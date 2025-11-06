/**
 * Servicio para consultar información de cuotas sin interés
 */

export interface CeroInteresEntity {
  codEntidad: string;
  entidad: string;
  codsBin: string;
  plazos: string;
  valor: number;
}

export type CeroInteresResponse = CeroInteresEntity[];

/**
 * Busca entidades bancarias con cuotas sin interés para los precios dados
 * @param precios Array de precios únicos a consultar
 * @returns Array de entidades con información de cuotas
 */
export async function buscarCeroInteresPorPrecios(
  precios: number[]
): Promise<CeroInteresResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error('[CeroInteres] NEXT_PUBLIC_API_URL no está configurada');
    throw new Error('API URL no configurada');
  }

  // Eliminar precios duplicados
  const preciosUnicos = Array.from(new Set(precios));

  try {
    const response = await fetch(`${apiUrl}/api/cero-interes/buscar-por-precios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        precios: preciosUnicos,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CeroInteresResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[CeroInteres] Error al consultar cuotas sin interés:', error);
    throw error;
  }
}

/**
 * Calcula el plazo máximo y la cuota mensual para un precio específico
 * @param entities Array de entidades del backend
 * @param precio Precio específico a buscar
 * @returns Objeto con plazo máximo y cuota mensual, o null si no hay datos
 */
export function calcularCuotaMaxima(
  entities: CeroInteresResponse,
  precio: number
): { plazoMaximo: number; cuotaMensual: number } | null {
  // Filtrar entidades que correspondan a este precio
  const entidadesDelPrecio = entities.filter(entity => entity.valor === precio);

  if (entidadesDelPrecio.length === 0) {
    return null;
  }

  // Encontrar el plazo máximo entre todas las entidades
  let plazoMaximo = 0;

  for (const entity of entidadesDelPrecio) {
    // Los plazos vienen como string "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24"
    const plazosArray = entity.plazos.split(',').map(p => Number.parseInt(p.trim(), 10));
    const maxPlazoEntidad = Math.max(...plazosArray);
    
    if (maxPlazoEntidad > plazoMaximo) {
      plazoMaximo = maxPlazoEntidad;
    }
  }

  // Calcular cuota mensual
  const cuotaMensual = Math.round(precio / plazoMaximo);

  return {
    plazoMaximo,
    cuotaMensual,
  };
}
