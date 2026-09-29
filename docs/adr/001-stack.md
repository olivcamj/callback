# ADR 0001: Core stack

- **Status:** Accepted
- **Date:** 2026-09-28

> An ADR (Architecture Decision Record) is a short note explaining one technical decision: the situation, the options, what was chosen, and the trade-offs. They're numbered, never deleted, and when a decision changes, a new ADR replaces the old one.

## Context

Callback is a two-week solo build. It needs auth, a relational database, streaming AI responses with validated structured output, and a free (or nearly free) way to call an LLM. It also has to show production-quality React/Next.js work.

## Options considered

| Area | Options | Chosen |
| --- | --- | --- |
| Framework | Next.js App Router · Vite + React SPA with a separate API · Nuxt | **Next.js App Router** |
| Auth | Clerk · Auth.js · Supabase Auth | **Clerk** |
| Database | Prisma + Neon Postgres · Supabase · SQLite | **Prisma + Neon** |
| LLM provider | Gemini API · OpenAI · Anthropic | **Gemini (Flash-Lite, free tier)** |
| AI client | Vercel AI SDK · provider SDK directly | **Vercel AI SDK** |

## Decision

- **Next.js App Router.** Server Components and Server Actions keep API keys and model calls on the server with no separate backend to deploy. Streaming is built in.
- **Clerk.** Prebuilt, accessible sign-in in under an hour, so the two weeks go to product features.
- **Prisma + Neon Postgres.** Relational data (plans → questions → answers, stories ↔ skills) fits Postgres. Prisma gives typed queries and migrations. Neon has a free tier and works well from Vercel.
- **Gemini free tier.** It's the cheapest option: $0 on the free tier, and low per-token pricing on Flash-Lite if usage ever outgrows it.
- **Vercel AI SDK.** One interface for streaming and Zod-validated structured output. Switching providers later is a one-line model change inside the gateway.

## Consequences

- **Good:** one deployable app, typed from database to UI, $0 to run during the challenge.
- **Trade-off:** Google may use free-tier Gemini inputs to improve its products. **Mitigation:** PII scrubbing before every model call, a privacy note in the README, and demo data in the seeded account.
- **Trade-off:** free-tier rate limits are low. **Mitigation:** a per-user daily cap (Day 11) and caching the demo account's plan.
- **Trade-off:** vendor lock-in to Clerk and Vercel. This is acceptable for a portfolio project. Auth is isolated behind middleware and `auth()` calls.