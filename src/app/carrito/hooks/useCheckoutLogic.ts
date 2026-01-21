"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePurchaseFlow } from "@/hooks/usePurchaseFlow";
import { useCart } from "@/hooks/useCart";
import { CardData, CardErrors } from "../components/CreditCardForm";
import {
  PaymentMethod,
  BeneficiosDTO,
  CheckZeroInterestResponse,
} from "../types";
import {
  payWithAddi,
  payWithCard,
  payWithSavedCard,
  payWithPse,
} from "../utils";
import { validateCardFields } from "../utils/cardValidation";
import { safeGetLocalStorage, safeSetLocalStorage } from "@/lib/localStorage";
import { useCardsCache } from "./useCardsCache";
import useSecureStorage from "@/hooks/useSecureStorage";

/**
 * Extrae los beneficios de trade-in desde localStorage
 * Maneja tanto el formato antiguo como el nuevo formato indexado por SKU
 * @returns Array de beneficios de tipo entrego_y_estreno
 */
function extractTradeInBeneficios(): BeneficiosDTO[] {
  const beneficios: BeneficiosDTO[] = [];
  try {
    const tradeStr = localStorage.getItem("imagiq_trade_in");
    if (!tradeStr) return beneficios;

    const parsedTrade = JSON.parse(tradeStr);

    // Formato antiguo: { deviceName, value, completed, detalles }
    if (parsedTrade?.completed && parsedTrade?.deviceName) {
      beneficios.push({
        type: "entrego_y_estreno",
        dispositivo_a_recibir: parsedTrade.deviceName,
        valor_retoma: parsedTrade.value,
        detalles_dispositivo_a_recibir: parsedTrade.detalles,
      });
      return beneficios;
    }

    // Formato nuevo: { "SKU": { sku, name, skuPostback, deviceName, value, completed, detalles } }
    if (typeof parsedTrade === 'object' && !parsedTrade.deviceName) {
      for (const sku of Object.keys(parsedTrade)) {
        const tradeInData = parsedTrade[sku];
        if (tradeInData?.completed && tradeInData?.deviceName) {
          beneficios.push({
            type: "entrego_y_estreno",
            dispositivo_a_recibir: tradeInData.deviceName,
            valor_retoma: tradeInData.value,
            detalles_dispositivo_a_recibir: tradeInData.detalles,
            // Datos adicionales del producto que aplica trade-in
            sku_producto: tradeInData.sku || sku,
            nombre_producto: tradeInData.name,
            sku_postback_producto: tradeInData.skuPostback,
          });
        }
      }
    }
  } catch {
    // ignore parsing errors
  }
  return beneficios;
}

export function useCheckoutLogic() {
  const { redirectToError } = usePurchaseFlow();
  const router = useRouter();
  const { products: cartProducts, appliedDiscount, calculations } = useCart();
  const [checkoutAddress, _] = useSecureStorage<{ id: string } | null>("checkout-address", null);

  // Hook de caché para zero interest
  const {
    zeroInterestData: cachedZeroInterestData,
    isLoadingZeroInterest: cachedIsLoadingZeroInterest,
    loadZeroInterest,
  } = useCardsCache();

  // Estados principales
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("tarjeta");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [selectedBankName, setSelectedBankName] = useState<string>("");

  // Estados para tarjetas guardadas
  const [selectedCardId, setSelectedCardId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("checkout-saved-card-id");
    }
    return null;
  });

  const [useNewCard, setUseNewCard] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCardId = localStorage.getItem("checkout-saved-card-id");
      const tempCardData = localStorage.getItem("checkout-card-data");
      // If we have temporary card data and NO saved card selected, default to new card
      if (tempCardData && !savedCardId) {
        return true;
      }
    }
    return false;
  });
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  // Contador para forzar recarga de tarjetas guardadas
  const [savedCardsReloadCounter, setSavedCardsReloadCounter] = useState(0);

  // Usar datos del caché para zero interest
  const zeroInterestData = cachedZeroInterestData;
  const isLoadingZeroInterest = cachedIsLoadingZeroInterest;

  const [card, setCard] = useState<CardData>(() => {
    let cedula = "";
    let initialCardData = {
      number: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      name: "",
      docType: "C.C.",
      docNumber: "",
      installments: "1",
    };

    if (typeof window !== "undefined") {
      const savedDoc = localStorage.getItem("checkout-document");
      if (savedDoc) {
        cedula = savedDoc;
        initialCardData.docNumber = savedDoc;
      }

      // Check for temporary card data
      try {
        const tempCardData = localStorage.getItem("checkout-card-data");
        if (tempCardData) {
          const parsed = JSON.parse(tempCardData);
          initialCardData = {
            ...initialCardData,
            number: parsed.cardNumber || "",
            name: parsed.cardHolder || "",
            expiryMonth: parsed.cardExpMonth || "",
            expiryYear: parsed.cardExpYear || "",
            cvc: parsed.cardCvc || "",
            // Preserve docNumber if not in temp data
            docNumber: parsed.docNumber || cedula,
            installments: parsed.installments || "1"
          };
        }
      } catch (e) {
        console.error("Error parsing temporary card data:", e);
      }
    }
    return initialCardData;
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
      setSelectedBankName("");
    }
  };

  const handleBankChange = (bankCode: string, bankName?: string) => {
    setSelectedBank(bankCode);
    if (bankName) setSelectedBankName(bankName);
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
    // Forzar recarga de tarjetas guardadas al cerrar el modal
    setSavedCardsReloadCounter((c) => c + 1);
  };

  // Cerrar modal después de agregar tarjeta y solicitar recarga de tarjetas
  const handleAddCardSuccess = async (newCardId?: string) => {
    setIsAddCardModalOpen(false);

    // Forzar recarga de tarjetas - la tarjeta se seleccionará automáticamente en PaymentForm después de recargar
    setSavedCardsReloadCounter((c) => c + 1);
    setPaymentMethod("tarjeta");
    setUseNewCard(false);

    // Si se proporcionó el ID de la nueva tarjeta, consultar cuotas sin interés
    if (newCardId) {
      fetchZeroInterestInfo([newCardId]);
    }
  };

  const handleUseNewCardChange = (useNew: boolean) => {
    setUseNewCard(useNew);
    // If user chooses to use a new card, clear selected saved card.
    if (useNew) {
      setSelectedCardId(null);
    }
  };

  // Función para consultar información de cuotas sin interés (ahora usa el caché)
  const fetchZeroInterestInfo = useCallback(
    async (cardIds: string[]) => {
      if (cardIds.length === 0) return;

      await loadZeroInterest(
        cardIds,
        cartProducts.map((p) => p.sku),
        calculations.total
      );
    },
    [cartProducts, calculations.total, loadZeroInterest]
  );

  // Effects para sincronizar carrito y descuento - Ya no necesarios con useCart

  // Cargar método de pago guardado de localStorage al montar
  useEffect(() => {
    const savedPaymentMethod = localStorage.getItem("checkout-payment-method");
    if (savedPaymentMethod) {
      setPaymentMethod(savedPaymentMethod as PaymentMethod);
    }

    const savedBankData = localStorage.getItem("checkout-selected-bank");
    if (savedBankData) {
      try {
        const { code, name } = JSON.parse(savedBankData);
        setSelectedBank(code);
        setSelectedBankName(name);
      } catch (error) {
        console.error("Error parsing saved bank data:", error);
      }
    }
  }, []);

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
      // Verificar que haya seleccionado una tarjeta guardada O esté usando una nueva
      const hasTempCard = typeof window !== 'undefined' && localStorage.getItem("checkout-card-data");

      if (!selectedCardId && !hasTempCard) {
        setError("Debes seleccionar una tarjeta o ingresar los datos de una nueva.");
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
      // Solo guardar tarjetas guardadas (ya no se permiten nuevas tarjetas en step 4)
      if (selectedCardId) {
        localStorage.setItem("checkout-saved-card-id", selectedCardId);
        localStorage.setItem(
          "checkout-card-installments",
          card.installments || "1"
        );

        // Guardar información de cuotas sin interés para usar en Step5
        if (zeroInterestData) {
          safeSetLocalStorage("checkout-zero-interest", zeroInterestData);
        }
      } else {
        // Si no hay tarjeta guardada seleccionada (es tarjeta nueva), limpiar el ID guardado
        localStorage.removeItem("checkout-saved-card-id");
      }
    } else if (paymentMethod === "pse") {
      // Guardar tanto código como nombre del banco para uso en resumen
      const payload = { code: selectedBank, name: selectedBankName || "" };
      localStorage.setItem("checkout-selected-bank", JSON.stringify(payload));
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
      // Verificar que haya seleccionado una tarjeta guardada O esté usando una nueva
      const hasTempCard = typeof window !== 'undefined' && localStorage.getItem("checkout-card-data");

      if (!selectedCardId && !hasTempCard) {
        setError("Debes seleccionar una tarjeta o ingresar los datos de una nueva.");
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
      const userInfo = safeGetLocalStorage<{ id?: string }>("imagiq_user", {});
      const direction = safeGetLocalStorage<{ id?: string }>(
        "checkout-address",
        {}
      );
      const billing = safeGetLocalStorage<{
        direccion?: { id?: string };
        email?: string;
        nombre?: string;
        documento?: string;
        tipoDocumento?: string;
        telefono?: string;
        type?: string;
        nit?: string;
        razonSocial?: string;
        nombreRepresentante?: string;
      }>("checkout-billing-data", {});

      const informacion_facturacion = {
        direccion_id: billing?.direccion?.id ?? direction?.id ?? "",
        email: billing?.email ?? "",
        nombre_completo: billing?.nombre ?? "",
        numero_documento: billing?.documento ?? "",
        tipo_documento: billing?.tipoDocumento ?? "",
        telefono: billing?.telefono ?? "",
        type: billing?.type ?? "",
        nit: billing?.nit,
        razon_social: billing?.razonSocial,
        representante_legal:
          billing?.nombreRepresentante || billing?.razonSocial,
      };
      let res;

      switch (paymentMethod) {
        case "addi": {
          // Construir beneficios
          const buildBeneficios = (): BeneficiosDTO[] => {
            const beneficios: BeneficiosDTO[] = extractTradeInBeneficios();
            try {
              const zeroStr = localStorage.getItem("checkout-zero-interest");
              if (zeroStr) {
                const parsedZero = JSON.parse(zeroStr);
                const aplicaZero =
                  parsedZero?.aplica_zero_interes || parsedZero?.aplica;
                if (aplicaZero) {
                  // Addi payments might not have a card id, but keep logic for completeness
                  beneficios.push({ type: "0%_interes" });
                }
              }
            } catch {
              // ignore
            }
            if (beneficios.length === 0) return [{ type: "sin_beneficios" }];
            return beneficios;
          };

          res = await payWithAddi({
            currency: "COP",
            items: cartProducts.map((p) => ({
              name: String(p.name),
              sku: String(p.sku),
              ean: p.ean && p.ean !== "" ? String(p.ean) : String(p.sku),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
              skupostback: p.skuPostback || p.sku || "",
              desDetallada: p.desDetallada || p.name || "",
              categoria: p.categoria || (p.bundleInfo ? "IM" : ""),
              category: p.categoria || (p.bundleInfo ? "IM" : ""),
              // Incluir bundleInfo si el producto es parte de un bundle
              ...(p.bundleInfo && {
                bundleInfo: {
                  codCampana: p.bundleInfo.codCampana,
                  productSku: p.bundleInfo.productSku,
                  skusBundle: p.bundleInfo.skusBundle,
                  bundlePrice: p.bundleInfo.bundlePrice,
                  bundleDiscount: p.bundleInfo.bundleDiscount,
                  fechaFinal: p.bundleInfo.fechaFinal,
                },
              }),
            })),
            metodo_envio: 1,
            shippingAmount: String(envio),
            totalAmount: String(total),
            userInfo: {
              userId: userInfo.id || "",
              direccionId: checkoutAddress?.id || "",
            },
            informacion_facturacion,
            beneficios: buildBeneficios(),
          });
          if ("error" in res) {
            // Check if it's an out-of-stock error
            if (
              res.message.includes("dejó (dejaron) de estar disponobles") ||
              res.message.includes("no está disponible") ||
              res.message.includes("not available")
            ) {
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
        }

        case "tarjeta": {
          // Solo se permite pago con tarjeta guardada (ya no se permiten nuevas tarjetas en step 4)
          if (selectedCardId) {
            // Pago con tarjeta guardada
            res = await payWithSavedCard({
              cardId: selectedCardId,
              dues: card.installments || "1",
              items: cartProducts.map((p) => ({

                name: String(p.name),
                sku: String(p.sku),
                ean: p.ean && p.ean !== "" ? String(p.ean) : String(p.sku),
                quantity: String(p.quantity),
                unitPrice: String(p.price),
                skupostback: p.skuPostback || p.sku || "",
                desDetallada: p.desDetallada || p.name || "",
                categoria: p.categoria || (p.bundleInfo ? "IM" : ""),
                category: p.categoria || (p.bundleInfo ? "IM" : ""),
                ...(p.bundleInfo && {
                  bundleInfo: {
                    codCampana: p.bundleInfo.codCampana,
                    productSku: p.bundleInfo.productSku,
                    skusBundle: p.bundleInfo.skusBundle,
                    bundlePrice: p.bundleInfo.bundlePrice,
                    bundleDiscount: p.bundleInfo.bundleDiscount,
                    fechaFinal: p.bundleInfo.fechaFinal,
                  },
                }),
              })),
              metodo_envio: 1,
              shippingAmount: String(envio),
              totalAmount: String(total),
              currency: "COP",
              userInfo: {
                userId: userInfo.id || "",
                direccionId: checkoutAddress?.id || "",
              },
              informacion_facturacion,
              beneficios: (() => {
                const beneficios: BeneficiosDTO[] = extractTradeInBeneficios();
                try {
                  const zeroStr = localStorage.getItem(
                    "checkout-zero-interest"
                  );
                  if (zeroStr) {
                    const parsedZero = JSON.parse(zeroStr);
                    const aplicaZero =
                      parsedZero?.aplica_zero_interes || parsedZero?.aplica;
                    if (aplicaZero) {
                      const installmentsNum = Number(card.installments || 1);
                      const cardId =
                        selectedCardId ||
                        localStorage.getItem("checkout-saved-card-id");
                      const matched = parsedZero?.cards?.find(
                        (c: {
                          id: string;
                          eligibleForZeroInterest: boolean;
                          availableInstallments: number[];
                        }) => String(c.id) === String(cardId)
                      );
                      if (
                        matched?.eligibleForZeroInterest &&
                        matched.availableInstallments?.includes(installmentsNum)
                      ) {
                        beneficios.push({ type: "0%_interes" });
                      }
                    }
                  }
                } catch {
                  // ignore
                }
                if (beneficios.length === 0)
                  return [{ type: "sin_beneficios" }];
                return beneficios;
              })(),
            });
          } else {
            // Pago con tarjeta nueva
            console.log("💳 [useCheckoutLogic] Paying with NEW CARD. Data:", card);
            res = await payWithCard({
              cardCvc: card.cvc,
              cardExpMonth: card.expiryMonth,
              cardExpYear: card.expiryYear,
              cardNumber: card.number,
              dues: card.installments,
              items: cartProducts.map((p) => ({
                name: String(p.name),
                sku: String(p.sku),
                ean: p.ean && p.ean !== "" ? String(p.ean) : String(p.sku),
                quantity: String(p.quantity),
                unitPrice: String(p.price),
                skupostback: p.skuPostback || p.sku || "",
                desDetallada: p.desDetallada || p.name || "",
                categoria: p.categoria || (p.bundleInfo ? "IM" : ""),
                category: p.categoria || (p.bundleInfo ? "IM" : ""),
                ...(p.bundleInfo && {
                  bundleInfo: {
                    codCampana: p.bundleInfo.codCampana,
                    productSku: p.bundleInfo.productSku,
                    skusBundle: p.bundleInfo.skusBundle,
                    bundlePrice: p.bundleInfo.bundlePrice,
                    bundleDiscount: p.bundleInfo.bundleDiscount,
                    fechaFinal: p.bundleInfo.fechaFinal,
                  },
                }),
              })),
              metodo_envio: 1,
              shippingAmount: String(envio),
              totalAmount: String(total),
              currency: "COP",
              userInfo: {
                userId: userInfo.id || "",
                direccionId: checkoutAddress?.id || "",
              },
              informacion_facturacion,
              beneficios: (() => {
                const beneficios: BeneficiosDTO[] = extractTradeInBeneficios();
                // For new cards we don't have a card id to check zero interest eligibility
                if (beneficios.length === 0)
                  return [{ type: "sin_beneficios" }];
                return beneficios;
              })(),
            });
          }

          if ("error" in res) {
            // Check if it's an out-of-stock error
            if (
              res.message.includes("dejó (dejaron) de estar disponobles") ||
              res.message.includes("no está disponible") ||
              res.message.includes("not available")
            ) {
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
        }

        case "pse": {
          res = await payWithPse({
            bank: selectedBank,
            bankName: selectedBankName,
            description: "Imagiq Store",
            currency: "COP",
            items: cartProducts.map((p) => ({
              name: String(p.name),
              sku: String(p.sku),
              ean: p.ean && p.ean !== "" ? String(p.ean) : String(p.sku),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
              skupostback: p.skuPostback || p.sku || "",
              desDetallada: p.desDetallada || p.name || "",
              categoria: p.categoria || (p.bundleInfo ? "IM" : ""),
              category: p.categoria || (p.bundleInfo ? "IM" : ""),
              ...(p.bundleInfo && {
                bundleInfo: {
                  codCampana: p.bundleInfo.codCampana,
                  productSku: p.bundleInfo.productSku,
                  skusBundle: p.bundleInfo.skusBundle,
                  bundlePrice: p.bundleInfo.bundlePrice,
                  bundleDiscount: p.bundleInfo.bundleDiscount,
                  fechaFinal: p.bundleInfo.fechaFinal,
                },
              }),
            })),
            metodo_envio: 1,
            shippingAmount: String(envio),
            totalAmount: String(total),
            userInfo: {
              userId: userInfo.id || "",
              direccionId: direction.id || "",
            },
            informacion_facturacion,
            beneficios: (() => {
              const beneficios: BeneficiosDTO[] = extractTradeInBeneficios();
              if (beneficios.length === 0) return [{ type: "sin_beneficios" }];
              return beneficios;
            })(),
          });
          if ("error" in res) {
            // Check if it's an out-of-stock error
            if (
              res.message.includes("dejó (dejaron) de estar disponobles") ||
              res.message.includes("no está disponible") ||
              res.message.includes("not available")
            ) {
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
    savedCardsReloadCounter,

    // Estados de cuotas sin interés
    zeroInterestData,
    isLoadingZeroInterest,

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
    handleAddCardSuccess,
    handleUseNewCardChange,

    // Handlers de cuotas sin interés
    fetchZeroInterestInfo,

    // Setters
    setAccepted,
    setSaveInfo,
  };
}
