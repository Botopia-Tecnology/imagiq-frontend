"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Sugerencias from "./Sugerencias";
// Importar los catálogos reales
import { smartphoneProducts } from "../productos/DispositivosMoviles/Smartphones";
import { refrigeradorProducts } from "../productos/Electrodomesticos/Refrigeradores";

interface CartProduct {
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  id: string;
}

// Tipo para productos en localStorage/cart-context
type RawCartProduct = {
  id: string;
  cantidad?: number;
  quantity?: number;
};

// Función para buscar producto por id en todos los catálogos
function getProductDetails(id: string) {
  // Buscar en smartphones
  const smartphone = smartphoneProducts.find((p) => p.id === id);
  if (smartphone) {
    let imagen = "/img/logo_imagiq.png";
    if (typeof smartphone.image === "string") {
      imagen = smartphone.image;
    } else if (
      smartphone.image &&
      typeof smartphone.image === "object" &&
      "src" in smartphone.image
    ) {
      imagen = smartphone.image.src;
    }
    return {
      nombre: smartphone.name,
      precio: parseInt(String(smartphone.price).replace(/[^\d]/g, "")),
      imagen,
    };
  }
  // Buscar en refrigeradores
  const refrigerador = refrigeradorProducts.find((p) => p.id === id);
  if (refrigerador) {
    let imagen = "/img/logo_imagiq.png";
    if (typeof refrigerador.image === "string") {
      imagen = refrigerador.image;
    } else if (
      refrigerador.image &&
      typeof refrigerador.image === "object" &&
      "src" in refrigerador.image
    ) {
      imagen = refrigerador.image.src;
    }
    return {
      nombre: refrigerador.name,
      precio: parseInt(String(refrigerador.price).replace(/[^\d]/g, "")),
      imagen,
    };
  }
  // Si no se encuentra, datos por defecto
  return {
    nombre: "Producto",
    precio: 0,
    imagen: "/img/logo_imagiq.png",
  };
}

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
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  console.log("Render Step1, cartProducts:", cartProducts);

  // Cargar productos desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem("cart-items");
    console.log("useEffect: localStorage cart-items:", stored);
    if (stored) {
      try {
        const parsed: RawCartProduct[] = JSON.parse(stored);
        // Buscar detalles en el catálogo dinámico (puedes obtenerlo de contexto, API, etc)
        // Aquí solo se muestran los productos que realmente están en el carrito
        const products: CartProduct[] = Array.isArray(parsed)
          ? parsed
              .filter((p) => p.id)
              .map((p) => {
                const details = getProductDetails(p.id);
                return {
                  id: p.id,
                  nombre: details.nombre,
                  precio: details.precio,
                  cantidad:
                    typeof p.cantidad === "number"
                      ? p.cantidad
                      : typeof p.quantity === "number"
                      ? p.quantity
                      : 1,
                  imagen: details.imagen,
                };
              })
          : [];
        console.log("useEffect: parsed products:", products);
        setCartProducts(products);
      } catch (err) {
        console.log("useEffect: error parsing products", err);
        setCartProducts([]);
      }
    } else {
      console.log("useEffect: no products in localStorage");
      setCartProducts([]);
    }
  }, []);

  // Calcular totales
  const subtotal: number = cartProducts.reduce(
    (acc: number, p: CartProduct) => acc + p.precio * p.cantidad,
    0
  );
  const envio: number = 0;
  const impuestos: number = Math.round(subtotal * 0.09); // ejemplo 9%
  const total: number = subtotal + envio;

  // Cambiar cantidad de producto
  const handleQuantityChange = (idx: number, cantidad: number) => {
    setCartProducts((prev) => {
      const updated = prev.map((p, i) => (i === idx ? { ...p, cantidad } : p));
      console.log("handleQuantityChange: updated products", updated);
      localStorage.setItem("cart-items", JSON.stringify(updated));
      return updated;
    });
  };

  // Eliminar producto del carrito
  const handleRemove = (idx: number) => {
    setCartProducts((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      console.log("handleRemove: updated products", updated);
      localStorage.setItem("cart-items", JSON.stringify(updated));
      return updated;
    });
  };

  // ...existing code...

  // UX: feedback visual al agregar sugerencia
  const [addedName, setAddedName] = useState<string | null>(null);
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
    setCartProducts((prev) => {
      // Si ya está, suma cantidad
      const idx = prev.findIndex((p) => p.id === prod.id);
      let updated;
      if (idx >= 0) {
        updated = prev.map((p, i) =>
          i === idx ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        updated = [
          ...prev,
          {
            id: prod.id,
            nombre: prod.nombre,
            precio: prod.precio,
            cantidad: 1,
            imagen: prod.imagen,
          },
        ];
      }
      localStorage.setItem("cart-items", JSON.stringify(updated));
      return updated;
    });
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
                  addedName === product.nombre ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <ProductCard
                  {...product}
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
                {cartProducts.reduce((acc, p) => acc + p.cantidad, 0)})
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
            <div className="flex justify-between text-sm">
              <span>Envío</span>
              <span>
                {envio === 0 ? "0" : `$ ${Number(envio).toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold mt-2">
              <span>Total</span>
              <span>$ {Number(total).toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Incluye $ {Number(impuestos).toLocaleString()} de impuestos
            </div>
          </div>
          <button
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-base mt-2 hover:bg-blue-700 transition"
            onClick={onContinue}
          >
            Continuar pago
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
