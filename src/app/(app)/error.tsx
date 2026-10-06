"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

// Catches unexpected errors in any (app) page or Server Action, such as a
// database outage. Expected failures, like the AI returning an unusable plan,
// are handled where they happen and never reach here.
export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start gap-3 p-6">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">
        We hit an unexpected problem loading this page. Trying again usually
        fixes it.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">
          Reference: <code>{error.digest}</code>
        </p>
      )}
      <Button onClick={() => retry()}>Try again</Button>
    </main>
  );
}
