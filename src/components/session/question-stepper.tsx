import type { QuestionType } from "@/lib/ai/schemas/interview-plan";
import { cn } from "@/lib/utils";
import { ProgressDots } from "./progress-dots";
import { QuestionTypeChip } from "./question-type-chip";

type QuestionStepperProps = {
  question: { prompt: string; type: QuestionType };
  /** 1-based number of the current question. */
  current: number;
  total: number;
  className?: string;
};

// The question band on the mock interview screen: where you are, what kind
// of question it is, and the question itself.
export function QuestionStepper({ question, current, total, className }: QuestionStepperProps) {
  return (
    <section
      aria-labelledby="current-question"
      className={cn("flex flex-col gap-5 rounded-3xl bg-lilac p-6 md:p-10", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">
            Scene {current} of {total}
          </p>
          <ProgressDots current={current} total={total} />
        </div>
        <QuestionTypeChip type={question.type} />
      </div>

      {/* The question is the one thing on this screen, so it's the page heading. */}
      <h1
        id="current-question"
        className="font-display text-2xl leading-snug font-medium text-balance md:text-4xl"
      >
        {question.prompt}
      </h1>
    </section>
  );
}
