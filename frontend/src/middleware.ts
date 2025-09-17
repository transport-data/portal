import { clearAllAuxAuthCookies } from "@utils/auth";
import { getCookie } from "cookies-next";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/onboarding"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;
  const onboardingCompleted = getCookie("onboarding_completed", { req });

  // Handle organization URL canonicalization
  const orgUrlMatch = pathname.match(/^\/(@?[^\/]+)(\/.*)?$/);
  if (orgUrlMatch) {
    const [, orgPart, rest = ""] = orgUrlMatch;

    // If URL doesn't start with @ or contains uppercase, redirect to @lowercase
    if (orgPart && (!orgPart.startsWith("@") || /[A-Z]/.test(orgPart))) {
      const canonicalOrg = orgPart.startsWith("@")
        ? `@${orgPart.slice(1).toLowerCase()}`
        : `@${orgPart.toLowerCase()}`;
      const canonicalUrl = new URL(req.url);
      canonicalUrl.pathname = `/${canonicalOrg}${rest}`;
      return NextResponse.redirect(canonicalUrl, 301);
    }
  }

  let res;
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const signInUrl = new URL("/auth/signin", req.url);
    const path = req.url.replace(/^https?:\/\/[^/]+/, "");
    signInUrl.searchParams.set(
      "callbackUrl",
      `${process.env.NEXTAUTH_URL}${path[0] === "/" ? path : `/${path}`}`
    );
    res = NextResponse.redirect(signInUrl);
  } else if (onboardingCompleted == "false") {
    const url = req.nextUrl.clone();
    url.pathname = "/onboarding";
    const response = NextResponse.redirect(url);
    response.cookies.delete("onboarding_completed");
    res = response;
  } else if (req.nextUrl.pathname === "/dashboard") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/newsfeed";
    res = NextResponse.rewrite(url);
  } else {
    res = NextResponse.next();
  }

  clearAllAuxAuthCookies({ req, res });

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    // Organization URLs pattern matching
    "/((?!api|_next/static|_next/image|favicon.ico|images|styles|dashboard|auth|onboarding|search|datasets|organizations|groups|geography|partners|about-us|contact|events|data-provider|faq|privacy-policy|terms-and-conditions|unauthorized|404).*)",
  ],
};
