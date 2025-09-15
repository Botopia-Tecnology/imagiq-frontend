"use client";
import React from "react";
import PaymentMethodSelector from "./PaymentMethodSelector";
import CreditCardForm, { CardData, CardErrors } from "./CreditCardForm";
import AlternativePaymentMethods from "./AlternativePaymentMethods";
import SaveInfoCheckbox from "./SaveInfoCheckbox";
import { PaymentMethod } from "../types";

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
}: PaymentFormProps) {
  return (
    <div>
      <h2 className="text-[22px] font-bold mb-4">Metodo de pago</h2>

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

        {/* Credit card form */}
        <CreditCardForm
          card={card}
          cardErrors={cardErrors}
          onCardChange={onCardChange}
          onErrorChange={onCardErrorChange}
          isVisible={paymentMethod === "tarjeta"}
        />

        {/* Alternative payment methods */}
        <AlternativePaymentMethods
          selectedMethod={paymentMethod}
          onMethodChange={onPaymentMethodChange}
          selectedBank={selectedBank}
          onBankChange={onBankChange}
        />
      </div>

      {/* Save info checkbox */}
      <SaveInfoCheckbox checked={saveInfo} onChange={onSaveInfoChange} />
    </div>
  );
}
