import { describe, expect, it } from "vitest";
import { nextUnansweredIndex } from "./next-unanswered";

const questions = [{ id: "q1" }, { id: "q2" }, { id: "q3" }];

function answersFor(...questionIds: string[]) {
  return questionIds.map((questionId) => ({ questionId }));
}

describe("nextUnansweredIndex", () => {
  it("starts at the first question when nothing is answered", () => {
    expect(nextUnansweredIndex(questions, [])).toBe(0);
  });

  it("resumes after the answered questions", () => {
    expect(nextUnansweredIndex(questions, answersFor("q1"))).toBe(1);
    expect(nextUnansweredIndex(questions, answersFor("q1", "q2"))).toBe(2);
  });

  it("doesn't depend on the order answers were saved in", () => {
    expect(nextUnansweredIndex(questions, answersFor("q2", "q1"))).toBe(2);
  });

  it("goes back to a question that was skipped", () => {
    expect(nextUnansweredIndex(questions, answersFor("q1", "q3"))).toBe(1);
  });

  it("ignores answers to questions that aren't in the list", () => {
    expect(nextUnansweredIndex(questions, answersFor("other"))).toBe(0);
  });

  it("returns null when every question is answered", () => {
    expect(nextUnansweredIndex(questions, answersFor("q3", "q1", "q2"))).toBeNull();
  });

  it("returns null for a plan with no questions", () => {
    expect(nextUnansweredIndex([], [])).toBeNull();
  });
});
