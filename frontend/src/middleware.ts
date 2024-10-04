import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/dashboard") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/newsfeed";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
