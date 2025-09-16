import React from "react";
import { DeliveryIcon } from "./DeliveryIcon";

interface StorePickupSelectorProps {
  deliveryMethod: string;
  onMethodChange: (method: string) => void;
}

export const StorePickupSelector: React.FC<StorePickupSelectorProps> = ({
  deliveryMethod,
  onMethodChange,
}) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Recoger en tienda</h2>
      <div className="flex items-center gap-4 mb-2">
        <input
          type="radio"
          id="tienda"
          name="delivery"
          checked={deliveryMethod === "tienda"}
          onChange={() => onMethodChange("tienda")}
          className="accent-blue-600 w-5 h-5"
        />
        <label
          htmlFor="tienda"
          className="font-semibold text-base flex items-center gap-2"
        >
          Recoger en tienda
          <span className="inline-block">
            <DeliveryIcon />
          </span>
        </label>
      </div>
    </div>
  );
};
