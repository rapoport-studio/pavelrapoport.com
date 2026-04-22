import { createAuthProxy } from "@repo/auth/proxy";

const allowedEmails = (process.env.STUDIO_ALLOWED_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

if (process.env.NODE_ENV === "production" && allowedEmails.length === 0) {
  throw new Error(
    "STUDIO_ALLOWED_EMAILS must be set in production; refusing to start studio middleware."
  );
}

export const middleware = createAuthProxy({
  publicRoutes: ["/login", "/auth/callback", "/api/studio/command"],
  loginUrl: "/login",
  allowedEmails,
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
