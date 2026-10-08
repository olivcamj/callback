import { getCurrentUser } from "@/lib/user";
import { NewPlanForm } from "./new-plan-form";
import { PageHero } from "@/components/layout/page-hero";
import { PageBody } from "@/components/layout/page-body";

export default async function NewPlanPage() {
  await getCurrentUser();

  return (
    <div>
      {/* <div className="flex flex-col gap-1"> */}
      
      <PageHero
        title={
          <>
            Set the <em className="accent-word">scene.</em>
          </>
        }
        eyebrow="New interview plan"
        tone="butter"
        description="Tell us about the role. We'll write the questions this interviewer is most likely to ask."
      />
      <PageBody>
        <NewPlanForm />
      </PageBody>
    </div>
  );
}
