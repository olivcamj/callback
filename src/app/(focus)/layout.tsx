import { getCurrentUser } from "@/lib/user";

// Distraction-free frame for the mock interview: no site nav, no footer.
// The session page renders <FocusHeader> itself, because its "End session"
// link points at that session's plan.
//
// As in (app), each page here must also call `auth.protect()`.
export default async function FocusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getCurrentUser();
  return (
    <main id="main" className="flex flex-1 flex-col bg-paper">
      {children}
    </main>
  );
}
