export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|manifest.json|login|api/auth).*)",
  ],
};
