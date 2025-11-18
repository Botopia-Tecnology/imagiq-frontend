"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

interface ShippingVerification {
  envio_imagiq: boolean;
  todos_productos_im_it: boolean;
  en_zona_cobertura: boolean;
}

interface Step4OrderSummaryProps {
  isProcessing?: boolean;
  onFinishPayment: () => void;
  buttonText?: string;
  onBack?: () => void;
  disabled?: boolean;
  shippingVerification?: ShippingVerification | null;
  deliveryMethod?: "delivery" | "pickup";
}

export default function Step4OrderSummary({
  isProcessing = false,
  onFinishPayment,
  buttonText = "Continuar",
  onBack,
  disabled = false,
  shippingVerification,
  deliveryMethod,
}: Step4OrderSummaryProps) {
  const router = useRouter();
  const {
    calculations,
    formatPrice: cartFormatPrice,
    isEmpty,
    products,
  } = useCart();

  // Obtener método de entrega desde localStorage - forzar lectura correcta
  const getDeliveryMethodFromStorage = React.useCallback(() => {
    if (typeof window === "undefined") return "domicilio";
    try {
      const method = localStorage.getItem("checkout-delivery-method");
      // Validar que el método sea válido
      if (method === "tienda" || method === "domicilio") {
        return method;
      }
      return "domicilio";
    } catch (error) {
      console.error("Error reading delivery method from localStorage:", error);
      return "domicilio";
    }
  }, []);

  const [localDeliveryMethod, setLocalDeliveryMethod] = React.useState<string>(() =>
    getDeliveryMethodFromStorage()
  );

  // Actualizar el método de entrega cuando cambie
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDeliveryMethod = () => {
      const method = getDeliveryMethodFromStorage();
      setLocalDeliveryMethod((prev) => {
        // Solo actualizar si cambió para evitar re-renders innecesarios
        if (prev !== method) {
          return method;
        }
        return prev;
      });
    };

    // Actualizar inmediatamente al montar
    updateDeliveryMethod();

    // Escuchar cambios en localStorage (entre pestañas)
    const handleStorageChange = () => {
      updateDeliveryMethod();
    };
    window.addEventListener("storage", handleStorageChange);

    // Escuchar evento personalizado cuando cambia el método de entrega
    const handleDeliveryMethodChanged = () => {
      updateDeliveryMethod();
    };
    window.addEventListener("delivery-method-changed", handleDeliveryMethodChanged);

    // Verificar cambios más frecuentemente para detectar cambios en la misma pestaña
    const interval = setInterval(updateDeliveryMethod, 50);

    // También forzar actualización cuando el componente recibe foco
    const handleFocus = () => {
      updateDeliveryMethod();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("delivery-method-changed", handleDeliveryMethodChanged);
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [getDeliveryMethodFromStorage]);

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
            className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg mt-4 hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 transition cursor-pointer"
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

        {/* Envío */}
        <div className="flex justify-between text-sm">
          <span>
            {(() => {
              // Prefer prop value, fallback to local state or localStorage
              const currentMethod = deliveryMethod === "pickup" ? "tienda" :
                                   deliveryMethod === "delivery" ? "domicilio" :
                                   localDeliveryMethod === "tienda" ? "tienda" :
                                   getDeliveryMethodFromStorage();
              return currentMethod === "tienda" ? "Recoger en tienda" : "Envío a domicilio";
            })()}
          </span>
          {calculations.shipping > 0 && (
            <span className="font-semibold">
              {cartFormatPrice(calculations.shipping)}
            </span>
          )}
        </div>

        {/* Total: siempre string */}
        <div className="flex justify-between text-base font-bold mt-2">
          <span>Total</span>
          <span>{cartFormatPrice(calculations.total)}</span>
        </div>
      </div>

      {/* Mensaje de T&C */}
      <div className="text-xs text-gray-600 text-left">
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
            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 transition cursor-pointer"
            onClick={onBack}
          >
            Volver
          </button>
        )}
        <button
          type="button"
          className={`flex-1 bg-black text-white font-bold py-3 rounded-lg text-base hover:bg-gray-800 transition flex items-center justify-center ${
            isProcessing || disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
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

      {/* Debug: Shipping Method Display */}
      {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs font-semibold text-yellow-800 mb-2">
            Debug: Método de envío
          </p>
          <div className="text-xs text-yellow-700 space-y-1">
            {deliveryMethod === "pickup" && (
              <p className="font-medium">📦 Recogida en tienda</p>
            )}
            {deliveryMethod === "delivery" && shippingVerification && (
              <>
                {shippingVerification.envio_imagiq ? (
                  <p className="font-medium">🚚 Envío Imagiq</p>
                ) : (
                  <p className="font-medium">🚛 Envío Coordinadora</p>
                )}
                <div className="mt-2 space-y-0.5 text-[10px]">
                  <p>• envio_imagiq: {shippingVerification.envio_imagiq ? "true" : "false"}</p>
                  <p>• todos_productos_im_it: {shippingVerification.todos_productos_im_it ? "true" : "false"}</p>
                  <p>• en_zona_cobertura: {shippingVerification.en_zona_cobertura ? "true" : "false"}</p>
                </div>
              </>
            )}
            {deliveryMethod === "delivery" && !shippingVerification && (
              <p className="text-yellow-600 italic">Verificando cobertura...</p>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
