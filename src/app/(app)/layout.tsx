import { Footer } from "@/components/layout/footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/user";

// Shared frame for signed-in pages: site nav, <main>, footer.
// Each page renders its own <PageHero> and <PageBody> inside <main>.
//
// Layouts don't always re-render on navigation, so this check is not enough on
// its own: each page, route handler and server action under (app) must also call
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
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
