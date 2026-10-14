import { cn } from "@/lib/utils";

type ProgressDotsProps = {
  /** 1-based number of the current step. */
  current: number;
  total: number;
  className?: string;
};

// Done steps are ink, the current one coral, the rest empty. Decorative only:
// callers must show the same progress as text.
export function ProgressDots({ current, total, className }: ProgressDotsProps) {
  return (
    <ol aria-hidden="true" className={cn("flex gap-1.5", className)}>
      {Array.from({ length: total }, (_, i) => (
        <li
          key={i}
          className={cn(
            "h-2 w-5 rounded-full md:w-6",
            i + 1 < current && "bg-ink",
            i + 1 === current && "bg-coral",
            i + 1 > current && "bg-line",
          )}
        />
      ))}
    </ol>
  );
}
