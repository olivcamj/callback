import { describe, expect, it } from "vitest";
import { planOptionsSchema, readPlanOptions, TITLE_MAX_LENGTH } from "./plan-options";

function form(entries: Array<[string, string]>) {
  const formData = new FormData();
  for (const [key, value] of entries) formData.append(key, value);
  return formData;
}

const valid: Array<[string, string]> = [
  ["jobTitle", "  Frontend Engineer II  "],
  ["company", ""],
  ["level", "mid"],
  ["stage", "hiring-manager"],
  ["questionTypes", "technical"],
  ["questionTypes", "behavioral"],
];

describe("planOptionsSchema", () => {
  it("parses a valid form, trimming text and dropping an empty company", () => {
    const result = planOptionsSchema.parse(readPlanOptions(form(valid)));
    expect(result).toEqual({
      jobTitle: "Frontend Engineer II",
      company: undefined,
      level: "mid",
      stage: "hiring-manager",
      questionTypes: ["behavioral", "technical"],
    });
  });

  it("keeps a company when one is given", () => {
    const result = planOptionsSchema.parse(
      readPlanOptions(form([...valid.filter(([k]) => k !== "company"), ["company", " ROI Solutions "]])),
    );
    expect(result.company).toBe("ROI Solutions");
  });

  it("requires a job title", () => {
    const result = planOptionsSchema.safeParse(
      readPlanOptions(form(valid.map(([k, v]) => [k, k === "jobTitle" ? "   " : v]))),
    );
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toMatchObject({ path: ["jobTitle"], message: "Add the job title." });
  });

  it("caps the job title length", () => {
    const result = planOptionsSchema.safeParse(
      readPlanOptions(form(valid.map(([k, v]) => [k, k === "jobTitle" ? "a".repeat(TITLE_MAX_LENGTH + 1) : v]))),
    );
    expect(result.success).toBe(false);
  });

  it("rejects a level or stage that isn't an option", () => {
    const badLevel = planOptionsSchema.safeParse(
      readPlanOptions(form(valid.map(([k, v]) => [k, k === "level" ? "ceo" : v]))),
    );
    expect(badLevel.error?.issues[0].path).toEqual(["level"]);

    const noStage = planOptionsSchema.safeParse(readPlanOptions(form(valid.filter(([k]) => k !== "stage"))));
    expect(noStage.error?.issues[0].path).toEqual(["stage"]);
  });

  it("requires at least one question type and rejects unknown ones", () => {
    const none = planOptionsSchema.safeParse(readPlanOptions(form(valid.filter(([k]) => k !== "questionTypes"))));
    expect(none.error?.issues[0]).toMatchObject({
      path: ["questionTypes"],
      message: "Pick at least one type of question.",
    });

    const unknown = planOptionsSchema.safeParse(
      readPlanOptions(form([...valid, ["questionTypes", "trivia"]])),
    );
    expect(unknown.success).toBe(false);
  });
});
