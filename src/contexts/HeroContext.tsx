"use client";

/**
 * Context API para sincronización de color Hero → Navbar
 *
 * Gestiona el color del texto del Hero banner y calcula el tema (light/dark)
 * usando el algoritmo de luminancia W3C para sincronizar con el Navbar.
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Tema calculado basado en la luminancia del color
 * - 'light': Color claro (luminancia > 0.5) → Navbar debe usar colores claros
 * - 'dark': Color oscuro (luminancia ≤ 0.5) → Navbar debe usar colores oscuros
 */
export type HeroTheme = 'light' | 'dark';

/**
 * Estado del contexto Hero
 */
interface HeroContextState {
  /** Color del texto del Hero en formato hex (ej: "#ffffff") */
  textColor: string;
  /** Tema calculado automáticamente desde textColor */
  theme: HeroTheme;
}

/**
 * API del contexto Hero
 */
interface HeroContextValue extends HeroContextState {
  /** Actualiza el color del texto y recalcula el tema */
  setTextColor: (color: string) => void;
}

const HeroContext = createContext<HeroContextValue | undefined>(undefined);

/**
 * Calcula el tema (light/dark) usando el algoritmo de luminancia W3C
 *
 * @param hexColor - Color en formato hex (ej: "#ffffff" o "ffffff")
 * @returns 'light' si luminance > 0.5, 'dark' si no
 */
function getThemeFromColor(hexColor: string): HeroTheme {
  // Remover '#' si existe
  const hex = hexColor.replace('#', '');

  // Validar formato hex
  if (hex.length !== 6) {
    console.warn('[HeroContext] Invalid hex color:', hexColor, '- Using dark theme');
    return 'dark';
  }

  // Convertir hex a RGB
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  // Validar conversión
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    console.warn('[HeroContext] Failed to parse RGB from:', hexColor);
    return 'dark';
  }

  // Calcular luminancia según W3C
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Umbral: > 0.5 = color claro
  return luminance > 0.5 ? 'light' : 'dark';
}

/**
 * Provider del contexto Hero
 * Debe envolver la aplicación en layout.tsx
 */
export function HeroProvider({ children }: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  const [textColor, setTextColor] = useState<string>('#000000');
  const [theme, setTheme] = useState<HeroTheme>('dark');

  /**
   * Actualiza el color del texto y recalcula el tema
   */
  const updateTextColor = useCallback((color: string) => {
    setTextColor(color);
    const newTheme = getThemeFromColor(color);
    setTheme(newTheme);
  }, []);

  // Memoizar el valor del contexto para evitar que cambie en cada render
  const value = useMemo(
    () => ({ textColor, theme, setTextColor: updateTextColor }),
    [textColor, theme, updateTextColor]
  );

  return <HeroContext.Provider value={value}>{children}</HeroContext.Provider>;
}

/**
 * Hook para consumir el contexto Hero
 * Debe usarse dentro de HeroProvider
 *
 * @throws Error si se usa fuera del Provider
 * @returns API del contexto Hero
 */
export function useHeroContext(): HeroContextValue {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error('useHeroContext must be used within HeroProvider');
  }
  return context;
}
