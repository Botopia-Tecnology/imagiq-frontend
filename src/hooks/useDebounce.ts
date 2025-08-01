/**
 * Hook useDebounce
 * - Optimización de búsquedas y filtros
 * - Reduce llamadas innecesarias a APIs
 * - Mejora la performance de inputs
 * - Evita spam de requests
 */

import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
