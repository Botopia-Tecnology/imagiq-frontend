"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import { useCart } from "@/hooks/useCart";
import { validateTradeInProducts, getTradeInValidationMessage } from "./utils/validateTradeIn";
import { toast } from "sonner";
import { CheckZeroInterestResponse } from "./types";
import { DBCard } from "@/features/profile/types";
import CardBrandLogo from "@/components/ui/CardBrandLogo";

interface Step5Props {
  onBack?: () => void;
  onContinue?: () => void;
}

interface InstallmentOption {
  installments: number;
  installmentAmount: number;
  totalAmount: number;
  interestRate: number;
  hasInterest: boolean;
}

export default function Step5({ onBack, onContinue }: Step5Props) {
  const router = useRouter();
  const { calculations, products } = useCart();
  const [selectedInstallments, setSelectedInstallments] = useState<number | null>(null);
  const [zeroInterestData, setZeroInterestData] = useState<CheckZeroInterestResponse | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<DBCard | null>(null);

  // Trade-In state management
  const [tradeInData, setTradeInData] = useState<{
    completed: boolean;
    deviceName: string;
    value: number;
  } | null>(null);

  // Cargar cuotas guardadas de localStorage
  useEffect(() => {
    const savedInstallments = localStorage.getItem("checkout-installments");
    if (savedInstallments) {
      setSelectedInstallments(parseInt(savedInstallments));
    }

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

    // Cargar ID de tarjeta seleccionada
    const cardId = localStorage.getItem("checkout-saved-card-id");
    setSelectedCardId(cardId);

    // Cargar datos completos de la tarjeta seleccionada
    if (cardId) {
      try {
        const cardsCache = localStorage.getItem("checkout-cards-cache");
        if (cardsCache) {
          const cards = JSON.parse(cardsCache) as DBCard[];
          const card = cards.find((c) => String(c.id) === cardId);
          if (card) {
            setSelectedCard(card);
          }
        }
      } catch (error) {
        console.error("Error loading selected card data:", error);
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
    
    // Si se elimina el trade-in y el método está en "tienda", cambiar a "domicilio"
    if (typeof globalThis.window !== "undefined") {
      const currentMethod = globalThis.window.localStorage.getItem("checkout-delivery-method");
      if (currentMethod === "tienda") {
        globalThis.window.localStorage.setItem("checkout-delivery-method", "domicilio");
        globalThis.window.dispatchEvent(
          new CustomEvent("delivery-method-changed", { detail: { method: "domicilio" } })
        );
        globalThis.window.dispatchEvent(new Event("storage"));
      }
    }
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
    if (!validation.isValid && validation.errorMessage && validation.errorMessage.includes("Te removimos")) {
      // Limpiar localStorage inmediatamente
      localStorage.removeItem("imagiq_trade_in");

      // Quitar el banner inmediatamente
      setTradeInData(null);

      // Mostrar notificación toast
      toast.error("Cupón removido", {
        description: "El producto seleccionado ya no aplica para el beneficio Estreno y Entrego",
        duration: 5000,
      });
    }
  }, [products]);

  // Redirigir a Step3 si la dirección cambia desde el header
  useEffect(() => {
    const handleAddressChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const fromHeader = customEvent.detail?.fromHeader;

      if (fromHeader) {
        console.log('🔄 Dirección cambiada desde header en Step5, redirigiendo a Step3...');
        router.push('/carrito/step3');
      }
    };

    window.addEventListener('address-changed', handleAddressChange as EventListener);

    return () => {
      window.removeEventListener('address-changed', handleAddressChange as EventListener);
    };
  }, [router]);

  // Calcular opciones de cuotas basadas en el total del carrito
  const calculateInstallments = (): InstallmentOption[] => {
    const total = calculations.total;

    return [
      {
        installments: 1,
        installmentAmount: total,
        totalAmount: total,
        interestRate: 0,
        hasInterest: false,
      },
      {
        installments: 2,
        installmentAmount: total / 2,
        totalAmount: total,
        interestRate: 0,
        hasInterest: false,
      },
      {
        installments: 3,
        installmentAmount: total / 3,
        totalAmount: total,
        interestRate: 0,
        hasInterest: false,
      },
      {
        installments: 6,
        installmentAmount: total / 6,
        totalAmount: total,
        interestRate: 0,
        hasInterest: false,
      },
      {
        installments: 9,
        installmentAmount: total / 9,
        totalAmount: total,
        interestRate: 0,
        hasInterest: false,
      },
      {
        installments: 12,
        installmentAmount: total / 12,
        totalAmount: total,
        interestRate: 0,
        hasInterest: false,
      },
      {
        installments: 15,
        installmentAmount: total / 15,
        totalAmount: total,
        interestRate: 0,
        hasInterest: false,
      },
      {
        installments: 24,
        installmentAmount: total / 24,
        totalAmount: total,
        interestRate: 0,
        hasInterest: false,
      },
    ];
  };

  const installmentOptions = calculateInstallments();

  const handleInstallmentSelect = (installments: number) => {
    setSelectedInstallments(installments);
  };

  const handleContinue = () => {
    // Validar Trade-In antes de continuar
    const validation = validateTradeInProducts(products);
    if (!validation.isValid) {
      alert(getTradeInValidationMessage(validation));
      return;
    }

    if (selectedInstallments === null) {
      return;
    }

    // Guardar cuotas seleccionadas en localStorage
    localStorage.setItem("checkout-installments", selectedInstallments.toString());

    if (onContinue) {
      onContinue();
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Verificar si una cuota es elegible para cero interés
  const isInstallmentEligibleForZeroInterest = (installments: number): boolean => {
    if (!zeroInterestData?.cards || !selectedCardId) return false;

    const cardInfo = zeroInterestData.cards.find(c => c.id === selectedCardId);
    if (!cardInfo?.eligibleForZeroInterest) return false;

    return cardInfo.availableInstallments.includes(installments);
  };

  return (
    <div className="min-h-screen w-full pb-40 md:pb-0">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de selección de cuotas */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              {/* Título y tarjeta seleccionada */}
              <div className="flex items-start justify-between mb-6 gap-4">
                <h2 className="text-[22px] font-bold">Elige las cuotas</h2>
                {selectedCard && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 flex-shrink-0">
                    {/* Logo de marca */}
                    <div className="flex-shrink-0">
                      <CardBrandLogo brand={selectedCard.marca} size="md" />
                    </div>

                    {/* Información de la tarjeta */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-gray-900 tracking-wider text-sm">
                          •••• {selectedCard.ultimos_dijitos}
                        </p>
                        {selectedCard.es_predeterminada && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                            Predeterminada
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-600">
                        {selectedCard.banco && (
                          <span className="font-medium">{selectedCard.banco}</span>
                        )}
                        {selectedCard.tipo_tarjeta && selectedCard.banco && (
                          <span className="text-gray-400">•</span>
                        )}
                        {selectedCard.tipo_tarjeta && (
                          <span className="uppercase">
                            {selectedCard.tipo_tarjeta.includes("credit") ? "Crédito" : "Débito"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Nota sobre intereses */}
              <p className="text-sm text-gray-600 mb-6">
                * Los intereses serán manejados por tu entidad bancaria.
              </p>

              {/* Opciones de cuotas */}
              <div className="space-y-3">
                {installmentOptions.map((option) => {
                  const isZeroInterest = isInstallmentEligibleForZeroInterest(option.installments);

                  return (
                    <label
                      key={option.installments}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedInstallments === option.installments
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="installments"
                          value={option.installments}
                          checked={selectedInstallments === option.installments}
                          onChange={() => handleInstallmentSelect(option.installments)}
                          className="w-4 h-4 accent-black"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {option.installments}x {formatPrice(option.installmentAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        {isZeroInterest ? (
                          <p className="text-sm font-semibold text-green-600">
                            0% de interés
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600">
                            {formatPrice(option.totalAmount)} *
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resumen de compra y Trade-In - Hidden en mobile */}
          <aside className="hidden md:block lg:col-span-1 space-y-4">
            <Step4OrderSummary
              onFinishPayment={handleContinue}
              onBack={onBack}
              buttonText="Continuar"
              disabled={selectedInstallments === null || !tradeInValidation.isValid}
              isSticky={false}
              shouldCalculateCanPickUp={false}
              deliveryMethod={
                typeof window !== "undefined"
                  ? (() => {
                      const method = localStorage.getItem("checkout-delivery-method");
                      if (method === "tienda") return "pickup";
                      if (method === "domicilio") return "delivery";
                      if (method === "delivery" || method === "pickup") return method;
                      return undefined;
                    })()
                  : undefined
              }
            />

            {/* Banner de Trade-In - Debajo del resumen (baja con el scroll) */}
            {tradeInData?.completed && (
              <TradeInCompletedSummary
                deviceName={tradeInData.deviceName}
                tradeInValue={tradeInData.value}
                onEdit={handleRemoveTradeIn}
                validationError={!tradeInValidation.isValid ? getTradeInValidationMessage(tradeInValidation) : undefined}
              />
            )}
          </aside>
        </div>
      </div>

      {/* Sticky Bottom Bar - Solo Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="p-4">
          {/* Resumen compacto */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500">
                Total ({products.reduce((acc, p) => acc + p.quantity, 0)}{" "}
                productos)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                $ {Number(calculations.total).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Botón continuar */}
          <button
            className={`w-full font-bold py-3 rounded-lg text-base transition text-white ${
              selectedInstallments === null || !tradeInValidation.isValid
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-[#222] hover:bg-[#333] cursor-pointer"
            }`}
            onClick={handleContinue}
            disabled={selectedInstallments === null || !tradeInValidation.isValid}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
