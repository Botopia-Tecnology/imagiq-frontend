/**
 * @module AddressAutocomplete
 * @description Componente de autocompletado de direcciones para Colombia
 * Implementa los principios SOLID y está optimizado para el mercado colombiano
 */

'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, X, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AddressAutocompleteProps,
  PlacePrediction,
  AutocompleteOptions,
  PlaceType
} from '@/types/places.types';
import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';

/**
 * Componente de autocompletado de direcciones
 * Optimizado para direcciones colombianas con validación de cobertura
 */
export function AddressAutocomplete({
  value = '',
  addressType,
  onPlaceSelect,
  onChange,
  placeholder = 'Escribe tu dirección...',
  className = '',
  required = false,
  disabled = false,
  error: externalError,
  label,
  options,
  clearOnSelect = false,
  showSearchIcon = true,
  validateCoverage = false
}: AddressAutocompleteProps) {
  // Estado local del componente
  const [isOpen, setIsOpen] = useState(false);

  // Referencias para el manejo del DOM
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Opciones por defecto optimizadas para Colombia
  const defaultOptions: AutocompleteOptions = useMemo(() => ({
    countryRestriction: 'CO',
    language: 'es',
    minLength: 3,
    debounceTime: 300,
    maxResults: 5,
    location: {
      lat: 4.570868, // Bogotá como centro de Colombia
      lng: -74.297333
    },
    radius: 1000000, // Cubrir todo Colombia
    types: [PlaceType.GEOCODE, PlaceType.ADDRESS],
    ...options
  }), [options]);

  // Determinar si validar cobertura basado en addressType (compatibilidad) o validateCoverage
  const shouldValidateCoverage = validateCoverage || (addressType === 'shipping');

  // Hook de autocompletado
  const {
    inputValue,
    setInputValue,
    selectPlace,
    clearResults,
    reset,
    isLoading,
    predictions,
    selectedPlace,
    error: hookError
  } = usePlacesAutocomplete({
    options: defaultOptions,
    onPlaceSelect: (place) => {
      onPlaceSelect?.(place);
      if (clearOnSelect) {
        reset();
      }
      setIsOpen(false);
    },
    onError: (error) => {
      console.error('Error en autocompletado:', error);
    },
    validateCoverage: shouldValidateCoverage
  });

  // Error combinado (externo o del hook)
  const error = externalError || hookError;

  /**
   * Maneja el cambio en el input
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);

    // Abrir dropdown si hay texto
    if (newValue.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      clearResults();
    }
  };

  /**
   * Maneja la selección de una predicción
   */
  const handlePredictionSelect = async (prediction: PlacePrediction) => {
    await selectPlace(prediction);
  };

  /**
   * Maneja el focus del input
   */
  const handleFocus = () => {
    if (predictions.length > 0 && inputValue.trim()) {
      setIsOpen(true);
    }
  };

  /**
   * Maneja la pérdida de focus
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBlur = (_e: React.FocusEvent) => {
    // Cerrar dropdown con delay para permitir clicks en predicciones
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 150);
  };

  /**
   * Maneja el teclado
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  /**
   * Limpia el input
   */
  const handleClear = () => {
    reset();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  /**
   * Inicializa el input con el valor externo solo la primera vez
   */
  useEffect(() => {
    if (value !== undefined && value !== inputValue && value !== '') {
      setInputValue(value);
    }
  }, [value, inputValue]);

  /**
   * Efecto para cerrar dropdown al hacer click fuera
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clases CSS dinámicas
  const inputClasses = cn(
    'w-full px-4 py-3 text-base bg-white border-2 rounded-lg transition-all duration-200',
    'placeholder:text-gray-400 focus:outline-none focus:ring-0',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    {
      'border-gray-200 focus:border-blue-500': !error,
      'border-red-300 focus:border-red-500': error,
      'pl-12': showSearchIcon,
      'pr-10': inputValue || isLoading
    },
    className
  );

  const dropdownClasses = cn(
    'absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg',
    'max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300',
    {
      'border-red-300': error
    }
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Ícono de búsqueda */}
        {showSearchIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          autoComplete="off"
          role="combobox"
          aria-label={label || 'Dirección'}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="address-listbox"
          aria-describedby={error ? `${label}-error` : undefined}
        />

        {/* Indicadores del lado derecho */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading && (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          )}

          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Limpiar dirección"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown de predicciones */}
      {isOpen && predictions.length > 0 && (
        <div ref={dropdownRef} className={dropdownClasses}>
          <ul role="listbox" id="address-listbox" className="py-1">
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {predictions.map((prediction, _index) => (
              <li
                key={prediction.placeId}
                role="option"
                aria-selected="false"
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                onClick={() => handlePredictionSelect(prediction)}
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {prediction.structuredFormatting?.mainText || prediction.mainText}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {prediction.structuredFormatting?.secondaryText || prediction.secondaryText}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Estado vacío cuando se busca pero no hay resultados */}
      {isOpen && !isLoading && predictions.length === 0 && inputValue.trim() && (
        <div className={dropdownClasses}>
          <div className="px-4 py-6 text-center text-gray-500">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No se encontraron direcciones</p>
            <p className="text-xs text-gray-400 mt-1">
              Intenta con términos más específicos
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span id={`${label}-error`}>{error}</span>
        </div>
      )}


      {/* Indicador de cobertura */}
      {shouldValidateCoverage && selectedPlace && (
        <div className="mt-2 text-xs text-gray-500">
          ✓ Dirección verificada en zona de cobertura
        </div>
      )}

      {/* Información adicional para compatibilidad */}
      {addressType === 'billing' && !validateCoverage && (
        <div className="mt-2 text-xs text-gray-500">
          (Sin validación de cobertura)
        </div>
      )}
    </div>
  );
}

// Export default para compatibilidad con imports antiguos
export default AddressAutocomplete;