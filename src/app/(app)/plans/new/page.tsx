import { getCurrentUser } from "@/lib/user";
import { NewPlanForm } from "./new-plan-form";

export default async function NewPlanPage() {
  await getCurrentUser();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">New interview plan</h1>
        <p className="text-muted-foreground">
          Paste a job description and we&apos;ll draft the questions you&apos;re
          likely to be asked.
        </p>
      </div>
      <NewPlanForm />
    </main>
  );
}
