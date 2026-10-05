"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { generateStructured } from "@/lib/ai/gateway";
import {
  buildInterviewPlanPrompt,
  INTERVIEW_PLAN_SYSTEM_PROMPT,
} from "@/lib/ai/prompts/interview-plan";
import { interviewPlanSchema } from "@/lib/ai/schemas/interview-plan";
import { jobDescriptionSchema } from "@/lib/plans/job-description";
import { getCurrentUser } from "@/lib/user";

// "invalid" is a problem with what the user typed and is shown on the field.
// "failed" means generation didn't work and the same input may succeed on
// a retry.
export type CreatePlanState =
  | { status: "idle" }
  | { status: "invalid"; error: string }
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

  const parsed = jobDescriptionSchema.safeParse(formData.get("jobDescription"));
  if (!parsed.success) {
    return { status: "invalid", error: parsed.error.issues[0].message };
  }
  const jdText = parsed.data;

  let result;
  try {
    result = await generateStructured({
      schema: interviewPlanSchema,
      system: INTERVIEW_PLAN_SYSTEM_PROMPT,
      prompt: buildInterviewPlanPrompt(jdText),
    });
  } catch (error) {
    console.error("[plans.create] generation failed", error);
    return { status: "failed", error: SERVICE_UNAVAILABLE_MESSAGE };
  }

  if (!result.ok) return { status: "failed", error: UNUSABLE_OUTPUT_MESSAGE };

  const { questions, ...summary } = result.data;
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
