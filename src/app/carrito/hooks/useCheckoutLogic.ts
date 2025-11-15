"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePurchaseFlow } from "@/hooks/usePurchaseFlow";
import { useCart } from "@/hooks/useCart";
import { CardData, CardErrors } from "../components/CreditCardForm";
import { PaymentMethod } from "../types";
import { payWithAddi, payWithCard, payWithSavedCard, payWithPse } from "../utils";
import { validateCardFields } from "../utils/cardValidation";
import { safeGetLocalStorage } from "@/lib/localStorage";

export function useCheckoutLogic() {
  const { redirectToError } = usePurchaseFlow();
  const router = useRouter();
  const { products: cartProducts, appliedDiscount, calculations } = useCart();

  // Estados principales
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("tarjeta");
  const [selectedBank, setSelectedBank] = useState<string>("");

  // Estados para tarjetas guardadas
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [useNewCard, setUseNewCard] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

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
      installments: "1",
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

  // Handlers para tarjetas guardadas
  const handleCardSelect = (cardId: string | null) => {
    setSelectedCardId(cardId);
  };

  const handleOpenAddCardModal = () => {
    setIsAddCardModalOpen(true);
  };

  const handleCloseAddCardModal = () => {
    setIsAddCardModalOpen(false);
  };

  const handleUseNewCardChange = (useNew: boolean) => {
    setUseNewCard(useNew);
    if (!useNew) {
      setSelectedCardId(null);
    }
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

  // Función para validar y guardar datos de pago (sin procesar aún)
  const handleSavePaymentData = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setError("");

    // Validar método de pago
    if (!paymentMethod) {
      setError("Selecciona un método de pago");
      valid = false;
    }

    // Validar campos de tarjeta si corresponde
    if (paymentMethod === "tarjeta") {
      // Si usa una tarjeta guardada, no validar campos
      if (!selectedCardId || useNewCard) {
        const validation = validateCardFields(card, isAmex);
        setCardErrors(validation.errors);
        valid = !validation.hasError && valid;
      }
      // Si usa tarjeta guardada, verificar que haya seleccionado una
      else if (!selectedCardId) {
        setError("Debes seleccionar una tarjeta o agregar una nueva");
        valid = false;
      }
    }

    // Validar banco si se seleccionó PSE
    if (paymentMethod === "pse" && !selectedBank) {
      setError("Debes seleccionar un banco para pagar con PSE");
      valid = false;
    }

    // Si hay errores, no continuar
    if (!valid) {
      return false;
    }

    // Guardar datos en localStorage para usarlos después
    localStorage.setItem("checkout-payment-method", paymentMethod);

    if (paymentMethod === "tarjeta") {
      if (selectedCardId && !useNewCard) {
        localStorage.setItem("checkout-saved-card-id", selectedCardId);
        localStorage.setItem("checkout-card-installments", card.installments || "1");
      } else {
        localStorage.setItem("checkout-card-data", JSON.stringify(card));
      }
    } else if (paymentMethod === "pse") {
      localStorage.setItem("checkout-selected-bank", selectedBank);
    }

    return true;
  };

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
      // Si usa una tarjeta guardada, no validar campos
      if (!selectedCardId || useNewCard) {
        const validation = validateCardFields(card, isAmex);
        setCardErrors(validation.errors);
        valid = !validation.hasError && valid;
      }
      // Si usa tarjeta guardada, verificar que haya seleccionado una
      else if (!selectedCardId) {
        setError("Debes seleccionar una tarjeta o agregar una nueva");
        valid = false;
      }
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
      const userInfo = safeGetLocalStorage("imagiq_user", {});
      const direction = safeGetLocalStorage("checkout-address", {});
      let res;

      switch (paymentMethod) {
        case "addi":
          res = await payWithAddi({
            currency: "COP",
            items: cartProducts.map((p) => ({
              name: String(p.name),
              sku: String(p.sku),
              ean: String(p.ean || "").trim(),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
              skupostback: String(p.skuPostback),
              desDetallada: String(p.desDetallada),
            })),
            metodo_envio: 1,
            shippingAmount: String(envio),
            totalAmount: String(total),
            userInfo: {
              userId: userInfo.id,
              direccionId: direction.id,
            },
          });
          if ("error" in res) {
            // Check if it's an out-of-stock error
            if (res.message.includes("dejó (dejaron) de estar disponobles") ||
                res.message.includes("no está disponible") ||
                res.message.includes("not available")) {
              toast.error("Producto(s) no disponible(s)", {
                description: res.message,
                duration: 5000,
              });
              setIsProcessing(false);
              return;
            }
            // For other errors, redirect to error page
            redirectToError();
          } else {
            router.push(res.redirectUrl);
          }
          break;

        case "tarjeta":
          // Verificar si usa tarjeta guardada o nueva
          if (selectedCardId && !useNewCard) {
            // Pago con tarjeta guardada
            res = await payWithSavedCard({
              cardId: selectedCardId,
              dues: card.installments || "1",
              items: cartProducts.map((p) => ({
                name: String(p.name),
                sku: String(p.sku),
                ean: String(p.ean || "").trim(),
                quantity: String(p.quantity),
                unitPrice: String(p.price),
                skupostback: String(p.skuPostback),
                desDetallada: String(p.desDetallada),
              })),
              metodo_envio: 1,
              shippingAmount: String(envio),
              totalAmount: String(total),
              currency: "COP",
              userInfo: {
                userId: userInfo.id,
                direccionId: direction.id,
              },
            });
          } else {
            // Pago con tarjeta nueva
            res = await payWithCard({
              cardCvc: card.cvc,
              cardExpMonth: card.expiryMonth,
              cardExpYear: card.expiryYear,
              cardNumber: card.number,
              dues: card.installments,
              items: cartProducts.map((p) => ({
                name: String(p.name),
                sku: String(p.sku),
                ean: String(p.ean || "").trim(),
                quantity: String(p.quantity),
                unitPrice: String(p.price),
                skupostback: String(p.skuPostback),
                desDetallada: String(p.desDetallada),
              })),
              metodo_envio: 1,
              shippingAmount: String(envio),
              totalAmount: String(total),
              currency: "COP",
              userInfo: {
                userId: userInfo.id,
                direccionId: direction.id,
              },
            });
          }

          if ("error" in res) {
            // Check if it's an out-of-stock error
            if (res.message.includes("dejó (dejaron) de estar disponobles") ||
                res.message.includes("no está disponible") ||
                res.message.includes("not available")) {
              toast.error("Producto(s) no disponible(s)", {
                description: res.message,
                duration: 5000,
              });
              setIsProcessing(false);
              return;
            }
            // For other errors, redirect to error page
            redirectToError();
            break;
          }
          router.push(res.redirectionUrl);
          break;

        case "pse":
          res = await payWithPse({
            bank: selectedBank,
            description: "Imagiq Store",
            currency: "COP",
            items: cartProducts.map((p) => ({
              name: String(p.name),
              sku: String(p.sku),
              ean: String(p.ean || "").trim(),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
              skupostback: String(p.skuPostback),
              desDetallada: String(p.desDetallada),
            })),
            metodo_envio: 1,
            shippingAmount: String(envio),
            totalAmount: String(total),
            userInfo: {
              userId: userInfo.id,
              direccionId: direction.id,
            },
          });
          if ("error" in res) {
            // Check if it's an out-of-stock error
            if (res.message.includes("dejó (dejaron) de estar disponobles") ||
                res.message.includes("no está disponible") ||
                res.message.includes("not available")) {
              toast.error("Producto(s) no disponible(s)", {
                description: res.message,
                duration: 5000,
              });
              setIsProcessing(false);
              return;
            }
            // For other errors, redirect to error page
            redirectToError();
            break;
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

    // Estados de tarjetas guardadas
    selectedCardId,
    useNewCard,
    isAddCardModalOpen,

    // Handlers
    handleCardChange,
    handleCardErrorChange,
    handlePaymentMethodChange,
    handleBankChange,
    handleBillingTypeChange,
    handleFinish,
    handleSavePaymentData,

    // Handlers de tarjetas guardadas
    handleCardSelect,
    handleOpenAddCardModal,
    handleCloseAddCardModal,
    handleUseNewCardChange,

    // Setters
    setAccepted,
    setSaveInfo,
  };
}
