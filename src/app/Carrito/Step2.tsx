"use client";
/**
 * Paso 2 del carrito de compras: Datos de envío y pago
 * Layout profesional, estilo Samsung, código limpio y escalable
 */
import React, { useState } from "react";
// Eliminado: CountryCodeSelect

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
  });
  // Eliminado: indicativo
  const appliedDiscount = 0;

  // Estado para validación y UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  // Estado para errores por campo
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    nombre: "",
    apellido: "",
    cedula: "",
    celular: "",
  });

  // Calcular totales
  const subtotal = cartProducts.reduce((acc, p) => {
    const price = Number(p.price);
    const quantity = Number(p.quantity);
    return acc + (isNaN(price) ? 0 : price) * (isNaN(quantity) ? 1 : quantity);
  }, 0);
  const envio = 20000;
  const impuestos = isNaN(subtotal) ? 0 : Math.round(subtotal * 0.18);
  const total = isNaN(subtotal) ? 0 : subtotal - appliedDiscount + envio;

  // --- Validación simplificada y centralizada ---
  // Filtros de seguridad por campo
  const filters = {
    cedula: (v: string) => v.replace(/[^0-9]/g, ""),
    celular: (v: string) => v.replace(/[^0-9]/g, ""),
    nombre: (v: string) => v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""),
    apellido: (v: string) => v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""),
    email: (v: string) => v.replace(/\s/g, ""),
  };

  // Validadores por campo
  const validators = {
    email: (v: string) => {
      if (!v) return "Por favor escribe tu correo electrónico.";
      if (!/^([\w-.]+)@([\w-]+\.)+[\w-]{2,4}$/.test(v))
        return "El formato del correo electrónico no es válido. Ejemplo: usuario@dominio.com.";
      return "";
    },
    nombre: (v: string) => {
      if (!v) return "Por favor escribe tu nombre.";
      if (v.length < 2) return "El nombre debe tener al menos 2 letras.";
      return "";
    },
    apellido: (v: string) => {
      if (!v) return "Por favor escribe tu apellido.";
      if (v.length < 2) return "El apellido debe tener al menos 2 letras.";
      return "";
    },
    cedula: (v: string) => {
      if (!v) return "Por favor escribe tu número de cédula.";
      if (v.length < 6 || v.length > 10)
        return "La cédula debe tener entre 6 y 10 números.";
      if (!/^([1-9][0-9]{5,9})$/.test(v))
        return "La cédula debe empezar con un número diferente de cero.";
      return "";
    },
    celular: (v: string) => {
      if (!v) return "Por favor escribe tu número de celular.";
      if (v.length !== 10)
        return "El celular debe tener exactamente 10 números.";
      if (!/^3[0-9]{9}$/.test(v))
        return "El celular colombiano debe empezar con '3' y tener 10 dígitos.";
      return "";
    },
  };

  // Validar todos los campos y devolver errores
  function validateFields(form: typeof guestForm) {
    const errors: typeof fieldErrors = {
      email: "",
      nombre: "",
      apellido: "",
      cedula: "",
      celular: "",
    };
    Object.keys(errors).forEach((key) => {
      // @ts-expect-error Type mismatch due to dynamic key access; all keys are validated and safe here
      errors[key] = validators[key](form[key].trim());
    });
    return errors;
  }

  // Manejar cambios en el formulario invitado
  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const filter = filters[name as keyof typeof filters];
    const newValue = filter ? filter(value) : value;
    const newForm = { ...guestForm, [name]: newValue };
    setGuestForm(newForm);
    setFieldErrors(validateFields(newForm));
  };

  // Aplicar descuento si el código es válido
  // (Eliminado: handleDiscountApply no se usa)

  // Validar formulario invitado
  const isGuestFormValid = Object.values(validateFields(guestForm)).every(
    (err) => !err
  );

  /**
   * Maneja el envío del formulario de invitado.
   * Valida los campos, guarda la información en localStorage y muestra feedback UX.
   */
  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const errors = validateFields(guestForm);
    setFieldErrors(errors);
    if (Object.values(errors).some((err) => err)) {
      setError(
        "Por favor completa todos los campos obligatorios correctamente."
      );
      return;
    }
    // Estructura de datos para guardar en localStorage
    const guestPaymentInfo = {
      email: guestForm.email.trim(),
      nombre: guestForm.nombre.trim(),
      apellido: guestForm.apellido.trim(),
      cedula: guestForm.cedula.trim(),
      celular: guestForm.celular.trim(),
      fecha: new Date().toISOString(),
      carrito: cartProducts.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        quantity: p.quantity,
      })),
      total,
      envio,
      impuestos,
      appliedDiscount,
    };
    // Guardar en localStorage bajo la clave 'guest-payment-info'
    try {
      localStorage.setItem(
        "guest-payment-info",
        JSON.stringify(guestPaymentInfo)
      );
    } catch {
      setError(
        "No se pudo guardar la información localmente. Intenta de nuevo."
      );
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
              <div className="flex flex-col gap-1">
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico (ejemplo: usuario@dominio.com)"
                  className={`input-samsung ${
                    fieldErrors.email ? "border-red-500" : ""
                  }`}
                  value={guestForm.email}
                  onChange={handleGuestChange}
                  required
                  disabled={loading || success}
                  autoFocus
                  inputMode="email"
                  autoComplete="email"
                  pattern="^[\w-.]+@[\w-]+\.[\w-]{2,4}$"
                />
                {fieldErrors.email && (
                  <span
                    className="text-red-500 text-xs"
                    style={{ marginTop: 2 }}
                  >
                    {fieldErrors.email}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre (solo letras)"
                    className={`input-samsung ${
                      fieldErrors.nombre ? "border-red-500" : ""
                    }`}
                    value={guestForm.nombre}
                    onChange={handleGuestChange}
                    required
                    disabled={loading || success}
                    inputMode="text"
                    autoComplete="given-name"
                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  />
                  {fieldErrors.nombre && (
                    <span
                      className="text-red-500 text-xs"
                      style={{ marginTop: 2 }}
                    >
                      {fieldErrors.nombre}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido (solo letras)"
                    className={`input-samsung ${
                      fieldErrors.apellido ? "border-red-500" : ""
                    }`}
                    value={guestForm.apellido}
                    onChange={handleGuestChange}
                    required
                    disabled={loading || success}
                    inputMode="text"
                    autoComplete="family-name"
                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  />
                  {fieldErrors.apellido && (
                    <span
                      className="text-red-500 text-xs"
                      style={{ marginTop: 2 }}
                    >
                      {fieldErrors.apellido}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6,10}"
                    name="cedula"
                    placeholder="No. de Cédula (6 a 10 números, sin puntos ni espacios)"
                    className={`input-samsung ${
                      fieldErrors.cedula ? "border-red-500" : ""
                    }`}
                    value={guestForm.cedula}
                    onChange={handleGuestChange}
                    required
                    disabled={loading || success}
                    maxLength={10}
                    autoComplete="off"
                  />
                  {fieldErrors.cedula && (
                    <span
                      className="text-red-500 text-xs"
                      style={{ marginTop: 2 }}
                    >
                      {fieldErrors.cedula}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="3[0-9]{9}"
                      name="celular"
                      placeholder="Celular colombiano (10 números, empieza con 3)"
                      className={`input-samsung ${
                        fieldErrors.celular ? "border-red-500" : ""
                      }`}
                      value={guestForm.celular}
                      onChange={handleGuestChange}
                      required
                      disabled={loading || success}
                      style={{ minWidth: 120 }}
                      maxLength={10}
                      autoComplete="tel"
                    />
                  </div>
                  {fieldErrors.celular && (
                    <span
                      className="text-red-500 text-xs"
                      style={{ marginTop: 2 }}
                    >
                      {fieldErrors.celular}
                    </span>
                  )}
                </div>
              </div>
              {/* Mensaje de error general debajo del botón principal */}
              {error && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {error}
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
                .border-red-500 {
                  border-color: #ef4444 !important;
                }
              `}</style>
            </form>
          </div>
        </div>
        {/* Resumen de compra dinámico */}
        <div className="bg-[#F3F3F3] rounded-xl p-8 shadow flex flex-col gap-6 h-fit justify-between min-h-[480px] sticky top-8">
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
                // Si no es válido, mostrar error general
                if (!isGuestFormValid) {
                  setError("Por favor completa todos los campos obligatorios.");
                  // Marcar los campos vacíos
                  const newFieldErrors: typeof fieldErrors = {
                    email: guestForm.email.trim()
                      ? ""
                      : "Este campo es obligatorio",
                    nombre: guestForm.nombre.trim()
                      ? ""
                      : "Este campo es obligatorio",
                    apellido: guestForm.apellido.trim()
                      ? ""
                      : "Este campo es obligatorio",
                    cedula: guestForm.cedula.trim()
                      ? ""
                      : "Este campo es obligatorio",
                    celular: guestForm.celular.trim()
                      ? ""
                      : "Este campo es obligatorio",
                  };
                  setFieldErrors(newFieldErrors);
                  return;
                }
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
              disabled={loading || success}
              aria-disabled={loading || success}
            >
              {loading ? "Procesando..." : "Continuar pago"}
            </button>
            {onBack && (
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 text-[#0074E8] font-semibold text-base py-2 rounded-lg bg-white border border-[#e5e5e5] shadow-sm hover:bg-[#e6f3ff] hover:text-[#005bb5] focus:outline-none focus:ring-2 focus:ring-[#0074E8] transition-all duration-150"
                onClick={onBack}
                disabled={loading}
                aria-disabled={loading}
              >
                <span className="text-lg">←</span>
                <span>Volver al paso anterior</span>
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
