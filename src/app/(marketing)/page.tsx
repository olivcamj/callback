import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Highlight } from "@/components/brand/highlight";
import { StickyNote } from "@/components/brand/sticky-note";
import { PageHero } from "@/components/layout/page-hero";
import { buttonVariants } from "@/components/ui/button";

// TODO: build the full landing page (see the Callback UI design).
export default function Home() {
  return (
    <PageHero
      eyebrow="Your interview rehearsal room"
      title={
        <>
          Rehearse the interview. Get the <Highlight animate><em className="accent-word">callback.</em></Highlight>
        </>
      }
      description="Paste a job post and get a mock interview built for that exact role. Answer out loud, get STAR feedback, and practice your stories from beats instead of scripts."
      actions={
        <Link href="/plans/new" className={buttonVariants({ variant: "chunky", size: "lg" })}>
          Paste a job post
          <ArrowRight aria-hidden />
        </Link>
      }
      aside={
        <StickyNote tilt={4} attach="pin" className="w-60">
          Beats, not scripts. You already know your stories.
        </StickyNote>
      }
    />
  );
}
