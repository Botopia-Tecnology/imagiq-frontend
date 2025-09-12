/**
 * Middleware de Next.js
 * - Protección de rutas privadas
 * - Redirecciones basadas en autenticación
 * - Rate limiting para APIs
 * - Geolocalización y regionalización
 * - A/B testing routing
 * - Analytics tracking automático
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/productos",
  "/productos/dispositivos-moviles",
  "/productos/electrodomesticos",
  "/productos/view",
  "/login",
  "/login/create-account",
  "/register",
  "/soporte",
  "/tiendas",
  "/carrito",
  "/dashboard",
  "/ofertas",
  // Chatbot steps públicos:
  "/chatbot/step1",
  "/chatbot/step2",
  "/chatbot/step3",
  "/chatbot/step4",
  "/chatbot",
  "/chatbot/juegos.png",
  "/chatbot/fotografia.png",
  "/chatbot/trabajo.png",
  "/chatbot/hogar.png",
  "/chatbot/SamsungIA.png",
  // Rutas de animaciones correctas
  "/charging-result",
  "/success-checkout",
  "/error-checkout",
  "/tracking-service",
];

// Admin routes that require special permissions
const adminRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acceso público a archivos estáticos en la raíz de public (ej: /videoplayback.mp4)
  if (pathname.match(/^\/[\w\-]+\.\w+$/)) {
    return NextResponse.next();
  }

  // Permitir acceso público a todas las subrutas de Electrodomesticos, DispositivosMoviles y view
  if (
    pathname.startsWith("/productos/dispositivos-moviles") ||
    pathname.startsWith("/productos/electrodomesticos") ||
    pathname.startsWith("/productos/view")
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated (token in cookies/headers)
  const token = request.cookies.get("auth-token")?.value;
  const isAuthenticated = !!token;

  // Check if user is admin (simplified check)
  const userRole = request.cookies.get("user-role")?.value;
  const isAdmin = userRole === "admin";

  // Protect private routes
  if (!publicRoutes.includes(pathname) && !pathname.startsWith("/api")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Permitir acceso a /login aunque el usuario esté autenticado
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Protect admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Add security headers
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Analytics tracking headers for PostHog
  // Note: geo is available in production with Vercel or other platforms
  interface RequestGeo {
    country?: string;
    city?: string;
  }

  const geo = (request as NextRequest & { geo?: RequestGeo }).geo;
  if (geo) {
    response.headers.set("X-User-Country", geo.country || "US");
    response.headers.set("X-User-City", geo.city || "Unknown");
  }

  return response;
}

// Configure which routes use the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
