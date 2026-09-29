// Routes reachable while signed out. Everything else lives under the (app)
// route group and requires a session.
export const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

export function isPublic(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) =>
      pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)),
  );
}