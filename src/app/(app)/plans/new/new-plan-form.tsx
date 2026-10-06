"use client";

import { useActionState, useState } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { JD_MAX_LENGTH } from "@/lib/plans/job-description";
import { cn } from "cn";
import { createPlan, type CreatePlanState } from "./actions";

const initialState: CreatePlanState = { status: "idle" };

export function NewPlanForm() {
  const [state, formAction, pending] = useActionState(createPlan, initialState);
  // Controlled so the text survives React's form reset after a failed attempt.
  const [jobDescription, setJobDescription] = useState("");

  const length = jobDescription.length;
  // Turn the counter red once the user has used 90%
  const nearLimit = length > JD_MAX_LENGTH * 0.9;
  const fieldError = state.status === "invalid" ? state.error : null;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label htmlFor="jobDescription" className="text-sm font-medium">
        Job description
      </label>
      <Textarea
        id="jobDescription"
        name="jobDescription"
        value={jobDescription}
        onChange={(event) => setJobDescription(event.target.value)}
        maxLength={JD_MAX_LENGTH}
        required
        disabled={pending}
        placeholder="Paste the full job description here."
        aria-invalid={fieldError ? true : undefined}
        aria-describedby="jobDescription-count jobDescription-error"
        className="max-h-[60vh] min-h-64"
      />
      <div className="flex items-start justify-between gap-4 text-sm">
        <p
          id="jobDescription-error"
          aria-live="polite"
          className="text-destructive"
        >
          {fieldError}
        </p>
        <p
          id="jobDescription-count"
          className={cn(
            "shrink-0 tabular-nums text-muted-foreground",
            nearLimit && "text-destructive",
          )}
        >
          {length.toLocaleString("en-US")} / {JD_MAX_LENGTH.toLocaleString("en-US")}
        </p>
      </div>

      {/* Hidden while a retry is in flight so the old failure doesn't linger. */}
      {state.status === "failed" && !pending && (
        <div
          role="alert"
          className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <div className="flex flex-col gap-1">
            <p className="font-medium">Something went wrong</p>
            <p className="text-muted-foreground">{state.error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <LoaderCircle className="animate-spin" aria-hidden />}
          {pending
            ? "Generating plan…"
            : state.status === "failed"
              ? "Try again"
              : "Generate plan"}
        </Button>
        <p role="status" className="text-sm text-muted-foreground">
          {pending && "Reading the job description and drafting questions. This can take a little while."}
        </p>
      </div>
    </form>
  );
}
