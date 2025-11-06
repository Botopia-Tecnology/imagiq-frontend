/**
 * @module useStores
 * @description Hook para obtener y gestionar tiendas físicas de Samsung
 */

import { useState, useEffect } from 'react';
import { storesService } from '@/services/stores.service';
import type { FormattedStore } from '@/types/store';

export function useStores() {
  const [stores, setStores] = useState<FormattedStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError(null);

        const formattedStores = await storesService.getFormattedStores();
        setStores(formattedStores);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar tiendas');
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  /**
   * Filtra tiendas por ciudad
   */
  const filterByCity = (ciudad: string): FormattedStore[] => {
    return storesService.filterByCity(stores, ciudad);
  };

  /**
   * Busca tiendas por texto
   */
  const searchStores = (query: string): FormattedStore[] => {
    return storesService.searchStores(stores, query);
  };

  /**
   * Obtiene ciudades únicas
   */
  const getUniqueCities = (): string[] => {
    return storesService.getUniqueCities(stores);
  };

  return {
    stores,
    loading,
    error,
    filterByCity,
    searchStores,
    getUniqueCities
  };
}
