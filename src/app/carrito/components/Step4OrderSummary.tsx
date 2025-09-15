"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
}

interface Step4OrderSummaryProps {
  cartProducts: Product[];
  appliedDiscount: number;
  isProcessing: boolean;
  accepted: boolean;
  onFinishPayment: () => void;
}

const formatPrice = (price: number) =>
  price.toLocaleString("es-CO", { style: "currency", currency: "COP" });

// Formatea un valor numérico como moneda COP, siempre seguro y nunca NaN
function safeCurrency(val: unknown): string {
  const num = typeof val === "string" ? Number(val) : (val as number);
  if (!isFinite(num) || isNaN(num)) return "0";
  return String(formatPrice(num));
}

export default function Step4OrderSummary({
  cartProducts,
  appliedDiscount,
  isProcessing,
  accepted,
  onFinishPayment,
}: Step4OrderSummaryProps) {
  const router = useRouter();

  // Calcular totales y cantidad de productos, siempre como string para evitar NaN en React children
  const productCount = (() => {
    const val = cartProducts.reduce((acc, p) => {
      const qty = Number(p.quantity);
      return acc + (isNaN(qty) ? 1 : qty);
    }, 0);
    return !isFinite(val) || isNaN(val) ? "0" : String(val);
  })();

  const subtotal = cartProducts.reduce((acc, p) => {
    const price = Number(p.price);
    const quantity = Number(p.quantity);
    const safePrice = isNaN(price) ? 0 : price;
    const safeQuantity = isNaN(quantity) ? 1 : quantity;
    return acc + safePrice * safeQuantity;
  }, 0);

  const envio = 20000;
  const safeSubtotal = isNaN(subtotal) ? 0 : subtotal;
  const safeDiscount = isNaN(appliedDiscount) ? 0 : appliedDiscount;
  const impuestos = isNaN(safeSubtotal) ? 0 : Math.round(safeSubtotal * 0.09);
  const total = isNaN(safeSubtotal - safeDiscount + envio)
    ? 0
    : safeSubtotal - safeDiscount + envio;

  return (
    <aside className="bg-white rounded-2xl p-8 shadow flex flex-col gap-6 h-fit justify-between min-h-[480px] border border-[#E5E5E5] sticky top-8">
      <h2 className="font-bold text-xl mb-4">Resumen de compra</h2>
      <div className="flex flex-col gap-2">
        {/* Productos: siempre string */}
        <div className="flex justify-between text-base">
          <span>Productos ({String(productCount)})</span>
          <span className="font-bold">
            {String(safeCurrency(safeSubtotal))}
          </span>
        </div>
        {/* Descuento: siempre string */}
        <div className="flex justify-between text-base">
          <span>Descuento</span>
          <span className="text-red-600">
            -{String(safeCurrency(safeDiscount))}
          </span>
        </div>
        {/* Envío: siempre string */}
        <div className="flex justify-between text-base">
          <span>Envío</span>
          <span>{String(safeCurrency(envio))}</span>
        </div>
        {/* Total: siempre string */}
        <div className="flex justify-between text-lg font-bold mt-2">
          <span>Total</span>
          <span>{String(safeCurrency(total))}</span>
        </div>
        {/* Impuestos: siempre string */}
        <div className="text-xs text-gray-500 mt-1">
          Incluye {String(safeCurrency(impuestos))} de impuestos
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
