import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { Logo } from "@/components/brand/logo";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "GitHub", href: "https://github.com/olivcamj/callback" },
] as const;

// Top nav for the landing page. Signed-in visitors get a shortcut into the app.
export function MarketingNav() {
  return (
    <header className="bg-paper">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-16"
      >
        <Logo animate />
        <div className="flex items-center gap-8 text-base font-medium">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hidden py-3 no-underline hover:text-coral-deep md:inline"
            >
              {link.label}
            </Link>
          ))}
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="inline-flex h-11 items-center rounded-full border-2 border-ink px-5 font-bold no-underline"
            >
              Sign in
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center rounded-full bg-ink px-5 font-bold text-paper no-underline"
            >
              Open Callback
            </Link>
          </Show>
        </div>
      </nav>
    </header>
  );
}
