import { google } from "@ai-sdk/google";
import {
  generateText,
  NoObjectGeneratedError,
  Output,
  type FlexibleSchema,
  type LanguageModel,
  type LanguageModelUsage,
} from "ai";

// One retry covers the occasional malformed or schema-violating response.
const MAX_ATTEMPTS = 2;

export const INVALID_OUTPUT_MESSAGE =
  "The AI returned a response we couldn't use. Please try again.";

type GenerateStructuredOptions<T> = {
  schema: FlexibleSchema<T>;
  system: string;
  prompt: string;
  // Defaults to Gemini via GEMINI_MODEL. Tests pass a mock model here.
  model?: LanguageModel;
};

export type GenerateStructuredResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// Generates an object matching `schema`. If the model's output can't be
// parsed or validated, retries once, then returns a user-facing error
// instead of throwing. Other failures (network, auth, config) still throw.
// Every attempt logs its latency and token usage.
export async function generateStructured<T>({
  schema,
  system,
  prompt,
  model = defaultModel(),
}: GenerateStructuredOptions<T>): Promise<GenerateStructuredResult<T>> {
  const modelId = typeof model === "string" ? model : model.modelId;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const start = performance.now();
    try {
      const result = await generateText({
        model,
        output: Output.object({ schema }),
        system,
        prompt,
      });
      logCall({ modelId, attempt, start, usage: result.usage, ok: true });

      return { ok: true, data: result.output };
    } catch (error) {
      if (!NoObjectGeneratedError.isInstance(error)) throw error;

      logCall({ modelId, attempt, start, usage: error.usage, ok: false });
    }
  }

  return { ok: false, error: INVALID_OUTPUT_MESSAGE };
}

function defaultModel() {
  const modelId = process.env.GEMINI_MODEL;
  if (!modelId) throw new Error("GEMINI_MODEL is not set");
  return google(modelId);
}

function logCall({
  modelId,
  attempt,
  start,
  usage,
  ok,
}: {
  modelId: string;
  attempt: number;
  start: number;
  usage: LanguageModelUsage | undefined;
  ok: boolean;
}) {
  console.info("[ai.generateStructured]", {
    model: modelId,
    attempt,
    ok,
    latencyMs: Math.round(performance.now() - start),
    inputTokens: usage?.inputTokens,
    outputTokens: usage?.outputTokens,
    totalTokens: usage?.totalTokens,
  });
}
