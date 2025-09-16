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

export default function Step3({
  onBack,
  onContinue,
}: {
  onBack?: () => void;
  onContinue?: () => void;
}) {
  const { products, appliedDiscount } = useCart();
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

  // UX: Navegación al siguiente paso
  const handleContinue = () => {
    console.log("Step3: handleContinue called", {
      deliveryMethod,
      address,
      selectedStore,
    });
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
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center py-8 px-2 md:px-0">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Forma de entrega */}
        <div className="col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-2xl p-8 shadow flex flex-col gap-8">
            <DeliveryMethodSelector
              deliveryMethod={deliveryMethod}
              onMethodChange={handleDeliveryMethodChange}
              canContinue={canContinue}
            />
            {deliveryMethod === "domicilio" && (
              <AddressSelector
                address={address}
                addresses={addresses}
                addressEdit={addressEdit}
                onAddressChange={handleAddressChange}
                onEditToggle={setAddressEdit}
                onAddressAdded={addAddress}
              />
            )}

            <StorePickupSelector
              deliveryMethod={deliveryMethod}
              onMethodChange={handleDeliveryMethodChange}
            />
            {deliveryMethod === "tienda" && (
              <StoreSelector
                storeQuery={storeQuery}
                filteredStores={filteredStores}
                selectedStore={selectedStore}
                onQueryChange={setStoreQuery}
                onStoreSelect={selectedStoreChanged}
              />
            )}
          </div>
        </div>

        {/* Resumen de compra */}
        <OrderSummary
          cartProducts={products}
          appliedDiscount={appliedDiscount}
          canContinue={canContinue}
          onContinue={handleContinue}
          onBack={onBack}
        />
      </div>
    </div>
  );
}
