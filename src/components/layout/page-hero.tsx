import { cn } from "@/lib/utils";
import { Wave } from "./wave";

// Background + wave color for each band. Full class names are listed so
// Tailwind can find them.
const TONES = {
  butter: { bg: "bg-butter", fill: "text-butter" },
  lilac: { bg: "bg-lilac", fill: "text-lilac" },
  mint: { bg: "bg-mint-50", fill: "text-mint-50" },
  blush: { bg: "bg-blush-50", fill: "text-blush-50" },
} as const;

export type PageHeroTone = keyof typeof TONES;

type PageHeroProps = {
  /** ReactNode so pages can use <em className="accent-word">. */
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons or links under the description. */
  actions?: React.ReactNode;
  /** Right-hand extra: a sticky note, an illustration. Hidden below md. */
  aside?: React.ReactNode;
  tone?: PageHeroTone;
  /** Only change this if a page renders more than one PageHero. */
  titleId?: string;
  className?: string;
};

// The curved, colored header at the top of most pages. It lives in each
// page (not a layout) because its content comes from that page's data.
export function PageHero({
  title,
  eyebrow,
  description,
  actions,
  aside,
  tone = "butter",
  titleId = "page-title",
  className,
}: PageHeroProps) {
  const colors = TONES[tone];

  return (
    <section
      aria-labelledby={titleId}
      data-tone={tone}
      className={cn("mb-8 md:mb-12", className)}
    >
      <Wave edge="top" className={colors.fill} />
      <div className={cn(colors.bg, "px-5 md:px-16")}>
        <div className="mx-auto flex max-w-6xl flex-col gap-8 pb-4 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            {eyebrow && <p className="eyebrow text-ink-soft">{eyebrow}</p>}
            <h1
              id={titleId}
              className="text-4xl leading-[1.05] font-semibold md:text-6xl"
            >
              {title}
            </h1>
            {description && (
              <p className="text-lg text-ink-soft">{description}</p>
            )}
            {actions && (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            )}
          </div>
          {aside && <div className="hidden shrink-0 md:block">{aside}</div>}
        </div>
      </div>
      <Wave edge="bottom" className={colors.fill} />
    </section>
  );
}
