import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoMarkProps = {
  /** Width and height in px. */
  size?: number;
  /** Light version for dark backgrounds (footer). */
  onDark?: boolean;
  /** Snap the clapper shut once (page load, feedback arrives). */
  animate?: boolean;
  className?: string;
};

// The Slate: a clapperboard with an italic C.
export function LogoMark({
  size = 36,
  onDark = false,
  animate = false,
  className,
}: LogoMarkProps) {
  const board = onDark ? "var(--color-paper)" : "var(--color-ink)";
  const letter = onDark ? "var(--color-ink)" : "var(--color-paper)";

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <rect x="10" y="38" width="80" height="54" rx="10" fill={board} />
      <g
        transform="rotate(-16 14 36)"
        className={cn(animate && "animate-snap-once")}
        style={{ transformBox: "view-box", transformOrigin: "14px 36px" }}
      >
        <rect
          x="10"
          y="22"
          width="80"
          height="14"
          rx="4"
          fill="var(--color-coral)"
          stroke="var(--color-ink)"
          strokeWidth="3"
        />
        <path
          d="M24 22 L34 22 L28 36 L18 36 Z M46 22 L56 22 L50 36 L40 36 Z M68 22 L78 22 L72 36 L62 36 Z"
          fill="var(--color-ink)"
        />
      </g>
      <text
        x="50"
        y="81"
        textAnchor="middle"
        fontStyle="italic"
        fontWeight="600"
        fontSize="40"
        fill={letter}
        style={{ fontFamily: "var(--font-display)" }}
      >
        C
      </text>
    </svg>
  );
}

type LogoProps = {
  href?: string;
  onDark?: boolean;
  animate?: boolean;
  className?: string;
};

// Mark + "Callback" wordmark, linking home.
export function Logo({ href = "/", onDark = false, animate = false, className }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 no-underline",
        onDark ? "text-paper" : "text-ink",
        className,
      )}
    >
      <LogoMark onDark={onDark} animate={animate} />
      <span className="font-display text-[1.75rem] font-medium italic">Callback</span>
    </Link>
  );
}
