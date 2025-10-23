import React from "react";

interface TradeInCompletedSummaryProps {
  readonly deviceName: string;
  readonly tradeInValue: number;
  readonly onEdit: () => void;
}

export default function TradeInCompletedSummary({
  deviceName,
  tradeInValue,
  onEdit,
}: TradeInCompletedSummaryProps) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-[#222] mb-4">
        Estreno y Entrego
      </h2>

      <div className="border-2 border-[#0099FF] bg-white rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-[#0099FF] font-medium mb-2">
              ¡Felicidades! El descuento Estreno y Entrego ha sido aplicado a tu compra
            </p>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600">Devolución de dinero hasta</p>
                <p className="text-2xl font-bold text-[#0099FF]">
                  $ {tradeInValue.toLocaleString('es-CO')}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-[#222]">{deviceName}</p>
                <button
                  onClick={onEdit}
                  className="text-xs text-gray-500 hover:text-[#0099FF] underline transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-600 mt-4 pt-4 border-t border-gray-200">
          <p>
            *El descuento solo aplica para el teléfono declarado en las condiciones anteriores.
            Se anulará la compra en caso de lo contrario.
          </p>
        </div>
      </div>
    </section>
  );
}
