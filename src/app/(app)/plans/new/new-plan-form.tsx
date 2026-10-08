"use client";

import { useActionState, useState } from "react";
import { ArrowRight, CircleAlert, LoaderCircle } from "lucide-react";
import { StickyNote } from "@/components/brand/sticky-note";
import { Button } from "@/components/ui/button";
import { ChoiceGroup } from "@/components/ui/choice-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionType } from "@/lib/ai/schemas/interview-plan";
import { JD_MAX_LENGTH } from "@/lib/plans/job-description";
import {
  COMPANY_MAX_LENGTH,
  DEFAULT_LEVEL,
  DEFAULT_QUESTION_TYPES,
  DEFAULT_STAGE,
  LEVELS,
  QUESTION_TYPES,
  STAGES,
  TITLE_MAX_LENGTH,
  type Level,
  type Stage,
} from "@/lib/plans/plan-options";
import { cn } from "cn";
import { createPlan, type CreatePlanState } from "./actions";

const initialState: CreatePlanState = { status: "idle" };

// Question types use the same colors as the type chips on the plan page.
const QUESTION_TYPE_OPTIONS = QUESTION_TYPES.map((option) => ({
  ...option,
  color: ({ behavioral: "blush", technical: "mint", role: "butter" } as const)[option.value],
}));

export function NewPlanForm() {
  const [state, formAction, pending] = useActionState(createPlan, initialState);

  // Controlled so everything survives React's form reset after a failed attempt.
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [level, setLevel] = useState<Level>(DEFAULT_LEVEL);
  const [stage, setStage] = useState<Stage>(DEFAULT_STAGE);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(DEFAULT_QUESTION_TYPES);
  const [jobDescription, setJobDescription] = useState("");

  const errors = state.status === "invalid" ? state.errors : {};
  const length = jobDescription.length;
  // Turn the counter red once the user has used 90%.
  const nearLimit = length > JD_MAX_LENGTH * 0.9;

  return (
    <form action={formAction} className="grid gap-x-10 gap-y-8 md:grid-cols-12">
      <div className="flex flex-col gap-7 md:col-span-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="jobTitle"
            label="Job title"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            placeholder="Frontend Engineer II"
            autoComplete="organization-title"
            maxLength={TITLE_MAX_LENGTH}
            required
            disabled={pending}
            error={errors.jobTitle}
          />
          <Input
            name="company"
            label="Company"
            optional
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Who's interviewing you?"
            autoComplete="organization"
            maxLength={COMPANY_MAX_LENGTH}
            disabled={pending}
            error={errors.company}
          />
        </div>

        <ChoiceGroup
          legend="Level"
          name="level"
          variant="pill"
          options={LEVELS}
          value={level}
          onValueChange={setLevel}
          required
          disabled={pending}
          error={errors.level}
        />

        <div className="grid gap-7 sm:grid-cols-2">
          <ChoiceGroup
            legend="Interview stage"
            name="stage"
            variant="chip"
            options={STAGES}
            value={stage}
            onValueChange={setStage}
            required
            disabled={pending}
            error={errors.stage}
          />
          <ChoiceGroup
            legend="Question mix"
            name="questionTypes"
            variant="chip"
            multiple
            options={QUESTION_TYPE_OPTIONS}
            value={questionTypes}
            onValueChange={setQuestionTypes}
            disabled={pending}
            error={errors.questionTypes}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="jobDescription" className="text-[15px] font-bold">
              Job description
            </label>
            <p
              id="jobDescription-count"
              className={cn(
                "shrink-0 text-sm text-ink-muted tabular-nums",
                nearLimit && "font-medium text-destructive",
              )}
            >
              {length.toLocaleString("en-US")} / {JD_MAX_LENGTH.toLocaleString("en-US")} characters
            </p>
          </div>
          <Textarea
            id="jobDescription"
            name="jobDescription"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            maxLength={JD_MAX_LENGTH}
            required
            disabled={pending}
            placeholder="Paste the whole post, including requirements and nice-to-haves."
            aria-invalid={errors.jobDescription ? true : undefined}
            aria-describedby="jobDescription-count jobDescription-error"
            className="max-h-[60vh] min-h-64"
          />
          <p id="jobDescription-error" aria-live="polite" className="text-sm font-medium text-destructive">
            {errors.jobDescription}
          </p>
        </div>

        {/* Hidden while a retry is in flight so the old failure doesn't linger. */}
        {state.status === "failed" && !pending && (
          <div
            role="alert"
            className="flex gap-3 rounded-2xl border-2 border-destructive/40 bg-blush-50 p-4 text-sm"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
            <div className="flex flex-col gap-1">
              <p className="font-bold">Something went wrong</p>
              <p className="text-ink-soft">{state.error}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button type="submit" variant="chunky" size="lg" disabled={pending}>
            {pending && <LoaderCircle className="animate-spin" aria-hidden />}
            {pending
              ? "Building your interview…"
              : state.status === "failed"
                ? "Try again"
                : "Build my interview"}
            {!pending && <ArrowRight aria-hidden />}
          </Button>
          <p role="status" className="text-[15px] text-ink-muted">
            {pending
              ? "Reading the job description and drafting questions. This can take a little while."
              : "8 to 12 questions, written for this role"}
          </p>
        </div>
      </div>

      <aside className="flex flex-col gap-8 pt-2 md:col-span-4">
        <StickyNote color="white" tilt={2} attach="pin" label="What happens next">
          <ol className="m-0 flex list-decimal flex-col gap-1 pl-5">
            <li>We pull out the must-have skills</li>
            <li>You get questions for this exact role</li>
            <li>You rehearse them out loud</li>
          </ol>
        </StickyNote>
        <StickyNote color="mint" tilt={-2} attach="tape" label="Tip">
          Add the company name for a better &ldquo;Why us?&rdquo; question.
        </StickyNote>
      </aside>
    </form>
  );
}
