/**
 * Servicio para consultar opciones de cero interés por SKUs
 * Utiliza el nuevo endpoint que consulta v_bot_skucerointeres
 */

import { apiPost } from '@/lib/api-client';

export interface ZeroInterestSkuResult {
  sku: string;
  codEntidad: string;
  entidad: string;
  codsBIN: string;
  plazos: number;
  urlTerminos: string;
  valor: number;
}

/**
 * Busca opciones de cero interés para múltiples SKUs
 * @param skus - Array de SKUs a consultar
 * @returns Array de opciones de cero interés agrupadas por SKU y entidad
 */
export async function buscarCeroInteresPorSkus(
  skus: string[]
): Promise<ZeroInterestSkuResult[]> {
  if (!skus || skus.length === 0) {
    return [];
  }

  try {
    const data = await apiPost<ZeroInterestSkuResult[]>(
      '/api/cero-interes/buscar-por-skus',
      { skus }
    );
    return data || [];
  } catch (error) {
    console.error('[CeroInteresSku] Error al consultar cero interés por SKUs:', error);
    return [];
  }
}
