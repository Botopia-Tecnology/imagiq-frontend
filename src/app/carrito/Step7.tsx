"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import {
  CreditCard,
  MapPin,
  FileText,
  Truck,
  Store,
  Edit2,
} from "lucide-react";
import { useAuthContext } from "@/features/auth/context";
import { profileService } from "@/services/profile.service";
import { toast } from "sonner";
import { DBCard, DecryptedCardData } from "@/features/profile/types";
import { encryptionService } from "@/lib/encryption";
import CardBrandLogo from "@/components/ui/CardBrandLogo";
import { payWithAddi, payWithCard, payWithPse, fetchBanks } from "./utils";
import { useCart } from "@/hooks/useCart";
import {
  validateTradeInProducts,
  getTradeInValidationMessage,
} from "./utils/validateTradeIn";
import { CheckZeroInterestResponse, BeneficiosDTO } from "./types";

interface Step7Props {
  onBack?: () => void;
}

interface CardData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  brand?: string;
  cardType?: string;
  bank?: string;
}

interface PaymentData {
  method: string;
  cardData?: CardData;
  savedCard?: DBCard;
  bank?: string;
  bankName?: string;
  installments?: number;
}

interface ShippingData {
  type: "delivery" | "pickup";
  address?: string;
  city?: string;
  store?: {
    name: string;
    address?: string;
    city?: string;
    schedule?: string;
  };
}

interface BillingData {
  type: "natural" | "juridica";
  nombre: string;
  documento: string;
  email: string;
  telefono: string;
  direccion: {
    id: string;
    codigo_dane: string;
    pais: string;
    usuario_id: string;
    linea_uno: string;
    ciudad: string;
  };
  // Campos de persona jurídica
  razonSocial?: string;
  nit?: string;
  nombreRepresentante?: string;
  tipoDocumento: string;
}

export default function Step7({ onBack }: Step7Props) {
  const router = useRouter();
  const authContext = useAuthContext();
  const [isProcessing, setIsProcessing] = useState(false);

  // Estados para datos de resumen
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [zeroInterestData, setZeroInterestData] =
    useState<CheckZeroInterestResponse | null>(null);
  const { products, calculations } = useCart();

  // Trade-In state management
  const [tradeInData, setTradeInData] = useState<{
    completed: boolean;
    deviceName: string;
    value: number;
  } | null>(null);

  // Cargar datos de localStorage
  useEffect(() => {
    const loadPaymentData = async () => {
      // Cargar método de pago
      const paymentMethod = localStorage.getItem("checkout-payment-method");
      const savedCardId = localStorage.getItem("checkout-saved-card-id");
      const cardDataStr = localStorage.getItem("checkout-card-data");
      const selectedBank = localStorage.getItem("checkout-selected-bank");
      const installments = localStorage.getItem("checkout-installments");

      if (paymentMethod) {
        let cardData: CardData | undefined;
        let savedCard: DBCard | undefined;

        // Si usó una tarjeta guardada, cargar sus datos completos
        if (savedCardId && authContext.user?.id) {
          try {
            const encryptedCards =
              await profileService.getUserPaymentMethodsEncrypted(
                authContext.user.id
              );

            const decryptedCards: DBCard[] = encryptedCards
              .map((encCard) => {
                const decrypted =
                  encryptionService.decryptJSON<DecryptedCardData>(
                    encCard.encryptedData
                  );
                if (!decrypted) return null;

                return {
                  id: decrypted.cardId as unknown as string,
                  ultimos_dijitos: decrypted.last4Digits,
                  marca: decrypted.brand?.toLowerCase() || undefined,
                  banco: decrypted.banco || undefined,
                  tipo_tarjeta: decrypted.tipo || undefined,
                  es_predeterminada: false,
                  activa: true,
                  nombre_titular: decrypted.cardHolderName || undefined,
                } as DBCard;
              })
              .filter((card): card is DBCard => card !== null);

            savedCard = decryptedCards.find(
              (card) => String(card.id) === savedCardId
            );
          } catch (error) {
            console.error("Error loading saved card:", error);
          }
        }
        // Si hay datos de tarjeta nueva ingresados
        else if (cardDataStr) {
          try {
            cardData = JSON.parse(cardDataStr);
          } catch (error) {
            console.error("Error parsing card data:", error);
          }
        }

        // selectedBank can be a JSON string { code, name } or a plain code string
        let bankCode: string | undefined = undefined;
        let bankName: string | undefined = undefined;
        if (selectedBank) {
          try {
            const parsed = JSON.parse(selectedBank);
            if (parsed && typeof parsed === "object" && "code" in parsed) {
              bankCode = parsed.code || undefined;
              bankName = parsed.name || undefined;
            } else {
              bankCode = String(selectedBank);
            }
          } catch {
            bankCode = selectedBank;
          }
          // If we have a code but no name, try to resolve the name from the banks API
          if (bankCode && !bankName) {
            try {
              const banks = await fetchBanks();
              const found = banks.find(
                (b) => String(b.bankCode) === String(bankCode)
              );
              if (found) bankName = found.bankName;
            } catch {
              // ignore failure to fetch banks
            }
          }
        }

        setPaymentData({
          method: paymentMethod,
          cardData,
          savedCard,
          bank: bankCode,
          bankName,
          installments: installments
            ? Number.parseInt(installments)
            : undefined,
        });
      }
    };

    loadPaymentData();

    // Cargar datos de cuotas sin interés
    try {
      const stored = localStorage.getItem("checkout-zero-interest");
      if (stored) {
        const parsed = JSON.parse(stored) as CheckZeroInterestResponse;
        setZeroInterestData(parsed);
      }
    } catch (error) {
      console.error("Error loading zero interest data:", error);
    }

    // Cargar dirección de envío
    // Determinar método de entrega seleccionado
    const deliveryMethod =
      localStorage.getItem("checkout-delivery-method") || "domicilio";

    if (deliveryMethod === "tienda") {
      const storeStr = localStorage.getItem("checkout-store");
      if (storeStr) {
        try {
          const parsedStore = JSON.parse(storeStr);
          setShippingData({
            type: "pickup",
            store: {
              name:
                parsedStore.descripcion ||
                parsedStore.nombre ||
                "Tienda seleccionada",
              address: parsedStore.direccion,
              city: parsedStore.ciudad || parsedStore.departamento,
              schedule: parsedStore.horario,
            },
          });
        } catch (error) {
          console.error("Error parsing checkout-store:", error);
          setShippingData({
            type: "pickup",
          });
        }
      } else {
        setShippingData({
          type: "pickup",
        });
      }
    } else {
      const shippingAddress = localStorage.getItem("checkout-address");
      if (shippingAddress) {
        try {
          const parsed = JSON.parse(shippingAddress);
          setShippingData({
            type: "delivery",
            address: parsed.linea_uno,
            city: parsed.ciudad,
          });
        } catch (error) {
          console.error("Error parsing shipping address:", error);
        }
      }
    }

    // Cargar datos de facturación
    const billingDataStr = localStorage.getItem("checkout-billing-data");
    if (billingDataStr) {
      try {
        const parsed = JSON.parse(billingDataStr);
        setBillingData(parsed);
      } catch (error) {
        console.error("Error parsing billing data:", error);
      }
    }

    // Load Trade-In data
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
  }, []);

  // Handle Trade-In removal
  const handleRemoveTradeIn = () => {
    localStorage.removeItem("imagiq_trade_in");
    setTradeInData(null);
  };

  // Estado para validación de Trade-In
  const [tradeInValidation, setTradeInValidation] = useState<{
    isValid: boolean;
    productsWithoutRetoma: typeof products;
    hasMultipleProducts: boolean;
    errorMessage?: string;
  }>({ isValid: true, productsWithoutRetoma: [], hasMultipleProducts: false });

  // Validar Trade-In cuando cambian los productos
  useEffect(() => {
    const validation = validateTradeInProducts(products);
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
  }, [products]);

  // Calcular si la compra aplica para 0% interés y guardarlo en localStorage
  useEffect(() => {
    try {
      const computeAndStore = () => {
        // Leer objeto existente en localStorage (si existe)
        const storedStr = localStorage.getItem("checkout-zero-interest");
        let storedObj: Record<string, unknown> | null = null;
        if (storedStr) {
          try {
            storedObj = JSON.parse(storedStr);
          } catch {
            storedObj = null;
          }
        }

        // Determinar valor global 'aplica' (preferir datos ya cargados en zeroInterestData)
        const globalAplica =
          typeof zeroInterestData?.aplica !== "undefined"
            ? zeroInterestData?.aplica
            : storedObj?.aplica ?? false;

        // Obtener id de tarjeta seleccionada (preferir paymentData.savedCard)
        const savedCardId =
          paymentData?.savedCard?.id ??
          (localStorage.getItem("checkout-saved-card-id") || null);

        // Obtener cuotas seleccionadas
        const installmentsFromState = paymentData?.installments;
        const installmentsFromStorage = localStorage.getItem(
          "checkout-installments"
        );
        const installments =
          typeof installmentsFromState !== "undefined" &&
          installmentsFromState !== null
            ? Number(installmentsFromState)
            : installmentsFromStorage
            ? Number.parseInt(installmentsFromStorage)
            : undefined;

        let aplica_zero_interes = false;

        if (globalAplica && savedCardId && zeroInterestData?.cards) {
          const matched = zeroInterestData.cards.find(
            (c) => String(c.id) === String(savedCardId)
          );
          if (
            matched &&
            matched.eligibleForZeroInterest &&
            typeof installments !== "undefined" &&
            matched.availableInstallments.includes(installments)
          ) {
            aplica_zero_interes = true;
          }
        }

        // Actualizar el objeto en localStorage sin eliminar otras propiedades
        const updatedObj = {
          ...(storedObj || (zeroInterestData ? { ...zeroInterestData } : {})),
          aplica_zero_interes,
        };

        try {
          localStorage.setItem(
            "checkout-zero-interest",
            JSON.stringify(updatedObj)
          );
        } catch (err) {
          console.error(
            "Error saving checkout-zero-interest to localStorage",
            err
          );
        }
      };

      computeAndStore();
    } catch (err) {
      console.error("Error computing aplica_zero_interes:", err);
    }
  }, [paymentData, zeroInterestData]);

  const handleConfirmOrder = async () => {
    // Validar Trade-In antes de confirmar
    const validation = validateTradeInProducts(products);
    if (!validation.isValid) {
      alert(getTradeInValidationMessage(validation));
      return;
    }

    if (!billingData) {
      console.error("No billing data available");
      return;
    }

    setIsProcessing(true);

    // Preparar información de facturación de forma segura
    const informacion_facturacion = {
      direccion_id: billingData.direccion?.id ?? "",
      email: billingData.email ?? "",
      nombre_completo: billingData.nombre ?? "",
      numero_documento: billingData.documento ?? "",
      tipo_documento: billingData.tipoDocumento ?? "",
      telefono: billingData.telefono ?? "",
      type: billingData.type ?? "",
      nit: billingData.nit,
      razon_social: billingData.razonSocial,
      representante_legal:
        billingData.nombreRepresentante || billingData.razonSocial,
    };

    try {
      // Helper to build beneficios array
      const buildBeneficios = (): BeneficiosDTO[] => {
        const beneficios: BeneficiosDTO[] = [];
        try {
          // Trade-In (entrego_y_estreno)
          const tradeStr = localStorage.getItem("imagiq_trade_in");
          if (tradeStr) {
            const parsedTrade = JSON.parse(tradeStr);
            if (parsedTrade?.completed) {
              beneficios.push({
                type: "entrego_y_estreno",
                dispositivo_a_recibir: parsedTrade.deviceName,
                valor_retoma: parsedTrade.value,
                detalles_dispositivo_a_recibir: parsedTrade.detalles,
              });
            }
          }

          // 0% interes
          const zeroStr = localStorage.getItem("checkout-zero-interest");
          if (zeroStr) {
            const parsedZero = JSON.parse(zeroStr);
            const aplicaZero =
              parsedZero?.aplica_zero_interes || parsedZero?.aplica;
            if (aplicaZero && paymentData?.method === "tarjeta") {
              const cardId =
                paymentData?.savedCard?.id ||
                localStorage.getItem("checkout-saved-card-id");
              const installments =
                paymentData?.installments ??
                Number.parseInt(
                  localStorage.getItem("checkout-installments") || "0"
                );
              const matched = parsedZero?.cards?.find(
                (c: {
                  id: string;
                  eligibleForZeroInterest: boolean;
                  availableInstallments: number[];
                }) => String(c.id) === String(cardId)
              );
              if (
                matched?.eligibleForZeroInterest &&
                matched.availableInstallments?.includes(Number(installments))
              ) {
                beneficios.push({ type: "0%_interes" });
              }
            }
          }
        } catch {
          // ignore
        }
        if (beneficios.length === 0) return [{ type: "sin_beneficios" }];
        return beneficios;
      };
      // Aquí irá la lógica para procesar el pago
      // Por ahora solo simulamos un delay
      console.log({ paymentData });

      // Determinar método de envío y código de bodega
      const deliveryMethod = (
        localStorage.getItem("checkout-delivery-method") || "domicilio"
      ).toLowerCase();
      const metodo_envio = deliveryMethod === "tienda" ? 2 : 1;
      let codigo_bodega: string | undefined = undefined;
      if (deliveryMethod === "tienda") {
        try {
          const storeStr = localStorage.getItem("checkout-store");
          if (storeStr) {
            const parsedStore = JSON.parse(storeStr);
            codigo_bodega =
              parsedStore?.codBodega || parsedStore?.codigo || undefined;
          }
        } catch {
          // ignore
        }
      }

      switch (paymentData?.method) {
        case "tarjeta": {
          const res = await payWithCard({
            currency: "COP",
            dues: String(paymentData.installments || "1"),
            items: products.map((p) => ({
              sku: String(p.sku),
              name: String(p.name),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
              skupostback:
                String(p.skuPostback) === ""
                  ? String(p.sku)
                  : String(p.skuPostback),
              desDetallada: String(p.desDetallada),
              ean: String(p.ean),
            })),
            totalAmount: String(calculations.total),
            metodo_envio,
            codigo_bodega,
            shippingAmount: String(calculations.shipping),
            userInfo: {
              direccionId: billingData.direccion?.id || "",
              userId: authContext.user?.id || "",
            },
            cardTokenId: paymentData.savedCard?.id || "",
            informacion_facturacion,
            beneficios: buildBeneficios(),
          });
          if ("error" in res) {
            throw new Error(res.message);
          }
          router.push(res.redirectionUrl);
          break;
        }
        case "pse": {
          const res = await payWithPse({
            totalAmount: String(calculations.total),
            shippingAmount: String(calculations.shipping),
            currency: "COP",
            items: products.map((p) => ({
              sku: String(p.sku),
              name: String(p.name),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
              skupostback: String(p.skuPostback),
              desDetallada: String(p.desDetallada),
              ean: String(p.ean),
            })),
            bank: paymentData.bank || "",
            description: "Pago de pedido en Imagiq",
            metodo_envio,
            codigo_bodega,
            userInfo: {
              direccionId: billingData.direccion?.id || "",
              userId: authContext.user?.id || "",
            },
            informacion_facturacion,
            beneficios: buildBeneficios(),
            bankName: paymentData.bankName || "",
          });
          if ("error" in res) {
            throw new Error(res.message);
          }
          router.push(res.redirectUrl);
          break;
        }
        case "addi": {
          const res = await payWithAddi({
            totalAmount: String(calculations.total),
            shippingAmount: String(calculations.shipping),
            currency: "COP",
            items: products.map((p) => ({
              sku: String(p.sku),
              name: String(p.name),
              quantity: String(p.quantity),
              unitPrice: String(p.price),
              skupostback: String(p.skuPostback),
              desDetallada: String(p.desDetallada),
              ean: String(p.ean),
            })),
            metodo_envio,
            codigo_bodega,
            userInfo: {
              direccionId: billingData.direccion?.id || "",
              userId: authContext.user?.id || "",
            },
            informacion_facturacion,
            beneficios: buildBeneficios(),
          });
          if ("error" in res) {
            throw new Error(res.message);
          }
          router.push(res.redirectUrl);
          break;
        }
        default:
          throw new Error("Método de pago no soportado");
      }
      // Redirigir a página de éxito
      /* router.push("/success-checkout/123456"); */
    } catch (error) {
      console.error("Error processing payment:", error);
      setIsProcessing(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "tarjeta":
        return "Tarjeta de crédito/débito";
      case "pse":
        return "PSE - Pago Seguro en Línea";
      case "addi":
        return "Paga a cuotas con Addi";
      default:
        return method;
    }
  };

  // Verificar si las cuotas seleccionadas son elegibles para cero interés
  const isInstallmentEligibleForZeroInterest = (
    installments: number,
    cardId: string
  ): boolean => {
    if (!zeroInterestData?.cards) return false;

    const cardInfo = zeroInterestData.cards.find((c) => c.id === cardId);
    if (!cardInfo?.eligibleForZeroInterest) return false;

    return cardInfo.availableInstallments.includes(installments);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Confirma tu pedido
          </h1>
          <p className="text-gray-600 mt-1">
            Revisa todos los detalles antes de confirmar tu compra
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sección de resumen */}
          <div className="lg:col-span-2 space-y-4">
            {/* Método de pago */}
            {paymentData && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Método de pago
                      </h2>
                      <p className="text-sm text-gray-600">
                        {getPaymentMethodLabel(paymentData.method)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/carrito/step4")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                </div>

                <div className="space-y-3">
                  {paymentData.method === "tarjeta" && (
                    <>
                      {/* Mostrar detalles de tarjeta guardada */}
                      {paymentData.savedCard && (
                        <>
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CardBrandLogo
                              brand={paymentData.savedCard.marca}
                              size="md"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 tracking-wider">
                                  •••• {paymentData.savedCard.ultimos_dijitos}
                                </span>
                                {paymentData.savedCard.tipo_tarjeta && (
                                  <span className="text-xs text-gray-500 uppercase">
                                    {paymentData.savedCard.tipo_tarjeta
                                      .toUpperCase()
                                      .includes("CREDIT")
                                      ? "Crédito"
                                      : "Débito"}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col gap-1 mt-1 text-xs text-gray-600">
                                {paymentData.savedCard.nombre_titular && (
                                  <span className="uppercase">
                                    {paymentData.savedCard.nombre_titular}
                                  </span>
                                )}
                                {paymentData.savedCard.banco && (
                                  <span>{paymentData.savedCard.banco}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          {paymentData.installments && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Cuotas:</span>
                              <span className="font-medium text-gray-900">
                                {paymentData.installments}x
                                {paymentData.savedCard &&
                                  isInstallmentEligibleForZeroInterest(
                                    paymentData.installments,
                                    String(paymentData.savedCard.id)
                                  ) && (
                                    <span className="ml-2 text-green-600 font-semibold">
                                      (sin interés)
                                    </span>
                                  )}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      {/* Mostrar detalles de tarjeta nueva */}
                      {paymentData.cardData && (
                        <>
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            {paymentData.cardData.brand && (
                              <CardBrandLogo
                                brand={paymentData.cardData.brand}
                                size="md"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 tracking-wider">
                                  ••••{" "}
                                  {paymentData.cardData.cardNumber.slice(-4)}
                                </span>
                                {paymentData.cardData.cardType && (
                                  <span className="text-xs text-gray-500 uppercase">
                                    {paymentData.cardData.cardType
                                      .toUpperCase()
                                      .includes("CREDIT")
                                      ? "Crédito"
                                      : "Débito"}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col gap-1 mt-1 text-xs text-gray-600">
                                {paymentData.cardData.cardHolder && (
                                  <span className="uppercase">
                                    {paymentData.cardData.cardHolder}
                                  </span>
                                )}
                                {paymentData.cardData.bank && (
                                  <span>{paymentData.cardData.bank}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          {paymentData.installments && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Cuotas:</span>
                              <span className="font-medium text-gray-900">
                                {paymentData.installments}x
                                {(() => {
                                  // Para tarjetas nuevas, intentar obtener el ID de localStorage
                                  const savedCardId = localStorage.getItem(
                                    "checkout-saved-card-id"
                                  );
                                  return (
                                    savedCardId &&
                                    isInstallmentEligibleForZeroInterest(
                                      paymentData.installments,
                                      savedCardId
                                    ) && (
                                      <span className="ml-2 text-green-600 font-semibold">
                                        (sin interés)
                                      </span>
                                    )
                                  );
                                })()}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {paymentData.method === "pse" && paymentData.bank && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Banco:</span>
                      <span className="font-medium text-gray-900">
                        {paymentData.bankName || paymentData.bank}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Método de entrega */}
            {shippingData && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {shippingData.type === "delivery" ? (
                        <Truck className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Store className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Método de entrega
                      </h2>
                      <p className="text-sm text-gray-600">
                        {shippingData.type === "delivery"
                          ? "Envío a domicilio"
                          : "Recogida en tienda"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/carrito/step3")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                </div>

                {shippingData.type === "delivery" && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {shippingData.address}
                      </p>
                      {shippingData.city && (
                        <p className="text-xs text-gray-600 mt-1">
                          {shippingData.city}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {shippingData.type === "pickup" && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Store className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {shippingData.store?.name || "Recoger en tienda"}
                        </p>
                        {shippingData.store?.address && (
                          <p className="text-xs text-gray-600 mt-1">
                            {shippingData.store.address}
                          </p>
                        )}
                        {shippingData.store?.city && (
                          <p className="text-xs text-gray-500">
                            {shippingData.store.city}
                          </p>
                        )}
                        {shippingData.store?.schedule && (
                          <p className="text-xs text-gray-500 mt-1">
                            Horario: {shippingData.store.schedule}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Datos de facturación */}
            {billingData && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Datos de facturación
                      </h2>
                      <p className="text-sm text-gray-600">
                        {billingData.type === "natural"
                          ? "Persona Natural"
                          : "Persona Jurídica"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/carrito/step6")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Razón Social (solo para jurídica) - ocupa todo el ancho */}
                  {billingData.type === "juridica" &&
                    billingData.razonSocial && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Razón Social
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {billingData.razonSocial}
                        </p>
                      </div>
                    )}

                  {/* Grid de 2 columnas para los demás campos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* NIT (solo para jurídica) */}
                    {billingData.type === "juridica" && billingData.nit && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">NIT</p>
                        <p className="text-sm font-medium text-gray-900">
                          {billingData.nit}
                        </p>
                      </div>
                    )}

                    {/* Nombre */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nombre</p>
                      <p className="text-sm font-medium text-gray-900">
                        {billingData.nombre}
                      </p>
                    </div>

                    {/* Documento */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Documento</p>
                      <p className="text-sm font-medium text-gray-900">
                        {billingData.documento}
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {billingData.email}
                      </p>
                    </div>

                    {/* Teléfono */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                      <p className="text-sm font-medium text-gray-900">
                        {billingData.telefono}
                      </p>
                    </div>
                  </div>

                  {/* Dirección de facturación - ocupa todo el ancho */}
                  {billingData.direccion && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Dirección de facturación
                      </p>
                      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {billingData.direccion.linea_uno}
                          </p>
                          {billingData.direccion.ciudad && (
                            <p className="text-xs text-gray-600 mt-1">
                              {billingData.direccion.ciudad}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Resumen de compra y Trade-In */}
          <div className="lg:col-span-1 space-y-4">
            <Step4OrderSummary
              isProcessing={isProcessing}
              onFinishPayment={handleConfirmOrder}
              onBack={onBack}
              buttonText="Confirmar y pagar"
              disabled={isProcessing || !tradeInValidation.isValid}
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
          </div>
        </div>
      </div>
    </div>
  );
}
