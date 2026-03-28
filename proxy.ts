import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/signin", "/signup"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
