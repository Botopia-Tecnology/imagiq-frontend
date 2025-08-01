/**
 * Hook useLocalStorage
 * - Persistencia de datos en localStorage
 * - Sincronización entre tabs
 * - Manejo de errores de storage
 * - TypeScript support
 */

import { useState, useEffect } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Local storage hook implementation will be here
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const setValue = (value: T | ((val: T) => T)) => {
    // Set value logic will be implemented
    setStoredValue(value instanceof Function ? value(storedValue) : value);
  };

  return [storedValue, setValue] as const;
};
