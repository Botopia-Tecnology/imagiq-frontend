import { useState, useCallback } from "react";

/**
 * Hook para manejar el flujo de compra con estados y animaciones.
 * @returns startPayment, estados: { loading, success, error }, setSuccess
 */
export function usePurchaseFlow() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Inicia el proceso de pago, simula loading y éxito.
   */
  const startPayment = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 600); // Simulación de loading breve
  }, []);

  /**
   * Permite cerrar el overlay de éxito.
   */
  const closeSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  return {
    loading,
    success,
    error,
    startPayment,
    closeSuccess,
    setSuccess,
    setError,
  };
}
