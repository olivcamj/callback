import Link from "next/link";
import { X } from "lucide-react";

type FocusHeaderProps = {
  /** Where "End session" goes, usually the plan page. */
  endHref: string;
};

// Minimal header for the mock interview: no site nav, just a way out.
// Progress and the question type live in <QuestionStepper>, next to the question.
export function FocusHeader({ endHref }: FocusHeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-16 md:py-6">
      <Link
        href={endHref}
        className="inline-flex h-11 items-center gap-2 font-medium no-underline"
      >
        <X aria-hidden="true" className="size-5" />
        End session
      </Link>
    </header>
  );
}
