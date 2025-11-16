"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

interface Step4OrderSummaryProps {
  isProcessing?: boolean;
  onFinishPayment: () => void;
  buttonText?: string;
  onBack?: () => void;
  disabled?: boolean;
}

export default function Step4OrderSummary({
  isProcessing = false,
  onFinishPayment,
  buttonText = "Continuar",
  onBack,
  disabled = false,
}: Step4OrderSummaryProps) {
  const router = useRouter();
  const {
    calculations,
    formatPrice: cartFormatPrice,
    isEmpty,
    products,
  } = useCart();

  // Calcular ahorro total por descuentos de productos
  const productSavings = React.useMemo(() => {
    return products.reduce((total, product) => {
      if (product.originalPrice && product.originalPrice > product.price) {
        const saving = (product.originalPrice - product.price) * product.quantity;
        return total + saving;
      }
      return total;
    }, 0);
  }, [products]);

  if (isEmpty) {
    return (
      <aside className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4 h-fit border border-[#E5E5E5] sticky top-8">
        <h2 className="font-bold text-lg">Resumen de compra</h2>
        <div className="flex flex-col items-center justify-center py-6">
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
    <aside className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4 h-fit border border-[#E5E5E5] sticky top-8">
      <h2 className="font-bold text-lg">Resumen de compra</h2>
      <div className="flex flex-col gap-2">
        {/* Productos: mostrar precio ANTES del descuento para que el usuario vea el impacto */}
        <div className="flex justify-between text-sm">
          <span>Productos ({calculations.productCount})</span>
          <span className="font-semibold">
            {cartFormatPrice(calculations.subtotal + productSavings)}
          </span>
        </div>

        {/* Descuento por productos */}
        {productSavings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">Descuento productos</span>
            <span className="text-green-600 font-semibold">
              -{cartFormatPrice(productSavings)}
            </span>
          </div>
        )}

        {/* Descuento por cupón (si existe) */}
        {calculations.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span>Descuento cupón</span>
            <span className="text-red-600">
              -{cartFormatPrice(calculations.discount)}
            </span>
          </div>
        )}

        {/* Total: siempre string */}
        <div className="flex justify-between text-base font-bold mt-2">
          <span>Total</span>
          <span>{cartFormatPrice(calculations.total)}</span>
        </div>
      </div>

      {/* Mensaje de T&C */}
      <div className="text-xs text-gray-600 text-center">
        Al comprar aceptas nuestros{" "}
        <a href="/terminos-y-condiciones" target="_blank" className="text-black underline hover:text-gray-700">
          términos y condiciones
        </a>{" "}
        y{" "}
        <a href="/politicas-de-privacidad" target="_blank" className="text-black underline hover:text-gray-700">
          políticas de privacidad
        </a>
      </div>

      <div className="flex gap-3">
        {/* Botón de volver (opcional) */}
        {onBack && (
          <button
            type="button"
            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 transition"
            onClick={onBack}
          >
            Volver
          </button>
        )}
        <button
          type="button"
          className={`flex-1 bg-black text-white font-bold py-3 rounded-lg text-base hover:bg-gray-800 transition flex items-center justify-center ${
            isProcessing || disabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isProcessing || disabled}
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
              <span>Procesando…</span>
            </span>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </aside>
  );
}
