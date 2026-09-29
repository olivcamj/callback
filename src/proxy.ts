import { clerkMiddleware } from "@clerk/nextjs/server";
import { isPublic } from "@/lib/public-routes"

// Early redirect for signed-out users. This is an optimization, not the
// security boundary every (app) page, route handler and server action must
// still call `auth.protect()` itself.
export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req.nextUrl.pathname)) return;

  const { isAuthenticated, redirectToSignIn } = await auth();
  if (!isAuthenticated) return redirectToSignIn();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Clerk's frontend API proxy
    "/__clerk/(.*)",
  ],
};
