import { NextRequest, NextResponse } from "next/server";

// Edge middleware can't read the in-memory Zustand store (client-only) or
// verify the JWT (that requires the backend's secret), so this is a coarse
// first line of defense: redirect to /login if the refresh-token cookie is
// simply absent. The real authorization check still happens per-request on
// the API (requireAuth) and again client-side via <RequireAuth> for a
// same-tab redirect once the store is known to be empty after hydration.
const PROTECTED_PREFIXES = ["/my-properties", "/profile", "/properties/create"];

export function middleware(request: NextRequest) {
  console.log("url :", request.nextUrl.pathname);
  console.log(request.cookies.getAll());
  const isEditRoute = /^\/properties\/[^/]+\/edit$/.test(
    request.nextUrl.pathname,
  );

  console.log("checking", isEditRoute);
  const isProtected =
    PROTECTED_PREFIXES.some((prefix) =>
      request.nextUrl.pathname.startsWith(prefix),
    ) || isEditRoute;

  if (!isProtected) return NextResponse.next();
  console.log("find token", request.cookies.get("refreshToken"));
  console.log(process.env.REFRESH_TOKEN_COOKIE_NAME);
  const hasRefreshCookie = request.cookies.has("refreshToken");
  console.log("Checking refresh cookie", hasRefreshCookie);

  // if (!hasRefreshCookie) {
  //   const loginUrl = new URL("/login", request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/my-properties/:path*",
    "/profile/:path*",
    "/properties/create",
    "/properties/:id/edit",
  ],
};
