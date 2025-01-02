import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();

    // make it simpler
    const { orgSlug } = await auth();
    const url = request.nextUrl.clone();
    const seg = url.pathname.split("/");
    if (
      seg[1] === "dashboard" &&
      (String(seg[2]) === "null" ||
        String(seg[2]) === "undefined" ||
        seg[2] == null)
    ) {
      url.pathname = `/`;
      return NextResponse.redirect(url);
    } else if (seg[1] === "dashboard" && seg[2] !== orgSlug) {
      url.pathname = `/dashboard/${orgSlug}/monitors`;
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
