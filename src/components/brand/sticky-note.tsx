import { cn } from "@/lib/utils";

// Note colors from the design tokens in globals.css.
const COLORS = {
  yellow: "var(--color-note-yellow)",
  mint: "var(--color-mint)",
  blush: "var(--color-blush)",
  lilac: "var(--color-lilac-200)",
  white: "#ffffff",
} as const;

export type StickyNoteColor = keyof typeof COLORS;

type StickyNoteProps = {
  children: React.ReactNode;
  color?: StickyNoteColor;
  /** Rotation in degrees. Negative tilts left. */
  tilt?: number;
  /** What holds the note up. */
  attach?: "pin" | "tape" | "none";
  /** Small uppercase heading, e.g. "ONE FIX". */
  label?: string;
  /** Drop in and settle (feedback arriving). */
  animate?: boolean;
  as?: "div" | "aside" | "li";
  className?: string;
};

// The handwritten note used for tips, feedback and story beats.
// Styling comes from the sticky-note, note-pin and note-tape utilities.
export function StickyNote({
  children,
  color = "yellow",
  tilt = -2,
  attach = "none",
  label,
  animate = false,
  as: Tag = "div",
  className,
}: StickyNoteProps) {
  const style = {
    "--tilt": `${tilt}deg`,
    background: COLORS[color],
  } as React.CSSProperties;

  return (
    <Tag
      data-color={color}
      className={cn("sticky-note", animate && "animate-note-drop", className)}
      style={style}
    >
      {attach === "pin" && <span aria-hidden="true" className="note-pin" />}
      {attach === "tape" && <span aria-hidden="true" className="note-tape" />}
      {label && (
        <span className="mb-1 block font-sans text-xs font-bold tracking-widest uppercase">
          {label}
        </span>
      )}
      {children}
    </Tag>
  );
}
