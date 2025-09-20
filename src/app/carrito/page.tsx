"use client";
/**
 * Página principal del carrito y checkout
 * Renderiza el paso 1 del carrito (productos y resumen)
 * Código limpio, escalable y documentado
 */


import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Página principal del carrito y checkout
 * Controla la navegación entre pasos del proceso de compra
 */
export default function CheckoutPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/carrito/step1");
  }, [router]);
  return null;
}
