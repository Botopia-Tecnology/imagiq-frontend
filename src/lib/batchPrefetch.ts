/**
 * Helper function centralizada para ejecutar batch prefetch de productos
 * 
 * Consolida la lógica de:
 * - Ejecución de batch request
 * - Procesamiento de respuestas
 * - Guardado en caché
 * - Manejo de errores
 */

import { productEndpoints } from './api';
import { productCache } from './productCache';
import type { ProductFilterParams, BatchProductResult } from './api';

/**
 * Ejecuta un batch prefetch de productos
 * 
 * @param queries - Array de parámetros de filtro para las queries
 * @param source - Identificador de la fuente (ej: "usePreloadAllProducts", "Navbar", etc.)
 * @returns Promise que se resuelve cuando el batch se completa
 */
export async function executeBatchPrefetch(
  queries: ProductFilterParams[],
  source: string
): Promise<void> {
  if (queries.length === 0) {
    return;
  }

  try {
    const batchResponse = await productEndpoints.getBatch(queries);

    if (batchResponse.success && batchResponse.data) {
      // Procesar respuestas y guardar en caché
      batchResponse.data.results.forEach((result: BatchProductResult) => {
        if (result.success && result.data) {
          const query = queries[result.index];
          if (query) {
            productCache.set(query, {
              data: result.data,
              success: true,
            });
          }
        }
      });
    }
  } catch {
    // Silenciar errores - no afectar la UX
  }
}

