import { describe, expect, it } from "vitest";
import {
  JD_MAX_LENGTH,
  JD_TOO_SHORT_MESSAGE,
  NOT_A_JD_MESSAGE,
  jobDescriptionProblem,
  jobDescriptionSchema,
} from "@/lib/plans/job-description";

const SAMPLE_JD =
  "We are hiring a frontend engineer to build accessible React and TypeScript features for our customer dashboard. " +
  "You will partner with design and backend teams, write tests for what you ship, review code, and help improve performance. " +
  "Requirements: two or more years of professional experience, REST APIs, and testing with Jest or Cypress.";

// Real-looking text of exactly `length` characters.
function textOfLength(length: number, separator = " ") {
  let text = SAMPLE_JD;
  while (text.length < length) text += separator + SAMPLE_JD;
  return text.slice(0, length);
}

describe("jobDescriptionSchema", () => {
  it("accepts a real job description", () => {
    expect(jobDescriptionSchema.parse(SAMPLE_JD)).toBe(SAMPLE_JD);
  });

  it("accepts a description exactly at the limit", () => {
    const text = textOfLength(JD_MAX_LENGTH);
    expect(jobDescriptionSchema.parse(text)).toBe(text);
  });

  it("rejects a description over the limit", () => {
    const result = jobDescriptionSchema.safeParse(textOfLength(JD_MAX_LENGTH + 1));
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/at most 12,000 characters/);
  });

  it("counts CRLF line breaks as one character", () => {
    // 12,000 characters with LF breaks; the CRLF version is longer before normalizing.
    const text = textOfLength(JD_MAX_LENGTH, "\n").replace(/\n/g, "\r\n");
    const result = jobDescriptionSchema.safeParse(text);
    expect(result.success).toBe(true);
    expect(result.data).not.toContain("\r");
  });

  it("trims surrounding whitespace before measuring", () => {
    const text = textOfLength(JD_MAX_LENGTH);
    expect(jobDescriptionSchema.parse(`  ${text}\n\n`)).toBe(text);
  });

  it("rejects empty, whitespace-only and missing input", () => {
    for (const input of ["", "   \n ", null]) {
      const result = jobDescriptionSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe("Paste a job description.");
    }
  });

  it("reports only one problem for over-limit text", () => {
    const result = jobDescriptionSchema.safeParse("a".repeat(JD_MAX_LENGTH + 1));
    expect(result.error?.issues).toHaveLength(1);
  });
});

describe("jobDescriptionProblem", () => {
  it("passes a real job description", () => {
    expect(jobDescriptionProblem(SAMPLE_JD)).toBeNull();
  });

  it("flags text that is too short", () => {
    expect(jobDescriptionProblem("Senior Go engineer, remote.")).toBe(JD_TOO_SHORT_MESSAGE);
  });

  it("flags one nonsense word repeated", () => {
    expect(jobDescriptionProblem(Array(200).fill("ajklfjaljgiaojfi").join(" "))).toBe(NOT_A_JD_MESSAGE);
  });

  it("flags keyboard mashing", () => {
    const mash = Array(40).fill("asdfghjkl qwrtzp xcvbnm sdfghk").join(" ");
    expect(jobDescriptionProblem(mash)).toBe(NOT_A_JD_MESSAGE);
  });

  it("flags a short phrase repeated to pad the length", () => {
    expect(jobDescriptionProblem(Array(30).fill("hire me please").join(" "))).toBe(NOT_A_JD_MESSAGE);
  });

  it("doesn't penalize words in non-Latin scripts", () => {
    const words = ["ソフトウェア", "エンジニア", "開発", "経験", "設計", "チーム", "テスト", "品質", "顧客", "製品", "改善", "責任"];
    const text = Array.from({ length: 40 }, (_, i) => words[i % words.length]).join(" ");
    expect(jobDescriptionProblem(text)).toBeNull();
  });
});
