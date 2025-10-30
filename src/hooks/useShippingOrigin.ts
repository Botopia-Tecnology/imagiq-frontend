/**
 * Hook para determinar si se debe mostrar el origen de envío
 * Lógica de negocio:
 * - Solo se muestra origen de envío si el usuario está autenticado Y tiene direcciones
 * - Usa caché global para evitar múltiples peticiones simultáneas
 */

import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/features/auth/context';
import { addressesService } from '@/services/addresses.service';

// Cache global para almacenar el resultado
let globalCache: { hasAddresses: boolean; timestamp: number } | null = null;
// Promise global para evitar múltiples peticiones simultáneas
let globalPromise: Promise<boolean> | null = null;
const CACHE_TTL = 60000; // 1 minuto

async function checkAddressesWithCache(): Promise<boolean> {
  // Si ya hay una petición en curso, retornar esa misma promesa
  if (globalPromise) {
    return globalPromise;
  }

  // Si hay cache válido (menos de 1 minuto), retornarlo
  if (globalCache && Date.now() - globalCache.timestamp < CACHE_TTL) {
    return Promise.resolve(globalCache.hasAddresses);
  }

  // Crear nueva petición
  globalPromise = (async () => {
    try {
      const addresses = await addressesService.getUserAddresses();
      const hasAddresses = addresses.length > 0;

      // Actualizar cache
      globalCache = {
        hasAddresses,
        timestamp: Date.now()
      };

      return hasAddresses;
    } catch (error) {
      console.error('Error al verificar direcciones:', error);
      return false;
    } finally {
      // Limpiar la promesa global después de completar
      globalPromise = null;
    }
  })();

  return globalPromise;
}

export function useShippingOrigin() {
  const { isAuthenticated } = useAuthContext();
  const [hasAddresses, setHasAddresses] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function checkAddresses() {
      if (!isAuthenticated) {
        if (mountedRef.current) {
          setHasAddresses(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        const result = await checkAddressesWithCache();
        if (mountedRef.current) {
          setHasAddresses(result);
        }
      } catch (error) {
        console.error('Error al verificar direcciones:', error);
        if (mountedRef.current) {
          setHasAddresses(false);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    checkAddresses();

    return () => {
      mountedRef.current = false;
    };
  }, [isAuthenticated]);

  /**
   * Determina si se debe incluir el origen de envío
   * @returns true si el usuario está autenticado Y tiene direcciones
   */
  const shouldShowShippingOrigin = isAuthenticated && hasAddresses;

  return {
    shouldShowShippingOrigin,
    isLoading,
    isAuthenticated,
    hasAddresses
  };
}

/**
 * Función para invalidar el cache (llamar cuando se agregue/elimine una dirección)
 */
export function invalidateShippingOriginCache() {
  globalCache = null;
  globalPromise = null;
}
