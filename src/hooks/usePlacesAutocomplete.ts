/**
 * @module usePlacesAutocomplete
 * @description Hook personalizado para manejar el autocompletado de direcciones
 * Siguiendo el Single Responsibility Principle (SRP) de SOLID
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { debounce } from 'lodash';
import {
  PlacePrediction,
  PlaceDetails,
  AutocompleteOptions,
  AutocompleteState,
  PlaceType,
  PlaceField
} from '@/types/places.types';
import { placesService } from '@/services/places.service';

interface UsePlacesAutocompleteProps {
  /**
   * Opciones de configuración del autocompletado
   */
  options?: AutocompleteOptions;

  /**
   * Callback cuando se selecciona un lugar
   */
  onPlaceSelect?: (place: PlaceDetails) => void;

  /**
   * Callback cuando ocurre un error
   */
  onError?: (error: string) => void;

  /**
   * Si debe validar cobertura automáticamente
   * SOLO se aplica para direcciones de envío, NO para facturación
   */
  validateCoverage?: boolean;

  /**
   * Tipo de dirección: 'shipping' (envío) o 'billing' (facturación)
   * Por defecto es 'shipping'
   */
  addressType?: 'shipping' | 'billing';
}

interface UsePlacesAutocompleteReturn {
  /**
   * Estado del autocompletado
   */
  state: AutocompleteState;

  /**
   * Valor actual del input
   */
  inputValue: string;

  /**
   * Función para actualizar el valor del input
   */
  setInputValue: (value: string) => void;

  /**
   * Función para buscar lugares
   */
  searchPlaces: (query: string) => void;

  /**
   * Función para seleccionar un lugar
   */
  selectPlace: (prediction: PlacePrediction) => Promise<void>;

  /**
   * Función para limpiar los resultados
   */
  clearResults: () => void;

  /**
   * Función para reiniciar el estado
   */
  reset: () => void;

  /**
   * Si está cargando
   */
  isLoading: boolean;

  /**
   * Predicciones actuales
   */
  predictions: PlacePrediction[];

  /**
   * Lugar seleccionado
   */
  selectedPlace: PlaceDetails | null;

  /**
   * Error actual
   */
  error: string | null;
}

/**
 * Hook para manejar el autocompletado de direcciones con Google Places
 */
export function usePlacesAutocomplete({
  options,
  onPlaceSelect,
  onError,
  validateCoverage = false,
  addressType = 'shipping'
}: UsePlacesAutocompleteProps = {}): UsePlacesAutocompleteReturn {
  // Estado del componente
  const [state, setState] = useState<AutocompleteState>({
    isLoading: false,
    predictions: [],
    selectedPlace: null,
    error: null,
    sessionToken: null
  });

  const [inputValue, setInputValue] = useState<string>('');

  // Referencias para evitar efectos no deseados
  const isMountedRef = useRef(false);
  const lastSearchRef = useRef<string>('');
  const isSelectingPlaceRef = useRef(false); // Flag para prevenir búsqueda automática al seleccionar

  // Efecto para marcar el componente como montado
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Configuración por defecto optimizada para Colombia - memoizada para evitar recreaciones
  const defaultOptions = useMemo<AutocompleteOptions>(() => ({
    countryRestriction: 'CO',
    language: 'es',
    minLength: 3,
    debounceTime: 300,
    maxResults: 5,
    location: {
      lat: 4.570868, // Centro de Colombia
      lng: -74.297333
    },
    radius: 1000000, // 1000km para cubrir todo Colombia
    types: [PlaceType.GEOCODE, PlaceType.ADDRESS],
    fields: [PlaceField.ADDRESS_COMPONENTS, PlaceField.FORMATTED_ADDRESS, PlaceField.GEOMETRY, PlaceField.NAME, PlaceField.PLACE_ID],
    ...options
  }), [options]);

  /**
   * Función para búsqueda sin debounce
   */
  const performSearch = useCallback(async (query: string) => {
    console.log('[usePlacesAutocomplete] performSearch called with:', query);

    if (!isMountedRef.current || !query.trim()) {
      console.log('[usePlacesAutocomplete] Returning early - not mounted or empty query');
      return;
    }

    const trimmedQuery = query.trim();

    // Evitar búsquedas duplicadas
    if (lastSearchRef.current === trimmedQuery) {
      console.log('[usePlacesAutocomplete] Duplicate search, skipping');
      return;
    }
    lastSearchRef.current = trimmedQuery;

    // Verificar longitud mínima
    if (trimmedQuery.length < (defaultOptions.minLength || 3)) {
      console.log('[usePlacesAutocomplete] Query too short:', trimmedQuery.length);
      setState(prev => ({
        ...prev,
        predictions: [],
        error: null
      }));
      return;
    }

    console.log('[usePlacesAutocomplete] Making API call for:', trimmedQuery);
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const response = await placesService.searchPlaces(trimmedQuery, defaultOptions);
      console.log('[usePlacesAutocomplete] API Response:', response);

      if (!isMountedRef.current) return;

      if (response.status === 'OK') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          predictions: response.predictions,
          sessionToken: response.sessionToken || null,
          error: null
        }));
      } else if (response.status === 'ZERO_RESULTS') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          predictions: [],
          error: null
        }));
      } else {
        throw new Error(response.errorMessage || 'Error desconocido');
      }
    } catch (error: unknown) {
      if (!isMountedRef.current) return;

      const errorMessage = error instanceof Error ? error.message : 'Error buscando direcciones';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      onError?.(errorMessage);
    }
  }, [defaultOptions, onError]);

  /**
   * Función debounced para buscar lugares
   */
  const debouncedSearch = useMemo(
    () => debounce(performSearch, defaultOptions.debounceTime || 300),
    [performSearch, defaultOptions.debounceTime]
  );

  /**
   * Función para buscar lugares
   */
  const searchPlaces = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  /**
   * Función para seleccionar un lugar
   */
  const selectPlace = useCallback(async (prediction: PlacePrediction) => {
    isSelectingPlaceRef.current = true; // Marcar que estamos seleccionando un lugar
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      // Validar cobertura SOLO para direcciones de envío, NO para facturación
      if (validateCoverage && addressType === 'shipping') {
        const isInCoverage = await placesService.validateCoverage(prediction.placeId);
        if (!isInCoverage) {
          throw new Error('Esta dirección no está dentro de nuestras zonas de cobertura');
        }
      }

      // Obtener detalles del lugar
      const response = await placesService.getPlaceDetails(prediction.placeId);

      if (!isMountedRef.current) return;

      if (response.status === 'OK') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          selectedPlace: response.place,
          predictions: [], // Limpiar predicciones después de seleccionar
          error: null
        }));

        // Actualizar el valor del input con la dirección seleccionada
        setInputValue(response.place.formattedAddress);

        // Llamar callback
        onPlaceSelect?.(response.place);

        // Resetear flag después de completar la selección
        setTimeout(() => {
          isSelectingPlaceRef.current = false;
        }, 100);
      } else {
        throw new Error(response.errorMessage || 'Error obteniendo detalles del lugar');
      }
    } catch (error: unknown) {
      if (!isMountedRef.current) return;

      const errorMessage = error instanceof Error ? error.message : 'Error seleccionando lugar';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      onError?.(errorMessage);

      // Resetear flag en caso de error también
      isSelectingPlaceRef.current = false;
    }
  }, [validateCoverage, addressType, onPlaceSelect, onError]);

  /**
   * Función para limpiar resultados
   */
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      predictions: [],
      error: null
    }));
    lastSearchRef.current = '';
  }, []);

  /**
   * Función para reiniciar el estado
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      predictions: [],
      selectedPlace: null,
      error: null,
      sessionToken: null
    });
    setInputValue('');
    lastSearchRef.current = '';
  }, []);

  /**
   * Efecto para buscar cuando cambia el input
   */
  useEffect(() => {
    console.log('[usePlacesAutocomplete] useEffect triggered with inputValue:', inputValue);
    console.log('[usePlacesAutocomplete] isSelectingPlace:', isSelectingPlaceRef.current);

    // No buscar si estamos en proceso de seleccionar un lugar
    if (isSelectingPlaceRef.current) {
      console.log('[usePlacesAutocomplete] Skipping search - selecting place');
      return;
    }

    if (inputValue.trim()) {
      console.log('[usePlacesAutocomplete] Calling debouncedSearch');
      debouncedSearch(inputValue);
    } else {
      console.log('[usePlacesAutocomplete] Clearing results - empty input');
      setState(prev => ({
        ...prev,
        predictions: [],
        error: null
      }));
      lastSearchRef.current = '';
    }
  }, [inputValue, debouncedSearch]);

  /**
   * Cleanup del debounce al desmontar
   */
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return {
    state,
    inputValue,
    setInputValue,
    searchPlaces,
    selectPlace,
    clearResults,
    reset,
    isLoading: state.isLoading,
    predictions: state.predictions,
    selectedPlace: state.selectedPlace,
    error: state.error
  };
}