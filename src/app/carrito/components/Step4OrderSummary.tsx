"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { productEndpoints } from "@/lib/api";
import { safeGetLocalStorage } from "@/lib/localStorage";
import {
  buildGlobalCanPickUpKey,
  getGlobalCanPickUpFromCache,
  setGlobalCanPickUpCache,
} from "../utils/globalCanPickUpCache";

interface ShippingVerification {
  envio_imagiq: boolean;
  todos_productos_im_it: boolean;
  en_zona_cobertura: boolean;
}

interface Step4OrderSummaryProps {
  readonly isProcessing?: boolean;
  readonly onFinishPayment: () => void;
  readonly buttonText?: string;
  readonly onBack?: () => void;
  readonly disabled?: boolean;
  readonly shippingVerification?: ShippingVerification | null;
  readonly deliveryMethod?: "delivery" | "pickup";
  readonly isSticky?: boolean;
  readonly isStep1?: boolean; // Indica si estamos en Step1 para calcular canPickUp global
  readonly onCanPickUpReady?: (isReady: boolean, isLoading: boolean) => void; // Callback para notificar cuando canPickUp está listo
  readonly error?: string | string[] | null;
  readonly shouldCalculateCanPickUp?: boolean; // Indica si debe calcular canPickUp (por defecto true en Steps 1-6, false en Step7)
  readonly products?: import("@/hooks/useCart").CartProduct[]; // Productos opcionales para reactividad inmediata
  readonly calculations?: {
    productCount: number;
    subtotal: number;
    shipping: number;
    taxes: number;
    discount: number;
    total: number;
  }; // Cálculos opcionales para reactividad inmediata
  readonly debugStoresInfo?: {
    availableStoresWhenCanPickUpFalse: number;
    stores: number;
    filteredStores: number;
    availableCities: number;
  }; // Información de debug sobre tiendas
}

export default function Step4OrderSummary({
  isProcessing = false,
  onFinishPayment,
  buttonText = "Continuar",
  onBack,
  disabled = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shippingVerification,
  deliveryMethod,
  isSticky = true,
  isStep1 = false,
  onCanPickUpReady,
  error,
  shouldCalculateCanPickUp = true, // Por defecto true (Steps 1-6)
  products: propProducts,
  calculations: propCalculations,
  debugStoresInfo,
}: Step4OrderSummaryProps) {
  const router = useRouter();
  const {
    calculations: hookCalculations,
    formatPrice: cartFormatPrice,
    isEmpty: hookIsEmpty,
    products: hookProducts,
  } = useCart();

  // Usar props si existen, sino usar hook (para reactividad inmediata en Step1)
  const products = propProducts || hookProducts;
  const calculations = propCalculations || hookCalculations;
  const isEmpty = propProducts ? propProducts.length === 0 : hookIsEmpty;

  // Obtener método de entrega desde localStorage - forzar lectura correcta
  const getDeliveryMethodFromStorage = React.useCallback(() => {
    if (globalThis.window === undefined) return "domicilio";
    try {
      const method = globalThis.window.localStorage.getItem("checkout-delivery-method");
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

  const [localDeliveryMethod, setLocalDeliveryMethod] = React.useState<string>(
    () => getDeliveryMethodFromStorage()
  );

  // Actualizar el método de entrega cuando cambie
  React.useEffect(() => {
    if (globalThis.window === undefined) return;

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

    // Escuchar cambios en localStorage (entre pestaanas)
    const handleStorageChange = () => {
      updateDeliveryMethod();
    };
    globalThis.window.addEventListener("storage", handleStorageChange);

    // Escuchar evento personalizado cuando cambia el método de entrega
    const handleDeliveryMethodChanged = () => {
      updateDeliveryMethod();
    };
    globalThis.window.addEventListener(
      "delivery-method-changed",
      handleDeliveryMethodChanged
    );

    // Verificar cambios más frecuentemente para detectar cambios en la misma pestaña
    const interval = setInterval(updateDeliveryMethod, 50);

    // También forzar actualización cuando el componente recibe foco
    const handleFocus = () => {
      updateDeliveryMethod();
    };
    globalThis.window.addEventListener("focus", handleFocus);

    return () => {
      globalThis.window.removeEventListener("storage", handleStorageChange);
      globalThis.window.removeEventListener(
        "delivery-method-changed",
        handleDeliveryMethodChanged
      );
      globalThis.window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [getDeliveryMethodFromStorage]);

  // Calcular ahorro total por descuentos de productos
  const productSavings = React.useMemo(() => {
    return products.reduce((total, product) => {
      if (product.originalPrice && product.originalPrice > product.price) {
        const saving =
          (product.originalPrice - product.price) * product.quantity;
        return total + saving;
      }
      return total;
    }, 0);
  }, [products]);

  // Estado para canPickUp global y debug
  const [globalCanPickUp, setGlobalCanPickUp] = React.useState<boolean | null>(
    null
  );
  const [isLoadingCanPickUp, setIsLoadingCanPickUp] = React.useState(false);
  // Estado para rastrear si el usuario hizo clic en el botón mientras está cargando
  const [userClickedWhileLoading, setUserClickedWhileLoading] = React.useState(false);
  // Ref para guardar la función onFinishPayment y evitar ejecuciones múltiples
  const onFinishPaymentRef = React.useRef(onFinishPayment);

  // Actualizar la ref cuando cambie la función
  React.useEffect(() => {
    onFinishPaymentRef.current = onFinishPayment;
  }, [onFinishPayment]);

  // Llamar a candidate-stores con TODOS los productos del carrito agrupados en una sola petición
  // Ejecutar en Steps 1-6 (cuando shouldCalculateCanPickUp es true)
  const fetchGlobalCanPickUp = React.useCallback(async () => {
    // Solo calcular si shouldCalculateCanPickUp es true (Steps 1-6) o si la variable de debug está activa
    const shouldFetch =
      shouldCalculateCanPickUp ||
      process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true";

    if (!shouldFetch || products.length === 0) {
      if (!shouldFetch) {
        setGlobalCanPickUp(null);
        setIsLoadingCanPickUp(false);
      }
      return;
    }

    // Obtener user_id del localStorage
    const user = safeGetLocalStorage<{ id?: string; user_id?: string }>(
      "imagiq_user",
      {}
    );
    const userId = user?.id || user?.user_id;

    if (!userId) {
      setIsLoadingCanPickUp(false);
      setGlobalCanPickUp(null);
      return;
    }

    // Preparar TODOS los productos del carrito para una sola petición
    const productsToCheck = products.map((p) => ({
      sku: p.sku,
      quantity: p.quantity,
    }));

    // Obtener id de la dirección actual (si existe) para que la clave del caché
    // cambie automáticamente cuando el usuario cambie de dirección.
    let addressId: string | null = null;
    if (typeof globalThis.window !== "undefined") {
      try {
        const savedAddress = globalThis.window.localStorage.getItem(
          "checkout-address"
        );
        if (savedAddress && savedAddress !== "undefined") {
          const parsed = JSON.parse(savedAddress) as { id?: string };
          if (parsed?.id) {
            addressId = parsed.id;
          }
        }
      } catch (error) {
        console.error(
          "Error leyendo checkout-address para clave de canPickUp global:",
          error
        );
      }
    }

    // Intentar leer desde el caché antes de hacer la petición
    const cacheKey = buildGlobalCanPickUpKey({
      userId,
      products: productsToCheck,
      addressId,
    });
    const cachedValue = getGlobalCanPickUpFromCache(cacheKey);

    if (cachedValue !== null) {
      setGlobalCanPickUp(cachedValue);
      setIsLoadingCanPickUp(false);
      return;
    }

    setIsLoadingCanPickUp(true);
    try {
      // Llamar al endpoint con TODOS los productos agrupados y el user_id
      const response = await productEndpoints.getCandidateStores({
        products: productsToCheck,
        user_id: userId,
      });

      if (response.success && response.data) {
        const responseData = response.data as {
          canPickUp?: boolean;
          canPickup?: boolean;
        };
        // Obtener canPickUp de la respuesta (puede venir como canPickUp o canPickup)
        const canPickUpValue =
          responseData.canPickUp ?? responseData.canPickup ?? false;

        // El canPickUp global es el que responde el endpoint con todos los productos
        setGlobalCanPickUp(canPickUpValue);
        // Guardar respuesta completa en caché (tiendas, ciudades, canPickUp)
        setGlobalCanPickUpCache(cacheKey, canPickUpValue, response.data);
      } else {
        setGlobalCanPickUp(false);
        setGlobalCanPickUpCache(cacheKey, false, null);
      }
    } catch (error) {
      console.error("❌ Error al verificar canPickUp global:", error);
      setGlobalCanPickUp(false);
      setGlobalCanPickUpCache(cacheKey, false, null);
    } finally {
      setIsLoadingCanPickUp(false);
      // NO resetear userClickedWhileLoading aquí - se resetea en el useEffect después de ejecutar onFinishPayment
    }
  }, [products, shouldCalculateCanPickUp]);

  // Calcular canPickUp global cuando cambian los productos o shouldCalculateCanPickUp
  React.useEffect(() => {
    // NO resetear userClickedWhileLoading aquí - solo cuando cambian los productos o shouldCalculateCanPickUp
    // Llamar a fetch (la lógica de si debe ejecutarse está dentro de fetchGlobalCanPickUp)
    fetchGlobalCanPickUp();
  }, [fetchGlobalCanPickUp]);

  // Resetear userClickedWhileLoading cuando cambian los productos, shouldCalculateCanPickUp, o cuando canPickUp termina de cargar
  React.useEffect(() => {
    setUserClickedWhileLoading(false);
  }, [products.length, shouldCalculateCanPickUp]);

  // Resetear userClickedWhileLoading cuando canPickUp termina de cargar (para evitar bloqueos)
  React.useEffect(() => {
    if (!isLoadingCanPickUp && userClickedWhileLoading) {
      // Si canPickUp ya terminó de cargar y userClickedWhileLoading está en true, resetearlo
      // Esto permite que el usuario pueda hacer clic normalmente si canPickUp ya cargó
      setUserClickedWhileLoading(false);
    }
  }, [isLoadingCanPickUp, userClickedWhileLoading]);

  // Notificar cuando canPickUp está listo (no está cargando)
  // IMPORTANTE: Notificar en todos los pasos, no solo en Step1, para que Step3 pueda usar el valor
  React.useEffect(() => {
    if (onCanPickUpReady) {
      // Pasar el valor real de globalCanPickUp (o false si es null)
      // IMPORTANTE: Notificar tanto cuando está cargando como cuando terminó
      const canPickUpValue = globalCanPickUp ?? false;
      onCanPickUpReady(canPickUpValue, isLoadingCanPickUp);
    }
  }, [globalCanPickUp, isLoadingCanPickUp, onCanPickUpReady]);

  // Ejecutar onFinishPayment automáticamente cuando termine de cargar canPickUp
  // y el usuario había hecho clic mientras estaba cargando (pasos 1-6)
  React.useEffect(() => {
    // Solo avanzar si:
    // 1. El usuario hizo clic mientras estaba cargando
    // 2. Ya terminó de cargar (isLoadingCanPickUp es false)
    // 3. shouldCalculateCanPickUp es true (pasos 1-6, no Step7)
    if (userClickedWhileLoading && !isLoadingCanPickUp && shouldCalculateCanPickUp) {
      // Guardar el estado antes de resetearlo
      const shouldExecute = userClickedWhileLoading;

      // Resetear el estado inmediatamente para evitar ejecuciones múltiples
      setUserClickedWhileLoading(false);

      // Ejecutar la función usando la ref para evitar problemas de dependencias
      if (shouldExecute) {
        // Ejecutar inmediatamente sin delay para forzar el avance
        try {
          onFinishPaymentRef.current();
        } catch (error) {
          console.error('❌ Error al ejecutar onFinishPayment:', error);
        }
      }
    }
  }, [userClickedWhileLoading, isLoadingCanPickUp, shouldCalculateCanPickUp]);

  // Escuchar cambios en la dirección para recalcular canPickUp
  React.useEffect(() => {
    const handleAddressChange = () => {
      fetchGlobalCanPickUp();
    };

    globalThis.window.addEventListener("address-changed", handleAddressChange);
    globalThis.window.addEventListener("checkout-address-changed", handleAddressChange);

    // También escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "checkout-address") {
        fetchGlobalCanPickUp();
      }
    };
    globalThis.window.addEventListener("storage", handleStorageChange);

    return () => {
      globalThis.window.removeEventListener("address-changed", handleAddressChange);
      globalThis.window.removeEventListener("checkout-address-changed", handleAddressChange);
      globalThis.window.removeEventListener("storage", handleStorageChange);
    };
  }, [fetchGlobalCanPickUp]);

  const baseContainerClasses =
    "bg-white rounded-2xl p-6 shadow flex flex-col gap-4 h-fit border border-[#E5E5E5]";
  const stickyClasses = isSticky ? " sticky top-8" : "";
  const containerClasses = `${baseContainerClasses}${stickyClasses}`;

  if (isEmpty) {
    return (
      <aside className={containerClasses}>
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
    <aside className={containerClasses}>
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
            <span className="text-green-600 font-medium">
              Descuento productos
            </span>
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

        {/* Envío - Ocultar en Step1 */}
        {!isStep1 && (
          <div className="flex justify-between text-sm">
            <span>
              {(() => {
                // Prefer prop value, fallback to local state or localStorage
                let currentMethod: string;
                if (deliveryMethod === "pickup") {
                  currentMethod = "tienda";
                } else if (deliveryMethod === "delivery") {
                  currentMethod = "domicilio";
                } else if (localDeliveryMethod === "tienda") {
                  currentMethod = "tienda";
                } else {
                  currentMethod = getDeliveryMethodFromStorage();
                }
                return currentMethod === "tienda"
                  ? "Recoger en tienda"
                  : "Envío a domicilio";
              })()}
            </span>
            {calculations.shipping > 0 && (
              <span className="font-semibold">
                {cartFormatPrice(calculations.shipping)}
              </span>
            )}
          </div>
        )}

        {/* Total: siempre string */}
        <div className="flex justify-between text-base font-bold mt-2">
          <span>Total</span>
          <span>{cartFormatPrice(calculations.total)}</span>
        </div>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Botón de volver (opcional) */}
      {onBack && (
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 transition cursor-pointer"
            onClick={onBack}
          >
            Volver
          </button>
        </div>
      )}

      {/* Términos y Botón en la misma fila - Botón a la derecha */}
      <div className="flex items-center gap-4">
        {/* Términos y Condiciones - A la izquierda */}
        <p className="text-[10px] text-gray-600 leading-tight flex-1">
          Al continuar con tu compra, aceptas los{" "}
          <a
            href="/soporte/politicas-generales"
            target="_blank"
            className="text-blue-600 underline hover:text-blue-700"
          >
            Términos y Condiciones
          </a>{" "}
          y utilizaremos tus datos personales de acuerdo a nuestra{" "}
          <a
            href="/soporte/tratamiento-datos-personales"
            target="_blank"
            className="text-blue-600 underline hover:text-blue-700"
          >
            política de privacidad
          </a>.
        </p>

        <button
          type="button"
          className={`shrink-0 bg-black text-white font-bold py-3 px-6 rounded-lg text-sm hover:bg-gray-800 transition flex items-center justify-center ${isProcessing || disabled || (userClickedWhileLoading && isLoadingCanPickUp)
            ? "opacity-70 cursor-not-allowed"
            : "cursor-pointer"
            }`}
          disabled={isProcessing || disabled || (userClickedWhileLoading && isLoadingCanPickUp)}
          data-testid="checkout-finish-btn"
          aria-busy={isProcessing || (userClickedWhileLoading && isLoadingCanPickUp)}
          onClick={() => {
            // Si está cargando canPickUp cuando el usuario hace clic, marcar que hizo clic y esperar
            // Solo para pasos 1-6 donde shouldCalculateCanPickUp es true
            if (isLoadingCanPickUp && shouldCalculateCanPickUp) {
              setUserClickedWhileLoading(true);
              return; // No ejecutar onFinishPayment todavía, el useEffect se encargará
            }
            // Si no está cargando o estamos en Step7 (no calcula canPickUp), ejecutar inmediatamente
            // Resetear userClickedWhileLoading por si acaso quedó en true
            setUserClickedWhileLoading(false);
            onFinishPayment();
          }}
        >
          {(isProcessing || (userClickedWhileLoading && isLoadingCanPickUp)) ? (
            <span
              className="flex items-center justify-center gap-2"
              aria-live="polite"
            >
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              <span>{buttonText}</span>
            </span>
          ) : (
            buttonText
          )}
        </button>
      </div>

      {/* Información de compra - financiamiento y envío */}
      <div className="flex flex-col gap-2 text-[10px] leading-relaxed mt-3">

        {/* Contenedor con padding lateral para información de financiamiento y envío */}
        <div className="flex flex-col gap-2 px-1">
          {/* Información de Financiamiento */}
          <div className="flex gap-2 items-start">
            <div className="shrink-0">
              <svg
                width="28"
                height="28"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 14C8 12.3431 9.34315 11 11 11H29C30.6569 11 32 12.3431 32 14V26C32 27.6569 30.6569 29 29 29H11C9.34315 29 8 27.6569 8 26V14Z"
                  stroke="#222"
                  strokeWidth="1.5"
                />
                <path d="M8 17H32" stroke="#222" strokeWidth="1.5" />
                <rect x="13" y="23" width="7" height="2.5" rx="1.25" fill="#222" />
              </svg>
            </div>
            <p className="text-black">
              Compra sin interés a 3, 6, 12 o 24 cuotas pagando con tarjetas de
              nuestros bancos aliados: Bancolombia y Davivienda. Aplican{" "}
              <a
                href="/soporte/tyc-bancolombia"
                target="_blank"
                className="text-blue-600 underline hover:text-blue-700"
              >
                T&C Bancolombia
              </a>{" "}
              y{" "}
              <a
                href="/soporte/tyc-davivienda"
                target="_blank"
                className="text-blue-600 underline hover:text-blue-700"
              >
                T&C Davivienda
              </a>
              .
            </p>
          </div>

          {/* Información de Envío */}
          <div className="flex gap-2 items-start">
            <div className="shrink-0">
              <svg
                width="28"
                height="28"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Camión de envío */}
                <path
                  d="M9 16C9 14.8954 9.89543 14 11 14H21C22.1046 14 23 14.8954 23 16V29H9V16Z"
                  stroke="#222"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 21H26.5858C27.1162 21 27.6249 21.2107 28 21.5858L30.4142 24C30.7893 24.3751 31 24.8838 31 25.4142V29H23V21Z"
                  stroke="#222"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="14" cy="29" r="2.5" stroke="#222" strokeWidth="1.5" />
                <circle cx="27" cy="29" r="2.5" stroke="#222" strokeWidth="1.5" />
                <path d="M9 19H23" stroke="#222" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="text-black">
              Envío gratis a toda Colombia. Si compras en Bogotá antes de las
              11:00 am productos de la categoría Smartphones y Accesorios,
              recibirás tu pedido el mismo día
            </p>
          </div>
        </div>

        {/* Debug Info - Solo visible cuando NEXT_PUBLIC_SHOW_PRODUCT_CODES=true */}
        {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
            <p className="text-[10px] font-bold text-yellow-900 mb-1">
              🔍 DEBUG - Candidate Stores Info
            </p>
            <div className="text-[9px] text-yellow-800 space-y-0.5">
              <div className="flex justify-between">
                <span>canPickUp (endpoint):</span>
                <span className="font-mono font-bold">
                  {isLoadingCanPickUp ? (
                    <span className="text-blue-600">⏳ loading...</span>
                  ) : globalCanPickUp === null ? (
                    <span className="text-gray-500">null</span>
                  ) : globalCanPickUp ? (
                    <span className="text-green-600">✅ true</span>
                  ) : (
                    <span className="text-red-600">❌ false</span>
                  )}
                </span>
              </div>
              {debugStoresInfo && (
                <>
                  <div className="flex justify-between">
                    <span>Stores (canPickUp=true):</span>
                    <span className="font-mono">{debugStoresInfo.stores}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stores (canPickUp=false):</span>
                    <span className="font-mono">{debugStoresInfo.availableStoresWhenCanPickUpFalse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cities available:</span>
                    <span className="font-mono">{debugStoresInfo.availableCities}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span>Products count:</span>
                <span className="font-mono">{products.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
