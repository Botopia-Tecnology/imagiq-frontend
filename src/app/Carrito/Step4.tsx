"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const formatPrice = (price: number) =>
  price.toLocaleString("es-CO", { style: "currency", currency: "COP" });

export default function Step4({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
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
  // Estado para método de pago
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  // Estado para datos de tarjeta
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    docType: "C.C.",
    docNumber: "",
    installments: "",
  });
  // Estado para facturación
  const [billingType, setBillingType] = useState("");
  // Estado para aceptar políticas
  const [accepted, setAccepted] = useState(false);
  // Estado para guardar info
  const [saveInfo, setSaveInfo] = useState(false);

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
  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) return;
    // Aquí podrías procesar el pago y mostrar confirmación
    router.push("/carrito/confirmacion");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center py-8 px-2 md:px-0">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de pago */}
        <form
          className="col-span-2 flex flex-col gap-8 bg-white rounded-2xl p-8 shadow"
          onSubmit={handleFinish}
        >
          <div>
            <h2 className="text-lg font-bold mb-4">Metodo de pago</h2>
            {/* Métodos de pago */}
            <div className="flex flex-col gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "tarjeta"}
                  onChange={() => setPaymentMethod("tarjeta")}
                  className="accent-blue-600 w-5 h-5"
                />
                <span>Envío a domicilio</span>
                <span className="flex gap-1 ml-2">
                  {/* Logos tarjetas */}
                  <img src="/img/logo_imagiq.png" alt="Visa" className="h-5" />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                    alt="Mastercard"
                    className="h-5"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Amex-logo.png"
                    alt="Amex"
                    className="h-5"
                  />
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "pse"}
                  onChange={() => setPaymentMethod("pse")}
                  className="accent-blue-600 w-5 h-5"
                />
                <span>PSE y billetera Mercado Pago</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "add"}
                  onChange={() => setPaymentMethod("add")}
                  className="accent-blue-600 w-5 h-5"
                />
                <span>Adelanta - Paga después</span>
                <span className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                  Addi
                </span>
              </label>
            </div>
            {/* Campos de tarjeta si corresponde */}
            {paymentMethod === "tarjeta" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  className="bg-gray-100 rounded-lg px-3 py-2 text-sm"
                  placeholder="Número de tarjeta"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="bg-gray-100 rounded-lg px-3 py-2 text-sm w-1/2"
                    placeholder="Fecha de vencimiento (MM/AA)"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard({ ...card, expiry: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    className="bg-gray-100 rounded-lg px-3 py-2 text-sm w-1/2"
                    placeholder="Código de seguridad"
                    value={card.cvc}
                    onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                    required
                  />
                </div>
                <input
                  type="text"
                  className="bg-gray-100 rounded-lg px-3 py-2 text-sm"
                  placeholder="Nombre del titular"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <select
                    className="bg-gray-100 rounded-lg px-3 py-2 text-sm w-1/2"
                    value={card.docType}
                    onChange={(e) =>
                      setCard({ ...card, docType: e.target.value })
                    }
                  >
                    <option value="C.C.">C.C.</option>
                    <option value="C.E.">C.E.</option>
                    <option value="NIT">NIT</option>
                  </select>
                  <input
                    type="text"
                    className="bg-gray-100 rounded-lg px-3 py-2 text-sm w-1/2"
                    placeholder="Número de documento"
                    value={card.docNumber}
                    onChange={(e) =>
                      setCard({ ...card, docNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <input
                  type="text"
                  className="bg-gray-100 rounded-lg px-3 py-2 text-sm"
                  placeholder="Cuotas"
                  value={card.installments}
                  onChange={(e) =>
                    setCard({ ...card, installments: e.target.value })
                  }
                />
              </div>
            )}
            {/* Info cuotas */}
            <div className="text-xs text-gray-500 mb-2">
              Si hay intereses, se calcularán y aparecerán en la tienda
            </div>
          </div>
          {/* Guardar info */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-sm">
              ¿Quieres guardar esta información para tu próxima compra?
            </span>
          </div>
          {/* Datos de facturación */}
          <div>
            <h2 className="text-lg font-bold mb-2">Datos de facturación</h2>
            <select
              className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm mb-2"
              value={billingType}
              onChange={(e) => setBillingType(e.target.value)}
              required
            >
              <option value="">Selecciona un tipo de facturación</option>
              <option value="personal">Personal</option>
              <option value="empresa">Empresa</option>
            </select>
          </div>
          {/* Políticas */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="accent-blue-600 w-4 h-4"
              required
            />
            <span className="text-sm">
              He leído y acepto las políticas de privacidad
            </span>
          </div>
          <button
            type="submit"
            className={`w-full bg-[#0074E8] text-white font-bold py-3 rounded-lg text-base mt-2 hover:bg-blue-700 transition ${
              !accepted ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!accepted}
          >
            Finalizar pago
          </button>
          {typeof onBack === "function" && (
            <button
              type="button"
              className="w-full text-[#0074E8] underline text-sm mt-2"
              onClick={onBack}
            >
              ← Volver
            </button>
          )}
        </form>
        {/* Resumen de compra */}
        <aside className="bg-white rounded-2xl p-8 shadow flex flex-col gap-6 h-fit justify-between min-h-[480px]">
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
        </aside>
      </div>
    </div>
  );
}
