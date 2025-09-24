"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";
import Sugerencias from "./Sugerencias";
import { useCart, ORIGINAL_SHIPPING_COST } from "@/hooks/useCart";

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
  const [addedName, setAddedName] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string>("");

  // Usar el hook centralizado useCart
  const {
    products: cartProducts,
    updateQuantity,
    removeProduct,
    calculations,
    addProduct,
  } = useCart();

  console.log("Render Step1, cartProducts:", cartProducts);

  // Cargar productos desde el hook centralizado
  // Los productos ya están disponibles a través del hook useCart

  // Usar cálculos del hook centralizado
  const subtotal = calculations.subtotal;
  const envio = 0;
  const impuestos = Math.round(subtotal * 0.09); // ejemplo 9%
  const total = subtotal + envio;

  // Cambiar cantidad de producto usando el hook
  const handleQuantityChange = (idx: number, cantidad: number) => {
    const product = cartProducts[idx];
    if (product) {
      updateQuantity(product.id, cantidad);
    }
  };

  // Eliminar producto usando el hook
  const handleRemove = (idx: number) => {
    const product = cartProducts[idx];
    if (product) {
      removeProduct(product.id);
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
    // Buscar sugerencia por nombre
    const sugerencias = [
      {
        nombre: "Samsung Galaxy Watch7",
        precio: 1099900,
        imagen: "/img/categorias/galaxy_watch7.png",
        id: "watch7",
      },
      {
        nombre: "Galaxy Buds3 Pro",
        precio: 629900,
        imagen: "/img/categorias/galaxy_buds.png",
        id: "buds3pro",
      },
      {
        nombre: "Cargador Adaptador de carga rápida - Cable tipo-C (15W)",
        precio: 74900,
        imagen: "/img/categorias/cargador_tipo_c.png",
        id: "cargador15w",
      },
    ];
    const prod = sugerencias.find((s) => s.nombre === nombre);
    if (!prod) return;

    // Usar el hook centralizado para añadir productos
    addProduct(
      {
        id: prod.id,
        name: prod.nombre,
        price: prod.precio,
        image: prod.imagen,
        sku: prod.id,
      },
      1
    );

    setAddedName(nombre);
    setTimeout(() => setAddedName(null), 1200);
    // UX: scroll al carrito
    setTimeout(() => {
      document
        .getElementById("carrito-productos")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <main className="min-h-screen bg-[#F7F7F7] py-8 px-2 md:px-0">
      {/* Grid principal: productos y resumen de compra */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Productos */}
        <section
          id="carrito-productos"
          className="bg-[#EAEAEA] rounded-2xl p-8 shadow-md"
        >
          <h2 className="font-bold text-lg mb-4">Producto</h2>
          {cartProducts.length === 0 ? (
            <div className="text-gray-500 text-center py-16 text-lg">
              No hay productos en el carrito.
            </div>
          ) : (
            cartProducts.map((product, idx) => (
              <div
                key={idx}
                className={`mb-6 transition-all duration-300 ${
                  addedName === product.name ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <ProductCard
                  nombre={product.name}
                  imagen={product.image}
                  precio={product.price}
                  cantidad={product.quantity}
                  onQuantityChange={(cantidad) =>
                    handleQuantityChange(idx, cantidad)
                  }
                  onRemove={() => handleRemove(idx)}
                />
              </div>
            ))
          )}
        </section>
        {/* Resumen de compra */}
        <aside className="bg-[#EAEAEA] rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <h2 className="font-bold text-lg mb-4">Resumen de compra</h2>
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
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
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
      <div className="max-w-6xl mx-auto mt-8">
        <Sugerencias onAdd={handleAddSugerencia} />
      </div>
    </main>
  );
}
