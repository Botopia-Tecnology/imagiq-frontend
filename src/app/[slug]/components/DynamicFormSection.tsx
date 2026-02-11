/**
 * Componente de formulario dinámico
 * Renderiza formularios configurables desde el backend
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { submitFormResponse } from "@/services/form-submissions.service";
import type { MultimediaPage, FormField } from "@/services/multimedia-pages.service";
import { usePlacesAutocomplete } from "@/hooks/usePlacesAutocomplete";
import type { PlacePrediction } from "@/types/places.types";

const PHONE_COUNTRIES = [
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
  { code: "US", name: "Estados Unidos", dialCode: "+1", flag: "🇺🇸" },
  { code: "MX", name: "México", dialCode: "+52", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { code: "PE", name: "Perú", dialCode: "+51", flag: "🇵🇪" },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
  { code: "EC", name: "Ecuador", dialCode: "+593", flag: "🇪🇨" },
  { code: "VE", name: "Venezuela", dialCode: "+58", flag: "🇻🇪" },
  { code: "BR", name: "Brasil", dialCode: "+55", flag: "🇧🇷" },
  { code: "PA", name: "Panamá", dialCode: "+507", flag: "🇵🇦" },
  { code: "CR", name: "Costa Rica", dialCode: "+506", flag: "🇨🇷" },
  { code: "ES", name: "España", dialCode: "+34", flag: "🇪🇸" },
];

function validateFieldType(field: FormField, value: unknown): string | null {
  if (!value || typeof value !== "string") return null;
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Ingresa un correo electrónico válido";
  }
  if (field.type === "phone") {
    const parts = value.split(" ");
    const numberPart = parts.length > 1 ? parts.slice(1).join("") : value;
    if (numberPart && !/^\d{7,15}$/.test(numberPart)) {
      return "Ingresa un número de teléfono válido";
    }
  }
  return null;
}

function validateFieldConstraints(field: FormField, value: unknown): string | null {
  if (!field.validation || typeof value !== "string") return null;
  if (field.validation.min_length && value.length < field.validation.min_length) {
    return field.validation.message || `Mínimo ${field.validation.min_length} caracteres`;
  }
  if (field.validation.max_length && value.length > field.validation.max_length) {
    return field.validation.message || `Máximo ${field.validation.max_length} caracteres`;
  }
  if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
    return field.validation.message || "Formato inválido";
  }
  return null;
}

interface DynamicFormSectionProps {
  pageData: MultimediaPage;
}

export default function DynamicFormSection({ pageData }: DynamicFormSectionProps) {
  const config = pageData.form_config;
  const layout = pageData.form_layout;
  const successConfig = pageData.form_success_config;

  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.self !== window.top) {
      setIsPreview(true);
    }
  }, []);

  if (!config || !config.fields) return null;

  const fields = [...config.fields].sort((a, b) => a.order - b.order);

  const validateField = (field: FormField, value: unknown): string | null => {
    if (field.required && (!value || (typeof value === "string" && !value.trim()))) {
      return `${field.label} es obligatorio`;
    }
    const typeError = validateFieldType(field, value);
    if (typeError) return typeError;
    return validateFieldConstraints(field, value);
  };

  const handleChange = (fieldId: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error on change
    if (errors[fieldId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const error = validateField(field, formData[field.id]);
      if (error) newErrors[field.id] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFormResponse(pageData.id, formData);

      if (successConfig?.type === "redirect" && successConfig.redirect_url) {
        window.location.href = successConfig.redirect_url;
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrors({ _form: "Error al enviar el formulario. Por favor intenta de nuevo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div
        className="w-full max-w-lg mx-auto text-center py-12 px-4"
        style={{ maxWidth: layout?.form_max_width || "600px" }}
      >
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-lg font-medium text-green-800">
            {successConfig?.message || "¡Gracias! Tu respuesta ha sido enviada exitosamente."}
          </p>
        </div>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Volver a la página principal
        </a>
      </div>
    );
  }

  const buttonStyle = config.submit_button_style || {};

  return (
    <div
      className="w-full mx-auto px-4 py-6"
      style={{
        maxWidth: layout?.form_max_width || "600px",
        backgroundColor: layout?.form_background_color,
      }}
    >
      {pageData.title && (
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{pageData.title}</h1>
      )}
      {pageData.products_section_description && (
        <p className="text-gray-600 mb-6 text-base md:text-lg">{pageData.products_section_description}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div
              key={field.id}
              className={field.width === "half" ? "md:col-span-1 col-span-1" : "col-span-1 md:col-span-2"}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field, formData[field.id], (v: unknown) => handleChange(field.id, v))}
              {errors[field.id] && (
                <p className="text-sm text-red-500 mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>

        {errors._form && (
          <p className="text-sm text-red-500 text-center">{errors._form}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{
            backgroundColor: buttonStyle.background_color || "#000000",
            color: buttonStyle.text_color || "#ffffff",
            borderRadius: buttonStyle.border_radius || "8px",
          }}
        >
          {isSubmitting ? "Enviando..." : config.submit_button_text || "Enviar"}
        </button>
      </form>
    </div>
  );
}

// Render individual field based on type
function renderField(field: FormField, value: unknown, onChange: (v: unknown) => void) {
  const baseClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  switch (field.type) {
    case "text":
    case "email":
    case "number":
      return (
        <input
          type={field.type}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseClass}
        />
      );

    case "phone":
      return (
        <PhoneFieldInput
          value={(value as string) || ""}
          onChange={(v) => onChange(v)}
          placeholder={field.placeholder}
          baseClass={baseClass}
        />
      );

    case "date":
      return (
        <input
          type="date"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      );

    case "textarea":
      return (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={baseClass + " resize-y"}
        />
      );

    case "select":
      return (
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        >
          <option value="">{field.placeholder || "Selecciona una opción"}</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {(field.options || []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
      if (field.options && field.options.length > 0) {
        return (
          <div className="space-y-2">
            {field.options.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={((value as string[]) || []).includes(opt)}
                  onChange={(e) => {
                    const current = (value as string[]) || [];
                    if (e.target.checked) {
                      onChange([...current, opt]);
                    } else {
                      onChange(current.filter((v) => v !== opt));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        );
      }
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!(value as boolean)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <span className="text-sm">{field.placeholder || field.label}</span>
        </label>
      );

    case "address":
      return (
        <AddressFieldInput
          value={(value as string) || ""}
          onChange={(v) => onChange(v)}
          placeholder={field.placeholder}
          baseClass={baseClass}
        />
      );

    default:
      return (
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseClass}
        />
      );
  }
}

// Phone field with country code dropdown
function PhoneFieldInput({
  value,
  onChange,
  placeholder,
  baseClass,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  baseClass: string;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse existing value to extract country code and number
  const parseValue = () => {
    if (!value) return { country: PHONE_COUNTRIES[0], number: "" };
    // Try to match a dial code at the start
    for (const c of PHONE_COUNTRIES) {
      if (value.startsWith(c.dialCode + " ")) {
        return { country: c, number: value.slice(c.dialCode.length + 1) };
      }
      if (value.startsWith(c.dialCode)) {
        return { country: c, number: value.slice(c.dialCode.length) };
      }
    }
    return { country: PHONE_COUNTRIES[0], number: value };
  };

  const { country: selectedCountry, number } = parseValue();

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleCountrySelect = (c: typeof PHONE_COUNTRIES[0]) => {
    onChange(number ? `${c.dialCode} ${number}` : c.dialCode);
    setOpen(false);
  };

  const handleNumberChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    onChange(digits ? `${selectedCountry.dialCode} ${digits}` : "");
  };

  return (
    <div className="flex gap-0">
      {/* Country code selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 h-full px-2.5 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[90px]"
        >
          <span className="text-base">{selectedCountry.flag}</span>
          <span className="text-xs font-medium text-gray-700">{selectedCountry.dialCode}</span>
          <svg className={`w-3 h-3 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {PHONE_COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCountrySelect(c)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${c.code === selectedCountry.code ? "bg-blue-50" : ""}`}
              >
                <span className="text-base">{c.flag}</span>
                <span className="text-sm text-gray-900 flex-1 truncate">{c.name}</span>
                <span className="text-xs text-gray-500">{c.dialCode}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Phone number input */}
      <input
        type="tel"
        value={number}
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder={placeholder || "Número de teléfono"}
        className={baseClass + " rounded-l-none border-l-0"}
      />
    </div>
  );
}

// Address field with Google Places autocomplete
function AddressFieldInput({
  value,
  onChange,
  placeholder,
  baseClass,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  baseClass: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [justSelected, setJustSelected] = useState(false);

  const {
    inputValue,
    setInputValue,
    selectPlace,
    clearResults,
    isLoading,
    predictions,
  } = usePlacesAutocomplete({
    validateCoverage: false,
    onPlaceSelect: (place) => {
      onChange(place.formattedAddress);
      setIsOpen(false);
    },
  });

  // Sync external value into the hook on mount
  useEffect(() => {
    if (value && !inputValue) {
      setInputValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Open dropdown when predictions arrive (unless just selected)
  useEffect(() => {
    if (predictions.length > 0 && inputValue.trim() && !isLoading && !justSelected) {
      setIsOpen(true);
    }
  }, [predictions, inputValue, isLoading, justSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    if (newValue.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      clearResults();
    }
  };

  const handleSelect = async (prediction: PlacePrediction) => {
    setJustSelected(true);
    setIsOpen(false);
    clearResults();
    await selectPlace(prediction);
    setTimeout(() => setJustSelected(false), 500);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (predictions.length > 0 && inputValue.trim()) setIsOpen(true);
        }}
        placeholder={placeholder || "Escribe tu dirección..."}
        className={baseClass}
        autoComplete="off"
      />
      {isLoading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
      {isOpen && predictions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <li
              key={prediction.placeId}
              className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
              onClick={() => handleSelect(prediction)}
            >
              <div className="font-medium text-gray-900 truncate">
                {prediction.structuredFormatting?.mainText || prediction.mainText}
              </div>
              <div className="text-gray-500 text-xs truncate">
                {prediction.structuredFormatting?.secondaryText || prediction.secondaryText}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
