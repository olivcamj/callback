import { cn } from "@/lib/utils";

type HighlightProps = {
  children: React.ReactNode;
  /** Swipe the marker in left to right. */
  animate?: boolean;
  className?: string;
};

// Yellow highlighter behind text. A <mark> so screen readers can
// announce it as highlighted.
export function Highlight({ children, animate = false, className }: HighlightProps) {
  return (
    <mark
      className={cn(
        "highlight bg-transparent text-current",
        animate && "animate-marker",
        className,
      )}
    >
      {children}
    </mark>
  );
}
