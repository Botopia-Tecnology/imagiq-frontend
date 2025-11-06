"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaCcVisa, FaCcAmex, FaCcDiscover, FaCcDinersClub } from "react-icons/fa";
import { CreditCard } from "lucide-react";

interface CardData {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  holderName: string;
}

export function PaymentStep() {
  const [card, setCard] = useState<CardData>({
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    holderName: "",
  });

  const [errors, setErrors] = useState<Partial<CardData>>({});

  // Detectar tipo de tarjeta basándose en el número
  const detectCardType = (number: string): string => {
    const cleanNumber = number.replace(/\D/g, "");

    if (/^4/.test(cleanNumber)) return "visa";
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
    if (/^3[47]/.test(cleanNumber)) return "amex";
    if (/^6(?:011|5)/.test(cleanNumber)) return "discover";
    if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) return "diners";

    return "unknown";
  };

  const cardType = detectCardType(card.number);
  const isAmex = cardType === "amex";

  // Renderizar ícono de la tarjeta
  const renderCardIcon = () => {
    const iconClass = "w-8 h-8";

    switch (cardType) {
      case "visa":
        return <FaCcVisa className={iconClass} style={{ color: "#1434CB" }} />;
      case "mastercard":
        return (
          <svg className={iconClass} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="24" r="12" fill="#EB001B" />
            <circle cx="30" cy="24" r="12" fill="#F79E1B" />
            <path d="M24 14.4c-2.3 2.3-3.7 5.5-3.7 9s1.4 6.7 3.7 9c2.3-2.3 3.7-5.5 3.7-9s-1.4-6.7-3.7-9z" fill="#FF5F00" />
          </svg>
        );
      case "amex":
        return <FaCcAmex className={iconClass} style={{ color: "#006FCF" }} />;
      case "discover":
        return <FaCcDiscover className={iconClass} style={{ color: "#FF6000" }} />;
      case "diners":
        return <FaCcDinersClub className={iconClass} style={{ color: "#0079BE" }} />;
      default:
        return <CreditCard className={iconClass} style={{ color: "#9CA3AF" }} />;
    }
  };

  // Validar fecha de expiración
  const validateExpiryDate = (month: string, year: string): string => {
    if (!month || !year) return "";

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const expiryYear = parseInt(year);
    const expiryMonth = parseInt(month);

    if (isNaN(expiryYear) || isNaN(expiryMonth)) return "";

    if (expiryYear < currentYear) {
      return "El año de expiración no puede ser menor al actual";
    }

    if (expiryYear === currentYear && expiryMonth <= currentMonth) {
      return "La fecha de expiración debe ser mayor a la actual";
    }

    return "";
  };

  const handleCardChange = (field: keyof CardData, value: string) => {
    setCard((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Generar opciones de mes y año
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = [
    { value: "01", label: "01 - Enero" },
    { value: "02", label: "02 - Febrero" },
    { value: "03", label: "03 - Marzo" },
    { value: "04", label: "04 - Abril" },
    { value: "05", label: "05 - Mayo" },
    { value: "06", label: "06 - Junio" },
    { value: "07", label: "07 - Julio" },
    { value: "08", label: "08 - Agosto" },
    { value: "09", label: "09 - Septiembre" },
    { value: "10", label: "10 - Octubre" },
    { value: "11", label: "11 - Noviembre" },
    { value: "12", label: "12 - Diciembre" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Puedes agregar una tarjeta ahora o más tarde
      </p>

      <div className="space-y-4">
        {/* Nombre del titular */}
        <div className="space-y-2">
          <Label htmlFor="holderName">Nombre del titular *</Label>
          <Input
            id="holderName"
            type="text"
            placeholder="Como aparece en la tarjeta"
            value={card.holderName}
            onChange={(e) => handleCardChange("holderName", e.target.value)}
            autoComplete="cc-name"
            autoCapitalize="words"
          />
          {errors.holderName && (
            <p className="text-red-500 text-xs">{errors.holderName}</p>
          )}
        </div>

        {/* Número de tarjeta */}
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Número de tarjeta *</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              type="text"
              inputMode="numeric"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={card.number.replace(/(\d{4})(?=\d)/g, "$1 ").trim()}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                handleCardChange("number", raw);
              }}
              autoComplete="cc-number"
              className="pr-12"
            />
            {card.number.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {renderCardIcon()}
              </div>
            )}
          </div>
          {errors.number && (
            <p className="text-red-500 text-xs">{errors.number}</p>
          )}
        </div>

        {/* Fecha de expiración y CVC */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryMonth">Mes *</Label>
            <select
              id="expiryMonth"
              value={card.expiryMonth}
              onChange={(e) => {
                const newMonth = e.target.value;
                handleCardChange("expiryMonth", newMonth);

                // Validar fecha si tenemos mes y año
                const validationError = validateExpiryDate(newMonth, card.expiryYear);
                if (validationError && newMonth && card.expiryYear) {
                  setErrors((prev) => ({ ...prev, expiryMonth: validationError }));
                }
              }}
              style={{ backgroundColor: "#ffffff" }}
              className="h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="">Mes</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            {errors.expiryMonth && (
              <p className="text-red-500 text-xs">{errors.expiryMonth}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryYear">Año *</Label>
            <select
              id="expiryYear"
              value={card.expiryYear}
              onChange={(e) => {
                const newYear = e.target.value;
                handleCardChange("expiryYear", newYear);

                // Validar fecha si tenemos mes y año
                const validationError = validateExpiryDate(card.expiryMonth, newYear);
                if (validationError && card.expiryMonth && newYear) {
                  setErrors((prev) => ({ ...prev, expiryYear: validationError }));
                }
              }}
              style={{ backgroundColor: "#ffffff" }}
              className="h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="">Año</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {errors.expiryYear && (
              <p className="text-red-500 text-xs">{errors.expiryYear}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvc">CVC *</Label>
            <Input
              id="cvc"
              type="text"
              inputMode="numeric"
              maxLength={isAmex ? 4 : 3}
              placeholder={isAmex ? "4 dígitos" : "3 dígitos"}
              value={card.cvc}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "").slice(0, isAmex ? 4 : 3);
                handleCardChange("cvc", raw);
              }}
              autoComplete="cc-csc"
            />
            {errors.cvc && (
              <p className="text-red-500 text-xs">{errors.cvc}</p>
            )}
          </div>
        </div>

        {/* Nota informativa */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600">
            Tu información de pago está protegida. No guardaremos los datos completos de tu tarjeta.
          </p>
        </div>
      </div>
    </div>
  );
}
