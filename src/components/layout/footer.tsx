import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { StickyNote } from "@/components/brand/sticky-note";
import { Wave } from "./wave";

const REPO_URL = "https://github.com/olivcamj/callback";
const PORTFOLIO_URL = "https://oliviacameron.com";

const COLUMNS = [
  {
    heading: "Product",
    span: "md:col-span-2",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "New interview", href: "/plans/new" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    heading: "Behind the scenes",
    span: "md:col-span-3",
    links: [
      { label: "Source on GitHub", href: REPO_URL },
      { label: "Engineering decisions", href: `${REPO_URL}/tree/main/docs/adr` },
      { label: "About the builder", href: PORTFOLIO_URL },
    ],
  },
  {
    heading: "Your data",
    span: "md:col-span-2",
    // TODO (Day 11): build /privacy and /settings.
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Delete my data", href: "/settings" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto">
      <Wave edge="top" className="text-ink" />
      <div className="bg-ink text-[#e6e0f0]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-6 pb-10 md:grid-cols-12 md:px-16">
          <div className="relative flex flex-col gap-4 md:col-span-5">
            <Logo onDark />
            <p className="max-w-sm text-[17px] leading-relaxed text-[#cfc8de]">
              Rehearse the interview. Get the callback. Mock interviews built from the
              job post, with STAR feedback on every answer.
            </p>
            <Link
              href="/plans/new"
              className="inline-flex h-12 w-fit items-center rounded-[var(--radius-cta)] border-2 border-paper bg-coral px-5 font-bold text-ink no-underline shadow-[0_4px_0_var(--color-paper)] transition-transform active:translate-y-1 active:shadow-none"
            >
              Start rehearsing, free
            </Link>
            <StickyNote
              tilt={6}
              attach="pin"
              className="absolute top-36 right-0 hidden w-36 text-center text-2xl lg:block"
            >
              Break a leg!
            </StickyNote>
          </div>

          {COLUMNS.map((column) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              className={cn("flex flex-col", column.span)}
            >
              <h2 className="eyebrow mb-2 font-sans text-butter">{column.heading}</h2>
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="py-2 text-base text-[#e6e0f0] no-underline hover:text-butter"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        {/* Film-strip divider */}
        <div aria-hidden="true" className="mx-auto flex max-w-6xl gap-3.5 overflow-hidden px-5 md:px-16">
          {Array.from({ length: 40 }, (_, i) => (
            <span key={i} className="h-3 w-5.5 shrink-0 rounded-[3px] bg-[#3a3450]" />
          ))}
        </div>

        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pt-4 pb-7 text-sm text-[#cfc8de] md:flex-row md:items-center md:justify-between md:px-16">
          <p>© {new Date().getFullYear()} Callback · Built by Olivia Cameron</p>
          <p className="hidden font-hand text-[22px] text-butter md:block">That&apos;s a wrap.</p>
          <a
            href="#top"
            className="inline-flex h-11 w-fit items-center gap-2 rounded-full border-[1.5px] border-[#cfc8de] px-4 font-bold text-paper no-underline"
          >
            Back to top
            <ArrowUp aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
