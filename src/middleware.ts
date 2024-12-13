// src/middleware.ts (or just middleware.ts depending on the location)

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// Define CSP headers
const cspHeaders = ``;
const enforcedCspHeaders = cspHeaders + "frame-ancestors 'self';";

// Function to add custom headers
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

// Create the internationalization middleware with next-intl
const intlMiddleware = createMiddleware(routing);

// Main middleware function
export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";
  const pathname = request.nextUrl.pathname;

  // Add custom headers to the response
  const customHeadersResponse = customHeadersMiddleware(request);

  // Handle token-based redirection (if the user is logged in, redirect them away from login/sign-up)
  if (
    (token || request.cookies.get("token")) &&
    (pathname === "/sign-in" || pathname === "/sign-up")
  ) {
    return NextResponse.redirect(new URL(`/my-account`, request.url));
  }

  // Redirect to sign-in page if the user is not authenticated and trying to access the account page
  if (!token && pathname.startsWith("/my-account")) {
    return NextResponse.redirect(new URL(`/sign-in`, request.url));
  }

  // Handle internationalization logic using the next-intl middleware
  const intlResponse = await intlMiddleware(request);

  // Set the NEXT_LOCALE cookie with Secure and HttpOnly flags
  intlResponse.cookies.set('NEXT_LOCALE', locale, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 365 * 24 * 60 * 60, // 1 year
    sameSite: "strict"
  });

  // Merge custom headers and i18n headers
  customHeadersResponse.headers.forEach((value, key) => {
    intlResponse.headers.set(key, value);
  });

  return intlResponse;
}

// Config for which paths the middleware should run
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], // Apply to all paths except API and Next.js internals
};
