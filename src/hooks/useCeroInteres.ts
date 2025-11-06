/**
 * Hook para manejar la consulta de cuotas sin interés (0% interés)
 * Incluye caché en memoria que se limpia al cambiar de producto
 */

import { useState, useEffect, useRef } from 'react';
import { buscarCeroInteresPorPrecios, calcularCuotaMaxima, type CeroInteresResponse } from '@/services/ceroInteresService';

interface UseCeroInteresResult {
  cuotaMensual: number | null;
  plazoMaximo: number | null;
  loading: boolean;
  error: boolean;
  formatText: () => string | null;
  formatTextSimple: () => string | null;
}

// Caché en memoria (se limpia al recargar la página o cambiar de sesión)
const cache = new Map<string, CeroInteresResponse>();

/**
 * Hook para obtener información de cuotas sin interés
 * @param precios Array de precios del producto (precioeccommerce)
 * @param precioActual Precio de la variante actual seleccionada
 * @param indcerointeres Indicador si el producto tiene cuotas sin interés (1 = sí)
 * @param enabled Si debe ejecutarse la consulta (útil para optimizar)
 */
export function useCeroInteres(
  precios: number[],
  precioActual: number,
  indcerointeres: number,
  enabled: boolean = true
): UseCeroInteresResult {
  const [cuotaMensual, setCuotaMensual] = useState<number | null>(null);
  const [plazoMaximo, setPlazoMaximo] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  // Ref para evitar múltiples llamadas simultáneas
  const fetchingRef = useRef(false);
  
  // Ref para trackear el producto actual (limpiar caché al cambiar)
  const prevPreciosRef = useRef<string>('');

  useEffect(() => {
    // Solo ejecutar si está habilitado y indcerointeres === 1
    if (!enabled || indcerointeres !== 1) {
      return;
    }

    // Si no hay precios, no hacer nada
    if (!precios || precios.length === 0) {
      return;
    }

    // Crear key para identificar el producto actual
    const currentKey = [...precios].sort((a, b) => a - b).join('-');
    
    // Si cambiaron los precios (cambio de producto), limpiar estado
    if (prevPreciosRef.current && prevPreciosRef.current !== currentKey) {
      setCuotaMensual(null);
      setPlazoMaximo(null);
      setError(false);
    }
    
    prevPreciosRef.current = currentKey;

    // Verificar si ya está en caché
    const cachedData = cache.get(currentKey);
    if (cachedData) {
      const resultado = calcularCuotaMaxima(cachedData, precioActual);
      if (resultado) {
        setCuotaMensual(resultado.cuotaMensual);
        setPlazoMaximo(resultado.plazoMaximo);
      }
      return;
    }

    // Evitar múltiples llamadas simultáneas
    if (fetchingRef.current) {
      return;
    }

    // Hacer fetch
    const fetchData = async () => {
      fetchingRef.current = true;
      setLoading(true);
      setError(false);

      try {
        const data = await buscarCeroInteresPorPrecios(precios);
        
        // Guardar en caché
        cache.set(currentKey, data);
        
        // Calcular para el precio actual
        const resultado = calcularCuotaMaxima(data, precioActual);
        
        if (resultado) {
          setCuotaMensual(resultado.cuotaMensual);
          setPlazoMaximo(resultado.plazoMaximo);
        } else {
          console.warn(`[useCeroInteres] No se encontraron cuotas para el precio ${precioActual}`);
        }
      } catch (err) {
        console.error('[useCeroInteres] Error al obtener información de cuotas:', err);
        setError(true);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchData();
  }, [precios, precioActual, indcerointeres, enabled]);

  // Función helper para formatear el texto
  const formatText = (): string | null => {
    if (!cuotaMensual || !plazoMaximo) {
      return null;
    }

    const formattedPrice = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cuotaMensual);

    return `Desde ${formattedPrice} al mes en ${plazoMaximo} cuotas sin interés`;
  };

  // Función helper para formatear texto simplificado (mobile)
  const formatTextSimple = (): string | null => {
    if (!cuotaMensual || !plazoMaximo) {
      return null;
    }

    const formattedPrice = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cuotaMensual);

    return `${formattedPrice} en ${plazoMaximo} meses`;
  };

  return {
    cuotaMensual,
    plazoMaximo,
    loading,
    error,
    formatText,
    formatTextSimple,
  };
}

/**
 * Función para limpiar el caché manualmente (útil al cerrar sesión)
 */
export function clearCeroInteresCache() {
  cache.clear();
}
