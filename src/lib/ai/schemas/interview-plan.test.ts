import { describe, expect, it } from "vitest";
import { interviewPlanSchema, type InterviewPlan } from "@/lib/ai/schemas/interview-plan";

const sample: InterviewPlan = {
  role: "Frontend Engineer",
  level: "senior",
  mustHaveSkills: ["React", "TypeScript"],
  niceToHave: ["Next.js"],
  questions: [
    {
      type: "behavioral",
      prompt: "Tell me about a time you disagreed with a design decision.",
      competency: "Collaboration",
      whyAsked: "Senior engineers need to push back constructively.",
    },
    {
      type: "technical",
      prompt: "How would you prevent unnecessary re-renders in a large list?",
      competency: "React performance",
      whyAsked: "The product renders long, frequently updated lists.",
    },
    {
      type: "role",
      prompt: "What draws you to working on developer tools?",
      competency: "Motivation",
      whyAsked: "Checks fit with the team's product focus.",
    },
  ],
};

describe("interviewPlanSchema", () => {
  it("accepts a valid sample", () => {
    const result = interviewPlanSchema.safeParse(sample);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(sample);
  });

  it("rejects a bad question type", () => {
    const bad = {
      ...sample,
      questions: [{ ...sample.questions[0], type: "situational" }],
    };

    const result = interviewPlanSchema.safeParse(bad);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["questions", 0, "type"]);
  });
});
