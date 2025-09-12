"use client";
import { usePurchaseFlow } from "@/hooks/usePurchaseFlow";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import PaymentForm from "./components/PaymentForm";
import { CardData, CardErrors } from "./components/CreditCardForm";
import BillingTypeSelector from "./components/BillingTypeSelector";
import PolicyAcceptance from "./components/PolicyAcceptance";
import CheckoutActions from "./components/CheckoutActions";
import { PaymentMethod } from "./types";
import { payWithAddi, payWithCard } from "./utils";

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
  // Importamos la función de redirección de usePurchaseFlow
  const { redirectToLoading, redirectToError } = usePurchaseFlow();
  // Estado para error general (form)
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
  // Estado para procesamiento de pago
  const [isProcessing, setIsProcessing] = useState(false);
  // Estado para método de pago
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("tarjeta");
  // Estado para datos de tarjeta - usando el tipo del componente
  const [card, setCard] = useState<CardData>(() => {
    // Autocompletar número de documento con valor guardado en Step2
    let cedula = "";
    if (typeof window !== "undefined") {
      const savedDoc = localStorage.getItem("checkout-document");
      if (savedDoc) {
        cedula = savedDoc;
      }
    }
    return {
      number: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      name: "",
      docType: "C.C.",
      docNumber: cedula,
      installments: "",
    };
  });
  // Estado para errores de campos de tarjeta - usando el tipo del componente
  const [cardErrors, setCardErrors] = useState<CardErrors>({
    number: "",
    expiryMonth: "",
    expiryYear: "",
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

  // Determinar si la tarjeta es Amex para los inputs
  const isAmex = card.number.startsWith("34") || card.number.startsWith("37");

  // Helper functions for component callbacks
  const handleCardChange = (newCard: CardData) => {
    setCard(newCard);
  };

  const handleCardErrorChange = (errors: Partial<CardErrors>) => {
    setCardErrors((prev) => ({ ...prev, ...errors }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handleBillingTypeChange = (type: string) => {
    setBillingType(type);
    setBillingError("");
  };

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
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      name: "",
      docNumber: "",
    };
    let hasError = false;
    if (paymentMethod === "tarjeta") {
      // Validación robusta de número de tarjeta (16 dígitos, formateado con espacios)
      const num = card.number.replace(/\s+/g, "");
      if (!/^\d{16}$/.test(num)) {
        if (!num) {
          errors.number =
            "Por favor ingresa el número de tu tarjeta (16 dígitos).";
        } else if (num.length < 16) {
          errors.number = `El número de tarjeta es demasiado corto (${num.length}/16). Ingresa los 16 dígitos.`;
        } else if (num.length > 16) {
          errors.number = `El número de tarjeta es demasiado largo (${num.length}/16). Elimina los dígitos extra.`;
        } else {
          errors.number = "El número de tarjeta debe contener solo números.";
        }
        hasError = true;
      } else {
        // Luhn check
        let sum = 0;
        let shouldDouble = false;
        for (let i = num.length - 1; i >= 0; i--) {
          let digit = parseInt(num.charAt(i), 10);
          if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          sum += digit;
          shouldDouble = !shouldDouble;
        }
        // Permitir finalizar pago aunque el número no pase Luhn, pero mostrar advertencia
        if (sum % 10 !== 0) {
          errors.number =
            "Advertencia: El número de tarjeta no es válido. Verifica que los dígitos sean correctos o consulta con tu banco.";
          // No bloquea el pago, solo advierte
        }
      }
      // Fecha de vencimiento (mes y año separados)
      // Validar mes
      if (!card.expiryMonth || !/^\d{1,2}$/.test(card.expiryMonth)) {
        errors.expiryMonth = "Por favor ingresa un mes válido (01-12).";
        hasError = true;
      } else {
        const month = Number(card.expiryMonth);
        if (month < 1 || month > 12) {
          errors.expiryMonth = "El mes debe estar entre 01 y 12.";
          hasError = true;
        }
      }

      // Validar año
      if (!card.expiryYear || !/^\d{4}$/.test(card.expiryYear)) {
        errors.expiryYear = "Por favor ingresa un año válido (4 dígitos).";
        hasError = true;
      }

      // Validar que la fecha no esté vencida (solo si ambos campos son válidos)
      if (
        card.expiryMonth &&
        card.expiryYear &&
        !/^\d{1,2}$/.test(card.expiryMonth) === false &&
        !/^\d{4}$/.test(card.expiryYear) === false
      ) {
        const month = Number(card.expiryMonth);
        const year = Number(card.expiryYear);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (month >= 1 && month <= 12) {
          if (
            year < currentYear ||
            (year === currentYear && month <= currentMonth)
          ) {
            errors.expiryMonth =
              "La tarjeta está vencida. Ingresa una fecha vigente.";
            errors.expiryYear =
              "La tarjeta está vencida. Ingresa una fecha vigente.";
            hasError = true;
          }
        }
      }
      // CVC: 3 dígitos para Visa/Mastercard, 4 para Amex
      if (isAmex) {
        if (!/^\d{4}$/.test(card.cvc.trim())) {
          errors.cvc =
            "Por favor ingresa el código de seguridad (CVC) de 4 dígitos para American Express.";
          hasError = true;
        }
      } else {
        if (!/^\d{3}$/.test(card.cvc.trim())) {
          errors.cvc =
            "Por favor ingresa el código de seguridad (CVC) de 3 dígitos.";
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
      const docRaw = card.docNumber.replace(/\D/g, "");
      if (!/^\d{6,15}$/.test(docRaw)) {
        if (!docRaw) {
          errors.docNumber =
            "Por favor ingresa el número de documento (mínimo 6 dígitos).";
        } else if (docRaw.length < 6) {
          errors.docNumber = `El número de documento es demasiado corto (${docRaw.length}/6). Ingresa al menos 6 dígitos.`;
        } else if (docRaw.length > 15) {
          errors.docNumber = `El número de documento es demasiado largo (${docRaw.length}/15). Máximo 15 dígitos.`;
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
  const handleFinish = async (e: React.FormEvent) => {
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

    // Activar estado de procesamiento
    setIsProcessing(true);

    // Guardar la información de la orden en localStorage
    try {
      const userInfo = JSON.parse(localStorage.getItem("imagiq_user") || "{}");
      const direction = JSON.parse(
        localStorage.getItem("checkout-address") || "{}"
      );
      let res;
      switch (paymentMethod) {
        case "addi":
          res = await payWithAddi({
            currency: "COP",
            items: cartProducts.map((p) => ({
              name: String(p.name),
              sku: String(p.sku),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
            })),
            metodo_envio: 2,
            shippingAmount: String(envio),
            totalAmount: String(total),
            userInfo: {
              userId: userInfo.id,
              direccionId: direction.id,
            },
          });
          if (res === null) {
            redirectToError();
          }
          console.log(res);
        case "tarjeta":
          res = await payWithCard({
            cardCvc: card.cvc,
            cardExpMonth: card.expiryMonth,
            cardExpYear: card.expiryYear,
            cardNumber: card.number,
            dues: card.installments,
            items: cartProducts.map((p) => ({
              name: String(p.name),
              sku: String(p.sku),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
            })),
            metodo_envio: 2,
            shippingAmount: String(envio),
            totalAmount: "20000",
            currency: "COP",
            userInfo: {
              userId: userInfo.id,
              direccionId: direction.id,
            },
          });
          if (!res) {
            redirectToError()
          }
      }
    } catch (err) {
      console.error("Error al guardar datos de orden:", err);
      redirectToError();
    }

    // Redirigir a la página de carga
    redirectToLoading();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2 md:px-0">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de pago */}
        <form
          id="checkout-form"
          className="col-span-2 flex flex-col gap-8 bg-[#F3F3F3] rounded-2xl p-8 shadow"
          onSubmit={handleFinish}
          autoComplete="off"
        >
          {/* Payment Form */}
          <PaymentForm
            paymentMethod={paymentMethod}
            onPaymentMethodChange={handlePaymentMethodChange}
            card={card}
            cardErrors={cardErrors}
            onCardChange={handleCardChange}
            onCardErrorChange={handleCardErrorChange}
            saveInfo={saveInfo}
            onSaveInfoChange={setSaveInfo}
          />

          {/* Billing section */}
          <BillingTypeSelector
            value={billingType}
            onChange={handleBillingTypeChange}
            error={billingError}
          />

          {/* Privacy policy acceptance */}
          <PolicyAcceptance checked={accepted} onChange={setAccepted} />

          {/* Action buttons */}
          <CheckoutActions
            onBack={onBack}
            onFinish={() => {
              const form = document.getElementById(
                "checkout-form"
              ) as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            isProcessing={isProcessing}
            isAccepted={accepted}
            error={error}
          />
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
              isProcessing ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={!accepted || isProcessing}
            data-testid="checkout-finish-btn"
            aria-busy={isProcessing}
            onClick={() => {
              const form = document.getElementById(
                "checkout-form"
              ) as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
          >
            {isProcessing ? (
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
          <button
            type="button"
            className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg mt-3 hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 transition"
            onClick={() => router.push("/")}
            data-testid="checkout-back-to-home"
          >
            Regresar al comercio
          </button>
        </aside>
      </div>
    </div>
  );
}
