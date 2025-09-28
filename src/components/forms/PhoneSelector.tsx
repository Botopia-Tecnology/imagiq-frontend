/**
 * Componente de selección de teléfono con país
 * - Dropdown de países con banderas e indicativos
 * - Input numérico para el número de teléfono
 * - Validación automática por país
 * - Interfaz accesible y responsive
 */

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Country } from "@/types/registration";

interface PhoneSelectorProps {
  value: {
    countryCode: string;
    number: string;
  };
  onChange: (value: { countryCode: string; number: string }) => void;
  error?: string;
  disabled?: boolean;
}

// Lista de países principales (puede expandirse)
const COUNTRIES: Country[] = [
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
  { code: "US", name: "Estados Unidos", dialCode: "+1", flag: "🇺🇸" },
  { code: "MX", name: "México", dialCode: "+52", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { code: "PE", name: "Perú", dialCode: "+51", flag: "🇵🇪" },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
  { code: "EC", name: "Ecuador", dialCode: "+593", flag: "🇪🇨" },
  { code: "VE", name: "Venezuela", dialCode: "+58", flag: "🇻🇪" },
];

export default function PhoneSelector({
  value,
  onChange,
  error,
  disabled = false
}: PhoneSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedCountry = COUNTRIES.find(c => c.code === value.countryCode) || COUNTRIES[0];

  const handleCountrySelect = (country: Country) => {
    onChange({
      countryCode: country.code,
      number: value.number
    });
    setIsDropdownOpen(false);
  };

  const handleNumberChange = (phoneNumber: string) => {
    // Solo permitir números
    const numericValue = phoneNumber.replace(/\D/g, '');
    onChange({
      countryCode: value.countryCode,
      number: numericValue
    });
  };

  const validatePhoneLength = (country: Country, number: string): boolean => {
    // Validaciones básicas por país (puede expandirse)
    const lengthRules: Record<string, { min: number; max: number }> = {
      'CO': { min: 10, max: 10 },
      'US': { min: 10, max: 10 },
      'MX': { min: 10, max: 10 },
      'AR': { min: 8, max: 11 },
      'PE': { min: 9, max: 9 },
      'CL': { min: 8, max: 9 },
      'EC': { min: 8, max: 9 },
      'VE': { min: 7, max: 10 },
    };

    const rule = lengthRules[country.code];
    if (!rule) return true; // País no configurado, aceptar cualquier longitud

    return number.length >= rule.min && number.length <= rule.max;
  };

  const isValidLength = validatePhoneLength(selectedCountry, value.number);

  return (
    <div className="w-full">
      <label className="block text-sm sm:text-base font-semibold text-[#002142] mb-1.5 sm:mb-2 tracking-tight">
        Número de teléfono
      </label>

      <div className="flex gap-2">
        {/* Selector de país */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-2.5 sm:py-3 border-2 rounded-lg bg-[#f7fafd] transition-all duration-200 shadow-sm min-w-[100px] sm:min-w-[120px] ${
              error ? "border-red-400" : "border-[#e5e5e5]"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-[#002142] focus:outline-none focus:ring-2 focus:ring-[#002142]"}`}
          >
            <span className="text-base sm:text-lg">{selectedCountry.flag}</span>
            <span className="text-xs sm:text-sm font-medium text-[#002142]">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown className={`w-4 h-4 text-[#4a5a6a] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown de países */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#f7fafd] transition-colors text-left"
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#002142] truncate">
                      {country.name}
                    </div>
                    <div className="text-xs text-[#4a5a6a]">
                      {country.dialCode}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input del número */}
        <div className="flex-1">
          <input
            type="tel"
            value={value.number}
            onChange={(e) => handleNumberChange(e.target.value)}
            placeholder="Ingresa tu número"
            disabled={disabled}
            className={`w-full px-4 py-3 border-2 rounded-lg text-[#002142] placeholder-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#002142] font-normal bg-[#f7fafd] transition-all duration-200 shadow-sm ${
              error ? "border-red-400" : "border-[#e5e5e5]"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>
      </div>

      {/* Mensajes de error/ayuda */}
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-fade-in">
          {error}
        </p>
      )}

      {value.number && !isValidLength && !error && (
        <p className="text-amber-600 text-xs mt-1 animate-fade-in">
          El número parece incompleto para {selectedCountry.name}
        </p>
      )}

      {/* Blur overlay para cerrar dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

    </div>
  );
}