import { useEffect, useState, useRef } from 'react';

/**
 * Hook para debounce de valores
 * Evita que se ejecuten efectos con demasiada frecuencia
 */
export function useDebounce<T>(value: T, delay: number): T {
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
}

/**
 * Hook para debounce de objetos complejos
 * Compara las propiedades del objeto para evitar re-renders innecesarios
 */
export function useDebouncedObject<T extends Record<string, any>>(
  value: T, 
  delay: number
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const previousValueRef = useRef<T>(value);

  useEffect(() => {
    // Comparar si el objeto realmente cambió
    const hasChanged = Object.keys(value).some(
      key => value[key] !== previousValueRef.current[key]
    );

    if (!hasChanged) {
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      previousValueRef.current = value;
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}