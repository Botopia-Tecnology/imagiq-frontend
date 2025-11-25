"use client";
/**
 * ClientLayout: Componente cliente para renderizar el layout principal con Navbar y Footer.
 * Permite ocultar el Navbar dinámicamente según la ruta (ej: /carrito).
 * Se usa dentro del layout.tsx (servidor) para separar lógica cliente y exportar metadata correctamente.
 */
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { useNavbarVisibility } from "@/features/layout/NavbarVisibilityContext";
import { usePreloadAllProducts } from "@/hooks/usePreloadAllProducts";
import { useClarityIdentity } from "@/hooks/useClarityIdentity";
import VersionManager from "@/components/VersionManager";
import { subscribeToChannel } from "@/services/realtime";
import { connectSocket } from "@/lib/socket";

// Rutas donde el Navbar NO debe mostrarse
const HIDDEN_NAVBAR_ROUTES = [
  "/carrito",
  "/charging-result",
  "/success-checkout/",
  "/error-checkout",
  "/verify-purchase/",
];

function shouldHideNavbar(pathname: string) {
  return HIDDEN_NAVBAR_ROUTES.some((route) =>
    route.endsWith("/") ? pathname.startsWith(route) : pathname === route
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = shouldHideNavbar(pathname || '');
  const { hideNavbar: hideNavbarDynamic } = useNavbarVisibility();
  const [isClient, setIsClient] = useState(false);

  // Precargar productos de todas las combinaciones posibles en background
  usePreloadAllProducts();

  // Validar children para evitar NaN
  const safeChildren =
    typeof children === "number" && isNaN(children) ? null : children;

  // Ocultar el Footer solo en /carrito (sin step), /ofertas y las rutas de animaciones
  // Mostrar el Footer en /carrito/step2 y otros pasos del carrito
  const isCarritoStep = pathname?.startsWith("/carrito/step");
  const hideFooter =
    (!isCarritoStep && (pathname === "/carrito" || pathname === "/carrito/")) ||
    pathname === "/ofertas" ||
    pathname === "/charging-result" ||
    pathname === "/success-checkout" ||
    pathname === "/carrito/error-checkout";

  // Debug: verificar si el footer debe mostrarse
  if (typeof window !== "undefined" && pathname?.includes("/carrito/step2")) {
    console.log("🔍 Footer debug - pathname:", pathname, "hideFooter:", hideFooter, "isCarritoStep:", isCarritoStep);
  }

  // Identificación automática de usuarios en Clarity
  useClarityIdentity();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
  const allowedRoutes = ["*"]; // hoy todas

  const isAllowed =
    allowedRoutes.includes("*") || allowedRoutes.includes(pathname);

  console.log("🔌 Conectando socket en ClientLayout...");
  const socket = connectSocket("inweb");

  console.log("👂 Escuchando evento 'campaign_start'");

  // Listener para el evento específico
  socket.on("campaign_start", (msg) => {
    console.log("📨 Evento 'campaign_start' recibido:", msg);

    if (!isAllowed) {
      console.log("⛔ Evento ignorado en ruta:", pathname);
      return;
    }

    import("sonner").then(({ toast }) => {
      toast.info(msg?.title ?? "Nueva campaña inweb");
    });
  });

  // Listener para CUALQUIER evento (debug)
  socket.onAny((eventName, ...args) => {
    console.log("📡 Evento recibido:", eventName, args);
  });

  return () => {
    console.log("🧹 Limpiando listeners de socket");
    socket.off("campaign_start");
    socket.offAny();
  };
}, [pathname]);


//   useEffect(() => {
//   const allowedRoutes = ["*"];
//   const isAllowed =
//     allowedRoutes.includes("*") || allowedRoutes.includes(pathname);

//   // subscribeToChannel devuelve un EventSource
//   const es = subscribeToChannel("inweb", (msg) => {
//    console.log(msg); 
//     if (!isAllowed) {
//       console.log("Evento inweb ignorado en la ruta:", pathname);
//       return;
//     }
//     import("sonner").then(({ toast }) => {
//     toast.info(msg.title ?? "Nuevo mensaje inweb");
//   });
//   });

//   // limpiar correctamente
//   return () => {
//     es.close(); // ✅ correcto
//   };
// }, [pathname]);

  return (
    <>
      <VersionManager />
      <CookieBanner />
      <div id="main-layout" className="min-h-screen flex flex-col md:mr-0">
        {/* Solo monta el Navbar si no debe ocultarse por ruta ni por scroll dinámico */}
        {!hideNavbar && !hideNavbarDynamic && isClient && <Navbar />}
        <main className="flex-1" id="main-content">
          {safeChildren}
        </main>
        {!hideFooter && <Footer />}
      </div>
    </>
  );
}
