import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/brand/logo";

// TODO: add Stories and Progress once those pages exist.
const LINKS = [
  { label: "Plans", href: "/dashboard" },
  { label: "New interview", href: "/plans/new" },
] as const;

// Top nav for signed-in pages.
export function SiteHeader() {
  return (
    <header className="bg-paper">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 md:px-16"
      >
        <Logo href="/dashboard" />
        <div className="flex items-center gap-6 text-base font-medium md:gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden py-3 no-underline hover:text-coral-deep sm:inline"
            >
              {link.label}
            </Link>
          ))}
          <Show when="signed-out">
            <SignInButton />
          </Show>
          <Show when="signed-in">
            <UserButton appearance={{ elements: { avatarBox: "size-11 border-2 border-ink" } }} />
          </Show>
        </div>
      </nav>
    </header>
  );
}
