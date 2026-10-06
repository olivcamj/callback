# ADR 002: Structured LLM output, validated with Zod

- **Status:** Accepted
- **Date:** 2026-10-06

## Context

Callback turns a pasted job description into an interview plan: the role, its level, must-have and nice-to-have skills, and 8–12 questions. The UI and the database need that plan in a fixed shape. The source is an LLM (Gemini Flash-Lite on the free tier), which can return malformed JSON, miss fields or produce values outside what the app expects.

The job description is also untrusted user input. It can contain text written to steer the model ("ignore previous instructions").

## Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Free text, parsed in the app | Simple prompt | Fragile parsing, no type safety, errors show up in the UI |
| JSON mode, trust the result | Easy to read | Nothing guarantees the shape; bad data reaches the database |
| **Structured output + Zod schema, retry on failure** | Typed result, validated before use, schema is the single source of truth | One extra call when the model gets it wrong; depends on the provider supporting structured output |
| Repair invalid JSON (e.g. a "fix this JSON" second prompt or a lenient parser) | Fewer failed requests | Hides model problems, can silently invent or drop data |

## Decision

1. **Every model call goes through one function,** `generateStructured` in `src/lib/ai/gateway.ts`. It uses the AI SDK's `generateText` with `Output.object({ schema })`, so the model is asked for JSON matching the schema and the result is validated against it.
2. **The Zod schema is the contract.** `src/lib/ai/schemas/interview-plan.ts` defines the plan. Its `.describe()` text is sent with the schema, so field descriptions double as instructions to the model. TypeScript types are inferred from the same schema.
3. **Retry once, then fail gracefully.** If the output can't be parsed or validated (`NoObjectGeneratedError`), the gateway tries one more time. After two failures it returns `{ ok: false, error }` with a friendly message instead of throwing. Network, auth and config errors still throw, because a retry won't fix them.
4. **Retry instead of repair.** A response that fails validation is discarded, never patched, so the app never shows data the model didn't actually produce in the expected shape.
5. **Every attempt is logged** with model, attempt number, latency and token usage, for cost and reliability tracking.
6. **The job description is treated as data.** It's wrapped in `<job_description>` tags (with any copies of those tags stripped from the input), and the system prompt says to treat everything inside as data, never instructions.
7. **The model is injectable.** `generateStructured` accepts a `model` parameter, so tests use a mock model and never call the real API.

## Consequences

- **Good:** the UI and database only ever see typed, validated plans. Failure is a normal return value the UI can handle, not a crash.
- **Good:** tests cover the three paths (valid output, exactly one retry, friendly error after two failures) without network calls or API cost.
- **Trade-off:** a bad first response costs a second call, roughly doubling latency and tokens for that request. Logged usage will show whether this happens often enough to matter.
- **Trade-off:** the schema checks shape, not quality. A well-formed but weak question still passes. The eval suite (Day 7) covers quality.
- **Trade-off:** prompt-injection defenses lower the risk but don't remove it. Output is still validated, and the model has no tools or data access to misuse.
