import React from "react";

interface DeliveryMethodSelectorProps {
  deliveryMethod: string;
  onMethodChange: (method: string) => void;
  canContinue: boolean;
}

export const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({
  deliveryMethod,
  onMethodChange,
  canContinue,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Forma de entrega</h2>

      {!canContinue && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            {deliveryMethod === "domicilio"
              ? "Por favor selecciona una dirección para continuar."
              : "Por favor selecciona una tienda para continuar."}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <label
          htmlFor="domicilio"
          className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
            deliveryMethod === "domicilio"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            id="domicilio"
            name="delivery"
            checked={deliveryMethod === "domicilio"}
            onChange={() => onMethodChange("domicilio")}
            className="accent-blue-600 w-5 h-5"
          />
          <div className="flex items-center gap-3">
            <div>
              <div className="font-semibold text-gray-900">Envío a domicilio</div>
              <div className="text-sm text-gray-600">Recibe tu pedido en la dirección que prefieras</div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};
