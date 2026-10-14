"use server";

import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";

export async function startSession(planId: string) {
  // A Server Action can be called with a direct POST that skips this page and
  // its layout, so it has to authenticate on its own.
  const user = await getCurrentUser();

  // planId is bound on the client and can be tampered with, so check the plan
  // belongs to this user. Another user's plan id is a 404, same as the page.
  const plan = await db.interviewPlan.findFirst({
    where: { id: planId, userId: user.id },
    select: { id: true, userId: true },
  });
  
  if (!plan) notFound();

  const session = await db.session.create({
    // Take userId from the plan so Session.userId always matches its plan's owner.
    data: { userId: plan.userId, planId: plan.id },
    select: { id: true },
  });

  redirect(`/sessions/${session.id}`);
}
