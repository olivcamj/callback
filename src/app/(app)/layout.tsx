import { auth } from "@clerk/nextjs/server";
import { SiteHeader } from "@/components/site-header";

// Layouts don't always re-render on navigation, so this check is not enough on
// its own each page/route handler/server action under (app) must also call
// `auth.protect()`.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
