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

  // Load Trade-In data from localStorage
  React.useEffect(() => {
    const storedTradeIn = localStorage.getItem("tradeInData");
    if (storedTradeIn) {
      try {
        const parsed = JSON.parse(storedTradeIn);
        if (parsed.completed) {
          setTradeInData(parsed);
        }
      } catch (error) {
        console.error("Error parsing Trade-In data:", error);
      }
    }
  }, []);

  // Handle Trade-In removal
  const handleRemoveTradeIn = () => {
    localStorage.removeItem("tradeInData");
    setTradeInData(null);
  };

  // Verificar si algún producto tiene canPickUp: false
  const hasProductWithoutPickup = products.some(
    (product) => product.canPickUp === false
  );

  // Si hay productos sin pickup y el método está en tienda, cambiar a domicilio
  React.useEffect(() => {
    if (hasProductWithoutPickup && deliveryMethod === "tienda") {
      setDeliveryMethod("domicilio");
      localStorage.setItem("checkout-delivery-method", "domicilio");
    }
  }, [hasProductWithoutPickup, deliveryMethod, setDeliveryMethod]);

  // UX: Navegación al siguiente paso
  const handleContinue = () => {
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
              />

              {deliveryMethod === "domicilio" && (
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

              {!hasProductWithoutPickup && (
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
              disabled={!canContinue}
            />

            {/* Banner de Trade-In - Debajo del resumen */}
            {tradeInData?.completed && (
              <TradeInCompletedSummary
                deviceName={tradeInData.deviceName}
                tradeInValue={tradeInData.value}
                onEdit={handleRemoveTradeIn}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
