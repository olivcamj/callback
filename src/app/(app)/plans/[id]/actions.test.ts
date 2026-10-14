import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  findPlan: vi.fn(),
  createSession: vi.fn(),
  redirect: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/user", () => ({ getCurrentUser: mocks.getCurrentUser }));

vi.mock("@/lib/db", () => ({
  db: {
    interviewPlan: { findFirst: mocks.findPlan },
    session: { create: mocks.createSession },
  },
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect, notFound: mocks.notFound }));

const { startSession } = await import("./actions");

describe("startSession", () => {
  beforeEach(() => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user_1" });
    mocks.findPlan.mockResolvedValue({ id: "plan_1", userId: "user_1" });
    mocks.createSession.mockResolvedValue({ id: "session_1" });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("authenticates before touching the database", async () => {
    mocks.getCurrentUser.mockRejectedValue(new Error("unauthorized"));

    await expect(startSession("plan_1")).rejects.toThrow("unauthorized");
    expect(mocks.findPlan).not.toHaveBeenCalled();
    expect(mocks.createSession).not.toHaveBeenCalled();
  });

  it("only looks up plans owned by the signed-in user", async () => {
    await startSession("plan_1");

    expect(mocks.findPlan).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "plan_1", userId: "user_1" } }),
    );
  });

  it("404s without creating a session for someone else's plan", async () => {
    mocks.findPlan.mockResolvedValue(null);

    await expect(startSession("plan_other")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.createSession).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("creates a session owned by the plan's owner and redirects to it", async () => {
    await startSession("plan_1");

    expect(mocks.createSession).toHaveBeenCalledWith({
      data: { userId: "user_1", planId: "plan_1" },
      select: { id: true },
    });
    expect(mocks.redirect).toHaveBeenCalledWith("/sessions/session_1");
  });
});
