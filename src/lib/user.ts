import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Returns the signed-in user's database row, creating it on their first
// authenticated request. Cached so a layout and page in the same request
// share one lookup.
export const getCurrentUser = cache(async () => {
  const { userId } = await auth.protect();

  const existing = await db.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  if (!clerkUser || !email) {
    throw new Error(`Clerk user ${userId} has no primary email address`);
  }

  // Upsert so two concurrent first requests can't both try to insert.
  return db.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email,
      name: clerkUser.fullName,
      imageUrl: clerkUser.imageUrl,
    },
  });
});
