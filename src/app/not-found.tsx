import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StickyNote } from "@/components/brand/sticky-note";
import { Footer } from "@/components/layout/footer";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { PageBody } from "@/components/layout/page-body";
import { PageHero } from "@/components/layout/page-hero";

const QUICK_LINKS = [
  { label: "Your plans", href: "/dashboard" },
  { label: "New interview", href: "/plans/new" },
  { label: "How it works", href: "/#how-it-works" },
] as const;

// Shown for any URL that doesn't match a route, and wherever
// notFound() is called (e.g. a plan id that doesn't exist).
export default function NotFound() {
  return (
    <>
      <title>Page not found · Callback</title>
      <MarketingNav />
      <main id="main" className="flex-1">
        <PageHero
          tone="lilac"
          eyebrow={
            <span className="inline-block -rotate-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 text-ink">
              Error 404 · Scene not found
            </span>
          }
          title={
            <>
              This scene got <em className="accent-word">cut.</em>
            </>
          }
          description="The page you're looking for ended up on the cutting room floor, or the link has a typo. Let's get you back on set."
          actions={
            <>
              <Link
                href="/dashboard"
                className="btn-chunky inline-flex h-14 items-center gap-2 bg-coral px-7 text-lg font-bold text-ink no-underline"
              >
                <ArrowLeft aria-hidden="true" className="size-5" />
                Back to home
              </Link>
              <Link
                href="/plans/new"
                className="inline-flex h-14 items-center rounded-[var(--radius-cta)] border-2 border-ink bg-white px-6 text-lg font-bold no-underline"
              >
                Start a new interview
              </Link>
            </>
          }
          aside={
            <div className="relative w-95 pb-24">
              <SceneSlate />
              <StickyNote
                tilt={-5}
                attach="pin"
                className="absolute -bottom-2 -left-6 w-56"
              >
                Blanked? Happens to everyone. Go back to your beats.
              </StickyNote>
            </div>
          }
        />
        <PageBody>
          <nav aria-label="Helpful links" className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            <span className="font-bold text-ink-soft">Or try one of these:</span>
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="py-2.5 font-bold">
                {link.label}
              </Link>
            ))}
          </nav>
        </PageBody>
      </main>
      <Footer />
    </>
  );
}

// Film slate reading "Scene 404, Take: lost?"
function SceneSlate() {
  const label = { fontFamily: "var(--font-sans)", letterSpacing: 3 };
  return (
    <svg viewBox="0 0 320 300" className="w-full" role="img" aria-label="A film slate reading Scene 404, Take: lost?">
      <rect x="20" y="92" width="280" height="190" rx="22" fill="var(--color-ink)" />
      <g transform="rotate(-18 28 88)">
        <rect x="20" y="42" width="280" height="44" rx="10" fill="var(--color-coral)" stroke="var(--color-ink)" strokeWidth="6" />
        <path d="M60 42 L92 42 L74 86 L42 86 Z M132 42 L164 42 L146 86 L114 86 Z M204 42 L236 42 L218 86 L186 86 Z M276 42 L296 42 L290 86 L258 86 Z" fill="var(--color-ink)" />
      </g>
      <circle cx="30" cy="90" r="10" fill="var(--color-sun)" stroke="var(--color-ink)" strokeWidth="4" />
      <line x1="20" y1="170" x2="300" y2="170" stroke="var(--color-ink-soft)" strokeWidth="3" />
      <line x1="160" y1="170" x2="160" y2="282" stroke="var(--color-ink-soft)" strokeWidth="3" />
      <text x="44" y="130" fontSize="16" fontWeight="700" fill="#cfc8de" style={label}>PRODUCTION</text>
      <text x="44" y="158" fontSize="26" fontStyle="italic" fill="var(--color-paper)" style={{ fontFamily: "var(--font-display)" }}>Callback</text>
      <text x="44" y="204" fontSize="16" fontWeight="700" fill="#cfc8de" style={label}>SCENE</text>
      <text x="44" y="258" fontSize="56" fontWeight="600" fill="var(--color-coral)" style={{ fontFamily: "var(--font-display)" }}>404</text>
      <text x="184" y="204" fontSize="16" fontWeight="700" fill="#cfc8de" style={label}>TAKE</text>
      <text x="184" y="252" fontSize="46" fontWeight="700" fill="var(--color-butter)" style={{ fontFamily: "var(--font-hand)" }}>lost?</text>
    </svg>
  );
}
