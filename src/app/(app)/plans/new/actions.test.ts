import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { InterviewPlan } from "@/lib/ai/schemas/interview-plan";
import { JD_MAX_LENGTH } from "@/lib/plans/job-description";

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

function submit(jobDescription: string) {
  const formData = new FormData();
  formData.set("jobDescription", jobDescription);
  return createPlan({ status: "idle" }, formData);
}

describe("createPlan", () => {
  beforeEach(() => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user_1" });
    mocks.generateStructured.mockResolvedValue({ ok: true, data: plan });
    mocks.create.mockResolvedValue({ id: "plan_1" });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("rejects an over-limit description without calling the model", async () => {
    const state = await submit("a".repeat(JD_MAX_LENGTH + 1));

    expect(state).toEqual({
      status: "invalid",
      error: expect.stringMatching(/at most 12,000 characters/),
    });
    expect(mocks.generateStructured).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("authenticates before doing anything else", async () => {
    mocks.getCurrentUser.mockRejectedValue(new Error("unauthorized"));

    await expect(submit("Senior Go engineer")).rejects.toThrow("unauthorized");
    expect(mocks.generateStructured).not.toHaveBeenCalled();
  });

  it("saves the plan with ordered questions and redirects to it", async () => {
    await submit("  Senior Go engineer  ");

    expect(mocks.create).toHaveBeenCalledWith({
      data: {
        userId: "user_1",
        jdText: "Senior Go engineer",
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

    expect(await submit("Senior Go engineer")).toEqual({
      status: "failed",
      error: expect.stringMatching(/We tried twice/),
    });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("returns a friendly failure when the model call throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.generateStructured.mockRejectedValue(new Error("network down"));

    expect(await submit("Senior Go engineer")).toEqual({
      status: "failed",
      error: expect.stringMatching(/couldn't reach our AI service/),
    });
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
