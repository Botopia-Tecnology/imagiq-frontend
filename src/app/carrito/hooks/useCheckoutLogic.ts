import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePurchaseFlow } from "@/hooks/usePurchaseFlow";
import { useCart } from "@/hooks/useCart";
import { CardData, CardErrors } from "../components/CreditCardForm";
import { PaymentMethod } from "../types";
import { payWithAddi, payWithCard, payWithPse } from "../utils";
import { validateCardFields } from "../utils/cardValidation";

export function useCheckoutLogic() {
  const { redirectToError } = usePurchaseFlow();
  const router = useRouter();
  const { products: cartProducts, appliedDiscount, calculations } = useCart();

  // Estados principales
  const [error, setError] = useState("");
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

  // Effects para sincronizar carrito y descuento - Ya no necesarios con useCart
  // useEffect(() => {
  //   const syncCart = () => setCartProducts(getCartProducts());
  //   window.addEventListener("storage", syncCart);
  //   syncCart();
  //   return () => window.removeEventListener("storage", syncCart);
  // }, []);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const d = localStorage.getItem("applied-discount");
  //     setAppliedDiscount(d ? Number(d) : 0);
  //   }
  // }, []);

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

    // Usar cálculos del hook useCart
    const { total, shipping: envio } = calculations;

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
