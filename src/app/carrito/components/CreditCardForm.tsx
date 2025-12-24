"use client";
import React from "react";

interface CardData {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  name: string;
  docType: string;
  docNumber: string;
  installments: string;
}

interface CardErrors {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  name: string;
  docNumber: string;
}

interface CreditCardFormProps {
  card: CardData;
  cardErrors: CardErrors;
  onCardChange: (card: CardData) => void;
  onErrorChange: (errors: Partial<CardErrors>) => void;
  isVisible: boolean;
}

export default function CreditCardForm({
  card,
  cardErrors,
  onCardChange,
  onErrorChange,
  isVisible,
}: CreditCardFormProps) {
  // Determinar si la tarjeta es Amex para los inputs
  const isAmex = card.number.startsWith("34") || card.number.startsWith("37");

  // Función para validar si la fecha de expiración es mayor a la actual
  const validateExpiryDate = (month: string, year: string): string => {
    if (!month || !year) return "";

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

    const expiryYear = parseInt(year);
    const expiryMonth = parseInt(month);

    if (isNaN(expiryYear) || isNaN(expiryMonth)) return "";

    // Validar que el año no sea menor al actual
    if (expiryYear < currentYear) {
      return "El año de expiración no puede ser menor al actual";
    }

    // Si es el año actual, validar que el mes sea mayor al actual
    if (expiryYear === currentYear && expiryMonth <= currentMonth) {
      return "La fecha de expiración debe ser mayor a la actual";
    }

    return "";
  };

  if (!isVisible) return null;

  return (
    <div
      className="px-6 pt-4 pb-2 flex flex-col gap-3"
      style={{ background: "#F3F3F3" }}
    >
      {/* Card Number */}
      <div className="flex flex-col gap-1">
        <input
          type="text"
          inputMode="numeric"
          maxLength={19} // 16 dígitos + 3 espacios
          pattern="[0-9 ]{19}"
          className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${cardErrors.number ? "border-red-500" : ""
            }`}
          placeholder="Número de tarjeta (16 dígitos)"
          value={card.number.replace(/(\d{4})(?=\d)/g, "$1 ").trim()}
          onChange={(e) => {
            // Solo permitir números y máximo 16 dígitos
            const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
            onCardChange({ ...card, number: raw });
            onErrorChange({ number: "" });
          }}
          required
          autoComplete="cc-number"
        />
        {cardErrors.number && (
          <span className="text-red-500 text-xs" style={{ marginTop: 2 }}>
            {cardErrors.number}
          </span>
        )}
      </div>

      {/* Expiry and CVC */}
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 w-1/3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            pattern="\d{1,2}"
            className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${cardErrors.expiryMonth ? "border-red-500" : ""
              }`}
            placeholder="Mes (MM)"
            value={card.expiryMonth.replace(/\D/g, "").slice(0, 2)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
              // Validar que el mes esté entre 01 y 12
              let formattedMonth = raw;
              if (raw.length === 1 && parseInt(raw) > 1) {
                formattedMonth = "0" + raw;
              } else if (raw.length === 2) {
                const monthNum = parseInt(raw);
                if (monthNum < 1) formattedMonth = "01";
                else if (monthNum > 12) formattedMonth = "12";
              }
              onCardChange({ ...card, expiryMonth: formattedMonth });

              // Validar fecha de expiración si tenemos mes y año
              const validationError = validateExpiryDate(
                formattedMonth,
                card.expiryYear
              );
              onErrorChange({
                expiryMonth:
                  validationError && formattedMonth.length === 2
                    ? validationError
                    : "",
                expiryYear:
                  validationError && card.expiryYear.length === 4
                    ? validationError
                    : "",
              });
            }}
            required
          />
          {cardErrors.expiryMonth && (
            <span className="text-red-500 text-xs" style={{ marginTop: 2 }}>
              {cardErrors.expiryMonth}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 w-1/3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            pattern="\d{4}"
            className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${cardErrors.expiryYear ? "border-red-500" : ""
              }`}
            placeholder="Año (AAAA)"
            value={card.expiryYear.replace(/\D/g, "").slice(0, 4)}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
              onCardChange({ ...card, expiryYear: raw });

              // Validar fecha de expiración si tenemos mes y año
              const validationError = validateExpiryDate(card.expiryMonth, raw);
              onErrorChange({
                expiryMonth:
                  validationError && card.expiryMonth.length === 2
                    ? validationError
                    : "",
                expiryYear:
                  validationError && raw.length === 4 ? validationError : "",
              });
            }}
            required
          />
          {cardErrors.expiryYear && (
            <span className="text-red-500 text-xs" style={{ marginTop: 2 }}>
              {cardErrors.expiryYear}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 w-1/3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={isAmex ? 4 : 3}
            pattern={isAmex ? "\\d{4}" : "\\d{3}"}
            className={`bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700 ${cardErrors.cvc ? "border-red-500" : ""
              }`}
            placeholder={isAmex ? "CVC (4 dígitos)" : "CVC (3 dígitos)"}
            value={card.cvc.replace(/\D/g, "").slice(0, isAmex ? 4 : 3)}
            onChange={(e) => {
              const raw = e.target.value
                .replace(/\D/g, "")
                .slice(0, isAmex ? 4 : 3);
              onCardChange({ ...card, cvc: raw });
              onErrorChange({ cvc: "" });
            }}
            required
            autoComplete="cc-csc"
          />
          {cardErrors.cvc && (
            <span className="text-red-500 text-xs" style={{ marginTop: 2 }}>
              {cardErrors.cvc}
            </span>
          )}
        </div>
      </div>

      {/* Installments */}
      <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        pattern="\d{1,2}"
        className="bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] w-full transition-all duration-150 font-medium text-gray-700"
        placeholder="Cuotas (opcional)"
        value={card.installments.replace(/\D/g, "").slice(0, 2)}
        onChange={(e) => {
          // Solo permitir números y máximo 2 dígitos
          const val = e.target.value.replace(/\D/g, "").slice(0, 2);
          onCardChange({ ...card, installments: val });
        }}
        autoComplete="off"
      />
      <div className="text-xs text-gray-500 mt-1 mb-4">
        Si hay intereses, los aplicará y cobrará tu banco.
      </div>

      {/* Error message */}
      {Object.values(cardErrors).some(Boolean) && (
        <div className="text-red-500 text-sm mt-2 text-center">
          Por favor completa todos los campos obligatorios.
        </div>
      )}
    </div>
  );
}

export type { CardData, CardErrors };
