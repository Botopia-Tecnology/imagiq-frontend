// SelectedColorContext.tsx
// Contexto global para el color seleccionado de producto
// Permite compartir el color entre ProductCard y ViewProductMobile (o cualquier componente)
// Uso típico: envolver la app con <SelectedColorProvider> y usar useSelectedColor() en cualquier componente

"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

/**
 * Tipo del contexto: color seleccionado y su setter
 */
interface SelectedColorContextType {
  /** Color HEX actual seleccionado (ej: "#17407A") */
  selectedColor: string;
  /** Setter para actualizar el color global */
  setSelectedColor: (color: string) => void;
}

// Contexto global para el color seleccionado
const SelectedColorContext = createContext<
  SelectedColorContextType | undefined
>(undefined);

/**
 * Props del provider: recibe children
 */
interface SelectedColorProviderProps {
  children: ReactNode;
}

/**
 * Provider global para el color seleccionado
 * Envuelve la app y permite que cualquier componente acceda o actualice el color
 * Ejemplo de uso:
 * <SelectedColorProvider>
 *   <App />
 * </SelectedColorProvider>
 */
export function SelectedColorProvider({
  children,
}: SelectedColorProviderProps) {
  // Estado global del color seleccionado (HEX)
  const [selectedColor, setSelectedColor] = useState<string>("#17407A");

  // Memoiza el value para evitar renders innecesarios
  const value = useMemo(
    () => ({
      selectedColor,
      setSelectedColor,
    }),
    [selectedColor]
  );

  return (
    <SelectedColorContext.Provider value={value}>
      {children}
    </SelectedColorContext.Provider>
  );
}

/**
 * Hook para acceder al color seleccionado y su setter
 * Ejemplo:
 * const { selectedColor, setSelectedColor } = useSelectedColor();
 */
export function useSelectedColor() {
  const context = useContext(SelectedColorContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedColor must be used within a SelectedColorProvider"
    );
  }
  return context;
}
