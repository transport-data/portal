import { clearAllAuxAuthCookies } from "@utils/auth";
import { getCookie } from "cookies-next";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/onboarding"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;
  const onboardingCompleted = getCookie("onboarding_completed", { req });

  let res;
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set(
      "callbackUrl",
      `${process.env.NEXTAUTH_URL}/${req.url.replace(/^https?:\/\/[^/]+/, "")}`
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
  matcher: protectedRoutes.flatMap((route) => [route, `${route}/:path*`]),
};
