"use client";
import { usePurchaseFlow } from "@/hooks/usePurchaseFlow";
import addiLogo from "@/img/carrito/addi_logo.png";
import amexLogo from "@/img/carrito/amex_logo.png";
import dinersLogo from "@/img/carrito/logo4.png";
import mastercardLogo from "@/img/carrito/masterdcard_logo.png";
import visaLogo from "@/img/carrito/visa_logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CheckoutSuccessOverlay from "./CheckoutSuccessOverlay";
import LogoReloadAnimation from "./LogoReloadAnimation";

// Utilidad para obtener productos del carrito desde localStorage
/**
 * Utilidad para obtener productos del carrito desde localStorage
 * - Incluye campo SKU genérico para cada producto.
 * - El SKU se genera como 'SKU-' + id del producto, pero puede adaptarse fácilmente.
 * - Si el prodto ya tiene un SKU, lo respeta.
 * - El formato es escalable y fucácil de modificar.
 *
 * Ejemplo de producto retornado:
 * {
 *   id: '123',
 *   name: 'Producto',
 *   image: '/img/logo_imagiq.png',
 *   price: 1000,
 *   quantity: 1,
 *   sku: 'SKU-123'
 * }
 */
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
          // SKU genérico: si existe lo respeta, si no lo genera
          sku:
            p.sku || `SKU-${p.id || Math.random().toString(36).slice(2, 10)}`,
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
  // Estado para animación ola Samsung
  const [showLogoAnimation, setShowLogoAnimation] = useState(false);

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
      // Validación robusta de número de tarjeta (Luhn y longitud)
      const num = card.number.replace(/\s+/g, "");
      function luhnCheck(val: string) {
        let sum = 0;
        let shouldDouble = false;
        for (let i = val.length - 1; i >= 0; i--) {
          let digit = parseInt(val.charAt(i), 10);
          if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          sum += digit;
          shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
      }
      if (!/^[0-9]{16}$/.test(num)) {
        if (!num) {
          errors.number =
            "Por favor ingresa el número de tu tarjeta (16 dígitos, sin espacios).";
        } else if (num.length < 16) {
          errors.number = `El número de tarjeta es demasiado corto (${num.length}/16). Ingresa los 16 dígitos.`;
        } else if (num.length > 16) {
          errors.number = `El número de tarjeta es demasiado largo (${num.length}/16). Elimina los dígitos extra.`;
        } else {
          errors.number =
            "El número de tarjeta debe contener solo números (sin espacios ni letras).";
        }
        hasError = true;
      } else if (!luhnCheck(num)) {
        errors.number =
          "El número de tarjeta no es válido. Verifica que los dígitos sean correctos o consulta con tu banco.";
        hasError = true;
      }
      // Fecha de vencimiento MM/AA y que no esté vencida
      if (!/^\d{2}\/\d{2}$/.test(card.expiry.trim())) {
        if (!card.expiry.trim()) {
          errors.expiry =
            "Por favor ingresa la fecha de vencimiento en formato MM/AA.";
        } else {
          errors.expiry = "Formato inválido. Usa MM/AA, por ejemplo 08/27.";
        }
        hasError = true;
      } else {
        const [mm, aa] = card.expiry.split("/");
        const month = Number(mm);
        const year = Number(aa) + 2000;
        const now = new Date();
        const expDate = new Date(year, month - 1, 1);
        if (month < 1 || month > 12) {
          errors.expiry =
            "El mes ingresado no es válido. Usa un valor entre 01 y 12.";
          hasError = true;
        } else if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
          errors.expiry =
            "La tarjeta está vencida. Ingresa una tarjeta vigente.";
          hasError = true;
        }
      }
      // CVC: 3 dígitos para Visa/Mastercard, 4 para Amex
      const isAmex = num.startsWith("34") || num.startsWith("37");
      if (isAmex) {
        if (!/^\d{4}$/.test(card.cvc.trim())) {
          if (!card.cvc.trim()) {
            errors.cvc =
              "Por favor ingresa el código de seguridad (CVC) de 4 dígitos para American Express.";
          } else if (card.cvc.trim().length < 4) {
            errors.cvc = `El CVC es demasiado corto (${
              card.cvc.trim().length
            }/4). Ingresa los 4 dígitos.`;
          } else if (card.cvc.trim().length > 4) {
            errors.cvc = `El CVC es demasiado largo (${
              card.cvc.trim().length
            }/4). Elimina los dígitos extra.`;
          } else {
            errors.cvc = "El CVC debe contener solo números.";
          }
          hasError = true;
        }
      } else {
        if (!/^\d{3}$/.test(card.cvc.trim())) {
          if (!card.cvc.trim()) {
            errors.cvc =
              "Por favor ingresa el código de seguridad (CVC) de 3 dígitos.";
          } else if (card.cvc.trim().length < 3) {
            errors.cvc = `El CVC es demasiado corto (${
              card.cvc.trim().length
            }/3). Ingresa los 3 dígitos.`;
          } else if (card.cvc.trim().length > 3) {
            errors.cvc = `El CVC es demasiado largo (${
              card.cvc.trim().length
            }/3). Elimina los dígitos extra.`;
          } else {
            errors.cvc = "El CVC debe contener solo números.";
          }
          hasError = true;
        }
      }
      // Nombre del titular: solo letras y espacios, mínimo 2 palabras
      if (!card.name.trim()) {
        errors.name =
          "Por favor ingresa el nombre y apellido del titular de la tarjeta.";
        hasError = true;
      } else if (
        !/^([A-Za-zÁÉÍÓÚáéíóúÑñ]+\s+){1,}[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(
          card.name.trim()
        )
      ) {
        errors.name =
          "El nombre debe contener solo letras y al menos un apellido. Ejemplo: Juan Pérez.";
        hasError = true;
      }
      // Documento: solo números, mínimo 6 dígitos
      if (!/^\d{6,}$/.test(card.docNumber.trim())) {
        if (!card.docNumber.trim()) {
          errors.docNumber =
            "Por favor ingresa el número de documento (mínimo 6 dígitos).";
        } else if (!/^[0-9]+$/.test(card.docNumber.trim())) {
          errors.docNumber = "El documento debe contener solo números.";
        } else if (card.docNumber.trim().length < 6) {
          errors.docNumber = `El número de documento es demasiado corto (${
            card.docNumber.trim().length
          }/6). Ingresa al menos 6 dígitos.`;
        } else {
          errors.docNumber = "Número de documento inválido.";
        }
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
    // Si todo está correcto, mostrar animación ola
    setShowLogoAnimation(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2 md:px-0">
      {/* Animación ola Samsung: se superpone pero no bloquea el render */}
      {showLogoAnimation && (
        <LogoReloadAnimation
          open={showLogoAnimation}
          duration={2500}
          onFinish={() => {
            setShowLogoAnimation(false);
            startPayment();
          }}
        />
      )}
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
                      inputMode="numeric"
                      maxLength={16}
                      pattern="[0-9]{16}"
                      className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${
                        cardErrors.number ? "border-red-500" : ""
                      }`}
                      placeholder="Número de tarjeta (16 dígitos)"
                      value={card.number.replace(/\D/g, "")}
                      onChange={(e) => {
                        // Solo permitir números y máximo 16 dígitos
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16);
                        setCard({ ...card, number: val });
                        setCardErrors((prev) => ({ ...prev, number: "" }));
                      }}
                      required
                      autoComplete="cc-number"
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
                        inputMode="numeric"
                        maxLength={4}
                        pattern="\d{3,4}"
                        className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${
                          cardErrors.cvc ? "border-red-500" : ""
                        }`}
                        placeholder="Código de seguridad"
                        value={card.cvc
                          .replace(/\D/g, "")
                          .slice(
                            0,
                            card.number.startsWith("34") ||
                              card.number.startsWith("37")
                              ? 4
                              : 3
                          )}
                        onChange={(e) => {
                          // Solo permitir números y máximo 4 dígitos para Amex, 3 para otros
                          const maxLen =
                            card.number.startsWith("34") ||
                            card.number.startsWith("37")
                              ? 4
                              : 3;
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, maxLen);
                          setCard({ ...card, cvc: val });
                          setCardErrors((prev) => ({ ...prev, cvc: "" }));
                        }}
                        required
                        autoComplete="cc-csc"
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
                      placeholder="Nombre del titular (solo letras y espacios)"
                      value={card.name.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "")}
                      onChange={(e) => {
                        // Solo permitir letras y espacios
                        const val = e.target.value.replace(
                          /[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,
                          ""
                        );
                        setCard({ ...card, name: val });
                        setCardErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      required
                      autoComplete="cc-name"
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
                        inputMode="numeric"
                        maxLength={12}
                        pattern="\d{6,12}"
                        className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${
                          cardErrors.docNumber ? "border-red-500" : ""
                        }`}
                        placeholder="Documento (6-12 dígitos, solo números)"
                        value={card.docNumber.replace(/\D/g, "").slice(0, 12)}
                        onChange={(e) => {
                          // Solo permitir números y máximo 12 dígitos
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 12);
                          setCard({ ...card, docNumber: val });
                          setCardErrors((prev) => ({ ...prev, docNumber: "" }));
                        }}
                        required
                        autoComplete="off"
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
                    inputMode="numeric"
                    maxLength={2}
                    pattern="\d{1,2}"
                    className="bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700"
                    placeholder="Cuotas (opcional)"
                    value={card.installments.replace(/\D/g, "").slice(0, 2)}
                    onChange={(e) => {
                      // Solo permitir números y máximo 2 dígitos
                      const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setCard({ ...card, installments: val });
                    }}
                    autoComplete="off"
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
