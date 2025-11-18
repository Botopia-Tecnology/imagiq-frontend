import React from "react";

interface DeliveryMethodSelectorProps {
  deliveryMethod: string;
  onMethodChange: (method: string) => void;
  canContinue: boolean;
  disableHomeDelivery?: boolean;
  disableReason?: string;
}

export const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({
  deliveryMethod,
  onMethodChange,
  canContinue,
  disableHomeDelivery = false,
  disableReason,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Forma de entrega</h2>

      {!canContinue && deliveryMethod === "domicilio" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-bold text-gray-900">
            Por favor selecciona una dirección para continuar.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <label
          htmlFor="domicilio"
          className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
            disableHomeDelivery
              ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
              : deliveryMethod === "domicilio"
              ? "border-blue-500 bg-blue-50 cursor-pointer"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
          }`}
        >
          <input
            type="radio"
            id="domicilio"
            name="delivery"
            checked={deliveryMethod === "domicilio"}
            onChange={() => !disableHomeDelivery && onMethodChange("domicilio")}
            disabled={disableHomeDelivery}
            className="accent-blue-600 w-5 h-5"
          />
          <div className="flex items-center gap-3 flex-1">
            <div>
              <div className="font-semibold text-gray-900">Envío a domicilio</div>
              <div className="text-sm text-gray-600">
                {disableHomeDelivery && disableReason
                  ? disableReason
                  : "Recibe tu pedido en la dirección que prefieras"}
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};
