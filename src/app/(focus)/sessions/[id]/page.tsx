import { notFound, redirect } from "next/navigation";
import { FocusHeader } from "@/components/layout/focus-header";
import { QuestionStepper } from "@/components/session/question-stepper";
import { db } from "@/lib/db";
import { nextUnansweredIndex } from "@/lib/sessions/next-unanswered";
import { getCurrentUser } from "@/lib/user";

export default async function SessionPage(props: PageProps<"/sessions/[id]">) {
  // getCurrentUser calls auth.protect(), so this page doesn't rely on the layout.
  const user = await getCurrentUser();
  const { id } = await props.params;

  // Scoping by userId means another user's session id is a 404, not a leak.
  const session = await db.session.findFirst({
    where: { id, userId: user.id },
    select: {
      id: true,
      planId: true,
      plan: {
        select: {
          questions: {
            orderBy: { position: "asc" },
            select: { id: true, prompt: true, type: true },
          },
        },
      },
      answers: { select: { questionId: true } },
    },
  });
  if (!session) notFound();

  // Worked out from saved answers, so a refresh resumes at the right question.
  const { questions } = session.plan;
  const index = nextUnansweredIndex(questions, session.answers);
  if (index === null) redirect(`/sessions/${session.id}/summary`);

  return (
    <>
      <FocusHeader endHref={`/plans/${session.planId}`} />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 pb-10">
        <QuestionStepper
          question={questions[index]}
          current={index + 1}
          total={questions.length}
        />
        {/* TODO (Day 3): answer form with timer and Cmd/Ctrl+Enter submit. */}
      </div>
    </>
  );
}
