"use client";
import React, { useState, useEffect } from "react";
import { usePurchaseFlow } from "@/hooks/usePurchaseFlow";
import CheckoutSuccessOverlay from "@/app/carrito/CheckoutSuccessOverlay";
import { useRouter } from "next/navigation";
import Image from "next/image";
import visaLogo from "@/img/Carrito/visa_logo.png";
import mastercardLogo from "@/img/Carrito/masterdcard_logo.png";
import amexLogo from "@/img/Carrito/amex_logo.png";
import dinersLogo from "@/img/Carrito/logo4.png";
import addiLogo from "@/img/Carrito/addi_logo.png";

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
  // Integración animación de éxito
  const {
    loading: purchaseLoading,
    success: purchaseSuccess,
    startPayment,
    closeSuccess,
  } = usePurchaseFlow();
  // Estado local para controlar visibilidad del overlay
  const [successOpen, setSuccessOpen] = useState(false);
  // Estado para la posición del botón 'Finalizar pago'
  const [triggerPosition, setTriggerPosition] = useState<
    { x: number; y: number } | undefined
  >();
  useEffect(() => {
    setSuccessOpen(!!purchaseSuccess);
  }, [purchaseSuccess]);
  // Captura la posición del botón cuando successOpen cambia a true
  useEffect(() => {
    if (successOpen) {
      const btn = document.querySelector('[data-testid="checkout-finish-btn"]');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        setTriggerPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2 + window.scrollY,
        });
      }
    }
  }, [successOpen]);
  // Estado para error general
  const [error, setError] = useState("");
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
  // Estado para errores de campos de tarjeta
  const [cardErrors, setCardErrors] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    docNumber: "",
  });
  // Estado para error de facturación
  const [billingError, setBillingError] = useState("");
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

  // Calcular totales y cantidad de productos, siempre como string para evitar NaN en React children
  const productCount = (() => {
    const val = cartProducts.reduce((acc, p) => {
      const qty = Number(p.quantity);
      return acc + (isNaN(qty) ? 1 : qty);
    }, 0);
    return !isFinite(val) || isNaN(val) ? "0" : String(val);
  })();
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
  const impuestos = isNaN(safeSubtotal) ? 0 : Math.round(safeSubtotal * 0.09);
  const total = isNaN(safeSubtotal - safeDiscount + envio)
    ? 0
    : safeSubtotal - safeDiscount + envio;
  // Formatea un valor numérico como moneda COP, siempre seguro y nunca NaN
  function safeCurrency(val: unknown): string {
    const num = typeof val === "string" ? Number(val) : (val as number);
    if (!isFinite(num) || isNaN(num)) return "0";
    return String(formatPrice(num));
  }

  // Validar campos obligatorios de tarjeta
  function validateCardFields() {
    const errors: typeof cardErrors = {
      number: "",
      expiry: "",
      cvc: "",
      name: "",
      docNumber: "",
    };
    let hasError = false;
    if (paymentMethod === "tarjeta") {
      // Validación estricta de número de tarjeta (16 dígitos)
      if (!/^\d{16}$/.test(card.number.trim())) {
        errors.number = card.number.trim()
          ? "El número de tarjeta debe tener 16 dígitos"
          : "Número de tarjeta obligatorio";
        hasError = true;
      }
      // Fecha de vencimiento MM/AA
      if (!/^\d{2}\/\d{2}$/.test(card.expiry.trim())) {
        errors.expiry = card.expiry.trim()
          ? "Formato MM/AA requerido"
          : "Fecha de vencimiento obligatoria";
        hasError = true;
      }
      // CVC 3 o 4 dígitos
      if (!/^\d{3,4}$/.test(card.cvc.trim())) {
        errors.cvc = card.cvc.trim()
          ? "CVC debe tener 3 o 4 dígitos"
          : "Código de seguridad obligatorio";
        hasError = true;
      }
      // Nombre del titular
      if (!card.name.trim()) {
        errors.name = "Nombre del titular obligatorio";
        hasError = true;
      }
      // Documento (solo números, mínimo 6 dígitos)
      if (!/^\d{6,}$/.test(card.docNumber.trim())) {
        errors.docNumber = card.docNumber.trim()
          ? "Número de documento inválido"
          : "Número de documento obligatorio";
        hasError = true;
      }
    }
    setCardErrors(errors);
    return !hasError;
  }

  // UX: Navegación al siguiente paso
  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setBillingError("");
    setError("");
    // Validar método de pago
    if (!paymentMethod) {
      setError("Selecciona un método de pago");
      valid = false;
    }
    // Validar campos de tarjeta si corresponde
    if (paymentMethod === "tarjeta") {
      valid = validateCardFields() && valid;
    }
    // Validar facturación
    if (!billingType) {
      setBillingError("Selecciona un tipo de facturación");
      valid = false;
    }
    // Validar políticas (obligatorio)
    if (!accepted) {
      setError(
        "Debes aceptar y leer las políticas de privacidad para continuar"
      );
      valid = false;
    }
    // Si hay errores, no continuar
    if (!valid) {
      return;
    }
    // Si todo está correcto, inicia animación de compra exitosa
    startPayment();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2 md:px-0">
      {/* Overlay de éxito de compra */}
      <CheckoutSuccessOverlay
        open={purchaseSuccess}
        onClose={closeSuccess}
        reloadSrc={"/img/logo_imagiq.png"}
        autoCloseMs={2500}
        locale="es"
        className=""
        testId="checkout-success-overlay"
        triggerPosition={triggerPosition}
      />
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de pago */}
        <form
          id="checkout-form"
          className="col-span-2 flex flex-col gap-8 bg-[#F3F3F3] rounded-2xl p-8 shadow"
          onSubmit={handleFinish}
          autoComplete="off"
        >
          <div>
            <h2 className="text-[22px] font-bold mb-4">Metodo de pago</h2>
            {/* Card visual Samsung, igual a la imagen */}
            <div
              className="rounded-xl overflow-hidden mb-6"
              style={{
                boxShadow: "0 2px 8px #0001",
                background: "#F3F3F3",
                border: "1px solid #E5E5E5",
                padding: 0,
              }}
            >
              {/* Header logos y radio */}
              <div
                className="flex items-center justify-between px-6 py-3"
                style={{
                  background: "#fff",
                  borderBottom: "1px solid #E5E5E5",
                }}
              >
                <label className="flex items-center gap-2 m-0">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "tarjeta"}
                    onChange={() => setPaymentMethod("tarjeta")}
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span className="font-medium text-black">
                    Envío a domicilio
                  </span>
                </label>
                <span className="flex gap-3">
                  <Image
                    src={visaLogo}
                    alt="Visa"
                    width={40}
                    height={24}
                    style={{ objectFit: "contain" }}
                  />
                  <Image
                    src={mastercardLogo}
                    alt="Mastercard"
                    width={40}
                    height={24}
                    style={{ objectFit: "contain" }}
                  />
                  <Image
                    src={amexLogo}
                    alt="Amex"
                    width={40}
                    height={24}
                    style={{ objectFit: "contain" }}
                  />
                  <Image
                    src={dinersLogo}
                    alt="Diners"
                    width={40}
                    height={24}
                    style={{ objectFit: "contain" }}
                  />
                </span>
              </div>
              {/* Campos tarjeta */}
              {paymentMethod === "tarjeta" && (
                <div
                  className="px-6 pt-4 pb-2 flex flex-col gap-3"
                  style={{ background: "#F3F3F3" }}
                >
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${
                        cardErrors.number ? "border-red-500" : ""
                      }`}
                      placeholder="Número de tarjeta"
                      value={card.number}
                      onChange={(e) => {
                        setCard({ ...card, number: e.target.value });
                        setCardErrors((prev) => ({ ...prev, number: "" }));
                      }}
                      required
                    />
                    {cardErrors.number && (
                      <span
                        className="text-red-500 text-xs"
                        style={{ marginTop: 2 }}
                      >
                        {cardErrors.number}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1 w-1/2">
                      <input
                        type="text"
                        className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${
                          cardErrors.expiry ? "border-red-500" : ""
                        }`}
                        placeholder="Fecha de vencimiento (MM/AA)"
                        value={card.expiry}
                        onChange={(e) => {
                          setCard({ ...card, expiry: e.target.value });
                          setCardErrors((prev) => ({ ...prev, expiry: "" }));
                        }}
                        required
                      />
                      {cardErrors.expiry && (
                        <span
                          className="text-red-500 text-xs"
                          style={{ marginTop: 2 }}
                        >
                          {cardErrors.expiry}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                      <input
                        type="text"
                        className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${
                          cardErrors.cvc ? "border-red-500" : ""
                        }`}
                        placeholder="Codigo de seguridad"
                        value={card.cvc}
                        onChange={(e) => {
                          setCard({ ...card, cvc: e.target.value });
                          setCardErrors((prev) => ({ ...prev, cvc: "" }));
                        }}
                        required
                      />
                      {cardErrors.cvc && (
                        <span
                          className="text-red-500 text-xs"
                          style={{ marginTop: 2 }}
                        >
                          {cardErrors.cvc}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${
                        cardErrors.name ? "border-red-500" : ""
                      }`}
                      placeholder="Nombre del titular"
                      value={card.name}
                      onChange={(e) => {
                        setCard({ ...card, name: e.target.value });
                        setCardErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      required
                    />
                    {cardErrors.name && (
                      <span
                        className="text-red-500 text-xs"
                        style={{ marginTop: 2 }}
                      >
                        {cardErrors.name}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-1/2">
                      <select
                        className="bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full shadow-sm transition-all duration-150 appearance-none cursor-pointer font-medium text-gray-700 pr-8"
                        value={card.docType}
                        onChange={(e) =>
                          setCard({ ...card, docType: e.target.value })
                        }
                        required
                      >
                        <option value="C.C.">Cédula de ciudadanía</option>
                        <option value="C.E.">Cédula de extranjería</option>
                        <option value="NIT">NIT</option>
                        <option value="T.I.">Tarjeta de identidad</option>
                        <option value="P.P.">Pasaporte</option>
                        <option value="Otro">Otro</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2563EB] text-lg">
                        ▼
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                      <input
                        type="text"
                        className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${
                          cardErrors.docNumber ? "border-red-500" : ""
                        }`}
                        placeholder="Número de documento"
                        value={card.docNumber}
                        onChange={(e) => {
                          setCard({ ...card, docNumber: e.target.value });
                          setCardErrors((prev) => ({ ...prev, docNumber: "" }));
                        }}
                        required
                      />
                      {cardErrors.docNumber && (
                        <span
                          className="text-red-500 text-xs"
                          style={{ marginTop: 2 }}
                        >
                          {cardErrors.docNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    className="bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700"
                    placeholder="Cuotas"
                    value={card.installments}
                    onChange={(e) =>
                      setCard({ ...card, installments: e.target.value })
                    }
                  />
                  <div className="text-xs text-gray-500 mt-1 mb-4">
                    Si hay intereses, los aplicará y cobrará tu banco.
                  </div>
                  {/* Mensaje de error general debajo del botón principal */}
                  {Object.values(cardErrors).some(Boolean) && (
                    <div className="text-red-500 text-sm mt-2 text-center">
                      Por favor completa todos los campos obligatorios.
                    </div>
                  )}
                </div>
              )}
              {/* Otros métodos */}
              <div
                className="px-6 pb-2 flex flex-col gap-2"
                style={{ background: "#fff" }}
              >
                <label className="flex items-center gap-2 mt-4">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "pse"}
                    onChange={() => setPaymentMethod("pse")}
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span className="font-medium text-black">
                    PSE y billetera Mercado Pago
                  </span>
                </label>
                <label className="flex items-center gap-2 justify-between">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "add"}
                      onChange={() => setPaymentMethod("add")}
                      className="accent-blue-600 w-5 h-5"
                    />
                    <span className="font-medium text-black">
                      Addi - Paga después
                    </span>
                  </span>
                  <span
                    className="flex items-center justify-center bg-white rounded-full"
                    style={{
                      width: 54,
                      height: 54,
                      border: "2px solid #111",
                      boxSizing: "border-box",
                      padding: 0,
                      marginRight: 0,
                      background: "#fff",
                    }}
                  >
                    <Image
                      src={addiLogo}
                      alt="Addi"
                      width={38}
                      height={38}
                      style={{
                        objectFit: "contain",
                        filter: "invert(0) brightness(0) saturate(100%)",
                      }}
                    />
                  </span>
                </label>
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
          </div>
          {/* Datos de facturación */}
          <div>
            <h2 className="text-xl font-bold mb-2">Datos de facturación</h2>
            <select
              className={`w-full bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] mb-2 transition-all duration-150 font-medium text-gray-700 ${
                billingError ? "border-red-500" : ""
              }`}
              value={billingType}
              onChange={(e) => {
                setBillingType(e.target.value);
                setBillingError("");
              }}
              required
            >
              <option value="">Selecciona un tipo de facturación</option>
              <option value="personal">Personal</option>
              <option value="empresa">Empresa</option>
            </select>
            {billingError && (
              <span className="text-red-500 text-xs">{billingError}</span>
            )}
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
          {typeof onBack === "function" && (
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 text-[#2563EB] font-semibold text-base py-2 rounded-lg bg-white border border-[#e5e5e5] shadow-sm hover:bg-[#e6f3ff] hover:text-[#005bb5] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all duration-150 mt-2"
              onClick={onBack}
            >
              <span className="text-lg">←</span>
              <span>Volver</span>
            </button>
          )}
          {/* Mensaje de error general debajo del botón principal (dentro del form, para submit) */}
          <div className="w-full flex justify-center">
            {error && (
              <div className="text-red-500 text-sm mt-4 text-center w-full max-w-md">
                {error}
              </div>
            )}
          </div>
        </form>
        {/* Resumen de compra */}
        <aside className="bg-white rounded-2xl p-8 shadow flex flex-col gap-6 h-fit justify-between min-h-[480px] border border-[#E5E5E5] sticky top-8">
          <h2 className="font-bold text-xl mb-4">Resumen de compra</h2>
          <div className="flex flex-col gap-2">
            {/* Productos: siempre string */}
            <div className="flex justify-between text-base">
              <span>Productos ({String(productCount)})</span>
              <span className="font-bold">
                {String(safeCurrency(safeSubtotal))}
              </span>
            </div>
            {/* Descuento: siempre string */}
            <div className="flex justify-between text-base">
              <span>Descuento</span>
              <span className="text-red-600">
                -{String(safeCurrency(safeDiscount))}
              </span>
            </div>
            {/* Envío: siempre string */}
            <div className="flex justify-between text-base">
              <span>Envío</span>
              <span>{String(safeCurrency(envio))}</span>
            </div>
            {/* Total: siempre string */}
            <div className="flex justify-between text-lg font-bold mt-2">
              <span>Total</span>
              <span>{String(safeCurrency(total))}</span>
            </div>
            {/* Impuestos: siempre string */}
            <div className="text-xs text-gray-500 mt-1">
              Incluye {String(safeCurrency(impuestos))} de impuestos
            </div>
          </div>
          <button
            type="button"
            className={`w-full bg-[#2563EB] text-white font-bold py-3 rounded-lg text-base mt-6 hover:bg-blue-700 transition flex items-center justify-center ${
              purchaseLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={!accepted || purchaseLoading}
            data-testid="checkout-finish-btn"
            aria-busy={purchaseLoading}
            onClick={() => {
              const form = document.getElementById(
                "checkout-form"
              ) as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
          >
            {purchaseLoading ? (
              <span className="flex items-center gap-2" aria-live="polite">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-green-500"
                  viewBox="0 0 24 24"
                >
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
                <span>Procesando tu compra…</span>
              </span>
            ) : (
              "Finalizar pago"
            )}
          </button>
          {/* Botón secundario: Regresar al comercio */}
          {!successOpen && (
            <button
              type="button"
              className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg mt-3 hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 transition"
              onClick={() => router.push("/")}
              data-testid="checkout-back-to-home"
            >
              Regresar al comercio
            </button>
          )}
          {/* ...no mostrar error aquí, solo en el form... */}
        </aside>
      </div>
    </div>
  );
}
