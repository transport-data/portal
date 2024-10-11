import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/dashboard'];

export async  function middleware(req: NextRequest) {

  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard/newsfeed", req.url));
  }

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher:protectedRoutes.flatMap((route) => [
    route,             
    `${route}/:path*`,  
  ])
};
