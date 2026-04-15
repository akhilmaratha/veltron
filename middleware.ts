import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/checkout",
  "/shopping-cart",
  "/wishlist",
  "/user-profile",
  "/coupons",
  "/admin-dashboard",
  "/order-management",
  "/product-management",
];

const adminRoutes = ["/admin-dashboard", "/order-management", "/product-management"];
const authPages = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthPage = authPages.some((route) => pathname.startsWith(route));

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (isProtected && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdmin && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/checkout/:path*",
    "/shopping-cart/:path*",
    "/wishlist/:path*",
    "/user-profile/:path*",
    "/coupons/:path*",
    "/admin-dashboard/:path*",
    "/order-management/:path*",
    "/product-management/:path*",
  ],
};