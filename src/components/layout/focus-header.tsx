import Link from "next/link";
import { X } from "lucide-react";
import { ProgressDots } from "@/components/session/progress-dots";
import { QuestionTypeChip } from "@/components/session/question-type-chip";
import type { QuestionType } from "@/lib/ai/schemas/interview-plan";

type FocusHeaderProps = {
  /** 1-based number of the current question. */
  current: number;
  total: number;
  type: QuestionType;
  /** Where "End" goes, usually the plan page. */
  endHref: string;
};

// Minimal header for the mock interview: no site nav, just progress.
export function FocusHeader({ current, total, type, endHref }: FocusHeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-16 md:py-6">
      <Link
        href={endHref}
        className="inline-flex h-11 items-center gap-2 font-medium no-underline"
      >
        <X aria-hidden="true" className="size-5" />
        End session
      </Link>

      <div className="flex flex-col items-center gap-2">
        <p className="eyebrow">
          Scene {current} of {total}
        </p>
        <ProgressDots current={current} total={total} />
      </div>

      <QuestionTypeChip type={type} />
    </header>
  );
}
