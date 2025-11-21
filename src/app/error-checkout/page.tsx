"use client";

/**
 * Página de error en el proceso de checkout
 * Muestra overlay de error con animación y mensaje explicativo
 * Permite al usuario reintentar o volver a la página de carrito
 *
 * Características:
 * - Animación profesional para comunicar el error
 * - Mensaje claro y explicativo
 * - Posibilidad de reintentar el proceso
 * - Redirección a la página de carrito al cerrar
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutErrorOverlay from "../carrito/CheckoutErrorOverlay";

export default function ErrorCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(true);

  // Obtener mensaje de error personalizado desde los parámetros de búsqueda
  const errorMessage = searchParams.get("error") || undefined;

  // Coordenadas para el efecto de expansión de la animación (centrado)
  const [triggerPosition, setTriggerPosition] = useState(() => {
    if (typeof window !== "undefined") {
      return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
    }
    return { x: 0, y: 0 };
  });

  /**
   * Maneja el cierre del overlay y la redirección
   * - Cierra suavemente la animación
   * - Redirecciona al usuario a la página de carrito
   */
  const handleClose = () => {
    setOpen(false);

    // Pequeño retraso antes de redirigir para permitir que la animación de cierre termine
    setTimeout(() => {
      // Siempre redirigir a la página de carrito en caso de error
      router.push("/carrito");
    }, 300);
  };

  // Ajustar posición al cambiar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setTriggerPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <CheckoutErrorOverlay
        open={open}
        onClose={handleClose}
        message={errorMessage}
        triggerPosition={triggerPosition}
      />
    </div>
  );
}
