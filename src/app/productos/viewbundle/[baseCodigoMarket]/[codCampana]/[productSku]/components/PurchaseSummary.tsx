/**
 * Componente reutilizable de Resumen de Compra
 * Muestra el precio, información del producto y botones de acción
 */

interface PurchaseSummaryProps {
  productName: string;
  productDetails?: string; // Color, almacenamiento, RAM, etc.
  price: string;
  originalPrice?: string;
  discount?: string;
  hasStock?: boolean;
  onAddToCart?: () => void;
  onNotifyStock?: () => void;
  isLoading?: boolean;
  deliveryText?: string;
  financingText?: string;
  customButton?: React.ReactNode; // Para botones personalizados como Trade-in
}

export function PurchaseSummary({
  productDetails,
  price,
  originalPrice,
  discount,
  hasStock = true,
  onAddToCart,
  onNotifyStock,
  isLoading = false,
  deliveryText = "Entregas: en 1-3 días laborables",
  financingText = "*Financiación sujeta a aprobación",
  customButton,
}: PurchaseSummaryProps) {
  const hasDiscount = Boolean(originalPrice && originalPrice !== price);

  return (
    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 w-full">
      <h3 className="text-lg sm:text-xl font-bold text-[#222] mb-4">
        Resumen de Compra
      </h3>

      {/* Detalles del producto (sin nombre repetido) */}
      {productDetails && (
        <div className="mb-4">
          <div className="text-sm text-[#666] whitespace-pre-line font-bold">
            {productDetails}
          </div>
        </div>
      )}

      <div className="border-t border-gray-300 pt-4 mb-4"></div>

      {/* Precio */}
      <div className="mb-4">
        <div className="flex items-end justify-center gap-3 mb-2">
          <span className="text-2xl sm:text-3xl font-bold text-[#222]">
            {price}
          </span>
          {hasDiscount && (
            <div className="flex flex-col items-start">
              <span className="text-sm line-through text-gray-500">
                {originalPrice}
              </span>
              {discount && (
                <span className="text-sm font-semibold text-blue-600">
                  {discount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Delivery info */}
        {deliveryText && (
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#666] mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>{deliveryText}</span>
          </div>
        )}

        {/* Botón principal */}
        {hasStock ? (
          <button
            onClick={onAddToCart}
            disabled={isLoading}
            className="w-full rounded-full bg-[#4A90E2] text-white px-6 py-3 sm:py-4 font-bold text-base sm:text-lg shadow-lg hover:bg-[#357ABD] transition-all duration-200 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Añadiendo..." : "Añadir al carrito"}
          </button>
        ) : (
          <button
            onClick={onNotifyStock}
            className="w-full rounded-full bg-gray-800 text-white px-6 py-3 sm:py-4 font-bold text-base sm:text-lg shadow-lg hover:bg-gray-700 transition-all duration-200 hover:shadow-xl"
          >
            Notificarme cuando haya stock
          </button>
        )}

        {/* Botón personalizado (ej: Trade-in) */}
        {customButton && (
          <div className="mt-3">
            {customButton}
          </div>
        )}

        {/* Financing note */}
        {financingText && (
          <p className="text-[10px] sm:text-xs text-[#999] text-center mt-3">
            {financingText}
          </p>
        )}
      </div>
    </div>
  );
}
