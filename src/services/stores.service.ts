/**
 * @module stores.service
 * @description Servicio para obtener tiendas físicas de Samsung
 */

import { storesEndpoints } from '@/lib/api';
import type { Store, FormattedStore } from '@/types/store';

/**
 * Servicio singleton para gestión de tiendas físicas
 */
class StoresService {
  /**
   * Obtiene todas las tiendas físicas de Samsung
   * @returns Promise con array de tiendas
   */
  async getAllStores(): Promise<Store[]> {
    try {
      const response = await storesEndpoints.getAll();

      if (response.success && response.data) {
        return response.data;
      }

      console.error('❌ Error al obtener tiendas:', response.message);
      throw new Error(response.message || 'Error al obtener tiendas');
    } catch (error) {
      console.error('❌ Error en getAllStores:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las tiendas formateadas para uso en UI
   * Convierte latitud/longitud de string a number y agrega campo position
   * Las tiendas con coordenadas inválidas se muestran en la lista pero no en el mapa
   * @returns Promise con array de tiendas formateadas
   */
  async getFormattedStores(): Promise<FormattedStore[]> {
    try {
      const stores = await this.getAllStores();

      return stores.map(store => {
        // Convertir latitud y longitud a número
        const lat = typeof store.latitud === 'string' ? parseFloat(store.latitud) : store.latitud;
        const lng = typeof store.longitud === 'string' ? parseFloat(store.longitud) : store.longitud;

        // Validar si las coordenadas son válidas
        const hasValidCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

        // Si las coordenadas no son válidas, usar valores por defecto

        // Retornar la tienda formateada (incluso si no tiene coordenadas válidas)
        return {
          ...store,
          latitud: hasValidCoords ? lat : 0,
          longitud: hasValidCoords ? lng : 0,
          position: [hasValidCoords ? lat : 0, hasValidCoords ? lng : 0] as [number, number]
        };
      });
    } catch (error) {
      console.error('❌ Error en getFormattedStores:', error);
      throw error;
    }
  }

  /**
   * Filtra tiendas por ciudad
   * @param stores - Array de tiendas
   * @param ciudad - Ciudad a filtrar
   * @returns Array de tiendas filtradas
   */
  filterByCity(stores: FormattedStore[], ciudad: string): FormattedStore[] {
    if (!ciudad) return stores;
    return stores.filter(store =>
      store.ciudad.toLowerCase() === ciudad.toLowerCase()
    );
  }

  /**
   * Filtra tiendas por búsqueda de texto
   * @param stores - Array de tiendas
   * @param searchQuery - Texto de búsqueda
   * @returns Array de tiendas filtradas
   */
  searchStores(stores: FormattedStore[], searchQuery: string): FormattedStore[] {
    if (!searchQuery) return stores;

    const query = searchQuery.toLowerCase();
    return stores.filter(store =>
      store.descripcion.toLowerCase().includes(query) ||
      store.direccion.toLowerCase().includes(query) ||
      store.ciudad.toLowerCase().includes(query) ||
      store.departamento.toLowerCase().includes(query)
    );
  }

  /**
   * Obtiene lista única de ciudades de las tiendas
   * @param stores - Array de tiendas
   * @returns Array de ciudades únicas ordenadas alfabéticamente
   */
  getUniqueCities(stores: FormattedStore[]): string[] {
    const cities = new Set(stores.map(store => store.ciudad));
    return Array.from(cities).sort();
  }
}

// Export singleton instance
export const storesService = new StoresService();
