"use client";
import React from "react";
import { useCart } from "@/hooks/useCart";
import { useDelivery } from "./hooks/useDelivery";
import {
  DeliveryMethodSelector,
  StorePickupSelector,
  AddressSelector,
  StoreSelector,
  OrderSummary,
} from "./components";
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

          {/* Resumen de compra */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartProducts={products}
              appliedDiscount={appliedDiscount}
              canContinue={canContinue}
              onContinue={handleContinue}
              onBack={onBack}
              deliveryMethod={deliveryMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
