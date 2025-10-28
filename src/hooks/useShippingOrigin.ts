/**
 * Hook para determinar si se debe mostrar el origen de envío
 * Lógica de negocio:
 * - Solo se muestra origen de envío si el usuario está autenticado Y tiene direcciones
 */

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/features/auth/context';
import { addressesService } from '@/services/addresses.service';

export function useShippingOrigin() {
  const { isAuthenticated } = useAuthContext();
  const [hasAddresses, setHasAddresses] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAddresses() {
      if (!isAuthenticated) {
        setHasAddresses(false);
        setIsLoading(false);
        return;
      }

      try {
        const addresses = await addressesService.getUserAddresses();
        setHasAddresses(addresses.length > 0);
      } catch (error) {
        console.error('Error al verificar direcciones:', error);
        setHasAddresses(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAddresses();
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
