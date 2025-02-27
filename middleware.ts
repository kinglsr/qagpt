import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhook",
    "/api/stripe",
    "/privacy",
    "/terms",
    "/tips",
  ],
  ignoredRoutes: ["/api/webhook", "/api/stripe"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
