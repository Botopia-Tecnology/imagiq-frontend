"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import { useCart } from "@/hooks/useCart";
import { validateTradeInProducts, getTradeInValidationMessage } from "./utils/validateTradeIn";
import { toast } from "sonner";
import { CheckZeroInterestResponse } from "./types";

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
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de selección de cuotas */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              {/* Título y tarjeta seleccionada */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[22px] font-bold">Elige las cuotas</h2>
                {selectedCardId && (
                  <p className="text-sm text-gray-600">
                    Tarjeta terminada en •••• {selectedCardId.slice(-4)}
                  </p>
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

          {/* Resumen de compra y Trade-In */}
          <aside className="lg:col-span-1 space-y-4">
            <Step4OrderSummary
              onFinishPayment={handleContinue}
              onBack={onBack}
              buttonText="Continuar"
              disabled={selectedInstallments === null || !tradeInValidation.isValid}
              isSticky={false}
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
    </div>
  );
}
