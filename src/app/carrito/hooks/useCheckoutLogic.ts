import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePurchaseFlow } from "@/hooks/usePurchaseFlow";
import { CardData, CardErrors } from "../components/CreditCardForm";
import { PaymentMethod } from "../types";
import { payWithAddi, payWithCard, payWithPse } from "../utils";
import { validateCardFields } from "../utils/cardValidation";

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
          sku:
            p.sku || `SKU-${p.id || Math.random().toString(36).slice(2, 10)}`,
        }))
      : [];
  } catch {
    return [];
  }
}

export function useCheckoutLogic() {
  const { redirectToLoading, redirectToError } = usePurchaseFlow();
  const router = useRouter();

  // Estados principales
  const [error, setError] = useState("");
  const [cartProducts, setCartProducts] = useState(getCartProducts());
  const [appliedDiscount, setAppliedDiscount] = useState(() => {
    if (typeof window !== "undefined") {
      const d = localStorage.getItem("applied-discount");
      return d ? Number(d) : 0;
    }
    return 0;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("tarjeta");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [card, setCard] = useState<CardData>(() => {
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
  const [cardErrors, setCardErrors] = useState<CardErrors>({
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    name: "",
    docNumber: "",
  });
  const [billingError, setBillingError] = useState("");
  const [billingType, setBillingType] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);

  // Computed values
  const isAmex = card.number.startsWith("34") || card.number.startsWith("37");

  // Handlers
  const handleCardChange = (newCard: CardData) => {
    setCard(newCard);
  };

  const handleCardErrorChange = (errors: Partial<CardErrors>) => {
    setCardErrors((prev) => ({ ...prev, ...errors }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method !== "pse") {
      setSelectedBank("");
    }
  };

  const handleBankChange = (bank: string) => {
    setSelectedBank(bank);
  };

  const handleBillingTypeChange = (type: string) => {
    setBillingType(type);
    setBillingError("");
  };

  // Effects para sincronizar carrito y descuento
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

  // Función principal de finalización de compra
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
      const validation = validateCardFields(card, isAmex);
      setCardErrors(validation.errors);
      valid = !validation.hasError && valid;
    }

    // Validar banco si se seleccionó PSE
    if (paymentMethod === "pse" && !selectedBank) {
      setError("Debes seleccionar un banco para pagar con PSE");
      valid = false;
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
    const total = isNaN(safeSubtotal - safeDiscount + envio)
      ? 0
      : safeSubtotal - safeDiscount + envio;

    // Procesar pago
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
          break;

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
            redirectToError();
          }
          break;

        case "pse":
          res = await payWithPse({
            bank: selectedBank,
            description: "Imagiq Store",
            currency: "COP",
            items: cartProducts.map((p) => ({
              name: String(p.name),
              sku: String(p.sku),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
            })),
            metodo_envio: 2,
            shippingAmount: String(envio),
            totalAmount: total > 200_000 ? String(200_000) : String(total),
            userInfo: {
              userId: userInfo.id,
              direccionId: direction.id,
            },
          });
          if (!res) {
            redirectToError();
          }
          router.push(res.redirectUrl);
          break;
      }
    } catch (err) {
      console.error("Error al guardar datos de orden:", err);
      redirectToError();
    }
  };

  return {
    // Estados
    error,
    cartProducts,
    appliedDiscount,
    isProcessing,
    paymentMethod,
    selectedBank,
    card,
    cardErrors,
    billingError,
    billingType,
    accepted,
    saveInfo,
    isAmex,

    // Handlers
    handleCardChange,
    handleCardErrorChange,
    handlePaymentMethodChange,
    handleBankChange,
    handleBillingTypeChange,
    handleFinish,

    // Setters
    setAccepted,
    setSaveInfo,
  };
}
