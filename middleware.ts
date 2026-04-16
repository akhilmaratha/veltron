import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/checkout",
  "/shopping-cart",
  "/wishlist",
  "/user-profile",
  "/coupons",
  "/admin",
];

const adminRoutes = ["/admin"];
const authPages = ["/login", "/signup", "/admin/signin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdmin =
    adminRoutes.some((route) => pathname.startsWith(route)) && !pathname.startsWith("/admin/signin");
  const isAuthPage = authPages.some((route) => pathname.startsWith(route));

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (isProtected && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdmin && token?.role !== "admin") {
    const url = new URL("/admin/signin", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && token) {
    if (pathname.startsWith("/admin/signin")) {
      return NextResponse.redirect(new URL(token.role === "admin" ? "/admin" : "/", request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/admin/:path*",
    "/admin/signin",
    "/checkout/:path*",
    "/shopping-cart/:path*",
    "/wishlist/:path*",
    "/user-profile/:path*",
    "/coupons/:path*",
  ],
};