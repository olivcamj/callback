import { z } from "zod";
import { questionTypeSchema, type QuestionType } from "@/lib/ai/schemas/interview-plan";

// Choices on the "Set the scene" form. `value` is what's submitted and sent
// to the model; `label` is what the user sees.

export const LEVELS = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-level" },
  { value: "senior", label: "Senior" },
  { value: "staff", label: "Staff+" },
] as const;

export const STAGES = [
  { value: "recruiter-screen", label: "Recruiter screen" },
  { value: "hiring-manager", label: "Hiring manager" },
  { value: "panel", label: "Panel" },
] as const;

export const QUESTION_TYPES = [
  { value: "behavioral", label: "Behavioral" },
  { value: "technical", label: "Technical" },
  { value: "role", label: "Role-specific" },
] as const satisfies ReadonlyArray<{ value: QuestionType; label: string }>;

export type Level = (typeof LEVELS)[number]["value"];
export type Stage = (typeof STAGES)[number]["value"];

export const DEFAULT_LEVEL: Level = "mid";
export const DEFAULT_STAGE: Stage = "hiring-manager";
export const DEFAULT_QUESTION_TYPES: QuestionType[] = ["behavioral", "technical", "role"];

export const TITLE_MAX_LENGTH = 120;
export const COMPANY_MAX_LENGTH = 120;

const values = <T extends ReadonlyArray<{ value: string }>>(options: T) =>
  options.map((option) => option.value) as [T[number]["value"], ...T[number]["value"][]];

export const planOptionsSchema = z.object({
  jobTitle: z
    .string({ error: "Add the job title." })
    .trim()
    .min(1, "Add the job title.")
    .max(TITLE_MAX_LENGTH, `Keep the job title under ${TITLE_MAX_LENGTH} characters.`),
  company: z
    .string()
    .trim()
    .max(COMPANY_MAX_LENGTH, `Keep the company name under ${COMPANY_MAX_LENGTH} characters.`)
    .optional()
    .transform((company) => company || undefined),
  level: z.enum(values(LEVELS), { error: "Pick a level." }),
  stage: z.enum(values(STAGES), { error: "Pick an interview stage." }),
  questionTypes: z
    .array(questionTypeSchema, { error: "Pick at least one type of question." })
    .min(1, "Pick at least one type of question.")
    // Keep a stable order and drop duplicates however they were submitted.
    .transform((types) => DEFAULT_QUESTION_TYPES.filter((type) => types.includes(type))),
});

export type PlanOptions = z.infer<typeof planOptionsSchema>;
export type PlanOptionsField = keyof PlanOptions;

// Reads the options out of the submitted form. Missing fields become
// undefined so the schema reports them.
export function readPlanOptions(formData: FormData) {
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : undefined;
  };
  return {
    jobTitle: text("jobTitle"),
    company: text("company"),
    level: text("level"),
    stage: text("stage"),
    questionTypes: formData.getAll("questionTypes").filter((v) => typeof v === "string"),
  };
}

// Human-readable labels for the prompt.
export const labelFor = {
  level: (value: Level) => LEVELS.find((o) => o.value === value)!.label,
  stage: (value: Stage) => STAGES.find((o) => o.value === value)!.label,
  questionType: (value: QuestionType) => QUESTION_TYPES.find((o) => o.value === value)!.label,
};
