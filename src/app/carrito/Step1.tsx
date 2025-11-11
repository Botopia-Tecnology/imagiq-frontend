"use client";
import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import Sugerencias from "./Sugerencias";
import { useCart } from "@/hooks/useCart";
import { TradeInCompletedSummary } from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego";
import { type ProductApiData, productEndpoints } from "@/lib/api";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { useAnalytics } from "@/lib/analytics";

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
  const [validationError, setValidationError] = useState<string>("");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const { trackBeginCheckout } = useAnalytics();

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

  // Cargar datos de Trade-In desde localStorage
  useEffect(() => {
    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    console.log("🔍 Verificando Trade-In en localStorage:", storedTradeIn);
    if (storedTradeIn) {
      try {
        const data = JSON.parse(storedTradeIn);
        console.log("📦 Datos de Trade-In cargados:", data);
        if (data.completed) {
          setTradeInData(data);
          console.log("✅ Trade-In aplicado al carrito");
        }
      } catch (error) {
        console.error("❌ Error al cargar datos de Trade-In:", error);
      }
    } else {
      console.log("ℹ️ No hay datos de Trade-In guardados");
    }
  }, []);

  // Llamar a candidate-stores para cada producto en Step1
  useEffect(() => {
    const fetchCandidateStoresForAllProducts = async () => {
      if (cartProducts.length === 0) {
        return;
      }

      // Crear una clave única basada en los productos actuales para detectar cambios
      const currentProductsKey = cartProducts.map(p => `${p.sku}-${p.quantity}`).join(",");
      
      // Si los productos cambiaron, limpiar el ref para permitir nuevas peticiones
      if (previousProductsRef.current !== currentProductsKey) {
        candidateStoresFetchedRef.current.clear();
        previousProductsRef.current = currentProductsKey;
      }

      // Obtener user_id del localStorage
      try {
        const userStr = localStorage.getItem("imagiq_user");
        if (!userStr) {
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user?.id || user?.user_id;

        if (!userId) {
          return;
        }

        // Filtrar productos que necesitan la petición (no tienen canPickUp o no están en el ref)
        const productsToFetch = cartProducts.filter(product => {
          const productKey = `${product.sku}-${product.quantity}`;
          // Hacer petición si no está en el ref O si no tiene canPickUp definido
          return !candidateStoresFetchedRef.current.has(productKey) || product.canPickUp === undefined;
        });

        if (productsToFetch.length === 0) {
          return;
        }

        // Hacer petición para cada producto que lo necesite en paralelo
        const promises = productsToFetch.map(async (product) => {
          const productKey = `${product.sku}-${product.quantity}`;
          
          try {
            candidateStoresFetchedRef.current.add(productKey);
            
            const response = await productEndpoints.getCandidateStores({
              products: [{ sku: product.sku, quantity: product.quantity }],
              user_id: userId,
            });

            if (response.success && response.data) {
              const { stores, default_direction, canPickUp } = response.data;

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

              return { sku: product.sku, canPickUp, shippingCity, shippingStore };
            } else {
              console.error(`❌ Error en la respuesta de candidate-stores para ${product.sku}:`, response.message);
              return null;
            }
          } catch (error) {
            console.error(`❌ Error al llamar a candidate-stores para ${product.sku}:`, error);
            return null;
          }
        });

        // Esperar a que todas las peticiones terminen
        const results = await Promise.all(promises);
        
        // Actualizar localStorage una sola vez con todos los cambios
        const storedProducts = JSON.parse(localStorage.getItem("cart-items") || "[]");
        const updatedProducts = storedProducts.map((p: any) => {
          const result = results.find(r => r && r.sku === p.sku);
          if (result) {
            return { ...p, shippingCity: result.shippingCity, shippingStore: result.shippingStore, canPickUp: result.canPickUp };
          }
          return p;
        });
        localStorage.setItem("cart-items", JSON.stringify(updatedProducts));

        // Disparar evento storage para que el hook useCart se actualice
        window.dispatchEvent(new Event("storage"));
        
        // Forzar actualización adicional después de un pequeño delay
        setTimeout(() => {
          window.dispatchEvent(new Event("storage"));
        }, 200);
      } catch (error) {
        console.error("❌ Error al obtener usuario:", error);
      }
    };

    fetchCandidateStoresForAllProducts();
  }, [cartProducts]);

  // Usar cálculos del hook centralizado
  const subtotal = calculations.subtotal;
  const tradeInSavings = tradeInData?.value || 0; // Ahorro, NO descuento inmediato
  const envio = 0;
  const impuestos = Math.round(subtotal * 0.09); // ejemplo 9%
  const total = subtotal + envio; // NO restar el Trade-In, es un beneficio posterior

  // Cambiar cantidad de producto usando el hook
  const handleQuantityChange = (idx: number, cantidad: number) => {
    const product = cartProducts[idx];
    if (product) {
      updateQuantity(product.sku, cantidad);
    }
  };

  // Eliminar producto usando el hook
  // Esto evita el problema de actualizar el estado durante el renderizado
  const handleRemove = (idx: number) => {
    const product = cartProducts[idx];
    if (product) {
      // Programar la eliminación para después del renderizado usando setTimeout
      setTimeout(() => {
        removeProduct(product.sku);
      }, 0);
    }
  };

  // ...existing code...

  // Función para manejar el click en continuar pago
  const handleContinue = () => {
    if (cartProducts.length === 0) {
      setValidationError(
        "Agrega al menos un producto al carrito para continuar"
      );
      return;
    }
    setValidationError("");

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
        name: producto.desDetallada[0] || producto.nombreMarket,
        image: getCloudinaryUrl(producto.imagePreviewUrl[0], "catalog"),
        price: producto.precioeccommerce[0] || producto.precioNormal[0],
        sku: producto.sku[0] || "",
        ean: producto.ean[0] || "",
        desDetallada: producto.desDetallada[0] || producto.nombreMarket,
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
        <section id="carrito-productos" className="p-0 md:p-4">
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

              {/* Banner de Trade-In - Debajo de productos */}
              {tradeInData?.completed && (
                <div className="mt-6 px-2 md:px-0">
                  <TradeInCompletedSummary
                    deviceName={tradeInData.deviceName}
                    tradeInValue={tradeInData.value}
                    onEdit={handleRemoveTradeIn}
                  />
                </div>
              )}
            </>
          )}
        </section>
        {/* Resumen de compra - Solo Desktop */}
        <aside className="hidden md:flex rounded-2xl p-6 flex-col gap-6">
          <h2 className="font-bold text-lg mb-4">Resumen de compra</h2>

          {/* Estreno y Entrego - Justo después del título */}
          {tradeInData?.completed && tradeInSavings > 0 && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-gray-900 uppercase">
                  Estreno y Entrego
                </span>
                <span className="text-base font-bold text-blue-600">
                  - $ {Number(tradeInSavings).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
                Este es un valor aproximado del
                <br />
                beneficio Estreno y Entrego al que
                <br />
                aplicaste. Aplican TyC*
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>
                Productos (
                {cartProducts.reduce((acc, p) => acc + p.quantity, 0)})
              </span>
              <span className="font-bold">
                $ {Number(subtotal).toLocaleString()}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Código de descuento"
                className="border rounded-lg px-3 py-2 text-sm flex-1"
              />
              <button className="bg-gray-200 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-300 transition">
                Aplicar
              </button>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Subtotal</span>
              <span>$ {Number(subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold mt-2">
              <span>Total</span>
              <span>$ {Number(total).toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Incluye $ {Number(impuestos).toLocaleString()} de impuestos
            </div>
          </div>
          {/* Mostrar error de validación si existe */}
          {validationError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
              {validationError}
            </div>
          )}
          <button
            className={`w-full font-bold py-3 rounded-lg text-base mt-2 transition ${
              cartProducts.length === 0
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "text-black hover:brightness-95"
            }`}
            style={
              cartProducts.length === 0
                ? undefined
                : { backgroundColor: "#87CEEB" }
            }
            onClick={handleContinue}
            disabled={cartProducts.length === 0}
          >
            {cartProducts.length === 0
              ? "Agrega productos para continuar"
              : "Continuar pago"}
          </button>
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
                className="text-sm text-sky-600 hover:text-sky-700 font-medium underline"
              >
                Cupón
              </button>
            </div>

            {/* Botón continuar */}
            <button
              className="w-full font-bold py-3 rounded-lg text-base transition bg-sky-500 hover:bg-sky-600 text-white"
              onClick={handleContinue}
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
                className="text-gray-500 hover:text-gray-700"
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
                className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg transition"
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
