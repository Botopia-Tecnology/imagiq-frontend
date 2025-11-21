"use client";
/**
 * Paso 2 del carrito de compras: Datos de envío y pago
 * Layout profesional, estilo Samsung, código limpio y escalable
 */
import React, { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { safeGetLocalStorage } from "@/lib/localStorage";
import { apiPost } from "@/lib/api-client";
import { tradeInEndpoints } from "@/lib/api";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import {
  validateTradeInProducts,
  getTradeInValidationMessage,
} from "./utils/validateTradeIn";
import { toast } from "sonner";

interface GuestUserResponse {
  address: {
    id?: string;
    linea_uno: string;
    ciudad: string;
  };
  user: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    numero_documento: string;
    telefono: string;
  };
}

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
  // Usar el hook centralizado useCart
  const { products: cartProducts } = useCart();
  const router = useRouter();
  // Recibe onContinue para avanzar al siguiente paso
  // onBack ya existe
  // onContinue?: () => void
  // Estado para formulario de invitado
  // Formulario de invitado: incluye dirección línea uno y ciudad
  const [guestForm, setGuestForm] = useState({
    email: "",
    nombre: "",
    apellido: "",
    cedula: "",
    celular: "",
    tipo_documento: "",
  });

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
    tipo_documento: "",
  });

  // Trade-In state management
  const [tradeInData, setTradeInData] = useState<{
    completed: boolean;
    deviceName: string;
    value: number;
  } | null>(null);

  // --- Validación simplificada y centralizada ---
  // Filtros de seguridad por campo
  const filters = {
    cedula: (v: string) => v.replace(/[^0-9]/g, ""),
    celular: (v: string) => v.replace(/[^0-9]/g, ""),
    nombre: (v: string) => v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""),
    apellido: (v: string) => v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""),
    email: (v: string) => v.replace(/\s/g, ""),
    tipo_documento: (v: string) => v, // No filter needed for select
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
    tipo_documento: (v: string) => {
      if (!v) return "Por favor selecciona el tipo de documento.";
      if (!["CC", "CE", "NIT", "PP"].includes(v))
        return "Tipo de documento inválido.";
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
      tipo_documento: "",
    };
    Object.keys(errors).forEach((key) => {
      // @ts-expect-error Type mismatch due to dynamic key access; all keys are validated and safe here
      errors[key] = validators[key](form[key].trim());
    });
    return errors;
  }

  // Manejar cambios en el formulario invitado
  const handleGuestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
  const handleGuestSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setError("");
    const errors = validateFields(guestForm);
    setFieldErrors(errors);
    if (Object.values(errors).some((err) => err)) {
      setError(
        "Por favor completa todos los campos obligatorios correctamente."
      );
      return;
    }

    // Guardar dirección y cédula en localStorage para autocompletar en Step3 y Step4
    if (typeof window !== "undefined") {
      localStorage.setItem("checkout-document", guestForm.cedula);
    }

    // Guardar en localStorage bajo la clave 'guest-payment-info'
    try {
      const data = await apiPost<GuestUserResponse>("/api/users/guest/new", {
        guestInfo: {
          nombre: guestForm.nombre,
          apellido: guestForm.apellido,
          email: guestForm.email,
          numero_documento: guestForm.cedula,
          telefono: guestForm.celular,
          tipo_documento: guestForm.tipo_documento,
        },
      });
      localStorage.setItem("checkout-address", JSON.stringify(data.address));
      localStorage.setItem("imagiq_user", JSON.stringify(data.user));
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
      setTimeout(() => {
        if (typeof onContinue === "function") {
          onContinue();
        }
      }, 800);
    }, 1200);
  };

  // Estado para validación de Trade-In
  const [tradeInValidation, setTradeInValidation] = React.useState<{
    isValid: boolean;
    productsWithoutRetoma: typeof cartProducts;
    hasMultipleProducts: boolean;
    errorMessage?: string;
  }>({ isValid: true, productsWithoutRetoma: [], hasMultipleProducts: false });

  // Validar Trade-In cuando cambian los productos
  React.useEffect(() => {
    const validation = validateTradeInProducts(cartProducts);
    setTradeInValidation(validation);

    // Si el producto ya no aplica (indRetoma === 0), quitar banner inmediatamente y mostrar notificación
    if (
      !validation.isValid &&
      validation.errorMessage &&
      validation.errorMessage.includes("Te removimos")
    ) {
      // Limpiar localStorage inmediatamente
      localStorage.removeItem("imagiq_trade_in");

      // Mostrar notificación toast
      toast.error("Cupón removido", {
        description:
          "El producto seleccionado ya no aplica para el beneficio Estreno y Entrego",
        duration: 5000,
      });
    }
  }, [cartProducts]);

  // Wrapper function to handle both form validation and continue action
  const handleContinue = async () => {
    // Validar Trade-In antes de continuar
    const validation = validateTradeInProducts(cartProducts);
    if (!validation.isValid) {
      setError(getTradeInValidationMessage(validation));
      return;
    }

    if (!isGuestFormValid) {
      setError("Por favor completa todos los campos obligatorios.");
      const newFieldErrors: typeof fieldErrors = {
        email: guestForm.email.trim() ? "" : "Este campo es obligatorio",
        nombre: guestForm.nombre.trim() ? "" : "Este campo es obligatorio",
        apellido: guestForm.apellido.trim() ? "" : "Este campo es obligatorio",
        cedula: guestForm.cedula.trim() ? "" : "Este campo es obligatorio",
        celular: guestForm.celular.trim() ? "" : "Este campo es obligatorio",
        tipo_documento: guestForm.tipo_documento.trim()
          ? ""
          : "Este campo es obligatorio",
      };
      setFieldErrors(newFieldErrors);
      return;
    }
    await handleGuestSubmit();
  };
  useEffect(() => {
    const haveAccount = safeGetLocalStorage<{ email?: string }>(
      "imagiq_user",
      {}
    );
    console.log(haveAccount);
    if (haveAccount.email) {
      router.push("/carrito/step3");
    }

    // Load Trade-In data from localStorage
    const storedTradeIn = localStorage.getItem("imagiq_trade_in");
    if (storedTradeIn) {
      try {
        const parsed = JSON.parse(storedTradeIn);
        if (parsed.completed) {
          setTradeInData(parsed);
        }
      } catch (error) {
        console.error("Error parsing Trade-In data:", error);
      }
    }
  }, [router]);

  // Handle Trade-In removal
  const handleRemoveTradeIn = () => {
    localStorage.removeItem("imagiq_trade_in");
    setTradeInData(null);
  };

  // Ref para rastrear SKUs que ya fueron verificados (evita loops infinitos)
  const verifiedSkusRef = React.useRef<Set<string>>(new Set());

  // Verificar indRetoma para cada producto único en segundo plano (sin mostrar nada en UI)
  useEffect(() => {
    if (cartProducts.length === 0) return;

    const verifyTradeIn = async () => {
      // Obtener SKUs únicos (sin duplicados)
      const uniqueSkus = Array.from(new Set(cartProducts.map((p) => p.sku)));

      // Filtrar productos que necesitan verificación (solo si no tienen indRetoma definido Y no fueron verificados antes)
      const productsToVerify = uniqueSkus.filter((sku) => {
        const product = cartProducts.find((p) => p.sku === sku);
        const needsVerification = product && product.indRetoma === undefined;
        const notVerifiedYet = !verifiedSkusRef.current.has(sku);
        return needsVerification && notVerifiedYet;
      });

      if (productsToVerify.length === 0) return;

      // Verificar cada SKU único en segundo plano
      for (let i = 0; i < productsToVerify.length; i++) {
        const sku = productsToVerify[i];

        // Agregar delay entre peticiones (excepto la primera)
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        try {
          const response = await tradeInEndpoints.checkSkuForTradeIn({ sku });
          if (!response.success || !response.data) {
            throw new Error("Error al verificar trade-in");
          }
          const result = response.data;
          const indRetoma = result.indRetoma ?? (result.aplica ? 1 : 0);

          // Marcar SKU como verificado ANTES de actualizar localStorage (evita loop)
          verifiedSkusRef.current.add(sku);

          // Actualizar localStorage con el resultado
          const storedProducts = JSON.parse(
            localStorage.getItem("cart-items") || "[]"
          ) as Array<Record<string, unknown>>;
          const updatedProducts = storedProducts.map((p) => {
            if (p.sku === sku) {
              return { ...p, indRetoma };
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
        } catch (error) {
          // También marcar como verificado en caso de error para no reintentar infinitamente
          verifiedSkusRef.current.add(sku);
          // Silenciar errores, solo log en consola
          console.error(
            `❌ Error al verificar trade-in para SKU ${sku}:`,
            error
          );
        }
      }
    };

    verifyTradeIn();
  }, [cartProducts]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2 md:px-0 relative z-10">
      {/* Fondo blanco sólido para cubrir cualquier animación de fondo */}
      <div className="fixed inset-0 bg-white -z-10" />
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
              <button
                onClick={() => router.push("/login")}
                className="bg-[#333] text-white font-bold py-3 px-8 rounded-lg text-base hover:bg-[#222] transition cursor-pointer"
              >
                Iniciar sesión
              </button>
              <span className="text-gray-600">No tienes cuenta aún?</span>
              <a
                href="/login/create-account"
                className="text-[#0074E8] font-semibold underline"
              >
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

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Tipo de Documento *
                </label>
                <select
                  id="tipo_documento"
                  name="tipo_documento"
                  className={`input-samsung ${
                    fieldErrors.tipo_documento ? "border-red-500" : ""
                  }`}
                  value={guestForm.tipo_documento}
                  onChange={handleGuestChange}
                  required
                  disabled={loading || success}
                  autoComplete="off"
                >
                  <option value="">-- Selecciona --</option>
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="NIT">NIT</option>
                  <option value="PP">Pasaporte (PP)</option>
                </select>
                {fieldErrors.tipo_documento && (
                  <span
                    className="text-red-500 text-xs"
                    style={{ marginTop: 2 }}
                  >
                    {fieldErrors.tipo_documento}
                  </span>
                )}
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
        {/* Resumen de compra con Step4OrderSummary */}
        <div className="flex flex-col gap-4">
          <Step4OrderSummary
            onFinishPayment={handleContinue}
            onBack={onBack}
            buttonText={loading ? "Procesando..." : "Continuar pago"}
            disabled={
              loading ||
              success ||
              !isGuestFormValid ||
              !tradeInValidation.isValid
            }
            isProcessing={loading}
          />

          {/* Banner de Trade-In - Debajo del resumen */}
          {tradeInData?.completed && (
            <TradeInCompletedSummary
              deviceName={tradeInData.deviceName}
              tradeInValue={tradeInData.value}
              onEdit={handleRemoveTradeIn}
              validationError={
                !tradeInValidation.isValid
                  ? getTradeInValidationMessage(tradeInValidation)
                  : undefined
              }
            />
          )}

          {/* Mensajes de error/success */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              ¡Compra realizada como invitado!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
