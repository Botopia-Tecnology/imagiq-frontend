/**
 * useDynamicBackgroundColor Hook
 *
 * Permite cambiar dinámicamente el background de la vista según el color seleccionado por el usuario.
 * - Expone el color actual y una función setColor para actualizarlo.
 * - Genera un degradado dinámico usando el color seleccionado.
 * - Pensado para integración con TailwindCSS y estilos inline.
 * - Reutilizable y escalable para cualquier componente.
 *
 * Ejemplo de uso:
 * const { backgroundStyle, color, setColor } = useDynamicBackgroundColor();
 * <div style={backgroundStyle}>...</div>
 */
import { useState, useMemo, useEffect } from "react";

export interface DynamicBackgroundOptions {
  /** Color inicial en formato HEX, RGB o nombre CSS */
  initialColor?: string;
  /** Opcional: intensidad del degradado (0.1 a 1) */
  intensity?: number;
}

export interface DynamicBackgroundHook {
  /** Color actual seleccionado */
  color: string;
  /** Actualiza el color seleccionado */
  setColor: (color: string) => void;
  /** Estilo de background dinámico para aplicar en el componente */
  backgroundStyle: React.CSSProperties;
}

export function useDynamicBackgroundColor(
  options?: DynamicBackgroundOptions & { selectedColor?: string }
): DynamicBackgroundHook {
  // Estado para el color seleccionado
  const [color, setColor] = useState<string>(
    options?.selectedColor || options?.initialColor || "#17407A"
  );
  const intensity = options?.intensity ?? 0.6;

  // Actualiza el color si cambia desde fuera (ej: selección en ProductCard)
  useEffect(() => {
    if (options?.selectedColor && options.selectedColor !== color) {
      // Normaliza el hex
      const normalized = options.selectedColor.startsWith("#")
        ? options.selectedColor
        : `#${options.selectedColor}`;
      setColor(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.selectedColor]);

  /**
   * Genera un degradado radial y linear usando el color seleccionado.
   * El degradado se adapta automáticamente al color y la intensidad.
   * Aplica transición suave.
   */
  const backgroundStyle = useMemo(() => {
    const secondary = "#0A3A66";
    return {
      background:
        `radial-gradient(circle at 30% 30%, ${color}${Math.round(
          intensity * 255
        ).toString(16)}, transparent 50%),` +
        `radial-gradient(circle at 70% 70%, ${color}${Math.round(
          intensity * 180
        ).toString(16)}, transparent 60%),` +
        `radial-gradient(circle at 10% 80%, ${color}${Math.round(
          intensity * 120
        ).toString(16)}, transparent 70%),` +
        `linear-gradient(135deg, ${color} 0%, ${secondary} 100%)`,
      transition: "background 500ms ease",
    };
  }, [color, intensity]);

  return {
    color,
    setColor,
    backgroundStyle,
  };
}
