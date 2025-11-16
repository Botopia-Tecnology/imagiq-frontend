"use client";
import React from "react";
import { useCart } from "@/hooks/useCart";
import { useDelivery } from "./hooks/useDelivery";
import {
  DeliveryMethodSelector,
  StorePickupSelector,
  AddressSelector,
  StoreSelector,
} from "./components";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import { Direccion } from "@/types/user";
import { useAnalyticsWithUser } from "@/lib/analytics";
import { tradeInEndpoints } from "@/lib/api";
import { validateTradeInProducts, getTradeInValidationMessage } from "./utils/validateTradeIn";

export default function Step3({
  onBack,
  onContinue,
}: {
  onBack?: () => void;
  onContinue?: () => void;
}) {
  const { products, appliedDiscount, calculations } = useCart();
  const { trackAddPaymentInfo } = useAnalyticsWithUser();
  const {
    address,
    setAddress,
    addressEdit,
    setAddressEdit,
    storeQuery,
    setStoreQuery,
    filteredStores,
    selectedStore,
    setSelectedStore,
    addresses,
    addAddress,
    deliveryMethod,
    setDeliveryMethod,
    canContinue,
  } = useDelivery();

  // Trade-In state management
  const [tradeInData, setTradeInData] = React.useState<{
    completed: boolean;
    deviceName: string;
    value: number;
  } | null>(null);

  // Load Trade-In data from localStorage y forzar método a "tienda" si hay trade-in
  React.useEffect(() => {
    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    if (storedTradeIn) {
      try {
        const parsed = JSON.parse(storedTradeIn);
        if (parsed.completed) {
          setTradeInData(parsed);
          // IMPORTANTE: Si hay trade-in, forzar método a "tienda" inmediatamente
          setDeliveryMethod("tienda");
          localStorage.setItem("checkout-delivery-method", "tienda");
        }
      } catch (error) {
        console.error("Error parsing Trade-In data:", error);
      }
    }
  }, [setDeliveryMethod]);

  // Handle Trade-In removal
  const handleRemoveTradeIn = () => {
    localStorage.removeItem("imagiq_trade_in");
    setTradeInData(null);
  };

  // IMPORTANTE: Si hay trade-in activo, solo permitir recoger en tienda
  const hasActiveTradeIn = tradeInData?.completed === true;

  // Verificar si algún producto tiene canPickUp: false
  // PERO solo aplicar esta lógica si NO hay trade-in activo
  const hasProductWithoutPickup = !hasActiveTradeIn && products.some(
    (product) => product.canPickUp === false
  );

  // Si hay productos sin pickup y el método está en tienda, cambiar a domicilio
  // SOLO si NO hay trade-in activo
  React.useEffect(() => {
    if (!hasActiveTradeIn && hasProductWithoutPickup && deliveryMethod === "tienda") {
      setDeliveryMethod("domicilio");
      localStorage.setItem("checkout-delivery-method", "domicilio");
    }
  }, [hasActiveTradeIn, hasProductWithoutPickup, deliveryMethod, setDeliveryMethod]);

  // Forzar método de entrega a "tienda" si hay trade-in activo (ejecutar inmediatamente)
  React.useEffect(() => {
    if (hasActiveTradeIn) {
      // Forzar cambio a tienda si está en domicilio
      if (deliveryMethod === "domicilio") {
        setDeliveryMethod("tienda");
        localStorage.setItem("checkout-delivery-method", "tienda");
      }
      // También prevenir que se cambie a domicilio
      const savedMethod = localStorage.getItem("checkout-delivery-method");
      if (savedMethod === "domicilio") {
        setDeliveryMethod("tienda");
        localStorage.setItem("checkout-delivery-method", "tienda");
      }
    }
  }, [hasActiveTradeIn, deliveryMethod, setDeliveryMethod]);

  // Verificar indRetoma para cada producto único en segundo plano (sin mostrar nada en UI)
  React.useEffect(() => {
    if (products.length === 0) return;

    const verifyTradeIn = async () => {
      // Obtener SKUs únicos (sin duplicados)
      const uniqueSkus = Array.from(
        new Set(products.map((p) => p.sku))
      );

      // Filtrar productos que necesitan verificación (solo si no tienen indRetoma definido)
      const productsToVerify = uniqueSkus.filter((sku) => {
        const product = products.find((p) => p.sku === sku);
        return product && product.indRetoma === undefined;
      });

      if (productsToVerify.length === 0) return;

      // Verificar cada SKU único en segundo plano
      for (let i = 0; i < productsToVerify.length; i++) {
        const sku = productsToVerify[i];

        // Agregar delay entre peticiones (excepto la primera)
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        try {
          const response = await tradeInEndpoints.checkSkuForTradeIn({ sku });
          if (!response.success || !response.data) {
            throw new Error('Error al verificar trade-in');
          }
          const result = response.data;
          const indRetoma = result.indRetoma ?? (result.aplica ? 1 : 0);

          // Actualizar localStorage con el resultado
          const storedProducts = JSON.parse(
            localStorage.getItem("cart-items") || "[]"
          ) as Array<Record<string, unknown>>;
          const updatedProducts = storedProducts.map((p) => {
            if (p.sku === sku) {
              return { ...p, indRetoma };
            }
            return p;
          });
          localStorage.setItem("cart-items", JSON.stringify(updatedProducts));

          // Disparar evento storage para sincronizar
          const customEvent = new CustomEvent("localStorageChange", {
            detail: { key: "cart-items" },
          });
          window.dispatchEvent(customEvent);
          window.dispatchEvent(new Event("storage"));
        } catch (error) {
          // Silenciar errores, solo log en consola
          console.error(
            `❌ Error al verificar trade-in para SKU ${sku}:`,
            error
          );
        }
      }
    };

    verifyTradeIn();
  }, [products]);

  // UX: Navegación al siguiente paso
  // Estado para validación de Trade-In
  const [tradeInValidation, setTradeInValidation] = React.useState<{
    isValid: boolean;
    productsWithoutRetoma: typeof products;
    hasMultipleProducts: boolean;
    errorMessage?: string;
  }>({ isValid: true, productsWithoutRetoma: [], hasMultipleProducts: false });

  // Validar Trade-In cuando cambian los productos
  React.useEffect(() => {
    const validation = validateTradeInProducts(products);
    setTradeInValidation(validation);
    
    // Si el producto ya no aplica (indRetoma === 0), mostrar el mensaje primero y luego limpiar después de un delay
    if (!validation.isValid && validation.errorMessage && validation.errorMessage.includes("Te removimos")) {
      // Limpiar localStorage inmediatamente
      localStorage.removeItem("imagiq_trade_in");
      
      // Mantener el tradeInData en el estado por 5 segundos para que el usuario pueda ver el mensaje
      const timeoutId = setTimeout(() => {
        setTradeInData(null);
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [products]);

  const handleContinue = () => {
    // Validar Trade-In antes de continuar
    const validation = validateTradeInProducts(products);
    if (!validation.isValid) {
      alert(getTradeInValidationMessage(validation));
      return;
    }

    // Track del evento add_payment_info para analytics
    trackAddPaymentInfo(
      products.map((p) => ({
        item_id: p.sku,
        item_name: p.name,
        price: Number(p.price),
        quantity: p.quantity,
      })),
      calculations.subtotal
    );

    if (typeof onContinue === "function") {
      onContinue();
    }
  };
  const handleAddressChange = (newAddress: Direccion) => {
    setAddress(newAddress);
    localStorage.setItem("checkout-address", JSON.stringify(newAddress));
  };
  const handleDeliveryMethodChange = (method: string) => {
    // Si hay trade-in activo, no permitir cambiar a domicilio
    if (hasActiveTradeIn && method === "domicilio") {
      return; // No hacer nada, mantener en tienda
    }
    setDeliveryMethod(method);
    localStorage.setItem("checkout-delivery-method", method);
  };

  const selectedStoreChanged = (store: typeof selectedStore) => {
    setSelectedStore(store);
    localStorage.setItem("checkout-store", JSON.stringify(store));
  };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forma de entrega */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg p-6">
              <DeliveryMethodSelector
                deliveryMethod={deliveryMethod}
                onMethodChange={handleDeliveryMethodChange}
                canContinue={canContinue}
                disableHomeDelivery={hasActiveTradeIn}
                disableReason={hasActiveTradeIn ? "Para aplicar el beneficio Estreno y Entrego solo puedes recoger en tienda" : undefined}
              />

              {deliveryMethod === "domicilio" && !hasActiveTradeIn && (
                <div className="mt-6">
                  <AddressSelector
                    address={address}
                    addresses={addresses}
                    addressEdit={addressEdit}
                    onAddressChange={handleAddressChange}
                    onEditToggle={setAddressEdit}
                    onAddressAdded={addAddress}
                  />
                </div>
              )}

              {/* Mostrar opción de recoger en tienda si:
                  - NO hay productos sin pickup, O
                  - Hay trade-in activo (siempre permitir recoger en tienda) */}
              {(!hasProductWithoutPickup || hasActiveTradeIn) && (
                <div className="mt-6">
                  <StorePickupSelector
                    deliveryMethod={deliveryMethod}
                    onMethodChange={handleDeliveryMethodChange}
                  />
                </div>
              )}

              {deliveryMethod === "tienda" && (
                <div className="mt-6">
                  <StoreSelector
                    storeQuery={storeQuery}
                    filteredStores={filteredStores}
                    selectedStore={selectedStore}
                    onQueryChange={setStoreQuery}
                    onStoreSelect={selectedStoreChanged}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Resumen de compra y Trade-In */}
          <div className="lg:col-span-1 space-y-4">
            <Step4OrderSummary
              onFinishPayment={handleContinue}
              buttonText="Continuar"
              onBack={onBack}
              disabled={!canContinue || !tradeInValidation.isValid}
            />

            {/* Banner de Trade-In - Debajo del resumen */}
            {tradeInData?.completed && (
              <TradeInCompletedSummary
                deviceName={tradeInData.deviceName}
                tradeInValue={tradeInData.value}
                onEdit={handleRemoveTradeIn}
                validationError={!tradeInValidation.isValid ? getTradeInValidationMessage(tradeInValidation) : undefined}
                showStorePickupMessage={deliveryMethod === "tienda" || hasActiveTradeIn}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
