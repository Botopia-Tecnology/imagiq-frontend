/**
 * 🏗️ LAYOUT RAÍZ - IMAGIQ ECOMMERCE
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/features/auth/context";
import { CartProvider } from "@/features/cart/CartContext";
import { AnalyticsProvider } from "@/features/analytics/AnalyticsContext";
import { UserPreferencesProvider } from "@/features/user/UserPreferencesContext";
import { PostHogProvider } from "@/features/analytics/PostHogProvider";
import ChatbotWidget from "@/components/chatbotWidget";

import ClientLayout from "./ClientLayout";
import React from "react";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validar children para evitar NaN, null, undefined o string vacío
  let safeChildren = children;

  function isValidChild(child: unknown): boolean {
    if (child == null) return false;
    if (typeof child === "number") {
      if (isNaN(child) || !isFinite(child)) {
        console.warn("[RootLayout] Número inválido detectado:", child);
        return false;
      }
    }
    if (typeof child === "string") {
      if (
        child === "NaN" ||
        child === "undefined" ||
        child === "null" ||
        child.trim() === ""
      ) {
        console.warn("[RootLayout] String inválido detectado:", child);
        return false;
      }
    }
    if (Array.isArray(child)) {
      return child.every(isValidChild);
    }
    if (
      typeof child === "object" &&
      child !== null &&
      "children" in child &&
      !isValidChild((child as { children?: unknown }).children)
    ) {
      return false;
    }
    return true;
  }

  function sanitizeChildren(child: unknown): React.ReactNode {
    if (child == null) return null;
    if (typeof child === "number" && (isNaN(child) || !isFinite(child))) {
      return "";
    }
    if (
      typeof child === "string" &&
      (child === "NaN" ||
        child === "undefined" ||
        child === "null" ||
        child.trim() === "")
    ) {
      return "";
    }
    if (Array.isArray(child)) {
      // Filtra y mapea solo ReactNode válidos
      return child
        .map(sanitizeChildren)
        .filter(
          (el) =>
            el !== undefined &&
            el !== null &&
            el !== "" &&
            !(typeof el === "number" && (isNaN(el) || !isFinite(el)))
        );
    }
    // Si es un objeto React válido
    if (React.isValidElement(child)) return child;
    return null;
  }

  if (Array.isArray(children)) {
    const filtered = children.map(sanitizeChildren).filter(isValidChild);
    safeChildren = filtered.length > 0 ? (filtered as React.ReactNode) : <></>;
  } else if (!isValidChild(children)) {
    safeChildren = sanitizeChildren(children) ?? <></>;
  } else {
    safeChildren = sanitizeChildren(children);
  }
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">
        <PostHogProvider>
          <AnalyticsProvider>
            <AuthProvider>
              <UserPreferencesProvider>
                <CartProvider>
                  <ClientLayout>{safeChildren}</ClientLayout>
                  {/* Widget del chatbot */}
                  <ChatbotWidget />
                </CartProvider>
              </UserPreferencesProvider>
            </AuthProvider>
          </AnalyticsProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
