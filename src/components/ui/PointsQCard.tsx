import React from "react";
import Image from "next/image";
import { useCartContext } from "@/features/cart/CartContext";
import puntosQLogoRed from "@/img/puntos_q_logored.jpg";

/**
 * PointsQCard - Mini card de puntos Q acumulados
 *
 * - Reactiva: escucha el estado global del carrito y actualiza en tiempo real.
 * - Visual: sombra inferior consistente, bordes redondeados, padding y separación óptima.
 * - Animación: feedback de escala y color al aumentar puntos.
 * - Modular y listo para integración futura con APIs de puntos.
 */
interface PointsQCardProps {
  /** Clases CSS adicionales */
  className?: string;
  /** Modo oscuro para ajustar colores */
  isDark?: boolean;
  /** Variante del componente */
  variant?: "desktop" | "tablet" | "mobile";
}

export const PointsQCard: React.FC<PointsQCardProps> = ({
  className = "",
  isDark = false,
  variant = "desktop",
}) => {
  // Usar el valor global de puntos Q del contexto
  const { pointsQ } = useCartContext();
  // Estado para controlar la animación cuando cambian los puntos
  const [isAnimating, setIsAnimating] = React.useState(false);
  const prevPointsRef = React.useRef(pointsQ);

  // Efecto para trigger animación cuando cambian los puntos
  React.useEffect(() => {
    if (prevPointsRef.current < pointsQ && pointsQ > 0) {
      setIsAnimating(true);
      // Fase de relajación
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
    prevPointsRef.current = pointsQ;
  }, [pointsQ]);

  // Configuración de colores según el modo
  const cardStyles = React.useMemo(() => {
    if (isDark) {
      return {
        bg: "bg-white/10 backdrop-blur-md",
        text: "text-white",
        subtext: "text-white/90",
        border: "border-white/30",
        shadow: "shadow-md shadow-black/25",
      };
    } else {
      return {
        bg: "bg-white/90 backdrop-blur-md",
        text: "text-gray-900",
        subtext: "text-gray-700",
        border: "border-white/30",
        // Sombra inferior más notoria y elegante
        shadow: "shadow-md shadow-blue-100/60",
      };
    }
  }, [isDark]);

  // Tamaños según variante
  const sizeConfig = React.useMemo(() => {
    switch (variant) {
      case "mobile":
        return { logo: 24, padding: "px-2 py-1.5", minWidth: "min-w-[100px]" };
      case "tablet":
        return { logo: 28, padding: "px-3 py-2", minWidth: "min-w-[120px]" };
      default:
        return { logo: 32, padding: "px-3 py-2", minWidth: "min-w-[140px]" };
    }
  }, [variant]);

  return (
    <div
      className={`
        flex items-center gap-2.5 rounded-xl border transition-all duration-300 ease-in-out transform
        ${cardStyles.bg} ${cardStyles.text} ${cardStyles.border} ${
        cardStyles.shadow
      }
        ${sizeConfig.padding} ${sizeConfig.minWidth}
        hover:scale-[1.02] hover:shadow-lg hover:backdrop-blur-lg
        ${
          isAnimating
            ? "scale-105 shadow-lg ring-2 ring-blue-400/40 bg-blue-50/20"
            : "scale-100"
        }
        ${className}
      `}
      title="Puntos Q acumulados"
      aria-label={`Puntos Q acumulados: ${pointsQ}`}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Logo de Puntos Q */}
      <div className="flex-shrink-0">
        <div
          className={`
          relative rounded-full overflow-hidden bg-white p-0.5 shadow-sm
          transition-all duration-300 ease-in-out
          ${
            isAnimating
              ? "ring-2 ring-blue-400/60 shadow-md scale-110"
              : "scale-100"
          }
        `}
        >
          <Image
            src={puntosQLogoRed}
            alt="Logo Puntos Q"
            width={sizeConfig.logo}
            height={sizeConfig.logo}
            className="rounded-full object-cover transition-transform duration-300 ease-in-out"
            priority
          />
        </div>
      </div>

      {/* Contenido de texto */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <span
          className={`
            text-xs font-semibold leading-tight transition-all duration-300 ease-in-out
            ${cardStyles.subtext}
            ${isAnimating ? "text-blue-600" : ""}
          `}
          style={{ letterSpacing: "0.02em" }}
        >
          Puntos Q
        </span>
        <span
          className={`
            text-sm font-medium leading-tight transition-all duration-500 ease-in-out transform
            ${
              isAnimating
                ? "scale-125 text-blue-600 font-extrabold drop-shadow-sm"
                : "scale-100 font-medium"
            } 
            ${pointsQ === 0 ? "opacity-60 text-gray-400" : "opacity-100"}
          `}
          style={{
            minHeight: "16px",
            textShadow: isAnimating
              ? "0 0 8px rgba(59, 130, 246, 0.5)"
              : "none",
          }}
          aria-live="polite"
        >
          {(() => {
            if (pointsQ > 9999) return "9999+";
            return pointsQ.toLocaleString("es-CO");
          })()}
        </span>
      </div>
    </div>
  );
};

export default PointsQCard;
