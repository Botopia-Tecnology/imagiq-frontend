"use client";
import { TradeInCompletedSummary } from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego";
import TradeInModal from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInModal";
import { useCart, type CartProduct, type BundleInfo } from "@/hooks/useCart";
import { useAnalyticsWithUser } from "@/lib/analytics";
import { tradeInEndpoints, type ProductApiData } from "@/lib/api";
import { apiDelete, apiPut } from "@/lib/api-client";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import Step4OrderSummary from "./components/Step4OrderSummary";
import ProductCard from "./ProductCard";
import Sugerencias from "./Sugerencias";
import {
  getTradeInValidationMessage,
  validateTradeInProducts,
} from "./utils/validateTradeIn";
import { safeGetLocalStorage } from "@/lib/localStorage";
import { CartBundleGroup } from "./components/CartBundleGroup";
import { useTradeInPrefetch } from "@/hooks/useTradeInPrefetch";

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
export default function Step1({
  onContinue,
}: {
  readonly onContinue: () => void;
}) {
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const { trackBeginCheckout } = useAnalyticsWithUser();

  // Estado para Trade-In
  const [tradeInData, setTradeInData] = useState<{
    deviceName: string;
    value: number;
    completed: boolean;
  } | null>(null);

  // Estado para controlar el modal de Trade-In
  const [isTradeInModalOpen, setIsTradeInModalOpen] = useState(false);

  // Usar el hook centralizado useCart
  const {
    products: cartProducts,
    updateQuantity,
    removeProduct,
    addProduct,
    calculations,
    loadingShippingInfo,
    formatPrice,
    // Métodos de Bundle
    updateBundleQuantity,
    removeBundleProduct,
  } = useCart();

  // Agrupar productos por bundle
  const { bundleGroups, nonBundleProducts } = useMemo(() => {
    const groups = new Map<string, { bundleInfo: BundleInfo; items: CartProduct[] }>();
    const standalone: CartProduct[] = [];

    for (const product of cartProducts) {
      if (product.bundleInfo) {
        const key = `${product.bundleInfo.codCampana}-${product.bundleInfo.productSku}`;
        if (!groups.has(key)) {
          groups.set(key, { bundleInfo: product.bundleInfo, items: [] });
        }
        groups.get(key)!.items.push(product);
      } else {
        standalone.push(product);
      }
    }

    return {
      bundleGroups: Array.from(groups.values()),
      nonBundleProducts: standalone,
    };
  }, [cartProducts]);

  // Estado para rastrear qué productos están cargando indRetoma
  const [loadingIndRetoma, setLoadingIndRetoma] = useState<Set<string>>(
    new Set()
  );

  // 🚀 Prefetch automático de datos de Trade-In
  useTradeInPrefetch();

  // Cargar datos de Trade-In desde localStorage
  // Si el producto aplica (indRetoma === 1) pero no hay trade-in activo, mostrar banner para guiar al usuario
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
    } else {
      // Si no hay trade-in activo pero el producto aplica (indRetoma === 1), mostrar banner guía SIEMPRE
      // Sin importar canPickUp o si el usuario está logueado
      const productApplies =
        cartProducts.length === 1 && cartProducts[0]?.indRetoma === 1;

      if (productApplies) {
        // Mostrar banner siempre si el producto tiene indRetoma === 1
        setTradeInData({
          deviceName: cartProducts[0].name,
          value: 0,
          completed: false, // No está completado, solo es una guía
        });
      }
    }
  }, [cartProducts]);

  // El canPickUp global se calcula en Step4OrderSummary con todos los productos del carrito

  // Ref para rastrear SKUs que ya fueron verificados (evita loops infinitos)
  const verifiedSkusRef = useRef<Set<string>>(new Set());
  // Ref para rastrear SKUs que fallaron (evita reintentos de peticiones fallidas)
  const failedSkusRef = useRef<Set<string>>(new Set());

  // Verificar indRetoma para cada producto único en el carrito
  useEffect(() => {
    if (cartProducts.length === 0) return;

    const verifyTradeIn = async () => {
      // Obtener SKUs únicos (sin duplicados)
      const uniqueSkus = Array.from(new Set(cartProducts.map((p) => p.sku)));

      // Filtrar productos que necesitan verificación (solo si no tienen indRetoma definido Y no fueron verificados antes)
      // PROTECCIÓN: NO verificar SKUs que ya fallaron anteriormente
      const productsToVerify = uniqueSkus.filter((sku) => {
        const product = cartProducts.find((p) => p.sku === sku);
        const needsVerification = product && product.indRetoma === undefined;
        const notVerifiedYet = !verifiedSkusRef.current.has(sku);
        const notFailedBefore = !failedSkusRef.current.has(sku); // PROTECCIÓN: no reintentar fallos
        return needsVerification && notVerifiedYet && notFailedBefore;
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

        // PROTECCIÓN: Verificar si este SKU ya falló antes (ANTES del delay y try)
        if (failedSkusRef.current.has(sku)) {
          console.error(
            `🚫 SKU ${sku} ya falló anteriormente. NO se reintentará para evitar sobrecargar la base de datos.`
          );
          results.push(null);
          verifiedSkusRef.current.add(sku); // Marcar como verificado para no intentar de nuevo
          setLoadingIndRetoma((prev) => {
            const newSet = new Set(prev);
            newSet.delete(sku);
            return newSet;
          });
          continue; // Saltar este SKU
        }

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
            // Marcar SKU como verificado cuando tiene éxito
            verifiedSkusRef.current.add(sku);
            // Limpiar de fallos si existía
            failedSkusRef.current.delete(sku);
          } else {
            // Si falla la petición, marcar como fallido
            failedSkusRef.current.add(sku);
            console.error(
              `🚫 Petición falló para SKU ${sku}. NO se reintentará automáticamente para proteger la base de datos.`
            );
            results.push(null);
            // También marcar como verificado en caso de error para no reintentar infinitamente
            verifiedSkusRef.current.add(sku);
          }
        } catch (error) {
          // Si hay un error en el catch, también marcar como fallido
          failedSkusRef.current.add(sku);
          console.error(
            `🚫 Error al verificar trade-in para SKU ${sku} - Petición bloqueada para evitar sobrecargar BD:`,
            error
          );
          console.error(`🚫 SKU ${sku} NO se reintentará automáticamente.`);
          results.push(null);
          // También marcar como verificado en caso de error para no reintentar infinitamente
          verifiedSkusRef.current.add(sku);
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
      globalThis.dispatchEvent(customEvent);
      globalThis.dispatchEvent(new Event("storage"));

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
    if (product) {
      // Actualizar cantidad usando el hook
      // El canPickUp global se recalculará automáticamente en Step4OrderSummary
      updateQuantity(product.sku, cantidad);

      apiPut(`/api/cart/items/${product.sku}`, {
        quantity: cantidad,
      });
    }
  };

  // Eliminar producto usando el hook
  // Esto evita el problema de actualizar el estado durante el renderizado
  const handleRemove = (idx: number) => {
    const product = cartProducts[idx];
    const productId = product?.sku;
    if (product) {
      apiDelete(`/api/cart/items/${productId}`);
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

  // Estado para mostrar skeleton del mensaje de error inicialmente
  const [showErrorSkeleton, setShowErrorSkeleton] = React.useState(false);

  // Validar Trade-In cuando cambian los productos o el trade-in
  React.useEffect(() => {
    const validation = validateTradeInProducts(cartProducts);
    setTradeInValidation(validation);

    // Si el producto ya no aplica (indRetoma === 0), quitar banner inmediatamente y mostrar notificación
    if (
      validation.isValid === false &&
      validation.errorMessage !== undefined &&
      validation.errorMessage.includes("Te removimos")
    ) {
      // Limpiar localStorage inmediatamente
      localStorage.removeItem("imagiq_trade_in");

      // Quitar el banner inmediatamente
      setTradeInData(null);

      // Mostrar notificación toast
      toast.error("Cupón removido", {
        description:
          "El producto seleccionado ya no aplica para el beneficio Estreno y Entrego",
        duration: 5000,
      });
    } else {
      setShowErrorSkeleton(false);
    }
  }, [cartProducts, tradeInData]);

  // Estado para saber si canPickUp global está cargando
  const [isLoadingCanPickUpGlobal, setIsLoadingCanPickUpGlobal] =
    React.useState(false);

  // Callback para recibir el estado de canPickUp desde Step4OrderSummary
  // Solo actualiza el estado, el avance automático se maneja en Step4OrderSummary
  const handleCanPickUpReady = React.useCallback(
    (isReady: boolean, isLoading: boolean) => {
      setIsLoadingCanPickUpGlobal(isLoading);
      // El avance automático ahora se maneja en Step4OrderSummary con userClickedWhileLoading
    },
    []
  );

  // Función para manejar el click en continuar pago
  const handleContinue = async () => {
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

    // IMPORTANTE: Si canPickUp global está cargando, la nueva lógica en Step4OrderSummary
    // se encargará de avanzar automáticamente cuando termine (usando userClickedWhileLoading)
    // Solo necesitamos esperar si ya terminó de cargar
    if (isLoadingCanPickUpGlobal) {
      // No hacer nada aquí, dejar que Step4OrderSummary maneje el avance automático
      return;
    }

    // Si ya se calculó o no está cargando, continuar normalmente
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
        name: producto.desDetallada[0] || producto.nombreMarket?.[0] || "",
        image: getCloudinaryUrl(producto.imagePreviewUrl[0], "catalog"),
        price: producto.precioeccommerce[0] || producto.precioNormal[0],
        sku: producto.sku[0] || "",
        ean: producto.ean[0] || "",
        desDetallada:
          producto.desDetallada[0] || producto.nombreMarket?.[0] || "",
        modelo: producto.modelo?.[0] || "",
        categoria: producto.categoria || "",
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

    // FORZAR cambio a "domicilio" si el método está en "tienda" (sin importar si está autenticado o no)
    if (typeof globalThis.window !== "undefined") {
      const currentMethod = globalThis.window.localStorage.getItem(
        "checkout-delivery-method"
      );
      if (currentMethod === "tienda") {
        // Forzar cambio inmediatamente
        globalThis.window.localStorage.setItem(
          "checkout-delivery-method",
          "domicilio"
        );
        globalThis.window.dispatchEvent(
          new CustomEvent("delivery-method-changed", {
            detail: { method: "domicilio" },
          })
        );
        globalThis.window.dispatchEvent(new Event("storage"));
        console.log(
          "✅ Método de entrega cambiado a 'domicilio' después de eliminar trade-in"
        );
      }
    }

    // Si el producto aplica (indRetoma === 1), mostrar el banner guía SIEMPRE
    // Sin importar canPickUp o si el usuario está logueado
    const productApplies =
      cartProducts.length === 1 && cartProducts[0]?.indRetoma === 1;
    if (productApplies) {
      // Mostrar banner siempre si el producto tiene indRetoma === 1
      setTradeInData({
        deviceName: cartProducts[0].name,
        value: 0,
        completed: false, // No está completado, solo es una guía
      });
    }
  };

  // Handler para abrir el modal de Trade-In
  const handleOpenTradeInModal = () => {
    setIsTradeInModalOpen(true);
  };

  // Handler para cuando se completa el Trade-In
  const handleCompleteTradeIn = (deviceName: string, value: number) => {
    // IMPORTANTE: Cargar datos desde localStorage (ya guardados por handleFinalContinue)
    // Si no existe en localStorage, guardarlo como respaldo (importante para usuarios NO logueados)
    try {
      const raw = localStorage.getItem("imagiq_trade_in");
      if (raw) {
        const stored = JSON.parse(raw) as {
          deviceName?: string;
          value?: number;
          completed?: boolean;
        };
        const newTradeInData = {
          deviceName: stored.deviceName || deviceName,
          value: stored.value || value,
          completed: true,
        };
        setTradeInData(newTradeInData);
      } else {
        // Fallback: guardar en localStorage si no existe (importante para usuarios NO logueados)
        const tradeInData = {
          deviceName,
          value,
          completed: true,
        };
        try {
          localStorage.setItem("imagiq_trade_in", JSON.stringify(tradeInData));
        } catch (error) {
          console.error(
            "❌ Error al guardar trade-in en localStorage (respaldo):",
            error
          );
        }
        setTradeInData(tradeInData);
      }
    } catch (error) {
      // Fallback simple: guardar en localStorage como último recurso
      console.error("❌ Error al cargar trade-in desde localStorage:", error);
      const newTradeInData = {
        deviceName,
        value,
        completed: true,
      };
      try {
        localStorage.setItem("imagiq_trade_in", JSON.stringify(newTradeInData));
      } catch (storageError) {
        console.error(
          "❌ Error al guardar trade-in en localStorage (fallback):",
          storageError
        );
      }
      setTradeInData(newTradeInData);
    }
    setIsTradeInModalOpen(false);
  };

  // Handler para cancelar sin completar
  const handleCancelWithoutCompletion = () => {
    setIsTradeInModalOpen(false);
  };

  // Verificar si el usuario está logueado (se recalcula en cada render para estar actualizado)
  const user = safeGetLocalStorage<{
    id?: string;
    user_id?: string;
    email?: string;
  }>("imagiq_user", {});
  const isUserLoggedIn = !!(user?.id || user?.user_id || user?.email);

  // Mostrar el banner SIEMPRE si el producto tiene indRetoma === 1, sin importar canPickUp
  const shouldShowTradeInBanner =
    !!tradeInData &&
    (tradeInData.completed ||
      (!tradeInData.completed &&
        cartProducts.length === 1 &&
        cartProducts[0]?.indRetoma === 1));

  // Verificar si canPickUp es false para mostrar mensaje informativo
  const productCanPickUp =
    cartProducts.length === 1 ? cartProducts[0]?.canPickUp : undefined;
  const showCanPickUpMessage = isUserLoggedIn && productCanPickUp === false;

  const tradeInSummaryProps = shouldShowTradeInBanner
    ? {
      deviceName: tradeInData!.deviceName,
      tradeInValue: tradeInData!.value,
      onEdit: tradeInData!.completed
        ? handleRemoveTradeIn
        : handleOpenTradeInModal,
      validationError:
        tradeInValidation.isValid === false
          ? getTradeInValidationMessage(tradeInValidation)
          : undefined,
      isGuide: !tradeInData!.completed,
      showErrorSkeleton,
      shippingCity: cartProducts.find((p) => p.indRetoma === 1)?.shippingCity,
      showCanPickUpMessage: showCanPickUpMessage,
    }
    : null;

  return (
    <main className="min-h-screen py-2 md:py-8 px-2 md:px-0 pb-40 md:pb-8">
      {/* Grid principal: productos y resumen de compra */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Productos */}
        <section id="carrito-productos" className="p-0">

          {cartProducts.length === 0 ? (
            <div className="text-gray-500 text-center py-16 text-lg">
              No hay productos en el carrito.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bundles agrupados */}
              {bundleGroups.map((group) => (
                <CartBundleGroup
                  key={`${group.bundleInfo.codCampana}-${group.bundleInfo.productSku}`}
                  bundleInfo={group.bundleInfo}
                  items={group.items}
                  onUpdateQuantity={updateBundleQuantity}
                  onRemoveProduct={removeBundleProduct}
                  formatPrice={formatPrice}
                />
              ))}

              {/* Productos individuales (sin bundle) */}
              {nonBundleProducts.length > 0 && (
                <div className="flex flex-col bg-white rounded-lg overflow-hidden border border-gray-200 divide-y divide-gray-200">
                  {nonBundleProducts.map((product) => {
                    const idx = cartProducts.findIndex((p) => p.sku === product.sku);
                    return (
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
                        isLoadingShippingInfo={
                          loadingShippingInfo[product.sku] || false
                        }
                        isLoadingIndRetoma={loadingIndRetoma.has(product.sku)}
                        indRetoma={product.indRetoma}
                        onQuantityChange={(cantidad) =>
                          handleQuantityChange(idx, cantidad)
                        }
                        onRemove={() => handleRemove(idx)}
                      />
                    );
                  })}
                </div>
              )}

              {/* Banner de Trade-In - Debajo de los productos */}
              {tradeInSummaryProps && (
                <div className="mt-3">
                  <TradeInCompletedSummary {...tradeInSummaryProps} />
                </div>
              )}
            </div>
          )}
        </section>
        {/* Resumen de compra - Solo Desktop */}
        <aside className="hidden md:block space-y-4">
          <Step4OrderSummary
            onFinishPayment={() => {
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
            }}
            buttonText="Continuar pago"
            disabled={cartProducts.length === 0 || !tradeInValidation.isValid}
            isSticky={false}
            isStep1={true}
            onCanPickUpReady={handleCanPickUpReady}
            shouldCalculateCanPickUp={true}
            products={cartProducts}
            calculations={calculations}
          />
        </aside>
      </div>
      {/* Sugerencias: fila completa debajo del grid principal */}
      <div className="max-w-6xl mx-auto mt-4 mb-4 md:mb-0">
        <Sugerencias onAdd={handleAddSugerencia} cartProducts={cartProducts} />
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

            {/* Botón continuar */}
            <button
              className={`w-full font-bold py-3 rounded-lg text-base transition text-white ${!tradeInValidation.isValid || isLoadingCanPickUpGlobal
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-[#222] hover:bg-[#333] cursor-pointer"
                }`}
              onClick={handleContinue}
              disabled={!tradeInValidation.isValid || isLoadingCanPickUpGlobal}
            >
              {isLoadingCanPickUpGlobal ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  Verificando...
                </span>
              ) : (
                "Continuar pago"
              )}
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

      <TradeInModal
        isOpen={isTradeInModalOpen}
        onClose={() => setIsTradeInModalOpen(false)}
        onCompleteTradeIn={handleCompleteTradeIn}
        onCancelWithoutCompletion={handleCancelWithoutCompletion}
      />
    </main>
  );
}
