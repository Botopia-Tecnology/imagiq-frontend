/**
 * Componente de selección de documento de identidad colombiano
 * - Dropdown de tipos de documento específicos de Colombia
 * - Input con validación específica por tipo
 * - Patrones de validación automáticos
 * - Interfaz accesible y responsive
 */

"use client";

import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { DocumentType } from "@/types/registration";

interface DocumentSelectorProps {
  value: {
    type: string;
    number: string;
  };
  onChange: (value: { type: string; number: string }) => void;
  error?: string;
  disabled?: boolean;
}

// Tipos de documento colombianos
const DOCUMENT_TYPES: DocumentType[] = [
  {
    code: 'CC',
    name: 'Cédula de Ciudadanía',
    country: 'CO',
    maxLength: 12,
    pattern: /^\d{6,12}$/
  },
  {
    code: 'CE',
    name: 'Cédula de Extranjería',
    country: 'CO',
    maxLength: 12,
    pattern: /^\d{6,12}$/
  },
  {
    code: 'PP',
    name: 'Pasaporte',
    country: 'CO',
    maxLength: 15,
    pattern: /^[A-Z0-9]{6,15}$/
  },
  {
    code: 'TI',
    name: 'Tarjeta de Identidad',
    country: 'CO',
    maxLength: 12,
    pattern: /^\d{6,12}$/
  }
];

export default function DocumentSelector({
  value,
  onChange,
  error,
  disabled = false
}: DocumentSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedType = DOCUMENT_TYPES.find(dt => dt.code === value.type) || DOCUMENT_TYPES[0];

  const handleTypeSelect = (docType: DocumentType) => {
    onChange({
      type: docType.code,
      number: '' // Limpiar número al cambiar tipo
    });
    setIsDropdownOpen(false);
  };

  const handleNumberChange = (docNumber: string) => {
    // Solo números para CC, CE, TI; alfanumérico para PP
    let formattedNumber = docNumber.toUpperCase();

    if (['CC', 'CE', 'TI'].includes(selectedType.code)) {
      formattedNumber = formattedNumber.replace(/\D/g, '');
    }

    // Aplicar longitud máxima
    if (formattedNumber.length > selectedType.maxLength) {
      formattedNumber = formattedNumber.substring(0, selectedType.maxLength);
    }

    onChange({
      type: value.type,
      number: formattedNumber
    });
  };

  const validateDocument = (type: DocumentType, number: string): boolean => {
    if (!number) return false;
    if (type.pattern) {
      return type.pattern.test(number);
    }
    return number.length >= 4; // Mínimo genérico
  };

  const isValidDocument = validateDocument(selectedType, value.number);

  const getPlaceholder = (type: DocumentType): string => {
    const placeholders: Record<string, string> = {
      'CC': 'Ej: 1234567890',
      'CE': 'Ej: 1234567890',
      'PP': 'Ej: AB123456',
      'TI': 'Ej: 1234567890',
    };
    return placeholders[type.code] || 'Ingresa tu documento';
  };

  return (
    <div className="w-full">
      <label className="block text-base font-semibold text-[#002142] mb-2 tracking-tight">
        Documento de identidad
      </label>

      <div className="flex gap-2">
        {/* Selector de tipo de documento */}
        <div className="relative min-w-[200px]">
          <button
            type="button"
            onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className={`flex items-center gap-2 px-3 py-3 border-2 rounded-lg bg-[#f7fafd] transition-all duration-200 shadow-sm w-full ${
              error ? "border-red-400" : "border-[#e5e5e5]"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-[#002142] focus:outline-none focus:ring-2 focus:ring-[#002142]"}`}
          >
            <FileText className="w-4 h-4 text-[#4a5a6a]" />
            <span className="text-sm font-medium text-[#002142] truncate flex-1 text-left">
              {selectedType.name}
            </span>
            <ChevronDown className={`w-4 h-4 text-[#4a5a6a] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown de tipos */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg z-10">
              {DOCUMENT_TYPES.map((docType) => (
                <button
                  key={docType.code}
                  type="button"
                  onClick={() => handleTypeSelect(docType)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#f7fafd] transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-[#4a5a6a]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#002142]">
                      {docType.name}
                    </div>
                    <div className="text-xs text-[#4a5a6a]">
                      {docType.code}
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
            type="text"
            value={value.number}
            onChange={(e) => handleNumberChange(e.target.value)}
            placeholder={getPlaceholder(selectedType)}
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

      {value.number && !isValidDocument && !error && (
        <p className="text-amber-600 text-xs mt-1 animate-fade-in">
          Formato de {selectedType.name} incorrecto
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