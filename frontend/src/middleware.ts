import { clearAllAuxAuthCookies } from "@utils/auth";
import { getCookie } from "cookies-next";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/onboarding"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;
  const onboardingCompleted = getCookie("onboarding_completed", { req });

  // Handle malformed @dashboard paths - redirect back to proper dashboard path
  if (pathname.startsWith('/@dashboard')) {
    const correctedPath = pathname.replace('/@dashboard', '/dashboard');
    console.log('Redirecting malformed @dashboard path:', pathname, 'to:', correctedPath);
    return NextResponse.redirect(new URL(correctedPath, req.url));
  }

  // Skip organization URL processing for dashboard and onboarding paths
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
    // Handle specific dashboard root redirect
    if (pathname === "/dashboard") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard/newsfeed";
      return NextResponse.rewrite(url);
    }
    // For all other dashboard/onboarding paths, continue with normal auth logic
    if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
      const signInUrl = new URL("/auth/signin", req.url);
      const path = req.url.replace(/^https?:\/\/[^/]+/, "");
      signInUrl.searchParams.set(
        "callbackUrl",
        `${process.env.NEXTAUTH_URL}${path[0] === "/" ? path : `/${path}`}`
      );
      const res = NextResponse.redirect(signInUrl);
      clearAllAuxAuthCookies({ req, res });
      return res;
    } else if (onboardingCompleted == "false" && pathname.startsWith('/dashboard')) {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding";
      const response = NextResponse.redirect(url);
      response.cookies.delete("onboarding_completed");
      clearAllAuxAuthCookies({ req, res: response });
      return response;
    }
    const res = NextResponse.next();
    clearAllAuxAuthCookies({ req, res });
    return res;
  }

  const orgUrlMatch = pathname.match(/^\/(@?[^\/]+)(\/.*)?$/);

  let res;
  if (orgUrlMatch) {
    const [, orgPart, rest = ""] = orgUrlMatch;

    if (orgPart && (!orgPart.startsWith("@") || /[A-Z]/.test(orgPart))) {
      const canonicalOrg = orgPart.startsWith("@")
        ? `@${orgPart.slice(1).toLowerCase()}`
        : `@${orgPart.toLowerCase()}`;
      const canonicalUrl = new URL(req.url);
      canonicalUrl.pathname = `/${canonicalOrg}${rest}`;
      clearAllAuxAuthCookies({ req, res });
      return NextResponse.redirect(canonicalUrl, 301);
    }
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
    "/((?!api|_next/static|_next/image|favicon.ico|images|styles|dashboard|onboarding|auth|search|datasets|organizations|groups|geography|partners|about-us|contact|events|data-provider|faq|privacy-policy|terms-and-conditions|unauthorized|404).*)",
  ],
};
