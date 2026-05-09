import { NextRequest, NextResponse } from "next/server";

const APP_PATHS = [
  "/login",
  "/register",
  "/accept-invite",
  "/reset-password",
  "/dashboard",
  "/courses",
  "/exams",
  "/users",
];

function extractSubdomain(hostname: string): string | null {
  // Strip port
  const host = hostname.split(":")[0];

  // localhost — no subdomain
  if (host === "localhost") return null;

  const parts = host.split(".");

  // Need at least 3 parts: subdomain.domain.tld
  if (parts.length < 3) return null;

  const sub = parts[0];
  if (sub === "www" || sub === "app") return null;

  return sub;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") ?? "";
  const subdomain = extractSubdomain(hostname);

  const response = NextResponse.next();

  // Set subdomain header for server components to read
  if (subdomain) {
    response.headers.set("x-tenant-subdomain", subdomain);
  }

  // Redirect: landing domain trying to access app paths → back to landing
  // (In production only — skip for localhost)
  const isLocalhost = hostname.startsWith("localhost");
  if (
    !isLocalhost &&
    !subdomain &&
    APP_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
