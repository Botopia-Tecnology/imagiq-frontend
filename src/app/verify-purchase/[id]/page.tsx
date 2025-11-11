"use client";
import LogoReloadAnimation from "@/app/carrito/LogoReloadAnimation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Página de verificación de compra
 * Implementa la lógica del diagrama de flujo:
 * 1. Consulta candidate_stores
 * 2. Verifica canPickUp
 * 3. Determina el flujo de envío (NOVASOFT, IMAGIQ, COORDINADORA)
 * 4. Procesa según corresponda
 */
export default function VerifyPurchase(props: Readonly<{ params: Readonly<Promise<{ id: string }>>; }>) {
  const { params } = props;
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Verificando compra...");

  useEffect(() => {
    params.then(({ id }) => {
      setOrderId(id);
    });
  }, [params]);

  /**
   * Lógica principal según el diagrama:
   * 
   * 1. Obtener datos de la orden
   * 2. Consultar candidate_stores
   * 3. Según canPickUp y selección del usuario:
   *    - canPickUp=false → COORDINADORA
   *    - canPickUp=true + recogida en tienda → NOVASOFT
   *    - canPickUp=true + envío a domicilio:
   *      - En zona de cobertura → IMAGIQ
   *      - Fuera de zona → COORDINADORA
   */
  const verifyOrder = useCallback(async () => {
    if (!orderId) return;

    try {
      setStatusMessage("Verificando orden...");
      
      // 1. Verificar la orden
      const response = await fetch(
        `${API_BASE_URL}/api/orders/verify/${orderId}`
      );

      if (!response.ok) {
        console.error("HTTP error:", response.status, response.statusText);
        router.push("/error-checkout");
        return;
      }

      const data: { message: string; status: number } = await response.json();

      if (data.status !== 200) {
        console.error("Verification failed with status:", data.status, data.message);
        router.push("/error-checkout");
        return;
      }

      // 2. Obtener información de la orden y productos
      setStatusMessage("Obteniendo información de productos...");
      const orderResponse = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
      
      if (!orderResponse.ok) {
        console.error("Error obteniendo orden");
        router.push("/error-checkout");
        return;
      }

      const orderData = await orderResponse.json();
      const { productos, user_id, direccion_id, delivery_method } = orderData.data || {};

      if (!productos || !user_id) {
        console.error("Datos de orden incompletos");
        router.push("/error-checkout");
        return;
      }

      // 3. Consultar candidate_stores
      setStatusMessage("Verificando disponibilidad...");
      const candidateResponse = await fetch(`${API_BASE_URL}/api/products/candidate-stores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: productos.map((p: { sku: string; quantity: number }) => ({
            sku: p.sku,
            quantity: p.quantity || 1
          })),
          user_id
        })
      });

      if (!candidateResponse.ok) {
        console.error("Error consultando candidate_stores");
        router.push("/error-checkout");
        return;
      }

      const candidateData = await candidateResponse.json();
      const { canPickUp, stores } = candidateData.data || {};

      console.log("📦 Datos de candidate_stores:", { canPickUp, stores, delivery_method });

      // 4. DETERMINAR FLUJO SEGÚN EL DIAGRAMA
      let shippingMethod: 'NOVASOFT' | 'IMAGIQ' | 'COORDINADORA';

      if (!canPickUp) {
        // Flujo 1: canPickUp = false → COORDINADORA
        console.log("📦 Flujo: COORDINADORA (canPickUp = false)");
        shippingMethod = 'COORDINADORA';
        setStatusMessage("Procesando envío con Coordinadora...");
      } else if (delivery_method === 'tienda' || delivery_method === 'pickup') {
        // Flujo 2: canPickUp = true + usuario eligió recoger en tienda → NOVASOFT
        console.log("🏪 Flujo: NOVASOFT (Recogida en tienda)");
        shippingMethod = 'NOVASOFT';
        setStatusMessage("Procesando recogida en tienda...");
      } else {
        // Flujo 3: canPickUp = true + envío a domicilio
        // Verificar si está en zona de cobertura
        setStatusMessage("Verificando zona de cobertura...");
        
        if (direccion_id) {
          try {
            const coverageResponse = await fetch(
              `${API_BASE_URL}/api/addresses/zonas-cobertura/verificar-por-id`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ direccion_id })
              }
            );

            if (coverageResponse.ok) {
              const coverageData = await coverageResponse.json();
              const { en_zona_cobertura } = coverageData;

              if (en_zona_cobertura) {
                console.log("🚚 Flujo: IMAGIQ (En zona de cobertura)");
                shippingMethod = 'IMAGIQ';
                setStatusMessage("Procesando envío con Imagiq...");
              } else {
                console.log("📦 Flujo: COORDINADORA (Fuera de zona)");
                shippingMethod = 'COORDINADORA';
                setStatusMessage("Procesando envío con Coordinadora...");
              }
            } else {
              // Si falla la verificación de zona, usar COORDINADORA como fallback
              console.warn("⚠️ No se pudo verificar zona, usando COORDINADORA");
              shippingMethod = 'COORDINADORA';
              setStatusMessage("Procesando envío con Coordinadora...");
            }
          } catch (err) {
            console.error("Error verificando zona de cobertura:", err);
            shippingMethod = 'COORDINADORA';
            setStatusMessage("Procesando envío con Coordinadora...");
          }
        } else {
          // Sin dirección, asumir COORDINADORA
          console.warn("⚠️ Sin dirección, usando COORDINADORA");
          shippingMethod = 'COORDINADORA';
          setStatusMessage("Procesando envío con Coordinadora...");
        }
      }

      // 5. Procesar según el método de envío determinado
      console.log(`✅ Método de envío determinado: ${shippingMethod}`);
      
      // Aquí se haría el procesamiento específico según shippingMethod
      // Por ahora, redirigimos a success con el método determinado
      router.push(`/success-checkout/${orderId}?shipping_method=${shippingMethod}`);

    } catch (error) {
      console.error("Error verifying order:", error);
      router.push("/error-checkout");
    }
  }, [orderId, router]);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0057B7] via-[#0a2a5c] to-[#1e90ff]">
      <LogoReloadAnimation
        open={isLoading}
        onFinish={orderId ? verifyOrder : undefined}
      />
      {/* Mensaje de estado */}
      <div className="absolute bottom-20 left-0 right-0 text-center">
        <p className="text-white text-lg font-medium animate-pulse">
          {statusMessage}
        </p>
      </div>
    </div>
  );
}
