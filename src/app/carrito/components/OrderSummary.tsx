import React from "react";

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
  deliveryMethod?: string; // Método de entrega: "domicilio" o "tienda"
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deliveryMethod: _deliveryMethod, // No usado por ahora
}) => {
  // Calcular totales
  const subtotal = cartProducts.reduce((acc, p) => {
    const price = Number(p.price);
    const quantity = Number(p.quantity);
    const safePrice = isNaN(price) ? 0 : price;
    const safeQuantity = isNaN(quantity) ? 1 : quantity;
    return acc + safePrice * safeQuantity;
  }, 0);

  // Sin costo de envío
  const safeSubtotal = isNaN(subtotal) ? 0 : subtotal;
  const safeDiscount = isNaN(appliedDiscount) ? 0 : appliedDiscount;
  const impuestos = Math.round(safeSubtotal * 0.09);
  const total = safeSubtotal - safeDiscount;

  const totalQuantity = cartProducts.reduce((acc, p) => {
    const qty = Number(p.quantity);
    return acc + (isNaN(qty) ? 1 : qty);
  }, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-fit lg:sticky lg:top-6 shadow-lg flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen de compra</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Productos ({isNaN(totalQuantity) ? "0" : String(totalQuantity)})
            </span>
            <span className="font-semibold text-gray-900">
              {safeSubtotal > 0 ? String(formatPrice(safeSubtotal)) : "0"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Descuento</span>
            <span className="font-semibold text-red-600">
              - {safeDiscount > 0 ? String(formatPrice(safeDiscount)) : "0"}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">
              {total > 0 ? String(formatPrice(total)) : "0"}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Incluye {impuestos > 0 ? String(formatPrice(impuestos)) : "0"} de impuestos
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 p-6 space-y-3">
        <button
          className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 ${
            canContinue
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={canContinue ? onContinue : undefined}
          disabled={!canContinue}
        >
          Continuar pago
        </button>

        {typeof onBack === "function" && (
          <button
            type="button"
            className="w-full py-3 px-4 rounded-lg font-medium text-blue-600 bg-white border border-gray-300 hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            onClick={onBack}
          >
            <span>←</span>
            <span>Volver</span>
          </button>
        )}
      </div>
    </div>
  );
};
