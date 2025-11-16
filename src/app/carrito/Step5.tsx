"use client";
import React, { useState, useEffect } from "react";
import Step4OrderSummary from "./components/Step4OrderSummary";
import TradeInCompletedSummary from "@/app/productos/dispositivos-moviles/detalles-producto/estreno-y-entrego/TradeInCompletedSummary";
import { useCart } from "@/hooks/useCart";

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
  const { calculations } = useCart();
  const [selectedInstallments, setSelectedInstallments] = useState<number | null>(null);

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

  // Obtener la tarjeta seleccionada del localStorage
  const getSelectedCard = () => {
    const savedCardId = localStorage.getItem("checkout-selected-card-id");
    return savedCardId || null;
  };

  const selectedCardId = getSelectedCard();

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de selección de cuotas */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-[22px] font-bold mb-6">Elige las cuotas</h2>

              {/* Información de la tarjeta seleccionada */}
              {selectedCardId && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">CARD</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Tarjeta terminada en •••• {selectedCardId.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nota sobre intereses */}
              <p className="text-sm text-gray-600 mb-6">
                * Los intereses serán aplicados por tu entidad bancaria.
              </p>

              {/* Opciones de cuotas */}
              <div className="space-y-3">
                {installmentOptions.map((option) => (
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
                      <p className="text-sm text-gray-600">
                        {formatPrice(option.totalAmount)} *
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen de compra y Trade-In */}
          <div className="lg:col-span-1 space-y-4">
            <Step4OrderSummary
              onFinishPayment={handleContinue}
              onBack={onBack}
              buttonText="Continuar"
              disabled={selectedInstallments === null}
            />

            {/* Banner de Trade-In - Debajo del resumen */}
            {tradeInData?.completed && (
              <TradeInCompletedSummary
                deviceName={tradeInData.deviceName}
                tradeInValue={tradeInData.value}
                onEdit={handleRemoveTradeIn}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
