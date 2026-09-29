import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/user";

// Layouts don't always re-render on navigation, so this check is not enough on
// its own each page/route handler/server action under (app) must also call
// `auth.protect()`.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Also creates the database row for a user's first authenticated visit.
  await getCurrentUser();
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
