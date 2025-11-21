"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";
import CreditCardForm, { CardData, CardErrors } from "./CreditCardForm";
import SaveInfoCheckbox from "./SaveInfoCheckbox";
import { PaymentMethod, CheckZeroInterestResponse } from "../types";
import { useAuthContext } from "@/features/auth/context";
import CardBrandLogo from "@/components/ui/CardBrandLogo";
import pseLogo from "@/img/iconos/logo-pse.png";
import addiLogo from "@/img/iconos/addi_negro.png";
import { fetchBanks } from "../utils";
import { useCardsCache } from "../hooks/useCardsCache";

interface PaymentFormProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  card: CardData;
  cardErrors: CardErrors;
  onCardChange: (card: CardData) => void;
  onCardErrorChange: (errors: Partial<CardErrors>) => void;
  saveInfo: boolean;
  onSaveInfoChange: (save: boolean) => void;
  selectedBank?: string;
  onBankChange?: (bankCode: string, bankName?: string) => void;
  selectedCardId: string | null;
  onCardSelect: (cardId: string | null) => void;
  onOpenAddCardModal: () => void;
  useNewCard: boolean;
  onUseNewCardChange: (useNew: boolean) => void;
  savedCardsReloadCounter?: number;
  zeroInterestData?: CheckZeroInterestResponse | null;
  isLoadingZeroInterest?: boolean;
  onFetchZeroInterest?: (cardIds: string[]) => void;
}

export default function PaymentForm({
  paymentMethod,
  onPaymentMethodChange,
  card,
  cardErrors,
  onCardChange,
  onCardErrorChange,
  saveInfo,
  onSaveInfoChange,
  selectedBank,
  onBankChange,
  selectedCardId,
  onCardSelect,
  onOpenAddCardModal,
  useNewCard,
  onUseNewCardChange,
  savedCardsReloadCounter,
  zeroInterestData,
  isLoadingZeroInterest,
  onFetchZeroInterest,
}: PaymentFormProps) {
  const authContext = useAuthContext();
  const { savedCards, isLoadingCards, loadSavedCards } = useCardsCache();
  const [banks, setBanks] = useState<{ bankCode: string; bankName: string }[]>(
    []
  );

  // Helper para obtener el userId (autenticado o invitado)
  const getUserId = (): string | null => {
    if (authContext.user?.id) {
      return authContext.user.id;
    }

    try {
      const storedUser = localStorage.getItem("imagiq_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser.id || null;
      }
    } catch (error) {
    
    }

    return null;
  };

  // Helper para obtener el máximo de cuotas sin interés de una tarjeta
  const getMaxInstallments = (cardId: string): number | null => {
    if (!zeroInterestData?.cards) return null;

    const cardInfo = zeroInterestData.cards.find((c) => c.id === cardId);
    if (!cardInfo?.eligibleForZeroInterest) return null;

    return Math.max(...cardInfo.availableInstallments);
  };

  // Cargar bancos para PSE
  useEffect(() => {
    fetchBanks().then((res) => {
      setBanks(res);
    });
  }, []);

  // Cargar tarjetas guardadas al montar
  useEffect(() => {
    const userId = getUserId();
    
    if (userId) {
      loadSavedCards();
    }
  }, [authContext.user?.id, loadSavedCards]);

  // Volver a cargar tarjetas si el contador cambia (se incrementa cuando se agrega una nueva tarjeta)
  useEffect(() => {
    const userId = getUserId();
    if (userId && savedCardsReloadCounter !== undefined && savedCardsReloadCounter > 0) {
      loadSavedCards(true); // true = forzar recarga
    }
  }, [authContext.user?.id, savedCardsReloadCounter, loadSavedCards]);

  // Auto-seleccionar la tarjeta predeterminada cuando se cargan las tarjetas
  useEffect(() => {
    
    if (
      savedCards.length > 0 &&
      !selectedCardId &&
      paymentMethod === "tarjeta"
    ) {
      const defaultCard =
        savedCards.find((card) => card.es_predeterminada) || savedCards[0];
      if (defaultCard) {
        onCardSelect(String(defaultCard.id));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedCards.length, paymentMethod]);

  // Llamar a fetchZeroInterestInfo cuando se cargan las tarjetas
  useEffect(() => {
    if (savedCards.length > 0 && onFetchZeroInterest) {
      const cardIds = savedCards.map((card) => String(card.id));
      onFetchZeroInterest(cardIds);
    }
  }, [savedCards, onFetchZeroInterest]);

  // Activar automáticamente "useNewCard" cuando no hay tarjetas guardadas
  useEffect(() => {
    if (
      savedCards.length === 0 &&
      !useNewCard &&
      paymentMethod === "tarjeta" &&
      !isLoadingCards
    ) {
      // Si no hay tarjetas guardadas, activar automáticamente el modo de nueva tarjeta
      onUseNewCardChange(true);
    }
  }, [savedCards.length, useNewCard, paymentMethod, isLoadingCards, onUseNewCardChange]);

  // Obtener tarjeta predeterminada
  const defaultCard =
    savedCards.find((card) => card.es_predeterminada) || savedCards[0];

  // Filtrar tarjetas activas y no expiradas, excluyendo la predeterminada (ya está en Recomendados)
  const activeCards = savedCards.filter((card) => {
  
    if (!card.activa) return false;
    if (card.fecha_vencimiento) {
      const [month, year] = card.fecha_vencimiento.split("/");
      const expDate = new Date(
        2000 + Number.parseInt(year),
        Number.parseInt(month) - 1
      );
      if (expDate < new Date()) return false;
    }
    // Excluir la tarjeta que ya está en Recomendados
    return defaultCard ? String(card.id) !== String(defaultCard.id) : true;
  });


  // Mostrar skeleton completo cuando:
  // 1. Se están cargando las tarjetas inicialmente
  // 2. Se está cargando zero interest PERO aún no tenemos tarjetas cargadas
  const shouldShowFullSkeleton =
    isLoadingCards ||
    (isLoadingZeroInterest && savedCards.length === 0);

  if (shouldShowFullSkeleton) {
    return (
      <div>
        <h2 className="text-[22px] font-bold mb-6">Elije como pagar</h2>

        <div className="animate-pulse space-y-6">
          {/* Skeleton de Recomendados */}
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>
            <div className="rounded-xl overflow-hidden p-6 bg-gray-100 border border-gray-200">
              <div className="space-y-4">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
                <div className="h-16 bg-gray-200 rounded-lg"></div>
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Skeleton de Tarjetas guardadas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
              <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[22px] font-bold mb-6">Elije como pagar</h2>

      {/* Sección de Recomendados */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-700 mb-3">
          Recomendados
        </h3>
        <div
          className="rounded-xl overflow-hidden"
          style={{
            boxShadow: "0 2px 8px #0001",
            background: "#F3F3F3",
            border: "1px solid #E5E5E5",
          }}
        >
          <div
            className="px-6 py-2 flex flex-col gap-2"
            style={{ background: "#fff" }}
          >
            {/* Tarjeta predeterminada */}
            {defaultCard && (
              <label className="flex items-center gap-3 justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors px-3 -mx-3">
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={
                      paymentMethod === "tarjeta" &&
                      selectedCardId === String(defaultCard.id)
                    }
                    onChange={() => {
                      onPaymentMethodChange("tarjeta");
                      onCardSelect(String(defaultCard.id));
                      onUseNewCardChange(false);
                    }}
                    className="accent-black w-5 h-5 flex-shrink-0"
                  />
                  <CardBrandLogo brand={defaultCard.marca} size="md" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 tracking-wider">
                        •••• {defaultCard.ultimos_dijitos}
                      </span>
                      {defaultCard.tipo_tarjeta && (
                        <span className="text-xs text-gray-500 uppercase">
                          {defaultCard.tipo_tarjeta
                            .toUpperCase()
                            .includes("CREDIT")
                            ? "Crédito"
                            : "Débito"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {defaultCard.nombre_titular && (
                        <span className="uppercase">
                          {defaultCard.nombre_titular}
                        </span>
                      )}
                      {defaultCard.banco && (
                        <>
                          {defaultCard.nombre_titular && <span>•</span>}
                          <span>{defaultCard.banco}</span>
                        </>
                      )}
                    </div>
                  </div>
                </span>
                {defaultCard.es_predeterminada && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    Predeterminada
                  </span>
                )}
              </label>
            )}

            {/* PSE */}
            <label className="flex items-center gap-3 justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors px-3 -mx-3">
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "pse"}
                  onChange={() => onPaymentMethodChange("pse")}
                  className="accent-black w-5 h-5 flex-shrink-0"
                />
                <span className="font-medium text-black">
                  PSE - Débito bancario
                </span>
              </span>
              <Image
                src={pseLogo}
                alt="PSE"
                width={35}
                height={35}
                className="object-contain"
              />
            </label>

            {/* Bank selector for PSE */}
            {paymentMethod === "pse" && (
              <div className="ml-8 mb-3 mt-1">
                <label
                  htmlFor="bank-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Selecciona tu banco
                </label>
                <select
                  id="bank-select"
                  value={selectedBank || ""}
                  onChange={(e) => {
                    const code = e.target.value;
                    const bank = banks.find((b) => b.bankCode === code);
                    onBankChange?.(code, bank?.bankName);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white"
                  required={paymentMethod === "pse"}
                >
                  <option value="">Elige tu banco...</option>
                  {banks.map((bank) => (
                    <option key={bank.bankCode} value={bank.bankCode}>
                      {bank.bankName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Addi */}
            <label className="flex items-center gap-3 justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors px-3 -mx-3">
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "addi"}
                  onChange={() => onPaymentMethodChange("addi")}
                  className="accent-black w-5 h-5 flex-shrink-0"
                />
                <span className="font-medium text-black">
                  Addi - Paga después
                </span>
              </span>
              <Image
                src={addiLogo}
                alt="Addi"
                width={35}
                height={35}
                className="object-contain"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Sección de Tarjetas guardadas */}
      {activeCards.length > 0 ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-700">
              Tarjetas guardadas
            </h3>
            <button
              type="button"
              onClick={onOpenAddCardModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-black text-white hover:bg-gray-800 font-medium transition-colors rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {activeCards.map((card) => {
                const isSelected =
                  paymentMethod === "tarjeta" &&
                  selectedCardId === String(card.id);

                return (
                  <label
                    key={card.id}
                    className={`flex items-center gap-3 justify-between py-3 px-4 cursor-pointer rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={isSelected}
                      onChange={() => {
                        onPaymentMethodChange("tarjeta");
                        onCardSelect(String(card.id));
                        onUseNewCardChange(false);
                      }}
                      className="sr-only"
                    />
                    <span className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-black bg-black"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <CardBrandLogo brand={card.marca} size="md" />
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 tracking-wider">
                            •••• {card.ultimos_dijitos}
                          </span>
                          {card.tipo_tarjeta && (
                            <span className="text-xs text-gray-500 uppercase">
                              {card.tipo_tarjeta
                                .toUpperCase()
                                .includes("CREDIT")
                                ? "Crédito"
                                : "Débito"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          {card.nombre_titular && (
                            <span className="uppercase">
                              {card.nombre_titular}
                            </span>
                          )}
                          {card.banco && (
                            <>
                              {card.nombre_titular && <span>•</span>}
                              <span>{card.banco}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </span>
                    {(() => {
                      const maxInstallments = getMaxInstallments(
                        String(card.id)
                      );
                      return maxInstallments && maxInstallments > 1 ? (
                        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0">
                          Hasta {maxInstallments} cuotas sin interés
                        </span>
                      ) : null;
                    })()}
                  </label>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-700">
              No tienes tarjetas guardadas
            </h3>
            <button
              type="button"
              onClick={onOpenAddCardModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-black text-white hover:bg-gray-800 font-medium transition-colors rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Agregar desde perfil
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Ingresa los datos de tu tarjeta para continuar con el pago
          </p>
        </div>
      )}

      {/* Formulario de nueva tarjeta (si el usuario elige agregar O no tiene tarjetas guardadas) */}
      {paymentMethod === "tarjeta" && (useNewCard || activeCards.length === 0) && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-700 mb-3">
            Nueva tarjeta
          </h3>
          <div
            className="rounded-xl overflow-hidden p-6"
            style={{
              boxShadow: "0 2px 8px #0001",
              background: "#fff",
              border: "1px solid #E5E5E5",
            }}
          >
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <SiVisa className="w-11 h-6 text-[#1A1F71]" />
              <SiMastercard className="w-11 h-6 text-[#EB001B]" />
              <SiAmericanexpress className="w-11 h-6 text-[#006FCF]" />
            </div>
            <CreditCardForm
              card={card}
              cardErrors={cardErrors}
              onCardChange={onCardChange}
              onErrorChange={onCardErrorChange}
              isVisible={true}
            />
          </div>
        </div>
      )}

      {/* Save info checkbox - solo mostrar si usa nueva tarjeta o no tiene tarjetas guardadas */}
      {paymentMethod === "tarjeta" && (useNewCard || activeCards.length === 0) && (
        <SaveInfoCheckbox checked={saveInfo} onChange={onSaveInfoChange} />
      )}
    </div>
  );
}
