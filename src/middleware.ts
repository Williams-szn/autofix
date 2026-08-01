import { NextResponse, type NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "autofix-super-secret-key-2026-production-ready-key";
const COOKIE_NAME = "autofix_session";

async function verifyTokenWebCrypto(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(JWT_SECRET);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Convert signature from base64url to Uint8Array
    let base64 = signature.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binarySig = atob(base64);
    const sigBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i);
    }

    const dataToVerify = encoder.encode(`${encodedHeader}.${encodedPayload}`);
    const isValid = await crypto.subtle.verify("HMAC", cryptoKey, sigBytes, dataToVerify);

    if (!isValid) return null;

    // Decode payload
    let payloadBase64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    while (payloadBase64.length % 4) {
      payloadBase64 += "=";
    }
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/login" || pathname === "/register";

  if (!sessionToken && isDashboardRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionToken) {
    const payload = await verifyTokenWebCrypto(sessionToken);

    if (!payload && isDashboardRoute) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (payload) {
      // Role enforcement
      if (pathname.startsWith("/dashboard/admin") && payload.role !== "ADMIN") {
        const target = payload.role === "MECHANIC" ? "/dashboard/mechanic" : "/dashboard/customer";
        return NextResponse.redirect(new URL(target, request.url));
      }

      if (pathname.startsWith("/dashboard/mechanic") && payload.role !== "MECHANIC" && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/customer", request.url));
      }

      if (pathname.startsWith("/dashboard/customer") && payload.role !== "CUSTOMER" && payload.role !== "ADMIN") {
        const target = payload.role === "MECHANIC" ? "/dashboard/mechanic" : "/dashboard/admin";
        return NextResponse.redirect(new URL(target, request.url));
      }

      // Root `/dashboard` generic redirect to role dashboard
      if (pathname === "/dashboard" || pathname === "/dashboard/") {
        const target =
          payload.role === "ADMIN"
            ? "/dashboard/admin"
            : payload.role === "MECHANIC"
            ? "/dashboard/mechanic"
            : "/dashboard/customer";
        return NextResponse.redirect(new URL(target, request.url));
      }

      // If already logged in and visiting login/register page
      if (isLoginRoute) {
        const target =
          payload.role === "ADMIN"
            ? "/dashboard/admin"
            : payload.role === "MECHANIC"
            ? "/dashboard/mechanic"
            : "/dashboard/customer";
        return NextResponse.redirect(new URL(target, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
