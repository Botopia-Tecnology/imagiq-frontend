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
    <div className="space-y-3">
      <label
        htmlFor="tienda"
        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
          deliveryMethod === "tienda"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <input
          type="radio"
          id="tienda"
          name="delivery"
          checked={deliveryMethod === "tienda"}
          onChange={() => onMethodChange("tienda")}
          className="accent-blue-600 w-5 h-5"
        />
        <div className="flex items-center gap-3">
          <DeliveryIcon />
          <div>
            <div className="font-semibold text-gray-900">Recoger en tienda</div>
            <div className="text-sm text-gray-600">Recoge tu pedido en una de nuestras tiendas</div>
          </div>
        </div>
      </label>
    </div>
  );
};
