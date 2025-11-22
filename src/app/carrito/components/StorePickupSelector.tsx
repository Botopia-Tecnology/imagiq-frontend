import React from "react";
import { DeliveryIcon } from "./DeliveryIcon";

interface StorePickupSelectorProps {
  deliveryMethod: string;
  onMethodChange: (method: string) => void;
  disabled?: boolean;
}

export const StorePickupSelector: React.FC<StorePickupSelectorProps> = ({
  deliveryMethod,
  onMethodChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <label
        htmlFor="tienda"
        className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
          disabled
            ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
            : deliveryMethod === "tienda"
            ? "border-blue-500 bg-blue-50 cursor-pointer"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <input
          type="radio"
          id="tienda"
          name="delivery"
          checked={deliveryMethod === "tienda"}
          onChange={(e) => {
            if (!disabled && e.target.checked) {
              onMethodChange("tienda");
            }
          }}
          disabled={disabled}
          className="accent-blue-600 w-5 h-5"
        />
        <div className="flex items-center gap-3 flex-1">
          <DeliveryIcon />
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Recoger en tienda</div>
            <div className="text-sm text-gray-600">
              {disabled
                ? "Tu producto no cuenta con esa opción"
                : "Recoge tu pedido en una de nuestras tiendas"}
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};
