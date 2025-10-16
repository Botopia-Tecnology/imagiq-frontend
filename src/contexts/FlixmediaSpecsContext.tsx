/**
 * Contexto para compartir especificaciones de Flixmedia entre componentes
 *
 * Este contexto permite que FlixmediaPlayer extraiga las especificaciones
 * y las comparta con el componente Specifications en otra página
 */

"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface FlixSpecItem {
  label: string;
  value: string;
}

export interface FlixSpecCategory {
  [key: string]: FlixSpecItem[];
}

interface FlixmediaSpecsContextType {
  specs: Record<string, FlixSpecCategory>; // specs por SKU
  setSpecs: (sku: string, specs: FlixSpecCategory) => void;
  getSpecs: (sku: string) => FlixSpecCategory | null;
  clearSpecs: (sku: string) => void;
}

const FlixmediaSpecsContext = createContext<FlixmediaSpecsContextType | undefined>(undefined);

export function FlixmediaSpecsProvider({ children }: { children: React.ReactNode }) {
  const [specs, setSpecsState] = useState<Record<string, FlixSpecCategory>>({});

  const setSpecs = useCallback((sku: string, newSpecs: FlixSpecCategory) => {
    setSpecsState(prev => ({
      ...prev,
      [sku]: newSpecs,
    }));

    // Guardar en localStorage para persistencia entre páginas
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`flixmedia_specs_${sku}`, JSON.stringify(newSpecs));
      } catch (error) {
        console.error('Error guardando especificaciones en localStorage:', error);
      }
    }
  }, []);

  const getSpecs = useCallback((sku: string): FlixSpecCategory | null => {
    console.log('getSpecs llamado para SKU:', sku);
    // Primero intentar obtener del estado
    if (specs[sku]) {
      return specs[sku];
    }

    // Si no está en el estado, intentar obtener de localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`flixmedia_specs_${sku}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Actualizar el estado con lo encontrado en localStorage
          setSpecsState(prev => ({
            ...prev,
            [sku]: parsed,
          }));
          return parsed;
        }
        console.log('⚠️ No se encontraron especificaciones en localStorage para SKU:', sku);
      } catch (error) {
        console.error('Error leyendo especificaciones de localStorage:', error);
      }
    }

    return null;
  }, [specs]);

  const clearSpecs = useCallback((sku: string) => {
    setSpecsState(prev => {
      const newState = { ...prev };
      delete newState[sku];
      return newState;
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`flixmedia_specs_${sku}`);
      } catch (error) {
        console.error('Error eliminando especificaciones de localStorage:', error);
      }
    }
  }, []);

  return (
    <FlixmediaSpecsContext.Provider value={{ specs, setSpecs, getSpecs, clearSpecs }}>
      {children}
    </FlixmediaSpecsContext.Provider>
  );
}

export function useFlixmediaSpecsContext() {
  const context = useContext(FlixmediaSpecsContext);
  if (context === undefined) {
    // Retornar una implementación que use localStorage directamente
    // Esto permite que el componente funcione sin el provider
    console.warn('useFlixmediaSpecsContext: Provider no disponible, usando localStorage directamente');
    return {
      specs: {},
      setSpecs: (sku: string, specs: FlixSpecCategory) => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`flixmedia_specs_${sku}`, JSON.stringify(specs));
            console.log('✅ Especificaciones guardadas en localStorage:', sku);
          } catch (error) {
            console.error('Error guardando especificaciones en localStorage:', error);
          }
        }
      },
      getSpecs: (sku: string): FlixSpecCategory | null => {
        if (typeof window !== 'undefined') {
          try {
            const stored = localStorage.getItem(`flixmedia_specs_${sku}`);
            if (stored) {
              return JSON.parse(stored);
            }
          } catch (error) {
            console.error('Error leyendo especificaciones de localStorage:', error);
          }
        }
        return null;
      },
      clearSpecs: (sku: string) => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem(`flixmedia_specs_${sku}`);
          } catch (error) {
            console.error('Error eliminando especificaciones de localStorage:', error);
          }
        }
      },
    };
  }
  return context;
}
