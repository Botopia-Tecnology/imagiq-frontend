'use client';

/**
 * 🔐 USE SECURE STORAGE HOOK
 *
 * Hook React para usar SecureStorage de forma declarativa.
 * API idéntica a useState pero con persistencia encriptada.
 *
 * @author Imagiq Security Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSecureStorage } from '@/lib/security/encryption/secureStorage';

type SetValue<T> = T | ((val: T) => T);

/**
 * Hook para usar localStorage encriptado como estado React
 *
 * @param key - Key para guardar en localStorage
 * @param initialValue - Valor inicial si no existe en storage
 * @returns [value, setValue, removeValue]
 *
 * @example
 * const [user, setUser, removeUser] = useSecureStorage('imagiq_user', null);
 */
export function useSecureStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Ref para evitar loops infinitos
  const isFirstRender = useRef(true);

  // Estado React
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const secureStorage = getSecureStorage();
      if (!secureStorage) {
        console.warn('SecureStorage no disponible, usando initialValue');
        return initialValue;
      }

      // Intentar leer valor desde storage
      const item = secureStorage.getDecrypted<T>(key, initialValue);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error leyendo key "${key}" desde SecureStorage:`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Permitir función callback como useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Actualizar estado React
        setStoredValue(valueToStore);

        // Guardar en storage
        if (typeof window !== 'undefined') {
          const secureStorage = getSecureStorage();
          if (secureStorage) {
            secureStorage.setEncrypted(key, valueToStore);

            // Disparar evento personalizado para sincronización multi-tab
            window.dispatchEvent(
              new CustomEvent('secureStorageChange', {
                detail: { key, value: valueToStore },
              })
            );
          }
        }
      } catch (error) {
        console.error(`Error guardando key "${key}" en SecureStorage:`, error);
      }
    },
    [key, storedValue]
  );

  // Función para eliminar el valor
  const removeValue = useCallback(() => {
    try {
      // Actualizar estado React al initial value
      setStoredValue(initialValue);

      // Eliminar de storage
      if (typeof window !== 'undefined') {
        const secureStorage = getSecureStorage();
        if (secureStorage) {
          secureStorage.removeItem(key);

          // Disparar evento
          window.dispatchEvent(
            new CustomEvent('secureStorageChange', {
              detail: { key, value: null },
            })
          );
        }
      }
    } catch (error) {
      console.error(`Error eliminando key "${key}" de SecureStorage:`, error);
    }
  }, [key, initialValue]);

  // Sincronización con cambios externos (otros tabs o componentes)
  useEffect(() => {
    // Skip first render para evitar loops
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handleStorageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string; value: T }>;

      if (customEvent.detail.key === key) {
        setStoredValue(customEvent.detail.value);
      }
    };

    // Listener para cambios desde otros tabs (evento nativo de browser)
    const handleNativeStorageChange = (event: StorageEvent) => {
      if (event.key === key || event.key === `_enc_${key}`) {
        try {
          const secureStorage = getSecureStorage();
          if (secureStorage) {
            const newValue = secureStorage.getDecrypted<T>(key, initialValue);
            setStoredValue(newValue !== null ? newValue : initialValue);
          }
        } catch (error) {
          console.error('Error sincronizando desde storage event:', error);
        }
      }
    };

    // Agregar listeners
    window.addEventListener('secureStorageChange', handleStorageChange);
    window.addEventListener('storage', handleNativeStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('secureStorageChange', handleStorageChange);
      window.removeEventListener('storage', handleNativeStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook simplificado para solo leer de SecureStorage
 * No crea estado React, solo lee una vez
 */
export function useSecureStorageValue<T>(key: string, initialValue: T): T {
  const [value] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const secureStorage = getSecureStorage();
      if (!secureStorage) {
        return initialValue;
      }

      const item = secureStorage.getDecrypted<T>(key, initialValue);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Error leyendo key "${key}":`, error);
      return initialValue;
    }
  });

  return value;
}

/**
 * Export por defecto
 */
export default useSecureStorage;
