import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Define CSP headers


const cspHeaders = `default-src 'self' https: https://api.imtyaaz.com http://localhost:4444 https://safetypointacademy.com;
script-src 'self' blob: 'unsafe-eval' 'unsafe-inline' https://api.imtyaaz.com http://localhost:4444 https://safetypointacademy.com;
img-src 'self' blob: data: https://api.imtyaaz.com http://localhost:4444 https://*.openstreetmap.org https://safetypointacademy.com;
media-src 'self' blob: https://api.imtyaaz.com http://localhost:4444 https://safetypointacademy.com;
font-src 'self' 'unsafe-eval' blob: data: webpack: https://fonts.gstatic.com;
base-uri 'self';
connect-src 'self' https://api.imtyaaz.com http://localhost:4444 https://nominatim.openstreetmap.org https://safetypointacademy.com;
script-src-elem 'self' 'unsafe-inline' https://analytics.google.com https://maps.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com https://static.hotjar.com https://connect.facebook.net https://*.googleapis.com https://*.google.com https://googleads.g.doubleclick.net  https://script.hotjar.com https://www.googleadservices.com https://www.youtube.com;
form-action 'self' https://api.imtyaaz.com http://localhost:4444 https://safetypointacademy.com;
frame-src 'self' https://api.imtyaaz.com http://localhost:4444 https://safetypointacademy.com;
object-src 'self' blob: data:;
worker-src 'self' blob:;
style-src 'self' 'unsafe-inline';
report-to default;`;
const enforcedCspHeaders = cspHeaders + "frame-ancestors 'self';";

function customHeadersMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = new Response(null);

  // Allow CORS for images and other resources
  if (pathname.includes("/uploads/")) {
    response.headers.set("Access-Control-Allow-Origin", "*"); // Or specify your domain instead of *
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  // Handle cache headers for static assets like images
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
  
  // Set other security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "deny");
  response.headers.set("X-Powered-By", "Ojja");
  response.headers.set("Referrer-Policy", "same-origin");
  response.headers.set("Strict-Transport-Security", "max-age=15768000");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Permissions-Policy", "browsing-topics=()");

  return response;
}

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware entirely for root path
  if (pathname === "/") {
    console.log('Middleware - Skipping middleware for root path');
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;
  const locale =
    request.cookies.get("NEXT_LOCALE")?.value ||
    request.headers.get("accept-language")?.split(",")[0] ||
    "en";

  // Debug logging
  console.log('Middleware - Pathname:', pathname);
  console.log('Middleware - Token exists:', !!token);
  console.log('Middleware - Token value:', token ? 'present' : 'missing');

  // Add custom headers
  const customHeadersResponse = customHeadersMiddleware(request);

  // Publicly accessible routes (e.g., login, signup, landing page)
  const publicRoutes = ["/authentication/login", "/authentication/signup", "/authentication/forget","/authentication/otp","/authentication/new-password"];

  // Special handling for locale root paths - always allow access to landing page
  if (pathname === "/en" || pathname === "/ar") {
    console.log('Middleware - Allowing access to landing page');
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

  // If the user is already logged in, and tries to access the login page, redirect to the dashboard or another page
  if (publicRoutes.some(route => pathname.startsWith(route)) && token) {
    console.log('Middleware - Redirecting logged in user from public route to dashboard');
    try {
    return NextResponse.redirect(new URL("/dashboard", request.url)); // Redirect to a protected page (e.g., dashboard)
    } catch (error) {
      console.error('Failed to construct redirect URL:', error);
      // Fallback redirect
      return NextResponse.redirect(new URL("/dashboard", "http://localhost:3000"));
    }
  }

  // If no token is found, protect other routes and redirect to login
  if (!token && !publicRoutes.some(route => pathname.startsWith(route))) {
    console.log('Middleware - No token found, redirecting to login');
    try {
    return NextResponse.redirect(new URL(`/authentication/login`, request.url));
    } catch (error) {
      console.error('Failed to construct redirect URL:', error);
      // Fallback redirect
      return NextResponse.redirect(new URL("/authentication/login", "http://localhost:3000"));
    }
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
  matcher: ["/((?!api|_next|.*\\..*).*)", "/((?!).*)"],
};
