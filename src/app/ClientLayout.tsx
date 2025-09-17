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
import { useNavbarVisibility } from "@/features/layout/NavbarVisibilityContext";

// Rutas donde el Navbar NO debe mostrarse
const HIDDEN_NAVBAR_ROUTES = [
  "/carrito",
  "/charging-result",
  "/success-checkout",
  "/carrito/ErrorCheckout",
];

function shouldHideNavbar(pathname: string) {
  return HIDDEN_NAVBAR_ROUTES.includes(pathname);
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = shouldHideNavbar(pathname);
  const { hideNavbar: hideNavbarDynamic } = useNavbarVisibility();

  // Validar children para evitar NaN
  const safeChildren =
    typeof children === "number" && isNaN(children) ? null : children;

  // Ocultar el Footer solo en /carrito, /ofertas y las rutas de animaciones
  const hideFooter =
    pathname === "/carrito" ||
    pathname === "/ofertas" ||
    pathname === "/charging-result" ||
    pathname === "/success-checkout" ||
    pathname === "/carrito/error-checkout";

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div id="main-layout" className="min-h-screen flex flex-col md:mr-0">
      {/* Solo monta el Navbar si no debe ocultarse por ruta ni por scroll dinámico */}
      {!hideNavbar && !hideNavbarDynamic && isClient && <Navbar />}
      <main className="flex-1" id="main-content">
        {safeChildren}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
