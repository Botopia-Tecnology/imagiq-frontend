/**
 * 🏗️ LAYOUT RAÍZ - IMAGIQ ECOMMERCE
 */

import type { Metadata } from "next";
import Script from "next/script";

import { samsungSharpSans } from "./fonts";
// Nota: eliminamos la importación de Inter desde next/font/google para evitar
// hacer fetch a fonts.googleapis.com durante el build en entornos sin acceso.
// Usaremos una variable CSS --font-inter definida en globals.css como fallback.
import "./globals.css";

// 🔐 SECURITY: La inicialización del sistema de encriptación se hace en ClientLayout.tsx
// (debe ejecutarse en el cliente, no en el servidor)

import { AuthProvider } from "@/features/auth/context";
import { CartProvider } from "@/features/cart/CartContext";
import { AnalyticsProvider } from "@/features/analytics/AnalyticsContext";
import { UserPreferencesProvider } from "@/features/user/UserPreferencesContext";
import { PostHogProvider } from "@/features/analytics/PostHogProvider";
import ChatbotWidget from "@/components/chatbotWidget";
import { Toaster } from "@/components/ui/sonner";
import ClientLayout from "./ClientLayout";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import AnalyticsInit from "@/components/analytics/AnalyticsInit";
import { ResponsiveProvider } from "@/components/responsive"; // Importa el provider
import { NavbarVisibilityProvider } from "@/features/layout/NavbarVisibilityContext";
import { ProductProvider } from "@/features/products/ProductContext";
import { SelectedColorProvider } from "@/contexts/SelectedColorContext";
import { PointsProvider } from "@/contexts/PointsContext";
import { SelectedStoreProvider } from "@/contexts/SelectedStoreContext";
import { HeroProvider } from "@/contexts/HeroContext";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import DevToolsGuard from "@/components/security/DevToolsGuard";
import SecurityInitializer from "@/components/security/SecurityInitializer";
// Si necesitas Inter desde Google Fonts en entornos con internet,
// reactivar la importación desde next/font/google o agregar el CSS manual.

export const metadata: Metadata = {
  metadataBase: new URL("https://imagiq.com"),
  title: {
    default: "Imagiq - Distribuidor Oficial Samsung Colombia",
    template: "%s | Imagiq Samsung Store",
  },
  description:
    "Imagiq - Distribuidor oficial de Samsung en Colombia. Encuentra los últimos Galaxy, tablets, wearables y electrodomésticos con garantía oficial. Envío gratis, soporte especializado y las mejores promociones.",
  keywords: [
    "Samsung Colombia",
    "distribuidor oficial Samsung",
    "Galaxy",
    "Samsung Store",
    "electrodomésticos Samsung",
    "tablets Samsung",
    "smartwatch Samsung",
    "Galaxy Z Fold",
    "Galaxy Z Flip",
    "tienda Samsung Colombia",
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
    locale: "es_CO",
    url: "https://imagiq.com",
    siteName: "Imagiq Samsung Store",
    title: "Imagiq - Distribuidor Oficial Samsung Colombia",
    description:
      "Distribuidor oficial de Samsung en Colombia. Galaxy, tablets, wearables y electrodomésticos con garantía oficial.",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Verificar si el modo mantenimiento está activado
  const isMaintenanceMode =
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  // Validar children para evitar NaN, null, undefined o string vacío
  let safeChildren = children;
  const isNaNValue =
    (typeof children === "number" && Number.isNaN(children)) ||
    (typeof children === "string" &&
      (children === "NaN" || children.trim() === "")) ||
    children == null;
  if (isNaNValue) {
    safeChildren = <></>;
  }
  return (
    <html
      lang="es"
      className={`${samsungSharpSans.variable}`}
      style={
        {
          "--font-inter":
            "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        } as React.CSSProperties
      }
    >
      <head></head>
      <body className="antialiased">
        <SecurityInitializer>
          <AnalyticsScripts />
          <AnalyticsInit />

          <DevToolsGuard>
            <ResponsiveProvider>
              <HeroProvider>
                <ProductProvider>
                  <NavbarVisibilityProvider>
                    <PostHogProvider>
                      <AnalyticsProvider>
                        <AuthProvider>
                          <UserPreferencesProvider>
                            <CartProvider>
                              <SelectedColorProvider>
                                <PointsProvider>
                                  <SelectedStoreProvider>
                                    {/* Mostrar pantalla de mantenimiento si está activada */}
                                    {isMaintenanceMode ? (
                                      <MaintenanceScreen />
                                    ) : (
                                      <ClientLayout>{safeChildren}</ClientLayout>
                                    )}
                                  </SelectedStoreProvider>
                                  {/* Widget del chatbot - solo si NO está en mantenimiento */}
                                  {!isMaintenanceMode && <ChatbotWidget />}
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
                                </PointsProvider>
                              </SelectedColorProvider>
                            </CartProvider>
                          </UserPreferencesProvider>
                        </AuthProvider>
                      </AnalyticsProvider>
                    </PostHogProvider>
                  </NavbarVisibilityProvider>
                </ProductProvider>
              </HeroProvider>
            </ResponsiveProvider>
          </DevToolsGuard>
        </SecurityInitializer>
        <Script
          src="https://multimedia.epayco.co/general/3DS/validateThreeds.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
