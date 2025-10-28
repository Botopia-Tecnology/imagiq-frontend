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
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-[#0099FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[#222] mb-1">
                Estreno y Entrego
              </h3>
              <p className="text-sm text-gray-600">{deviceName}</p>

              <button
                onClick={onEdit}
                className="text-sm text-[#0099FF] hover:underline transition-colors mt-2 inline-block"
              >
                Más información
              </button>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold text-[#0099FF]">
              - $ {tradeInValue.toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-700 leading-relaxed">
            Este es un valor aproximado del beneficio Estreno y Entrego al que aplicaste. Aplican TyC*
          </p>
        </div>
      </div>
    </section>
  );
}
