"use client";
import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import Sugerencias from "./Sugerencias";
import { useCart } from "@/hooks/useCart";
import { TradeInCompletedSummary } from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego";
import { apiClient, type ProductApiData, productEndpoints } from "@/lib/api";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { useAnalyticsWithUser } from "@/lib/analytics";
import { safeGetLocalStorage } from "@/lib/localStorage";
import Step4OrderSummary from "./components/Step4OrderSummary";
import { tradeInEndpoints } from "@/lib/api";
import { validateTradeInProducts, getTradeInValidationMessage } from "./utils/validateTradeIn";

/**
 * Paso 1 del carrito de compras
 * - Muestra productos guardados en localStorage
 * - Resumen de compra
 * - Código limpio, escalable y fiel al diseño Samsung
 */
/**
 * Paso 1 del carrito de compras
 * Recibe onContinue para avanzar al paso 2
 */
export default function Step1({ onContinue }: { onContinue: () => void }) {
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const { trackBeginCheckout } = useAnalyticsWithUser();

  // Estado para Trade-In
  const [tradeInData, setTradeInData] = useState<{
    deviceName: string;
    value: number;
    completed: boolean;
  } | null>(null);

  // Usar el hook centralizado useCart
  const {
    products: cartProducts,
    updateQuantity,
    removeProduct,
    addProduct,
    calculations,
    loadingShippingInfo,
  } = useCart();

  // Ref para evitar múltiples llamadas a candidate-stores
  const candidateStoresFetchedRef = useRef<Set<string>>(new Set());
  const previousProductsRef = useRef<string>("");
  const fetchingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Estado para rastrear qué productos están cargando canPickUp
  const [loadingCanPickUp, setLoadingCanPickUp] = useState<Set<string>>(
    new Set()
  );
  // Estado para rastrear qué productos están cargando indRetoma
  const [loadingIndRetoma, setLoadingIndRetoma] = useState<Set<string>>(
    new Set()
  );

  // Cargar datos de Trade-In desde localStorage
  useEffect(() => {
    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    if (storedTradeIn) {
      try {
        const data = JSON.parse(storedTradeIn);
        if (data.completed) {
          setTradeInData(data);
        }
      } catch (error) {
        console.error("❌ Error al cargar datos de Trade-In:", error);
      }
    }
  }, []);

  // Llamar a candidate-stores para cada producto en Step1
  useEffect(() => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce: esperar 500ms antes de hacer las peticiones para evitar rate limiting
    timeoutRef.current = setTimeout(async () => {
      // Evitar múltiples ejecuciones simultáneas
      if (fetchingRef.current) {
        return;
      }

      if (cartProducts.length === 0) {
        fetchingRef.current = false;
        return;
      }

      fetchingRef.current = true;

      try {
        // Crear una clave única basada en los productos actuales para detectar cambios
        const currentProductsKey = cartProducts
          .map((p) => `${p.sku}-${p.quantity}`)
          .sort((a, b) => a.localeCompare(b))
          .join(",");

        // Si los productos no han cambiado, no hacer nada (evitar peticiones duplicadas)
        if (previousProductsRef.current === currentProductsKey) {
          fetchingRef.current = false;
          return;
        }

        // Si los productos cambiaron, limpiar el ref solo para los productos que ya no existen
        const previousProductsSet = new Set(
          previousProductsRef.current.split(",").filter(Boolean)
        );
        const currentProductKeysSet = new Set(
          cartProducts.map((p) => `${p.sku}-${p.quantity}`)
        );

        // Limpiar solo las claves que ya no existen
        for (const key of previousProductsSet) {
          if (!currentProductKeysSet.has(key)) {
            candidateStoresFetchedRef.current.delete(key);
          }
        }

        // Actualizar la referencia
        previousProductsRef.current = currentProductsKey;

        // Obtener user_id del localStorage
        const user = safeGetLocalStorage<{ id?: string; user_id?: string }>(
          "imagiq_user",
          {}
        );
        const userId = user?.id || user?.user_id;

        if (!userId) {
          fetchingRef.current = false;
          return;
        }

        // Filtrar productos que necesitan la petición (solo si no tienen canPickUp definido Y no están en el ref)
        const productsToFetch = cartProducts.filter((product) => {
          const productKey = `${product.sku}-${product.quantity}`;
          // Solo hacer petición si:
          // 1. No está en el ref (nunca se ha consultado)
          // 2. Y no tiene canPickUp definido (undefined)
          // Si ya tiene canPickUp (true o false), no hacer petición
          const isInRef = candidateStoresFetchedRef.current.has(productKey);
          const hasCanPickUp = product.canPickUp !== undefined;

          // Solo hacer petición si NO está en el ref Y NO tiene canPickUp
          return !isInRef && !hasCanPickUp;
        });

        if (productsToFetch.length === 0) {
          fetchingRef.current = false;
          // Limpiar loading si no hay productos para cargar
          setLoadingCanPickUp(new Set());
          return;
        }

        // Marcar productos como cargando
        const productKeysToLoad = productsToFetch.map(
          (p) => `${p.sku}-${p.quantity}`
        );
        setLoadingCanPickUp(new Set(productKeysToLoad));

        // Hacer petición para cada producto con delay entre peticiones para evitar rate limiting
        const results: Array<{
          sku: string;
          canPickUp: boolean;
          shippingCity: string;
          shippingStore: string;
        } | null> = [];

        for (let i = 0; i < productsToFetch.length; i++) {
          const product = productsToFetch[i];
          const productKey = `${product.sku}-${product.quantity}`;

          // Agregar delay entre peticiones (excepto la primera)
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms entre peticiones
          }

          try {
            candidateStoresFetchedRef.current.add(productKey);

            const response = await productEndpoints.getCandidateStores({
              products: [{ sku: product.sku, quantity: product.quantity }],
              user_id: userId,
            });

            if (response.success && response.data) {
              const { stores } = response.data;
              // Manejar ambos casos: canPickUp (mayúscula) y canPickup (minúscula)
              const canPickUp =
                (response.data as { canPickUp?: boolean; canPickup?: boolean })
                  .canPickUp ??
                (response.data as { canPickUp?: boolean; canPickup?: boolean })
                  .canPickup ??
                false;

              let shippingCity = "BOGOTÁ";
              let shippingStore = "";

              const storeEntries = Object.entries(stores);
              if (storeEntries.length > 0) {
                const [firstCity, firstCityStores] = storeEntries[0];
                shippingCity = firstCity;
                if (firstCityStores.length > 0) {
                  shippingStore = firstCityStores[0].nombre_tienda.trim();
                }
              }

              results.push({
                sku: product.sku,
                canPickUp,
                shippingCity,
                shippingStore,
              });
            } else {
              console.error(
                `❌ Error en la respuesta de candidate-stores para ${product.sku}:`,
                response.message
              );
              results.push(null);
            }
          } catch (error) {
            console.error(
              `❌ Error al llamar a candidate-stores para ${product.sku}:`,
              error
            );
            results.push(null);
          } finally {
            // Remover de loading cuando termine (éxito o error)
            setLoadingCanPickUp((prev) => {
              const newSet = new Set(prev);
              newSet.delete(productKey);
              return newSet;
            });
          }
        }

        // Actualizar localStorage una sola vez con todos los cambios
        const storedProducts = JSON.parse(
          localStorage.getItem("cart-items") || "[]"
        ) as Array<Record<string, unknown>>;
        const updatedProducts = storedProducts.map((p) => {
          const result = results.find((r) => r && r.sku === p.sku);
          if (result) {
            return {
              ...p,
              shippingCity: result.shippingCity,
              shippingStore: result.shippingStore,
              canPickUp: result.canPickUp,
            };
          }
          return p;
        });
        localStorage.setItem("cart-items", JSON.stringify(updatedProducts));

        // Disparar evento storage personalizado para que el hook useCart se actualice
        // Usamos un evento personalizado porque el evento 'storage' nativo solo se dispara entre tabs
        const customEvent = new CustomEvent("localStorageChange", {
          detail: { key: "cart-items" },
        });
        window.dispatchEvent(customEvent);

        // También disparar el evento storage estándar por compatibilidad
        window.dispatchEvent(new Event("storage"));

        // Forzar actualización adicional después de un pequeño delay para asegurar sincronización
        setTimeout(() => {
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(customEvent);
        }, 100);

        // Limpiar todos los loading después de actualizar localStorage
        setLoadingCanPickUp(new Set());
      } catch (error) {
        console.error("❌ Error al obtener usuario:", error);
        // Limpiar loading en caso de error
        setLoadingCanPickUp(new Set());
        fetchingRef.current = false;
      }
    }, 500); // Debounce de 500ms

    // Cleanup: limpiar timeout si el componente se desmonta o cambian los productos
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cartProducts]);

  // Verificar indRetoma para cada producto único en el carrito
  useEffect(() => {
    if (cartProducts.length === 0) return;

    const verifyTradeIn = async () => {
      // Obtener SKUs únicos (sin duplicados)
      const uniqueSkus = Array.from(
        new Set(cartProducts.map((p) => p.sku))
      );

      // Filtrar productos que necesitan verificación (solo si no tienen indRetoma definido)
      const productsToVerify = uniqueSkus.filter((sku) => {
        const product = cartProducts.find((p) => p.sku === sku);
        return product && product.indRetoma === undefined;
      });

      if (productsToVerify.length === 0) return;

      // Marcar productos como cargando
      setLoadingIndRetoma(new Set(productsToVerify));

      // Verificar cada SKU único
      const results: Array<{
        sku: string;
        indRetoma: number;
      } | null> = [];

      for (let i = 0; i < productsToVerify.length; i++) {
        const sku = productsToVerify[i];

        // Agregar delay entre peticiones (excepto la primera)
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        try {
          const response = await tradeInEndpoints.checkSkuForTradeIn({ sku });
          if (response.success && response.data) {
            const result = response.data;
            results.push({
              sku,
              indRetoma: result.indRetoma ?? (result.aplica ? 1 : 0),
            });
          } else {
            results.push(null);
          }
        } catch (error) {
          console.error(
            `❌ Error al verificar trade-in para SKU ${sku}:`,
            error
          );
          results.push(null);
        } finally {
          // Remover de loading cuando termine
          setLoadingIndRetoma((prev) => {
            const newSet = new Set(prev);
            newSet.delete(sku);
            return newSet;
          });
        }
      }

      // Actualizar localStorage con los resultados
      const storedProducts = JSON.parse(
        localStorage.getItem("cart-items") || "[]"
      ) as Array<Record<string, unknown>>;
      const updatedProducts = storedProducts.map((p) => {
        const result = results.find((r) => r && r.sku === p.sku);
        if (result) {
          return {
            ...p,
            indRetoma: result.indRetoma,
          };
        }
        return p;
      });
      localStorage.setItem("cart-items", JSON.stringify(updatedProducts));

      // Disparar evento storage para sincronizar
      const customEvent = new CustomEvent("localStorageChange", {
        detail: { key: "cart-items" },
      });
      window.dispatchEvent(customEvent);
      window.dispatchEvent(new Event("storage"));

      // Limpiar todos los loading después de actualizar
      setLoadingIndRetoma(new Set());
    };

    verifyTradeIn();
  }, [cartProducts]);

  // Usar cálculos del hook centralizado
  const total = calculations.total;

  // Cambiar cantidad de producto usando el hook
  const handleQuantityChange = (idx: number, cantidad: number) => {
    const product = cartProducts[idx];
    const user = safeGetLocalStorage<{ id?: string }>("imagiq_user", {});
    const productId = product?.sku;
    if (product) {
      apiClient.put(
        `/api/cart/${user?.id ?? "unregistered"}/items/${productId}`,
        {
          quantity: cantidad,
        }
      );
      updateQuantity(product.sku, cantidad);
    }
  };

  // Eliminar producto usando el hook
  // Esto evita el problema de actualizar el estado durante el renderizado
  const handleRemove = (idx: number) => {
    const product = cartProducts[idx];
    const user = safeGetLocalStorage<{ id?: string }>("imagiq_user", {});
    const productId = product?.sku;
    if (product) {
      apiClient.delete(
        `/api/cart/${user?.id ?? "unregistered"}/items/${productId}`
      );
      setTimeout(() => {
        removeProduct(product.sku);
      }, 0);
    }
  };

  // ...existing code...

  // Estado para validación de Trade-In
  const [tradeInValidation, setTradeInValidation] = React.useState<{
    isValid: boolean;
    productsWithoutRetoma: typeof cartProducts;
    hasMultipleProducts: boolean;
    errorMessage?: string;
  }>({ isValid: true, productsWithoutRetoma: [], hasMultipleProducts: false });

  // Validar Trade-In cuando cambian los productos o el trade-in
  React.useEffect(() => {
    const validation = validateTradeInProducts(cartProducts);
    setTradeInValidation(validation);
  }, [cartProducts, tradeInData]);

  // Función para manejar el click en continuar pago
  const handleContinue = () => {
    if (cartProducts.length === 0) {
      return;
    }

    // Validar Trade-In antes de continuar
    const validation = validateTradeInProducts(cartProducts);
    if (!validation.isValid) {
      const message = getTradeInValidationMessage(validation);
      alert(message);
      return;
    }

    // Track del evento begin_checkout para analytics
    trackBeginCheckout(
      cartProducts.map((p) => ({
        item_id: p.sku,
        item_name: p.name,
        price: Number(p.price),
        quantity: p.quantity,
      })),
      total
    );

    onContinue();
  };

  // UX: feedback visual al agregar sugerencia usando el hook centralizado
  const handleAddSugerencia = async (producto: ProductApiData) => {
    try {
      // Mapear ProductApiData a CartProduct
      const cartProduct = {
        id: producto.codigoMarketBase,
        name: producto.desDetallada[0] || producto.nombreMarket?.[0] || '',
        image: getCloudinaryUrl(producto.imagePreviewUrl[0], "catalog"),
        price: producto.precioeccommerce[0] || producto.precioNormal[0],
        sku: producto.sku[0] || "",
        ean: producto.ean[0] || "",
        desDetallada: producto.desDetallada[0] || producto.nombreMarket?.[0] || '',
      };

      // Agregar al carrito
      await addProduct(cartProduct, 1);
    } catch (error) {
      console.error("Error al agregar producto sugerido:", error);
    }
  };

  // Handler para remover plan de Trade-In (usado en el banner mobile)
  const handleRemoveTradeIn = () => {
    setTradeInData(null);
    localStorage.removeItem("imagiq_trade_in");
  };

  return (
    <main className="min-h-screen py-2 md:py-8 px-2 md:px-0 pb-40 md:pb-8">
      {/* Grid principal: productos y resumen de compra */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Productos */}
        <section id="carrito-productos" className="p-0">
          <h2 className="font-bold text-lg mb-3 md:mb-6 px-2 md:px-0">
            Productos
          </h2>

          {cartProducts.length === 0 ? (
            <div className="text-gray-500 text-center py-16 text-lg">
              No hay productos en el carrito.
            </div>
          ) : (
            <>
              <div className="flex flex-col bg-white rounded-lg overflow-hidden border border-gray-200">
                {cartProducts.map((product, idx) => (
                  <ProductCard
                    key={product.sku}
                    nombre={product.name}
                    imagen={product.image}
                    precio={product.price}
                    precioOriginal={product.originalPrice}
                    cantidad={product.quantity}
                    stock={product.stock}
                    shippingCity={product.shippingCity}
                    shippingStore={product.shippingStore}
                    color={product.color}
                    colorName={product.colorName}
                    capacity={product.capacity}
                    ram={product.ram}
                    desDetallada={product.desDetallada}
                    canPickUp={product.canPickUp}
                    isLoadingShippingInfo={
                      loadingShippingInfo[product.sku] || false
                    }
                    isLoadingCanPickUp={loadingCanPickUp.has(
                      `${product.sku}-${product.quantity}`
                    )}
                    isLoadingIndRetoma={loadingIndRetoma.has(product.sku)}
                    indRetoma={product.indRetoma}
                    onQuantityChange={(cantidad) =>
                      handleQuantityChange(idx, cantidad)
                    }
                    onRemove={() => handleRemove(idx)}
                  />
                ))}
              </div>

              {/* Barra de envío gratis */}
              <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-2 flex-1 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-green-600 whitespace-nowrap">
                    Envío GRATIS
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Tu compra califica para envío gratuito
                </p>
              </div>
            </>
          )}
        </section>
        {/* Resumen de compra y Trade-In - Solo Desktop */}
        <aside className="hidden md:block space-y-4">
          {/* Mensaje de error si algún producto no aplica para Trade-In */}
          {!tradeInValidation.isValid && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {getTradeInValidationMessage(tradeInValidation)}
            </div>
          )}
          <Step4OrderSummary
            onFinishPayment={handleContinue}
            buttonText="Continuar pago"
            disabled={cartProducts.length === 0 || !tradeInValidation.isValid}
          />

          {/* Banner de Trade-In - Debajo del resumen */}
          {tradeInData?.completed && (
            <TradeInCompletedSummary
              deviceName={tradeInData.deviceName}
              tradeInValue={tradeInData.value}
              onEdit={handleRemoveTradeIn}
            />
          )}
        </aside>
      </div>
      {/* Sugerencias: fila completa debajo del grid principal */}
      <div className="max-w-6xl mx-auto mt-8 mb-4 md:mb-0">
        <Sugerencias onAdd={handleAddSugerencia} />
      </div>

      {/* Sticky Bottom Bar - Solo Mobile */}
      {cartProducts.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="p-4">
            {/* Resumen compacto */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500">
                  Total ({cartProducts.reduce((acc, p) => acc + p.quantity, 0)}{" "}
                  productos)
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  $ {Number(total).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setShowCouponModal(true)}
                className="text-sm text-sky-600 hover:text-sky-700 font-medium underline cursor-pointer"
              >
                Cupón
              </button>
            </div>

            {/* Mensaje de error si algún producto no aplica para Trade-In */}
            {!tradeInValidation.isValid && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs mb-3">
                {getTradeInValidationMessage(tradeInValidation)}
              </div>
            )}
            {/* Botón continuar */}
            <button
              className={`w-full font-bold py-3 rounded-lg text-base transition text-white cursor-pointer ${
                !tradeInValidation.isValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-600"
              }`}
              onClick={handleContinue}
              disabled={!tradeInValidation.isValid}
            >
              Continuar pago
            </button>
          </div>
        </div>
      )}

      {/* Modal de Cupón */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:max-w-md md:rounded-lg rounded-t-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold">Agregar cupón</h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <input
                type="text"
                placeholder="Código de cupón"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={() => {
                  // Aquí iría la lógica para aplicar el cupón
                  alert(`Cupón "${couponCode}" aplicado`);
                  setShowCouponModal(false);
                  setCouponCode("");
                }}
                className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg transition cursor-pointer"
              >
                Aplicar cupón
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
