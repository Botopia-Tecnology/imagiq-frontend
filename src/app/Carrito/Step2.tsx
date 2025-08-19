"use client";
/**
 * Paso 2 del carrito de compras: Datos de envío y pago
 * Layout profesional, estilo Samsung, código limpio y escalable
 */
import React, { useState } from "react";

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

/**
 * Paso 2 del carrito: recibe onBack para volver al paso anterior
 */
export default function Step2({
  onBack,
  onContinue,
}: {
  onBack?: () => void;
  onContinue?: () => void;
}) {
  // Estado para productos del carrito
  const [cartProducts, setCartProducts] = useState(getCartProducts());

  // Sincronizar productos del carrito al montar y cuando cambie el storage
  React.useEffect(() => {
    const syncCart = () => setCartProducts(getCartProducts());
    window.addEventListener("storage", syncCart);
    syncCart();
    return () => window.removeEventListener("storage", syncCart);
  }, []);
  // Recibe onContinue para avanzar al siguiente paso
  // onBack ya existe
  // onContinue?: () => void
  // Estado para formulario de invitado
  const [guestForm, setGuestForm] = useState({
    email: "",
    nombre: "",
    apellido: "",
    cedula: "",
    celular: "",
    descuento: "",
  });
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Estado para validación y UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Calcular totales
  const subtotal = cartProducts.reduce((acc, p) => {
    const price = Number(p.price);
    const quantity = Number(p.quantity);
    return acc + (isNaN(price) ? 0 : price) * (isNaN(quantity) ? 1 : quantity);
  }, 0);
  const envio = 20000;
  const impuestos = isNaN(subtotal) ? 0 : Math.round(subtotal * 0.18);
  const total = isNaN(subtotal) ? 0 : subtotal - appliedDiscount + envio;

  // Manejar cambios en el formulario invitado
  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestForm({ ...guestForm, [e.target.name]: e.target.value });
  };

  // Aplicar descuento si el código es válido
  // (Eliminado: handleDiscountApply no se usa)

  // Validar formulario invitado
  const isGuestFormValid =
    guestForm.email.trim() !== "" &&
    guestForm.nombre.trim() !== "" &&
    guestForm.apellido.trim() !== "" &&
    guestForm.cedula.trim() !== "" &&
    guestForm.celular.trim() !== "";

  // Manejar envío del formulario invitado
  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isGuestFormValid) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2 md:px-0">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Login y invitado */}
        <div className="col-span-2 flex flex-col gap-8">
          {/* Login */}
          <div className="bg-[#F3F3F3] rounded-xl p-8 shadow flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Continua con Log-in</h2>
            <p className="text-gray-700 mb-4">
              Inicia sesión para tener envío gratis, acumular puntos y más
              beneficios
            </p>
            <div className="flex gap-4 items-center">
              <button className="bg-[#333] text-white font-bold py-3 px-8 rounded-lg text-base hover:bg-[#222] transition">
                Iniciar sesión
              </button>
              <span className="text-gray-600">No tienes cuenta aún?</span>
              <a href="#" className="text-[#0074E8] font-semibold underline">
                Regístrate aquí
              </a>
            </div>
          </div>
          {/* Invitado */}
          <div className="bg-[#ECE9E6] rounded-xl p-8 flex flex-col gap-4 border border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-2">Continua como invitado</h2>
            <p className="text-gray-700 mb-4">
              ¿Estás usando el proceso de compra como invitado? Podrías estar
              perdiendo Puntos beneficios exclusivos
            </p>
            <form
              className="flex flex-col gap-4"
              autoComplete="off"
              onSubmit={handleGuestSubmit}
            >
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                className="input-samsung"
                value={guestForm.email}
                onChange={handleGuestChange}
                required
                disabled={loading || success}
                autoFocus
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  className="input-samsung"
                  value={guestForm.nombre}
                  onChange={handleGuestChange}
                  required
                  disabled={loading || success}
                />
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  className="input-samsung"
                  value={guestForm.apellido}
                  onChange={handleGuestChange}
                  required
                  disabled={loading || success}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="cedula"
                  placeholder="No. de Cédula"
                  className="input-samsung"
                  value={guestForm.cedula}
                  onChange={handleGuestChange}
                  required
                  disabled={loading || success}
                />
                <input
                  type="text"
                  name="celular"
                  placeholder="Celular"
                  className="input-samsung"
                  value={guestForm.celular}
                  onChange={handleGuestChange}
                  required
                  disabled={loading || success}
                />
              </div>
              <style jsx>{`
                .input-samsung {
                  background: #fff;
                  border-radius: 0.75rem;
                  border: 1px solid #d1d5db;
                  padding: 0.85rem 1.1rem;
                  font-size: 1rem;
                  color: #222;
                  font-family: inherit;
                  outline: none;
                  transition: border 0.2s;
                  box-shadow: none;
                }
                .input-samsung:focus {
                  border-color: #0074e8;
                }
              `}</style>
            </form>
          </div>
        </div>
        {/* Resumen de compra dinámico */}
        <div className="bg-[#F3F3F3] rounded-xl p-8 shadow flex flex-col gap-6 h-fit justify-between min-h-[480px]">
          <h2 className="text-xl font-bold mb-2">Resumen de compra</h2>
          <div className="flex flex-col gap-2 flex-1">
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
                {typeof subtotal === "number" && !isNaN(subtotal)
                  ? String(formatPrice(subtotal))
                  : "0"}
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span>Descuento</span>
              <span className="text-red-600">
                -{" "}
                {typeof appliedDiscount === "number" && !isNaN(appliedDiscount)
                  ? String(formatPrice(appliedDiscount))
                  : "0"}
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
              <span>
                {typeof total === "number" && !isNaN(total)
                  ? String(formatPrice(total))
                  : "0"}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Incluye{" "}
              {typeof impuestos === "number" && !isNaN(impuestos)
                ? String(formatPrice(impuestos))
                : "0"}{" "}
              de impuestos
            </div>
          </div>
          {/* Botones abajo, igual al diseño */}
          <div className="flex flex-col gap-2 mt-6">
            <button
              type="button"
              className="w-full bg-[#0074E8] text-white font-bold py-3 rounded-lg text-lg hover:bg-[#005bb5] transition"
              onClick={() => {
                // Simular un FormEvent real sin usar 'any'
                const fakeEvent = {
                  preventDefault: () => {},
                } as React.FormEvent<HTMLFormElement>;
                handleGuestSubmit(fakeEvent);
                if (
                  isGuestFormValid &&
                  !loading &&
                  !success &&
                  typeof onContinue === "function"
                ) {
                  setTimeout(() => onContinue(), 1200);
                }
              }}
              disabled={!isGuestFormValid || loading || success}
              aria-disabled={!isGuestFormValid || loading || success}
            >
              {loading ? "Procesando..." : "Continuar pago"}
            </button>
            {onBack && (
              <button
                type="button"
                className="w-full text-[#0074E8] underline text-sm focus:outline-none focus:ring-2 focus:ring-[#0074E8]"
                onClick={onBack}
                disabled={loading}
                aria-disabled={loading}
              >
                ← Volver al paso anterior
              </button>
            )}
          </div>
          {/* Mensajes de error/success debajo de los botones */}
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm mt-2">
              ¡Compra realizada como invitado!
            </div>
          )}
          <style jsx>{`
            .input-samsung {
              background: #fff;
              border-radius: 0.75rem;
              border: 1px solid #d1d5db;
              padding: 0.85rem 1.1rem;
              font-size: 1rem;
              color: #222;
              font-family: inherit;
              outline: none;
              transition: border 0.2s;
              box-shadow: none;
            }
            .input-samsung:focus {
              border-color: #0074e8;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
