"use client";
import React, { useState, useEffect } from "react";
import { stores } from "../../components/LocationsArray";

// Utilidad para obtener productos del carrito desde localStorage
function getCartProducts() {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("cart-items");
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.map((p) => ({
          id: p.id,
          name: p.nombre || p.name || "Producto",
          image: p.imagen || p.image || "/img/logo_imagiq.png",
          price: p.precio || p.price || 0,
          quantity: p.cantidad || p.quantity || 1,
        }))
      : [];
  } catch {
    return [];
  }
}

// Utilidad para formatear precios
const formatPrice = (price: number) =>
  price.toLocaleString("es-CO", { style: "currency", currency: "COP" });

export default function Step3({
  onBack,
  onContinue,
}: {
  onBack?: () => void;
  onContinue?: () => void;
}) {
  // Estado para dirección de domicilio
  const [address, setAddress] = useState("Calle 50A #52-71 Barrio Galerias");
  const [addressEdit, setAddressEdit] = useState(false);
  // Estado para buscador de tiendas
  const [storeQuery, setStoreQuery] = useState("");
  const [filteredStores, setFilteredStores] = useState(stores);
  const [selectedStore, setSelectedStore] = useState<(typeof stores)[0] | null>(
    null
  );

  useEffect(() => {
    if (storeQuery.trim() === "") {
      setFilteredStores(stores);
    } else {
      const q = storeQuery.toLowerCase();
      setFilteredStores(
        stores.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.address.toLowerCase().includes(q) ||
            s.city.toLowerCase().includes(q) ||
            (s.mall && s.mall.toLowerCase().includes(q))
        )
      );
    }
  }, [storeQuery]);

  // Recibe onBack para regresar al paso anterior
  // onBack?: () => void
  // Estado para productos del carrito
  const [cartProducts, setCartProducts] = useState(getCartProducts());
  // Estado para descuento aplicado
  const [appliedDiscount, setAppliedDiscount] = useState(() => {
    if (typeof window !== "undefined") {
      const d = localStorage.getItem("applied-discount");
      return d ? Number(d) : 0;
    }
    return 0;
  });
  // Estado para método de entrega
  const [deliveryMethod, setDeliveryMethod] = useState("domicilio");

  // Sincronizar productos y descuento
  useEffect(() => {
    const syncCart = () => setCartProducts(getCartProducts());
    window.addEventListener("storage", syncCart);
    syncCart();
    return () => window.removeEventListener("storage", syncCart);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const d = localStorage.getItem("applied-discount");
      setAppliedDiscount(d ? Number(d) : 0);
    }
  }, []);

  // Calcular totales
  const subtotal = cartProducts.reduce((acc, p) => {
    const price = Number(p.price);
    const quantity = Number(p.quantity);
    const safePrice = isNaN(price) ? 0 : price;
    const safeQuantity = isNaN(quantity) ? 1 : quantity;
    return acc + safePrice * safeQuantity;
  }, 0);
  const envio = 20000;
  const safeSubtotal = isNaN(subtotal) ? 0 : subtotal;
  const safeDiscount = isNaN(appliedDiscount) ? 0 : appliedDiscount;
  const impuestos = Math.round(safeSubtotal * 0.09);
  const total = safeSubtotal - safeDiscount + envio;

  // UX: Navegación al siguiente paso
  // Si se recibe onContinue, avanzar en el flujo local
  const handleContinue = () => {
    console.log("Step3: handleContinue called", {
      deliveryMethod,
      address,
      selectedStore,
    });
    if (typeof onContinue === "function") {
      onContinue();
    }
  };

  // Validar si se puede continuar
  const canContinue =
    (deliveryMethod === "domicilio" && address.trim().length > 0) ||
    (deliveryMethod === "tienda" && selectedStore);
  useEffect(() => {
    console.log("Step3: canContinue", canContinue, {
      deliveryMethod,
      address,
      selectedStore,
    });
  }, [canContinue, deliveryMethod, address, selectedStore]);

  useEffect(() => {
    // Solo autocompletar si el usuario selecciona "domicilio" y hay dirección guardada
    if (deliveryMethod === "domicilio" && typeof window !== "undefined") {
      const saved = localStorage.getItem("checkout-address");
      if (saved && saved.length > 0 && address !== saved) {
        setAddress(saved);
      }
    }
  }, [deliveryMethod, address]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center py-8 px-2 md:px-0">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Forma de entrega */}
        <div className="col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-2xl p-8 shadow flex flex-col gap-8">
            <div>
              <h2 className="text-lg font-bold mb-4">
                Revisa la forma de entrega
              </h2>
              {/* Feedback UX si no se puede continuar */}
              {!canContinue && (
                <div className="text-xs text-red-500 mb-2">
                  {deliveryMethod === "domicilio"
                    ? "Por favor ingresa una dirección válida para continuar."
                    : "Selecciona una tienda para continuar."}
                </div>
              )}
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="radio"
                  id="domicilio"
                  name="delivery"
                  checked={deliveryMethod === "domicilio"}
                  onChange={() => setDeliveryMethod("domicilio")}
                  className="accent-blue-600 w-5 h-5"
                />
                <label
                  htmlFor="domicilio"
                  className="font-semibold text-base flex items-center gap-2"
                >
                  Enviar a domicilio
                  <span className="inline-block">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <rect width="24" height="24" rx="6" fill="#F3F3F3" />
                      <path
                        d="M7 17V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8"
                        stroke="#222"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 17h10"
                        stroke="#222"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </label>
              </div>
              {deliveryMethod === "domicilio" && (
                <div className="ml-8 mt-2">
                  {!addressEdit ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 text-sm">{address}</span>
                      <button
                        type="button"
                        className="text-blue-600 text-xs underline ml-2"
                        onClick={() => setAddressEdit(true)}
                      >
                        Modificar domicilio o elegir otro
                      </button>
                    </div>
                  ) : (
                    <form
                      className="flex gap-2 items-center"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setAddressEdit(false);
                      }}
                    >
                      <input
                        type="text"
                        className="border rounded-lg px-3 py-2 text-sm flex-1"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Escribe tu domicilio..."
                        autoFocus
                        required
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 text-xs ml-2"
                        onClick={() => setAddressEdit(false)}
                      >
                        Cancelar
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold mb-4">Recoger en tienda</h2>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="radio"
                  id="tienda"
                  name="delivery"
                  checked={deliveryMethod === "tienda"}
                  onChange={() => setDeliveryMethod("tienda")}
                  className="accent-blue-600 w-5 h-5"
                />
                <label
                  htmlFor="tienda"
                  className="font-semibold text-base flex items-center gap-2"
                >
                  Recoger en tienda
                  <span className="inline-block">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <rect width="24" height="24" rx="6" fill="#F3F3F3" />
                      <path
                        d="M7 17V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8"
                        stroke="#222"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 17h10"
                        stroke="#222"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </label>
              </div>
              {deliveryMethod === "tienda" && (
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
                    placeholder="Buscar tienda por nombre, ciudad o centro comercial..."
                    value={storeQuery}
                    onChange={(e) => setStoreQuery(e.target.value)}
                  />
                  <div className="max-h-48 overflow-y-auto border rounded-lg bg-white shadow">
                    {filteredStores.length === 0 ? (
                      <div className="p-4 text-gray-500 text-sm">
                        No se encontraron tiendas.
                      </div>
                    ) : (
                      filteredStores.map((store) => (
                        <div
                          key={store.id}
                          className={`p-3 cursor-pointer hover:bg-blue-50 ${
                            selectedStore?.id === store.id ? "bg-blue-100" : ""
                          }`}
                          onClick={() => setSelectedStore(store)}
                        >
                          <div className="font-semibold text-sm">
                            {store.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {store.address} {store.city}
                          </div>
                          {store.mall && (
                            <div className="text-xs text-gray-400">
                              {store.mall}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  {selectedStore && (
                    <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                      <div className="font-bold text-base mb-1">
                        {selectedStore.name}
                      </div>
                      <div className="text-sm">
                        {selectedStore.address}, {selectedStore.city}
                      </div>
                      {selectedStore.mall && (
                        <div className="text-xs text-gray-500">
                          {selectedStore.mall}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Tel: {selectedStore.phone}
                      </div>
                      <div className="text-xs text-gray-500">
                        Horario: {selectedStore.hours}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Resumen de compra */}
        <aside className="bg-white rounded-2xl p-8 shadow flex flex-col gap-6 h-fit justify-between min-h-[480px] sticky top-8">
          <h2 className="font-bold text-lg mb-4">Resumen de compra</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-base">
              <span>
                Productos (
                {(() => {
                  const val = cartProducts.reduce((acc, p) => {
                    const qty = Number(p.quantity);
                    return acc + (isNaN(qty) ? 1 : qty);
                  }, 0);
                  return isNaN(val) ? "0" : String(val);
                })()}
                )
              </span>
              <span className="font-bold">
                {safeSubtotal > 0 ? String(formatPrice(safeSubtotal)) : "0"}
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span>Descuento</span>
              <span className="text-red-600">
                - {safeDiscount > 0 ? String(formatPrice(safeDiscount)) : "0"}
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span>Envío</span>
              <span>
                {typeof envio === "number" && !isNaN(envio)
                  ? String(formatPrice(envio))
                  : "0"}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2">
              <span>Total</span>
              <span>{total > 0 ? String(formatPrice(total)) : "0"}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Incluye {impuestos > 0 ? String(formatPrice(impuestos)) : "0"} de
              impuestos
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            {/* Botón principal para continuar el pago */}
            <button
              className={`w-full font-bold py-3 rounded-lg text-base transition shadow-lg ${
                !canContinue ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{
                backgroundColor: "#b2e2f2", // Color solicitado
                color: "#222", // Texto oscuro para mejor contraste
                fontFamily: "Samsung Sharp Sans, sans-serif",
              }}
              onClick={canContinue ? handleContinue : undefined}
              disabled={!canContinue}
            >
              Continuar pago
            </button>
            {/* Botón para volver al paso anterior */}
            {typeof onBack === "function" && (
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 text-[#0074E8] font-semibold text-base py-2 rounded-lg bg-white border border-[#e5e5e5] shadow-sm hover:bg-[#e6f3ff] hover:text-[#005bb5] focus:outline-none focus:ring-2 focus:ring-[#0074E8] transition-all duration-150"
                onClick={onBack}
              >
                <span className="text-lg">←</span>
                <span>Volver</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
