/**
 * Hook para manejar el flujo de envío según la lógica:
 * 1. Consultar candidate_stores
 * 2. Verificar canPickUp
 * 3. Determinar método de envío (NOVASOFT, IMAGIQ, o COORDINADORA)
 */

import { useState, useEffect, useCallback } from 'react';
import { productEndpoints, CandidateStore, DefaultDirection } from '@/lib/api';

interface ShippingFlowData {
  canPickUp: boolean;
  stores: Record<string, CandidateStore[]>;
  defaultDirection: DefaultDirection;
  isInCoverageZone: boolean; // Si está en zona de cobertura de IMAGIQ
  recommendedFlow: 'NOVASOFT' | 'IMAGIQ' | 'COORDINADORA' | null;
}

interface UseShippingFlowReturn {
  shippingFlow: ShippingFlowData | null;
  loading: boolean;
  error: string | null;
  checkShippingFlow: (products: Array<{ sku: string; quantity: number }>, userId: string) => Promise<void>;
  determineShippingMethod: (deliveryMethod: 'tienda' | 'domicilio') => 'NOVASOFT' | 'IMAGIQ' | 'COORDINADORA';
}

export const useShippingFlow = (): UseShippingFlowReturn => {
  const [shippingFlow, setShippingFlow] = useState<ShippingFlowData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos guardados en localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem('imagiq_shipping_flow');
    if (saved) {
      try {
        setShippingFlow(JSON.parse(saved));
      } catch (err) {
        console.error('Error al cargar shipping flow:', err);
      }
    }
  }, []);

  /**
   * Consulta el endpoint candidate_stores y determina el flujo de envío
   */
  const checkShippingFlow = useCallback(async (
    products: Array<{ sku: string; quantity: number }>,
    userId: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await productEndpoints.getCandidateStores({
        products,
        user_id: userId,
      });

      if (response.success && response.data) {
        const { stores, canPickUp, default_direction } = response.data;

        // Determinar si está en zona de cobertura de IMAGIQ
        // Por ahora, asumimos que si tiene tiendas disponibles, está en zona
        const isInCoverageZone = Object.keys(stores).length > 0;

        const flowData: ShippingFlowData = {
          canPickUp,
          stores,
          defaultDirection: default_direction,
          isInCoverageZone,
          recommendedFlow: null, // Se determina según la elección del usuario
        };

        // Guardar en localStorage
        localStorage.setItem('imagiq_shipping_flow', JSON.stringify(flowData));
        setShippingFlow(flowData);
      } else {
        setError('No se pudo obtener información de envío');
      }
    } catch (err) {
      console.error('Error al verificar flujo de envío:', err);
      setError('Error al consultar información de envío');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Determina el método de envío según la lógica del diagrama:
   * 
   * canPickUp = true:
   *   - Usuario elige tienda → NOVASOFT
   *   - Usuario elige domicilio:
   *     - Está en zona → IMAGIQ
   *     - NO está en zona → COORDINADORA
   * 
   * canPickUp = false:
   *   - COORDINADORA (único flujo)
   */
  const determineShippingMethod = useCallback((
    deliveryMethod: 'tienda' | 'domicilio'
  ): 'NOVASOFT' | 'IMAGIQ' | 'COORDINADORA' => {
    if (!shippingFlow) {
      console.warn('No hay datos de shipping flow, usando COORDINADORA por defecto');
      return 'COORDINADORA';
    }

    const { canPickUp, isInCoverageZone } = shippingFlow;

    // Flujo 1: canPickUp = false → COORDINADORA
    if (!canPickUp) {
      console.log('📦 Flujo: COORDINADORA (canPickUp = false)');
      return 'COORDINADORA';
    }

    // Flujo 2: canPickUp = true
    if (deliveryMethod === 'tienda') {
      // Usuario eligió recoger en tienda → NOVASOFT
      console.log('🏪 Flujo: NOVASOFT (Recogida en tienda)');
      return 'NOVASOFT';
    }

    // Flujo 3: canPickUp = true + envío a domicilio
    if (deliveryMethod === 'domicilio') {
      if (isInCoverageZone) {
        // Está en zona de cobertura → IMAGIQ
        console.log('🚚 Flujo: IMAGIQ (En zona de cobertura)');
        return 'IMAGIQ';
      } else {
        // NO está en zona → COORDINADORA
        console.log('📦 Flujo: COORDINADORA (Fuera de zona de cobertura)');
        return 'COORDINADORA';
      }
    }

    // Fallback
    console.warn('⚠️ Flujo no determinado, usando COORDINADORA');
    return 'COORDINADORA';
  }, [shippingFlow]);

  return {
    shippingFlow,
    loading,
    error,
    checkShippingFlow,
    determineShippingMethod,
  };
};
