"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart, ORIGINAL_SHIPPING_COST } from "@/hooks/useCart";

interface Step4OrderSummaryProps {
  isProcessing: boolean;
  accepted: boolean;
  onFinishPayment: () => void;
}

export default function Step4OrderSummary({
  isProcessing,
  accepted,
  onFinishPayment,
}: Step4OrderSummaryProps) {
  const router = useRouter();
  const {
    calculations,
    formatPrice: cartFormatPrice,
    isEmpty,
    products,
  } = useCart();

  if (isEmpty) {
    return (
      <aside className="bg-white rounded-2xl p-8 shadow flex flex-col gap-6 h-fit justify-between min-h-[480px] border border-[#E5E5E5] sticky top-8">
        <h2 className="font-bold text-xl mb-4">Resumen de compra</h2>
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-500 text-center">Tu carrito está vacío</p>
          <button
            type="button"
            className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg mt-4 hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 transition"
            onClick={() => router.push("/")}
          >
            Volver a comprar
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white rounded-2xl p-8 shadow flex flex-col gap-6 h-fit justify-between min-h-[480px] border border-[#E5E5E5] sticky top-8">
      <h2 className="font-bold text-xl mb-4">Resumen de compra</h2>
      <div className="flex flex-col gap-2">
        {/* Productos: siempre string */}
        <div className="flex justify-between text-base">
          <span>Productos ({calculations.productCount})</span>
          <span className="font-bold">
            {cartFormatPrice(calculations.subtotal)}
          </span>
        </div>
        {/* Descuento: siempre string */}
        <div className="flex justify-between text-base">
          <span>Descuento</span>
          <span className="text-red-600">
            -{cartFormatPrice(calculations.discount)}
          </span>
        </div>
        {/* Envío: siempre string */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-base">
            <span>Envío</span>
            <span>
              {products.length > 0 && (
                <span className="line-through mr-2 text-gray-400">
                  {String(Number(ORIGINAL_SHIPPING_COST).toLocaleString())}
                </span>
              )}
              <span className="font-bold">{cartFormatPrice(0)}</span>
            </span>
          </div>
          {products.length > 0 && (
            <div className="text-xs text-green-600">
              tienes envío gratis en esta compra
            </div>
          )}
        </div>
        {/* Total: siempre string */}
        <div className="flex justify-between text-lg font-bold mt-2">
          <span>Total</span>
          <span>{cartFormatPrice(calculations.total)}</span>
        </div>
        {/* Impuestos: siempre string */}
        <div className="text-xs text-gray-500 mt-1">
          Incluye {cartFormatPrice(calculations.taxes)} de impuestos
        </div>
      </div>
      <button
        type="button"
        className={`w-full bg-[#2563EB] text-white font-bold py-3 rounded-lg text-base mt-6 hover:bg-blue-700 transition flex items-center justify-center ${
          isProcessing ? "opacity-70 cursor-not-allowed" : ""
        }`}
        disabled={!accepted || isProcessing}
        data-testid="checkout-finish-btn"
        aria-busy={isProcessing}
        onClick={onFinishPayment}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2" aria-live="polite">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-green-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Procesando tu compra…</span>
          </span>
        ) : (
          "Finalizar pago"
        )}
      </button>
      {/* Botón secundario: Regresar al comercio */}
      <button
        type="button"
        className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg mt-3 hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 transition"
        onClick={() => router.push("/")}
        data-testid="checkout-back-to-home"
      >
        Regresar al comercio
      </button>
    </aside>
  );
}
