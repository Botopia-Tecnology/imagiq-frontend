import React from "react";
import { DeliveryIcon } from "./DeliveryIcon";

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
    <div>
      <h2 className="text-lg font-bold mb-4">Revisa la forma de entrega</h2>
      {/* Feedback UX si no se puede continuar */}
      {!canContinue && (
        <div className="text-xs text-red-500 mb-2">
          {deliveryMethod === "domicilio"
            ? "Por favor ingresa una dirección válida para continuar."
            : "Selecciona una tienda para continuar."}
        </div>
      )}
      <div className="flex items-center gap-4 mb-2">
        <input
          type="radio"
          id="domicilio"
          name="delivery"
          checked={deliveryMethod === "domicilio"}
          onChange={() => onMethodChange("domicilio")}
          className="accent-blue-600 w-5 h-5"
        />
        <label
          htmlFor="domicilio"
          className="font-semibold text-base flex items-center gap-2"
        >
          Enviar a domicilio
          <span className="inline-block">
            <DeliveryIcon />
          </span>
        </label>
      </div>
    </div>
  );
};
