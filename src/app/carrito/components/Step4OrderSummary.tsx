"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { productEndpoints } from "@/lib/api";
import { safeGetLocalStorage } from "@/lib/localStorage";

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
  isSticky?: boolean;
  isStep1?: boolean; // Indica si estamos en Step1 para calcular canPickUp global
  onCanPickUpReady?: (isReady: boolean, isLoading: boolean) => void; // Callback para notificar cuando canPickUp está listo
  error?: string | string[] | null;
  shouldCalculateCanPickUp?: boolean; // Indica si debe calcular canPickUp (por defecto true en Steps 1-6, false en Step7)
}

export default function Step4OrderSummary({
  isProcessing = false,
  onFinishPayment,
  buttonText = "Continuar",
  onBack,
  disabled = false,
  shippingVerification,
  deliveryMethod,
  isSticky = true,
  isStep1 = false,
  onCanPickUpReady,
  error,
  shouldCalculateCanPickUp = true, // Por defecto true (Steps 1-6)
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

  const [localDeliveryMethod, setLocalDeliveryMethod] = React.useState<string>(
    () => getDeliveryMethodFromStorage()
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
    window.addEventListener(
      "delivery-method-changed",
      handleDeliveryMethodChanged
    );

    // Verificar cambios más frecuentemente para detectar cambios en la misma pestaña
    const interval = setInterval(updateDeliveryMethod, 50);

    // También forzar actualización cuando el componente recibe foco
    const handleFocus = () => {
      updateDeliveryMethod();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "delivery-method-changed",
        handleDeliveryMethodChanged
      );
      window.removeEventListener("focus", handleFocus);
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

    setIsLoadingCanPickUp(true);
    try {
      // Obtener user_id del localStorage
      const user = safeGetLocalStorage<{ id?: string; user_id?: string }>(
        "imagiq_user",
        {}
      );
      const userId = user?.id || user?.user_id;

      if (!userId) {
        console.warn("⚠️ No se encontró userId en localStorage. Usuario no logueado?");
        setIsLoadingCanPickUp(false);
        setGlobalCanPickUp(null);
        return;
      }

      console.log("✅ userId encontrado:", userId);

      // Preparar TODOS los productos del carrito para una sola petición
      const productsToCheck = products.map((p) => ({
        sku: p.sku,
        quantity: p.quantity,
      }));

      // Llamar al endpoint con TODOS los productos agrupados
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
      } else {
        setGlobalCanPickUp(false);
      }
    } catch (error) {
      console.error("❌ Error al verificar canPickUp global:", error);
      setGlobalCanPickUp(false);
    } finally {
      console.log('🔄 Finalizando carga de canPickUp, isLoadingCanPickUp será false');
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
  
  // Resetear userClickedWhileLoading solo cuando cambian los productos o shouldCalculateCanPickUp
  React.useEffect(() => {
    setUserClickedWhileLoading(false);
  }, [products.length, shouldCalculateCanPickUp]);

  // Notificar cuando canPickUp está listo (no está cargando)
  React.useEffect(() => {
    if (isStep1 && onCanPickUpReady) {
      onCanPickUpReady(!isLoadingCanPickUp, isLoadingCanPickUp);
    }
  }, [isStep1, isLoadingCanPickUp, onCanPickUpReady]);

  // Ejecutar onFinishPayment automáticamente cuando termine de cargar canPickUp
  // y el usuario había hecho clic mientras estaba cargando (pasos 1-6)
  React.useEffect(() => {
    console.log('🔍 useEffect avance automático:', {
      userClickedWhileLoading,
      isLoadingCanPickUp,
      shouldCalculateCanPickUp,
      timestamp: new Date().toISOString()
    });
    
    // Solo avanzar si:
    // 1. El usuario hizo clic mientras estaba cargando
    // 2. Ya terminó de cargar (isLoadingCanPickUp es false)
    // 3. shouldCalculateCanPickUp es true (pasos 1-6, no Step7)
    if (userClickedWhileLoading && !isLoadingCanPickUp && shouldCalculateCanPickUp) {
      console.log('✅ CONDICIÓN CUMPLIDA: canPickUp terminó de cargar, avanzando automáticamente...', {
        userClickedWhileLoading,
        isLoadingCanPickUp,
        shouldCalculateCanPickUp
      });
      
      // Guardar el estado antes de resetearlo
      const shouldExecute = userClickedWhileLoading;
      
      // Resetear el estado inmediatamente para evitar ejecuciones múltiples
      setUserClickedWhileLoading(false);
      
      // Ejecutar la función usando la ref para evitar problemas de dependencias
      if (shouldExecute) {
        // Ejecutar inmediatamente sin delay para forzar el avance
        console.log('🚀 EJECUTANDO onFinishPayment automáticamente AHORA...');
        try {
          onFinishPaymentRef.current();
          console.log('✅ onFinishPayment ejecutado correctamente');
        } catch (error) {
          console.error('❌ Error al ejecutar onFinishPayment:', error);
        }
      }
    } else {
      console.log('⏸️ Condición NO cumplida para avance automático:', {
        userClickedWhileLoading,
        isLoadingCanPickUp,
        shouldCalculateCanPickUp,
        reason: !userClickedWhileLoading ? 'Usuario no hizo clic' : 
                isLoadingCanPickUp ? 'Aún está cargando' : 
                !shouldCalculateCanPickUp ? 'No debe calcular canPickUp' : 'Desconocido'
      });
    }
  }, [userClickedWhileLoading, isLoadingCanPickUp, shouldCalculateCanPickUp]);

  // Ejecutar cuando cambian los productos
  React.useEffect(() => {
    fetchGlobalCanPickUp();
  }, [fetchGlobalCanPickUp]);

  // Escuchar cambios de dirección (desde header O desde checkout) cuando la variable de debug está activa o en Step1
  React.useEffect(() => {
    const shouldListen =
      isStep1 || process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true";
    if (!shouldListen) return;

    const handleAddressChange = (event: Event) => {
      console.log(
        "🔄 Evento de cambio de dirección recibido en Step4OrderSummary:",
        event.type
      );
      console.log("🔄 Dirección cambió, recalculando canPickUp global...");
      // Recalcular canPickUp global cuando cambia la dirección
      fetchGlobalCanPickUp();
    };

    const handleStorageChange = (e: StorageEvent) => {
      // Escuchar cambios en checkout-address o imagiq_default_address
      if (e.key === "checkout-address" || e.key === "imagiq_default_address") {
        console.log(
          "🔄 Cambio detectado en localStorage (Step4OrderSummary):",
          e.key
        );
        handleAddressChange(e);
      }
    };

    // Escuchar evento storage (para cambios entre tabs)
    window.addEventListener("storage", handleStorageChange);

    // Escuchar eventos personalizados desde header
    window.addEventListener("address-changed", handleAddressChange);

    // Escuchar eventos personalizados desde checkout
    window.addEventListener("checkout-address-changed", handleAddressChange);

    // También verificar cambios periódicamente en la misma tab
    let lastCheckoutAddress = localStorage.getItem("checkout-address");
    let lastDefaultAddress = localStorage.getItem("imagiq_default_address");

    const checkAddressChanges = () => {
      const currentCheckoutAddress = localStorage.getItem("checkout-address");
      const currentDefaultAddress = localStorage.getItem(
        "imagiq_default_address"
      );

      if (
        currentCheckoutAddress !== lastCheckoutAddress &&
        lastCheckoutAddress !== null
      ) {
        console.log(
          "🔄 Cambio detectado en checkout-address (polling - Step4OrderSummary)"
        );
        handleAddressChange(new Event("checkout-address-changed"));
        lastCheckoutAddress = currentCheckoutAddress;
      }

      if (
        currentDefaultAddress !== lastDefaultAddress &&
        lastDefaultAddress !== null
      ) {
        console.log(
          "🔄 Cambio detectado en imagiq_default_address (polling - Step4OrderSummary)"
        );
        handleAddressChange(new Event("address-changed"));
        lastDefaultAddress = currentDefaultAddress;
      }
    };

    const intervalId = setInterval(checkAddressChanges, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("address-changed", handleAddressChange);
      window.removeEventListener(
        "checkout-address-changed",
        handleAddressChange
      );
      clearInterval(intervalId);
    };
  }, [fetchGlobalCanPickUp, isStep1]);

  // Escuchar cuando se agregan productos al carrito o cambia la cantidad (solo en Step1)
  React.useEffect(() => {
    if (!isStep1) return;

    const handleStorageChange = (e: Event | StorageEvent) => {
      const key =
        "detail" in e &&
        e.detail &&
        typeof e.detail === "object" &&
        "key" in e.detail
          ? (e.detail as { key?: string }).key
          : "key" in e
          ? e.key
          : null;

      if (key === "cart-items") {
        console.log(
          "🔄 Productos del carrito cambiaron (cantidad o nuevo producto), recalculando canPickUp global..."
        );
        // Recalcular canPickUp global cuando cambian los productos
        fetchGlobalCanPickUp();
      }
    };

    // Escuchar cambios en cart-items (cuando se agregan productos desde sugerencias o cambia la cantidad)
    window.addEventListener("storage", handleStorageChange);
    // También escuchar evento personalizado
    window.addEventListener("localStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleStorageChange);
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

        {/* Envío */}
        <div className="flex justify-between text-sm">
          <span>
            {(() => {
              // Prefer prop value, fallback to local state or localStorage
              const currentMethod =
                deliveryMethod === "pickup"
                  ? "tienda"
                  : deliveryMethod === "delivery"
                  ? "domicilio"
                  : localDeliveryMethod === "tienda"
                  ? "tienda"
                  : getDeliveryMethodFromStorage();
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
            isProcessing || disabled || (userClickedWhileLoading && isLoadingCanPickUp)
              ? "opacity-70 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          disabled={isProcessing || disabled || (userClickedWhileLoading && isLoadingCanPickUp)}
          data-testid="checkout-finish-btn"
          aria-busy={isProcessing || (userClickedWhileLoading && isLoadingCanPickUp)}
          onClick={() => {
            // Si está cargando canPickUp cuando el usuario hace clic, marcar que hizo clic y esperar
            if (isLoadingCanPickUp) {
              console.log('👆 Usuario hizo clic mientras canPickUp está cargando, esperando...');
              setUserClickedWhileLoading(true);
              return; // No ejecutar onFinishPayment todavía, el useEffect se encargará
            }
            // Si no está cargando, ejecutar normalmente
            console.log('👆 Usuario hizo clic, canPickUp ya terminó, ejecutando onFinishPayment inmediatamente');
            onFinishPayment();
          }}
        >
          {userClickedWhileLoading && isLoadingCanPickUp ? (
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

      {/* Información de compra - Términos, financiamiento y envío */}
      <div className="flex flex-col gap-3 text-xs leading-relaxed">
        {/* Términos y Condiciones - Centrado y pegado al botón */}
        <p className="text-gray-700 text-center mt-3">
          Al continuar con tu compra, aceptas los{" "}
          <a
            href="/soporte/politicas-generales"
            target="_blank"
            className="text-blue-600 underline hover:text-blue-700 font-semibold"
          >
            Términos y Condiciones
          </a>{" "}
          y utilizaremos tus datos personales de acuerdo a nuestra{" "}
          <a
            href="/soporte/tratamiento-datos-personales"
            target="_blank"
            className="text-blue-600 underline hover:text-blue-700 font-semibold"
          >
            política de privacidad
          </a>
          .
        </p>

        {/* Espacio entre secciones */}
        <div className="mt-3"></div>

        {/* Contenedor con padding lateral para información de financiamiento y envío */}
        <div className="flex flex-col gap-3 px-2.5">
          {/* Información de Financiamiento */}
          <div className="flex gap-3 items-start">
            <div className="shrink-0">
              <svg
                width="40"
                height="40"
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
            <p className="font-semibold text-black">
              Compra sin interés a 3, 6, 12 o 24 cuotas pagando con tarjetas de
              nuestros bancos aliados: Bancolombia y Davivienda. Aplican{" "}
              <a
                href="/soporte/tyc-bancolombia"
                target="_blank"
                className="text-blue-600 underline hover:text-blue-700 font-semibold"
              >
                T&C Bancolombia
              </a>{" "}
              y{" "}
              <a
                href="/soporte/tyc-davivienda"
                target="_blank"
                className="text-blue-600 underline hover:text-blue-700 font-semibold"
              >
                T&C Davivienda
              </a>
              .
            </p>
          </div>

          {/* Información de Envío */}
          <div className="flex gap-3 items-start">
            <div className="shrink-0">
              <svg
                width="40"
                height="40"
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
            <p className="font-semibold text-black">
              Envío gratis a toda Colombia. Si compras en Bogotá antes de las
              11:00 am productos de la categoría Smartphones y Accesorios,
              recibirás tu pedido el mismo día
            </p>
          </div>
        </div>
      </div>

      {/* Debug: canPickUp global (solo cuando la variable de entorno está activa) */}
      {process.env.NEXT_PUBLIC_SHOW_PRODUCT_CODES === "true" && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs font-semibold text-yellow-800 mb-2">
            Debug: canPickUp global
          </p>
          <div className="text-xs text-yellow-700">
            {isLoadingCanPickUp ? (
              <p className="text-yellow-600 italic">Verificando...</p>
            ) : globalCanPickUp === null ? (
              <p className="text-yellow-600 italic">
                No disponible - Verifica que estés logueado y tengas productos en el carrito
              </p>
            ) : (
              <p className="font-medium">
                canPickUp global: {globalCanPickUp ? "true" : "false"}
              </p>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
