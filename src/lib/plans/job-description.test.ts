import { describe, expect, it } from "vitest";
import { JD_MAX_LENGTH, jobDescriptionSchema } from "@/lib/plans/job-description";

describe("jobDescriptionSchema", () => {
  it("accepts a description exactly at the limit", () => {
    const text = "a".repeat(JD_MAX_LENGTH);
    expect(jobDescriptionSchema.parse(text)).toBe(text);
  });

  it("rejects a description over the limit", () => {
    const result = jobDescriptionSchema.safeParse("a".repeat(JD_MAX_LENGTH + 1));
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/at most 12,000 characters/);
  });

  it("counts CRLF line breaks as one character", () => {
    const lines = "a".repeat(99);
    // 120 lines of 99 chars + 119 breaks = 12,000 - 1 chars once normalized.
    const text = Array(120).fill(lines).join("\r\n");
    const result = jobDescriptionSchema.safeParse(text);
    expect(result.success).toBe(true);
    expect(result.data).not.toContain("\r");
  });

  it("trims surrounding whitespace before measuring", () => {
    const text = `  ${"a".repeat(JD_MAX_LENGTH)}\n\n`;
    expect(jobDescriptionSchema.parse(text)).toBe("a".repeat(JD_MAX_LENGTH));
  });

  it("rejects empty, whitespace-only and missing input", () => {
    for (const input of ["", "   \n ", null]) {
      const result = jobDescriptionSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe("Paste a job description.");
    }
  });
});
