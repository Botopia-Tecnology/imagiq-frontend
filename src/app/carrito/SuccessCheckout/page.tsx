"use client";

/**
 * Página de confirmación de compra exitosa
 * Muestra overlay de éxito con animación y mensaje de confirmación
 * Siempre redirige al usuario a la página principal al hacer clic en "Continuar"
 *
 * Características:
 * - Animación premium con video de confirmación
 * - Mensaje claro y directo
 * - Limpieza automática del carrito
 * - Redirección a la página principal para continuar comprando
 * - Diseño responsive y accesible
 */

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutSuccessOverlay from "../CheckoutSuccessOverlay";

export default function SuccessCheckoutPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

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
   * Maneja el cierre del overlay y la redirección a la página principal
   * - Cierra suavemente la animación
   * - Limpia el carrito de compras
   * - Redirecciona al usuario a la página principal
   */
  const handleClose = () => {
    setOpen(false);

    // Pequeño retraso antes de redirigir para permitir que la animación de cierre termine
    setTimeout(() => {
      // Limpiar carrito al finalizar exitosamente
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart-items");
        // También limpiar otros datos relacionados con la compra
        localStorage.removeItem("applied-discount");
        localStorage.removeItem("current-order");
      }

      // Siempre redirigir a la página principal
      router.push("/");
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <CheckoutSuccessOverlay
        open={open}
        onClose={handleClose}
        message="¡Tu compra ha sido exitosa!"
        triggerPosition={triggerPosition}
        reloadSrc="/Payment_Success.mp4"
      />
    </div>
  );
}
