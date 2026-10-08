"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { generateStructured } from "@/lib/ai/gateway";
import {
  buildInterviewPlanPrompt,
  INTERVIEW_PLAN_SYSTEM_PROMPT,
} from "@/lib/ai/prompts/interview-plan";
import { interviewPlanResponseSchema } from "@/lib/ai/schemas/interview-plan";
import { jobDescriptionSchema, NOT_A_JD_MESSAGE } from "@/lib/plans/job-description";
import {
  labelFor,
  planOptionsSchema,
  readPlanOptions,
  type PlanOptionsField,
} from "@/lib/plans/plan-options";
import { getCurrentUser } from "@/lib/user";

// "invalid" lists problems with what the user entered, keyed by field, and
// each one is shown on its field.
// "failed" means generation didn't work and the same input may succeed on
// a retry.
export type CreatePlanField = PlanOptionsField | "jobDescription";

export type CreatePlanState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<CreatePlanField, string>> }
  | { status: "failed"; error: string };

// The gateway already retried once, so the model failed twice in a row.
const UNUSABLE_OUTPUT_MESSAGE =
  "We tried twice but couldn't turn this job description into a plan. That's usually temporary, so give it another go. Your text is still here.";

const SERVICE_UNAVAILABLE_MESSAGE =
  "We couldn't reach our AI service just now. Please try again in a minute. Your text is still here.";

export async function createPlan(
  _prevState: CreatePlanState,
  formData: FormData,
): Promise<CreatePlanState> {
  // A Server Action can be called with a direct POST that skips this page and
  // its layout, so it has to authenticate on its own.
  const user = await getCurrentUser();

  const options = planOptionsSchema.safeParse(readPlanOptions(formData));
  const jd = jobDescriptionSchema.safeParse(formData.get("jobDescription"));
  if (!options.success || !jd.success) {
    const errors: Partial<Record<CreatePlanField, string>> = {};
    for (const issue of options.error?.issues ?? []) {
      const field = issue.path[0] as PlanOptionsField;
      errors[field] ??= issue.message;
    }
    if (!jd.success) errors.jobDescription = jd.error.issues[0].message;
    return { status: "invalid", errors };
  }
  const jdText = jd.data;
  const context = options.data;

  let result;
  try {
    result = await generateStructured({
      schema: interviewPlanResponseSchema,
      system: INTERVIEW_PLAN_SYSTEM_PROMPT,
      prompt: buildInterviewPlanPrompt(jdText, {
        jobTitle: context.jobTitle,
        company: context.company,
        level: labelFor.level(context.level),
        stage: labelFor.stage(context.stage),
        questionTypes: context.questionTypes.map(labelFor.questionType),
      }),
    });
  } catch (error) {
    console.error("[plans.create] generation failed", error);
    return { status: "failed", error: SERVICE_UNAVAILABLE_MESSAGE };
  }

  if (!result.ok) return { status: "failed", error: UNUSABLE_OUTPUT_MESSAGE };

  // The text got past the offline checks but the model judged it not to be
  // a job description. Treat it like any other invalid input: nothing saved.
  const { isJobDescription, questions, ...summary } = result.data;
  if (!isJobDescription || questions.length === 0) {
    return { status: "invalid", errors: { jobDescription: NOT_A_JD_MESSAGE } };
  }

  const plan = await db.interviewPlan.create({
    data: {
      userId: user.id,
      jdText,
      parsed: summary,
      questions: {
        create: questions.map((question, position) => ({
          position,
          ...question,
        })),
      },
    },
    select: { id: true },
  });

  redirect(`/plans/${plan.id}`);
}
