import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { InterviewPlan } from "@/lib/ai/schemas/interview-plan";
import { JD_MAX_LENGTH, NOT_A_JD_MESSAGE } from "@/lib/plans/job-description";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  generateStructured: vi.fn(),
  create: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/lib/user", () => ({ getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/lib/ai/gateway", () => ({ generateStructured: mocks.generateStructured }));
vi.mock("@/lib/db", () => ({ db: { interviewPlan: { create: mocks.create } } }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

const { createPlan } = await import("./actions");

const plan: InterviewPlan = {
  role: "Backend Engineer",
  level: "senior",
  mustHaveSkills: ["Go"],
  niceToHave: [],
  questions: [
    { type: "role", prompt: "Why us?", competency: "Motivation", whyAsked: "Fit." },
    { type: "technical", prompt: "Design a queue.", competency: "Systems", whyAsked: "Core work." },
  ],
};

const JD =
  "We are hiring a senior Go engineer to design and run the queueing services behind our payments platform. " +
  "You will own reliability, mentor other engineers, and work with product on the roadmap. " +
  "Requirements: five or more years with Go, distributed systems, PostgreSQL, and on-call experience.";

const DEFAULT_FIELDS: Array<[string, string]> = [
  ["jobTitle", "Backend Engineer"],
  ["company", "Acme"],
  ["level", "senior"],
  ["stage", "panel"],
  ["questionTypes", "technical"],
  ["questionTypes", "role"],
];

function submit(jobDescription: string, fields: Array<[string, string]> = DEFAULT_FIELDS) {
  const formData = new FormData();
  formData.set("jobDescription", jobDescription);
  for (const [key, value] of fields) formData.append(key, value);
  return createPlan({ status: "idle" }, formData);
}

describe("createPlan", () => {
  beforeEach(() => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user_1" });
    mocks.generateStructured.mockResolvedValue({ ok: true, data: { isJobDescription: true, ...plan } });
    mocks.create.mockResolvedValue({ id: "plan_1" });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("rejects an over-limit description without calling the model", async () => {
    const state = await submit("a".repeat(JD_MAX_LENGTH + 1));

    expect(state).toEqual({
      status: "invalid",
      errors: { jobDescription: expect.stringMatching(/at most 12,000 characters/) },
    });
    expect(mocks.generateStructured).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("reports every invalid field at once without calling the model", async () => {
    const state = await submit("", [["level", "senior"], ["stage", "panel"]]);

    expect(state).toEqual({
      status: "invalid",
      errors: {
        jobTitle: "Add the job title.",
        questionTypes: "Pick at least one type of question.",
        jobDescription: "Paste a job description.",
      },
    });
    expect(mocks.generateStructured).not.toHaveBeenCalled();
  });

  it("sends the interview settings to the model as readable labels", async () => {
    await submit(JD);

    const { prompt } = mocks.generateStructured.mock.calls[0][0];
    expect(prompt).toContain("Job title: Backend Engineer");
    expect(prompt).toContain("Company: Acme");
    expect(prompt).toContain("Level: Senior");
    expect(prompt).toContain("Interview stage: Panel");
    expect(prompt).toContain("Question types: Technical, Role-specific");
  });

  it("rejects gibberish before calling the model", async () => {
    const state = await submit(Array(100).fill("ajklfjaljgiaojfi").join(" "));

    expect(state).toEqual({ status: "invalid", errors: { jobDescription: NOT_A_JD_MESSAGE } });
    expect(mocks.generateStructured).not.toHaveBeenCalled();
  });

  it("doesn't save a plan when the model says it isn't a job description", async () => {
    mocks.generateStructured.mockResolvedValue({
      ok: true,
      data: { isJobDescription: false, role: "", level: "", mustHaveSkills: [], niceToHave: [], questions: [] },
    });

    expect(await submit(JD)).toEqual({ status: "invalid", errors: { jobDescription: NOT_A_JD_MESSAGE } });
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("authenticates before doing anything else", async () => {
    mocks.getCurrentUser.mockRejectedValue(new Error("unauthorized"));

    await expect(submit(JD)).rejects.toThrow("unauthorized");
    expect(mocks.generateStructured).not.toHaveBeenCalled();
  });

  it("saves the plan with ordered questions and redirects to it", async () => {
    await submit(`  ${JD}  `);

    expect(mocks.create).toHaveBeenCalledWith({
      data: {
        userId: "user_1",
        jdText: JD,
        parsed: { role: "Backend Engineer", level: "senior", mustHaveSkills: ["Go"], niceToHave: [] },
        questions: {
          create: [
            { position: 0, ...plan.questions[0] },
            { position: 1, ...plan.questions[1] },
          ],
        },
      },
      select: { id: true },
    });
    expect(mocks.redirect).toHaveBeenCalledWith("/plans/plan_1");
  });

  it("returns a friendly failure when both attempts give unusable output", async () => {
    mocks.generateStructured.mockResolvedValue({ ok: false, error: "Bad output" });

    expect(await submit(JD)).toEqual({
      status: "failed",
      error: expect.stringMatching(/We tried twice/),
    });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("returns a friendly failure when the model call throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.generateStructured.mockRejectedValue(new Error("network down"));

    expect(await submit(JD)).toEqual({
      status: "failed",
      error: expect.stringMatching(/couldn't reach our AI service/),
    });
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
