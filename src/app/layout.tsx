/**
 * 🏗️ LAYOUT RAÍZ - IMAGIQ ECOMMERCE
 */

import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { samsungSharpSans } from "./fonts";
import "./globals.css";

import { AuthProvider } from "@/features/auth/context";
import { CartProvider } from "@/features/cart/CartContext";
import { AnalyticsProvider } from "@/features/analytics/AnalyticsContext";
import { UserPreferencesProvider } from "@/features/user/UserPreferencesContext";
import { PostHogProvider } from "@/features/analytics/PostHogProvider";
import ChatbotWidget from "@/components/chatbotWidget";
import { Toaster } from "@/components/ui/sonner";
import ClientLayout from "./ClientLayout";
import ClarityScript from "@/components/analytics/ClarityScript";
import GTMScript from "@/components/analytics/GTMScript";
import MetaPixelScript from "@/components/analytics/MetaPixelScript";
import { ResponsiveProvider } from "@/components/responsive"; // Importa el provider
import { NavbarVisibilityProvider } from "@/features/layout/NavbarVisibilityContext";
import { ProductProvider } from "@/features/products/ProductContext";
import { SelectedColorProvider } from "@/contexts/SelectedColorContext";
import { PointsProvider } from "@/contexts/PointsContext";
import { FlixmediaSpecsProvider } from "@/contexts/FlixmediaSpecsContext";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imagiq.com"),
  title: {
    default: "Imagiq Store - Tu tienda online de confianza",
    template: "%s | Imagiq Store",
  },
  description:
    "Ecommerce líder con Outlet hasta 70% OFF, Novedades exclusivas, Productos Recomendados y Ventas Corporativas. Soporte 24/7 y envío gratis +$999",
  keywords: [
    "ecommerce",
    "outlet",
    "descuentos",
    "novedades",
    "recomendados",
    "ventas corporativas",
    "soporte",
    "envío gratis",
  ],
  authors: [{ name: "Imagiq Team", url: "https://imagiq.com" }],
  creator: "Imagiq Store",
  publisher: "Imagiq Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://imagiq.com",
    siteName: "Imagiq Store",
    title: "Imagiq Store - Tu tienda online de confianza",
    description:
      "Ecommerce líder con Outlet, Novedades, Recomendados y Ventas Corporativas",
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
        alt: "Imagiq Store Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@imagiqstore",
    creator: "@imagiqstore",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: "https://imagiq.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // Importante para iOS safe-area
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validar children para evitar NaN, null, undefined o string vacío
  let safeChildren = children;
  const isNaNValue =
    (typeof children === "number" && isNaN(children)) ||
    (typeof children === "string" &&
      (children === "NaN" || children.trim() === "")) ||
    children == null;
  if (isNaNValue) {
    safeChildren = <></>;
  }
  return (
    <html
      lang="es"
      className={`${inter.variable} ${samsungSharpSans.variable}`}
    >
      <head>
        <ClarityScript />
        <GTMScript />
        <MetaPixelScript />
      </head>
      <body className="antialiased">
        <ResponsiveProvider>
          <ProductProvider>
            <NavbarVisibilityProvider>
              <PostHogProvider>
                <AnalyticsProvider>
                  <AuthProvider>
                    <UserPreferencesProvider>
                      <CartProvider>
                        <SelectedColorProvider>
                          <PointsProvider>
                            <FlixmediaSpecsProvider>
                              <ClientLayout>{safeChildren}</ClientLayout>
                            </FlixmediaSpecsProvider>
                          </PointsProvider>
                          {/* Widget del chatbot */}
                          <ChatbotWidget />
                          {/* Toast notifications */}
                          <Toaster
                            position="top-center"
                            expand={true}
                            richColors
                            closeButton
                            toastOptions={{
                              duration: 4000,
                              style: {
                                background: "white",
                                border: "1px solid #e2e8f0",
                                color: "#1e293b",
                                fontFamily: "var(--font-inter)",
                              },
                            }}
                          />
                        </SelectedColorProvider>
                      </CartProvider>
                    </UserPreferencesProvider>
                  </AuthProvider>
                </AnalyticsProvider>
              </PostHogProvider>
            </NavbarVisibilityProvider>
          </ProductProvider>
        </ResponsiveProvider>
      </body>
    </html>
  );
}
