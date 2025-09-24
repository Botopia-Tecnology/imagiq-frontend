import React from "react";
import { ORIGINAL_SHIPPING_COST } from "@/hooks/useCart";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  cartProducts: Product[];
  appliedDiscount: number;
  canContinue: boolean;
  onContinue: () => void;
  onBack?: () => void;
}

// Utilidad para formatear precios
const formatPrice = (price: number) =>
  price.toLocaleString("es-CO", { style: "currency", currency: "COP" });

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartProducts,
  appliedDiscount,
  canContinue,
  onContinue,
  onBack,
}) => {
  // Calcular totales
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
  const impuestos = Math.round(safeSubtotal * 0.09);
  const total = safeSubtotal - safeDiscount + envio;

  const totalQuantity = cartProducts.reduce((acc, p) => {
    const qty = Number(p.quantity);
    return acc + (isNaN(qty) ? 1 : qty);
  }, 0);

  return (
    <aside className="bg-white rounded-2xl p-8 shadow flex flex-col gap-6 h-fit justify-between min-h-[480px] sticky top-8">
      <h2 className="font-bold text-lg mb-4">Resumen de compra</h2>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-base">
          <span>
            Productos ({isNaN(totalQuantity) ? "0" : String(totalQuantity)})
          </span>
          <span className="font-bold">
            {safeSubtotal > 0 ? String(formatPrice(safeSubtotal)) : "0"}
          </span>
        </div>
        <div className="flex justify-between text-base">
          <span>Descuento</span>
          <span className="text-red-600">
            - {safeDiscount > 0 ? String(formatPrice(safeDiscount)) : "0"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-base">
            <span>Envío</span>
            <span>
              <span className="line-through mr-2 text-gray-400">
                {String(formatPrice(ORIGINAL_SHIPPING_COST))}
              </span>
              <span className="font-bold">0</span>
            </span>
          </div>
          <div className="text-sm text-green-600">
            tienes envío gratis en esta compra
          </div>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2">
          <span>Total</span>
          <span>{total > 0 ? String(formatPrice(total)) : "0"}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Incluye {impuestos > 0 ? String(formatPrice(impuestos)) : "0"} de
          impuestos
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <button
          className={`w-full bg-[#0074E8] text-white font-bold py-3 rounded-lg text-base hover:bg-blue-700 transition ${
            !canContinue ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={canContinue ? onContinue : undefined}
          disabled={!canContinue}
        >
          Continuar pago
        </button>
        {/* Botón para volver al paso anterior */}
        {typeof onBack === "function" && (
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 text-[#0074E8] font-semibold text-base py-2 rounded-lg bg-white border border-[#e5e5e5] shadow-sm hover:bg-[#e6f3ff] hover:text-[#005bb5] focus:outline-none focus:ring-2 focus:ring-[#0074E8] transition-all duration-150"
            onClick={onBack}
          >
            <span className="text-lg">←</span>
            <span>Volver</span>
          </button>
        )}
      </div>
    </aside>
  );
};
