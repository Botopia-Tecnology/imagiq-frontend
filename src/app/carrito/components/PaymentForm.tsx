"use client";
import React, { useState, useEffect } from "react";
import PaymentMethodSelector from "./PaymentMethodSelector";
import CreditCardForm, { CardData, CardErrors } from "./CreditCardForm";
import AlternativePaymentMethods from "./AlternativePaymentMethods";
import SaveInfoCheckbox from "./SaveInfoCheckbox";
import SavedCardsSelector from "./SavedCardsSelector";
import { PaymentMethod } from "../types";
import { PaymentCardData, profileService } from "@/services/profile.service";
import { useAuthContext } from "@/features/auth/context";

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
  onBankChange?: (bank: string) => void;
  // Nuevos props para tarjetas guardadas
  selectedCardId: string | null;
  onCardSelect: (cardId: string | null) => void;
  onOpenAddCardModal: () => void;
  useNewCard: boolean;
  onUseNewCardChange: (useNew: boolean) => void;
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
}: PaymentFormProps) {
  const authContext = useAuthContext();
  const [savedCards, setSavedCards] = useState<PaymentCardData[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);

  // Cargar tarjetas guardadas cuando el usuario selecciona "tarjeta"
  useEffect(() => {
    if (paymentMethod === "tarjeta" && authContext.user?.id) {
      loadSavedCards();
    }
  }, [paymentMethod, authContext.user?.id]);

  const loadSavedCards = async () => {
    try {
      setIsLoadingCards(true);
      const cards = await profileService.getUserPaymentMethods(authContext.user?.id);
      setSavedCards(cards);
    } catch (error) {
      console.error("Error cargando tarjetas:", error);
      setSavedCards([]);
    } finally {
      setIsLoadingCards(false);
    }
  };

  // Handler para cuando el usuario agrega una nueva tarjeta
  const handleCardAdded = async () => {
    await loadSavedCards();
    onUseNewCardChange(false); // Volver a modo de selección
  };

  return (
    <div>
      <h2 className="text-[22px] font-bold mb-4">Método de pago</h2>

      <div
        className="rounded-xl overflow-hidden mb-6"
        style={{
          boxShadow: "0 2px 8px #0001",
          background: "#F3F3F3",
          border: "1px solid #E5E5E5",
          padding: 0,
        }}
      >
        {/* Payment method selector with card logos */}
        <PaymentMethodSelector
          selectedMethod={paymentMethod}
          onMethodChange={onPaymentMethodChange}
        />

        {/* Tarjetas guardadas o formulario de nueva tarjeta */}
        {paymentMethod === "tarjeta" && (
          <div className="p-6 bg-white">
            {!useNewCard ? (
              // Mostrar selector de tarjetas guardadas
              <SavedCardsSelector
                userId={authContext.user?.id || ""}
                cards={savedCards}
                selectedCardId={selectedCardId}
                onCardSelect={onCardSelect}
                onAddNewCard={onOpenAddCardModal}
                isLoading={isLoadingCards}
              />
            ) : (
              // Mostrar formulario de nueva tarjeta
              <CreditCardForm
                card={card}
                cardErrors={cardErrors}
                onCardChange={onCardChange}
                onErrorChange={onCardErrorChange}
                isVisible={true}
              />
            )}
          </div>
        )}

        {/* Alternative payment methods */}
        <AlternativePaymentMethods
          selectedMethod={paymentMethod}
          onMethodChange={onPaymentMethodChange}
          selectedBank={selectedBank}
          onBankChange={onBankChange}
        />
      </div>

      {/* Save info checkbox - solo mostrar si usa nueva tarjeta */}
      {paymentMethod === "tarjeta" && useNewCard && (
        <SaveInfoCheckbox checked={saveInfo} onChange={onSaveInfoChange} />
      )}
    </div>
  );
}
