import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook para manejar el flujo de compra con estados y animaciones.
 * Ahora soporta redirección a rutas dedicadas para cada estado.
 * Las redirecciones siempre llevan a rutas fijas para mejorar la UX:
 * - Éxito: Siempre redirige a la página principal (/)
 * - Error: Siempre redirige a la página de carrito (/carrito)
 *
 * @returns startPayment, estados: { loading, success, error }, setSuccess, closeSuccess,
 *          y métodos redirectToLoading, redirectToSuccess, redirectToError
 */
export function usePurchaseFlow() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Inicia el proceso de pago, simula loading y éxito.
   * Mantiene la funcionalidad original para compatibilidad con código existente.
   */
  const startPayment = useCallback(() => {
    setLoading(true);
    setError(null);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        resolve();
      }, 600); // Simulación de loading breve
    });
  }, []);

  /**
   * Permite cerrar el overlay de éxito.
   */
  const closeSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  /**
   * Redirecciona a la página de carga de compra.
   */
  const redirectToLoading = useCallback(() => {
    router.push(`/charging-result`);
  }, [router]);

  /**
   * Redirecciona directamente a la página de éxito.
   * Siempre redirige a la página principal (/) después de cerrar el overlay.
   */
  const redirectToSuccess = useCallback(() => {
    router.push(`/success-checkout`);
  }, [router]);

  /**
   * Redirecciona directamente a la página de error.
   * Siempre redirige a la página de carrito (/carrito) después de cerrar el overlay.
   * @param message Mensaje de error personalizado (opcional)
   */
  const redirectToError = useCallback(
    (message?: string) => {
      const url = new URL(`/error-checkout`, window.location.origin);
      if (message) {
        url.searchParams.set("message", message);
      }
      router.push(url.toString());
    },
    [router]
  );

  return {
    loading,
    success,
    error,
    startPayment,
    closeSuccess,
    setSuccess,
    setError,
    redirectToLoading,
    redirectToSuccess,
    redirectToError,
  };
}
