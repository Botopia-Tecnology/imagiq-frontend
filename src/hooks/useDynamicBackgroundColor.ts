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
  // const intensity = options?.intensity ?? 0.6; // Reserved for future use

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
   * Genera un degradado con efecto "linterna": centro blanco translúcido y bordes con el color base.
   */
  const backgroundStyle = useMemo(() => {
    const secondary = "#0A3A66";
    // Convierte hex a rgb
    const hexToRgb = (hex: string) => {
      let c = hex.replace("#", "");
      if (c.length === 3)
        c = c
          .split("")
          .map((x) => x + x)
          .join("");
      const num = parseInt(c, 16);
      return `${(num >> 16) & 255},${(num >> 8) & 255},${num & 255}`;
    };
    const rgb = hexToRgb(color);
    return {
      background:
        // Linterna: centro blanco, bordes color base
        `radial-gradient(circle at 60% 40%, rgba(255,255,255,0.55) 0%, rgba(${rgb},0.18) 60%, transparent 100%),` +
        // Luz secundaria y profundidad
        `radial-gradient(circle at 50% 40%, rgba(${rgb},0.38) 0%, transparent 70%),` +
        `radial-gradient(circle at 80% 80%, rgba(${rgb},0.18) 0%, transparent 80%),` +
        `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.14) 0%, transparent 85%),` +
        `linear-gradient(120deg, ${color} 0%, ${secondary} 100%)`,
      transition: "background 500ms cubic-bezier(0.4,0,0.2,1)",
    };
  }, [color]);

  return {
    color,
    setColor,
    backgroundStyle,
  };
}
