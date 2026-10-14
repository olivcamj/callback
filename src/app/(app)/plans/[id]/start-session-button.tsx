"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startSession } from "./actions";

// A form, not a link: starting a session creates a row, so it must be a POST.
export function StartSessionButton({ planId }: { planId: string }) {
  return (
    <form action={startSession.bind(null, planId)}>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="chunky" size="lg" disabled={pending}>
      {pending && <LoaderCircle className="animate-spin" aria-hidden />}
      {pending ? "Starting…" : "Start mock interview"}
      {!pending && <ArrowRight aria-hidden />}
    </Button>
  );
}
