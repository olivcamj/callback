import { MockLanguageModelV4 } from "ai/test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { generateStructured, INVALID_OUTPUT_MESSAGE } from "@/lib/ai/gateway";

const schema = z.object({ name: z.string(), score: z.number() });

function textResponse(text: string) {
  return {
    content: [{ type: "text" as const, text }],
    finishReason: { unified: "stop" as const, raw: undefined },
    usage: {
      inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
      outputTokens: { total: 5, text: 5, reasoning: undefined },
    },
    warnings: [],
  };
}

const valid = textResponse(JSON.stringify({ name: "Cathy Ames", score: 9 }));

const wrongShape = textResponse(JSON.stringify({ name: "Kate", score: "nine" }));

const notJson = textResponse("Sure! Here is your object:");

function run(model: MockLanguageModelV4) {
  return generateStructured({ schema, system: "You are a test.", prompt: "Go", model });
}

describe("generateStructured", () => {
  beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns valid output as typed data", async () => {
    const model = new MockLanguageModelV4({ doGenerate: valid });

    const result = await run(model);

    expect(result).toEqual({ ok: true, data: { name: "Cathy Ames", score: 9 } });
    expect(model.doGenerateCalls).toHaveLength(1);
  });

  it("retries exactly once after invalid output", async () => {
    const model = new MockLanguageModelV4({ doGenerate: [wrongShape, valid] });

    const result = await run(model);

    expect(result).toEqual({ ok: true, data: { name: "Cathy Ames", score: 9 } });
    expect(model.doGenerateCalls).toHaveLength(2);
  });

  it("returns a friendly error after two invalid responses", async () => {
    const model = new MockLanguageModelV4({ doGenerate: [notJson, wrongShape, valid] });

    const result = await run(model);

    expect(result).toEqual({ ok: false, error: INVALID_OUTPUT_MESSAGE });
    expect(model.doGenerateCalls).toHaveLength(2);
  });
});
