import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { interviewPlanSchema } from "@/lib/ai/schemas/interview-plan";
import { getCurrentUser } from "@/lib/user";

// `parsed` holds the plan minus its questions, which live in their own table.
const planSummarySchema = interviewPlanSchema.omit({ questions: true });

export default async function PlanPage(props: PageProps<"/plans/[id]">) {
  const user = await getCurrentUser();
  const { id } = await props.params;

  // Scoping by userId means another user's plan id is a 404, not a leak.
  const plan = await db.interviewPlan.findFirst({
    where: { id, userId: user.id },
    include: { questions: { orderBy: { position: "asc" } } },
  });
  if (!plan) notFound();

  const summary = planSummarySchema.parse(plan.parsed);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold">{summary.role}</h1>
          <Badge variant="secondary" className="capitalize">
            {summary.level}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Created{" "}
          {plan.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}
        </p>
      </div>

      <section className="grid gap-6 sm:grid-cols-2">
        <SkillList title="Must-have skills" skills={summary.mustHaveSkills} />
        <SkillList title="Nice to have" skills={summary.niceToHave} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">
          Questions ({plan.questions.length})
        </h2>
        <ol className="flex flex-col gap-3">
          {plan.questions.map((question, index) => (
            <li key={question.id}>
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                    <span className="text-xs tabular-nums">{index + 1}.</span>
                    <Badge variant="outline" className="capitalize">
                      {question.type}
                    </Badge>
                    <span className="text-xs">{question.competency}</span>
                  </div>
                  <CardTitle>{question.prompt}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{question.whyAsked}</CardDescription>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <details className="rounded-xl ring-1 ring-foreground/10">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
          Job description
        </summary>
        <p className="whitespace-pre-wrap px-4 pb-4 text-sm text-muted-foreground">
          {plan.jdText}
        </p>
      </details>
    </div>
  );
}

function SkillList({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">{title}</h2>
      {skills.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <li key={skill}>
              <Badge variant="secondary">{skill}</Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">None listed.</p>
      )}
    </div>
  );
}
