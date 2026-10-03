import { google } from "@ai-sdk/google";
import {
  generateText,
  NoObjectGeneratedError,
  Output,
  type FlexibleSchema,
  type LanguageModelUsage,
} from "ai";

// One retry covers the occasional malformed or schema-violating response.
const MAX_ATTEMPTS = 2;

type GenerateStructuredOptions<T> = {
  schema: FlexibleSchema<T>;
  system: string;
  prompt: string;
};

// Generates an object matching `schema`. If the model's output can't be
// parsed or validated, retries once before rethrowing. Every attempt logs
// its latency and token usage.
export async function generateStructured<T>({
  schema,
  system,
  prompt,
}: GenerateStructuredOptions<T>): Promise<T> {
  const modelId = process.env.GEMINI_MODEL;
  if (!modelId) throw new Error("GEMINI_MODEL is not set");

  for (let attempt = 1; ; attempt++) {
    const start = performance.now();
    try {
      const result = await generateText({
        model: google(modelId),
        output: Output.object({ schema }),
        system,
        prompt,
      });
      logCall({ modelId, attempt, start, usage: result.usage, ok: true });
     
      return result.output;
    } catch (error) {
      if (!NoObjectGeneratedError.isInstance(error)) throw error;

      logCall({ modelId, attempt, start, usage: error.usage, ok: false });
      
      if (attempt >= MAX_ATTEMPTS) throw error;
    }
  }
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
