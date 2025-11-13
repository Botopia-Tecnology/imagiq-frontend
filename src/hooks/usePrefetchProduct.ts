/**
 * Hook para precargar productos en segundo plano
 * Útil para mejorar la experiencia de navegación precargando
 * la página de detalle mientras el usuario está en multimedia
 */

"use client";

import { useEffect, useRef } from "react";
import { productEndpoints } from "@/lib/api";
import { productCache } from "@/lib/productCache";

interface UsePrefetchProductOptions {
  /**
   * ID del producto a precargar (codigoMarketBase)
   */
  productId: string;

  /**
   * Retraso en milisegundos antes de iniciar la precarga
   * Default: 1500ms (1.5 segundos)
   */
  delay?: number;

  /**
   * Si es true, la precarga se ejecuta inmediatamente
   * Si es false, se puede activar manualmente
   * Default: true
   */
  enabled?: boolean;
}

/**
 * Hook para precargar un producto en segundo plano
 * Almacena el resultado en el cache para que esté disponible
 * cuando el usuario navegue a la página de detalle
 */
export function usePrefetchProduct({
  productId,
  delay = 1500,
  enabled = true,
}: UsePrefetchProductOptions) {
  const prefetchedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Si no está habilitado, no hacer nada
    if (!enabled || !productId) {
      return;
    }

    // Si ya se precargó, no volver a hacerlo
    if (prefetchedRef.current) {
      return;
    }

    // Verificar si ya existe en cache
    const cachedProduct = productCache.getSingleProduct(productId);
    if (cachedProduct) {
     
      prefetchedRef.current = true;
      return;
    }

    // Programar la precarga con delay
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await productEndpoints.getByCodigoMarket(productId);

        if (response.success && response.data) {
          // Guardar en cache con TTL de 10 minutos (más tiempo que el default)
          // para que esté disponible cuando el usuario navegue
          productCache.setSingleProduct(productId, response, 10 * 60 * 1000);
          prefetchedRef.current = true;
        }
      } catch (error) {
       
        // No mostrar error al usuario, es una operación en background
      }
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [productId, delay, enabled]);

  return {
    isPrefetched: prefetchedRef.current,
  };
}
