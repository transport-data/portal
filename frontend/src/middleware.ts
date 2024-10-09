import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/dashboard'];

export async  function middleware(req: NextRequest) {

  const token = await getToken  ({ req });
  const { pathname } = req.nextUrl;

  if (pathname === "/dashboard") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/newsfeed";
    return NextResponse.rewrite(url);
  }

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url); // Append the current URL for redirect after login
    return NextResponse.redirect(signInUrl); // Redirect to sign-in page
  }

  return NextResponse.next();
}

export const config = {
  matcher:protectedRoutes.map((route)=>`${route}/:path*`)
};