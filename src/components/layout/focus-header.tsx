import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_STYLES = {
  behavioral: { label: "Behavioral", className: "bg-blush" },
  technical: { label: "Technical", className: "bg-mint" },
  role: { label: "Role", className: "bg-butter" },
} as const;

type FocusHeaderProps = {
  /** 1-based number of the current question. */
  current: number;
  total: number;
  type: keyof typeof TYPE_STYLES;
  /** Where "End" goes, usually the plan page. */
  endHref: string;
};

// Minimal header for the mock interview: no site nav, just progress.
export function FocusHeader({ current, total, type, endHref }: FocusHeaderProps) {
  const typeStyle = TYPE_STYLES[type];

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
        <ol aria-hidden="true" className="flex gap-1.5">
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
      </div>

      <span className={cn("rounded-full px-3 py-1.5 text-sm font-bold", typeStyle.className)}>
        {typeStyle.label}
      </span>
    </header>
  );
}
