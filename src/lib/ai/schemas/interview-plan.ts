import { z } from "zod";

// Descriptions are sent to the model as part of the JSON schema, so they
// double as generation instructions.

export const questionTypeSchema = z.enum(["behavioral", "technical", "role"]);

export const interviewQuestionSchema = z.object({
  type: questionTypeSchema.describe(
    "behavioral: past experience and conduct; technical: skills and problem solving; role: fit for this specific position",
  ),
  prompt: z.string().describe("The question exactly as the interviewer would ask it"),
  competency: z.string().describe("The skill or trait this question assesses"),
  whyAsked: z.string().describe("Why this question matters for this role, in one or two sentences"),
});

export const interviewPlanSchema = z.object({
  role: z.string().describe("The job title being interviewed for"),
  level: z.string().describe("Seniority level, e.g. junior, mid, senior, staff"),
  mustHaveSkills: z.array(z.string()).describe("Skills the candidate must have"),
  niceToHave: z.array(z.string()).describe("Skills that are a plus but not required"),
  questions: z.array(interviewQuestionSchema).describe("Interview questions, in the order they should be asked"),
});

export type QuestionType = z.infer<typeof questionTypeSchema>;
export type InterviewQuestion = z.infer<typeof interviewQuestionSchema>;
export type InterviewPlan = z.infer<typeof interviewPlanSchema>;
