"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Sugerencias from "./Sugerencias";
import { useCart, ORIGINAL_SHIPPING_COST } from "@/hooks/useCart";
import { TradeInCompletedSummary } from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego";

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
    calculations,
  } = useCart();

  // Cargar datos de Trade-In desde localStorage
  useEffect(() => {
    const storedTradeIn = localStorage.getItem('imagiq_trade_in');
    console.log('🔍 Verificando Trade-In en localStorage:', storedTradeIn);
    if (storedTradeIn) {
      try {
        const data = JSON.parse(storedTradeIn);
        console.log('📦 Datos de Trade-In cargados:', data);
        if (data.completed) {
          setTradeInData(data);
          console.log('✅ Trade-In aplicado al carrito');
        }
      } catch (error) {
        console.error('❌ Error al cargar datos de Trade-In:', error);
      }
    } else {
      console.log('ℹ️ No hay datos de Trade-In guardados');
    }
  }, []);

  // Usar cálculos del hook centralizado
  const subtotal = calculations.subtotal;
  const tradeInSavings = tradeInData?.value || 0; // Ahorro, NO descuento inmediato
  const envio = 0;
  const impuestos = Math.round(subtotal * 0.09); // ejemplo 9%
  const total = subtotal + envio; // NO restar el Trade-In, es un beneficio posterior

  // Cambiar cantidad de producto usando el hook
  const handleQuantityChange = (idx: number, cantidad: number) => {
    const product = cartProducts[idx];
    console.log(product)
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
    onContinue();
  };

  // UX: feedback visual al agregar sugerencia usando el hook centralizado
  const handleAddSugerencia = (nombre: string) => {
    // Nota: La función onAdd del componente Sugerencias ahora pasa el nombre del producto real
    // Por ahora solo mostramos un alert, más adelante se puede integrar con el carrito
    console.log("Producto agregado:", nombre);
    alert(`"${nombre}" agregado a tu compra`);
  };

  // Handler para remover plan de Trade-In (usado en el banner mobile)
  const handleRemoveTradeIn = () => {
    setTradeInData(null);
    localStorage.removeItem('imagiq_trade_in');
  };

  return (
    <main className="min-h-screen py-2 md:py-8 px-2 md:px-0 pb-40 md:pb-8">
      {/* Grid principal: productos y resumen de compra */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Productos */}
        <section
          id="carrito-productos"
          className="p-0 md:p-4"
        >
          <h2 className="font-bold text-lg mb-3 md:mb-6 px-2 md:px-0">Productos</h2>

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
                    ubicacionEnvio={product.shippingFrom}
                    color={product.color}
                    capacity={product.capacity}
                    ram={product.ram}
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
                  <span className="text-xs font-semibold text-green-600 whitespace-nowrap">Envío GRATIS</span>
                </div>
                <p className="text-xs text-gray-600">Tu compra califica para envío gratuito</p>
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
                Este es un valor aproximado del<br />
                beneficio Estreno y Entrego al que<br />
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
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span>Envío</span>
                <span>
                  {cartProducts.length > 0 && (
                    <span className="line-through mr-2 text-gray-400">
                      {String(Number(ORIGINAL_SHIPPING_COST).toLocaleString())}
                    </span>
                  )}
                  <span className="font-bold">0</span>
                </span>
              </div>
              {cartProducts.length > 0 && (
                <div className="text-xs text-green-600">
                  tienes envío gratis en esta compra
                </div>
              )}
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
                <p className="text-xs text-gray-500">Total ({cartProducts.reduce((acc, p) => acc + p.quantity, 0)} productos)</p>
                <p className="text-2xl font-bold text-gray-900">$ {Number(total).toLocaleString()}</p>
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
