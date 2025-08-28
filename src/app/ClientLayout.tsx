/**
 * ClientLayout: Componente cliente para renderizar el layout principal con Navbar y Footer.
 * Permite ocultar el Navbar dinámicamente según la ruta (ej: /carrito).
 * Se usa dentro del layout.tsx (servidor) para separar lógica cliente y exportar metadata correctamente.
 */
"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Rutas donde el Navbar NO debe mostrarse
const HIDDEN_NAVBAR_ROUTES = ["/carrito"];

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

  // Validar children para evitar NaN
  const safeChildren =
    typeof children === "number" && isNaN(children) ? null : children;

  // Ocultar el Footer solo en /carrito y /ofertas
  const hideFooter = pathname === "/carrito" || pathname === "/ofertas";

  return (
    <div id="main-layout" className="min-h-screen flex flex-col md:mr-0">
      {!hideNavbar && <Navbar />}
      <main className="flex-1" id="main-content">
        {safeChildren}
      </main>
      {/* Oculta el Footer solo en /carrito y /ofertas */}
      {!hideFooter && <Footer />}
    </div>
  );
}
