import { useCallback, useState } from "react";
import { apiPost } from "@/lib/api-client";

export function usePaySupportTicket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  const pay = useCallback(async (data: unknown) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiPost("/api/orders/support-ticket/pay", data);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { pay, loading, error, reset } as const;
}

export default usePaySupportTicket;
