import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Define CSP headers
const cspHeaders = ``;
const enforcedCspHeaders = cspHeaders + "frame-ancestors 'self';";

function customHeadersMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = new Response(null);

  if (
    pathname.includes("/images/") ||
    pathname.includes("/videos/") ||
    pathname.includes("/fonts/") ||
    pathname.includes("/styles/") ||
    pathname.includes("/favicons/")
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    response.headers.delete("Content-Security-Policy-Report-Only");
  } else {
    response.headers.set("Content-Security-Policy", enforcedCspHeaders.replace(/\n/g, ""));
    response.headers.set("Content-Security-Policy-Report-Only", cspHeaders.replace(/\n/g, ""));
  }
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "deny");
  response.headers.set("X-Powered-By", "www.mitchdesigns.com");
  response.headers.set("Referrer-Policy", "same-origin");
  response.headers.set("Strict-Transport-Security", "max-age=15768000");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Permissions-Policy", "browsing-topics=()");

  return response;
}

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const locale =
    request.cookies.get("NEXT_LOCALE")?.value ||
    request.headers.get("accept-language")?.split(",")[0] ||
    "en";
  const pathname = request.nextUrl.pathname;

  // Add custom headers
  const customHeadersResponse = customHeadersMiddleware(request);

  // Publicly accessible routes (e.g., login, signup)
  const publicRoutes = ["/authentication/login", "/authentication/signup", "/authentication/forget","/authentication/otp","/authentication/new-password"];

  // If the user is already logged in, and tries to access the login page, redirect to the dashboard or another page
  if (publicRoutes.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url)); // Redirect to a protected page (e.g., dashboard)
  }

  // If no token is found, protect other routes and redirect to login
  if (!token && !publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(`/authentication/login`, request.url));
  }

  // Internationalization handling
  const intlResponse = await intlMiddleware(request);

  // Set NEXT_LOCALE cookie
  intlResponse.cookies.set("NEXT_LOCALE", locale, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 365 * 24 * 60 * 60, // 1 year
    sameSite: "strict",
  });

  // Merge custom headers
  customHeadersResponse.headers.forEach((value, key) => {
    intlResponse.headers.set(key, value);
  });

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Apply to all routes except API and Next.js internals
};
