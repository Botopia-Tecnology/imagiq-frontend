"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * Animación tipo ola con el logo de Samsung creciendo sobre pantalla azul.
 * Se usa para simular el proceso de compra.
 *
 * Props:
 * - open: boolean, controla visibilidad.
 * - onFinish: callback cuando termina la animación.
 * - duration: duración de la animación en ms (default: 2500).
 */
type LogoReloadAnimationProps = {
  open: boolean;
  onFinish?: () => void;
};

// Logo Samsung desde Cloudinary (PNG - mejor compatibilidad con Safari en máscaras SVG)
// Usando transformación explícita f_png para forzar conversión a PNG
const LOGO_SRC =
  "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1762668978/Dise%C3%B1o_sin_t%C3%ADtulo_-_2025-11-09T011610.447_qvj6ct.png";

/**
 * LogoReloadAnimation
 * Animación de carga tipo ola Samsung para el proceso de compra.
 * - Pantalla azul, logo crece con efecto ola.
 * - Texto elegante y legible.
 * - Transición suave y profesional.
 * - Sin dependencias externas, solo React + Tailwind + CSS.
 */
const LogoReloadAnimation: React.FC<LogoReloadAnimationProps> = ({
  open,
  onFinish,
}) => {
  // Estado para controlar el cambio de texto
  const [showSecondText, setShowSecondText] = useState(false);
  // Estado para controlar la pre-carga de la imagen (fix Safari)
  const [imageLoaded, setImageLoaded] = useState(false);

  // Callback para finalizar solo cuando la animación SVG termina
  const animationRef = useRef<SVGAnimateElement | null>(null);

  // Pre-cargar la imagen del logo para Safari (fix CORS/loading issues)
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // Mostrar de todos modos si falla
    img.src = LOGO_SRC;
  }, []);
  useEffect(() => {
    if (open && animationRef.current) {
      const animateNode = animationRef.current;
      const handleEnd = () => {
        if (onFinish) onFinish();
      };
      animateNode.addEventListener("endEvent", handleEnd);
      return () => {
        animateNode.removeEventListener("endEvent", handleEnd);
      };
    }
  }, [open, onFinish]);

  // Cambiar texto a mitad de la animación (5 segundos de 10 total)
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setShowSecondText(true);
      }, 5000); // Cambia el texto a los 5 segundos

      return () => {
        clearTimeout(timer);
        setShowSecondText(false);
      };
    }
  }, [open]);

  /**
   * Subcomponente: Logo Samsung con máscara de ola SVG animada
   * Inspirado en el efecto CodePen, la ola sube y "llena" el logo.
   * Usando React.useMemo para evitar que el SVG se recree cuando cambia el texto
   * IMPORTANTE: Este hook debe estar antes del early return para cumplir con Rules of Hooks
   */
  const animatedLogoWithWaveMask = React.useMemo(
    () => (
      <div
        className="relative flex flex-col items-center justify-center z-10 w-full max-w-[1000px] h-[420px] md:w-[1000px] md:h-[420px] px-2"
        style={{ minWidth: 0 }}
      >
        <svg
          viewBox="0 0 1000 420"
          width="100%"
          height="auto"
          className="block logo-reload-animate-logoGrow"
          style={{
            display: "block",
            maxWidth: "1000px",
            width: "100%",
            height: "auto",
          }}
        >
          <defs>
            {/* Máscara SVG: la ola azul sube solo dentro del logo PNG */}
            <mask id="wave-logo-mask">
              <image
                href={LOGO_SRC}
                x="0"
                y="0"
                width="1000"
                height="420"
                crossOrigin="anonymous"
              />
            </mask>
            <linearGradient
              id="shine"
              x1="0"
              y1="0"
              x2="1000"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.7" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Ola blanca animada solo dentro del logo PNG */}
          <g>
            <path
              id="wave-path"
              d="M0,420 Q250,380 500,420 Q750,460 1000,420 L1000,420 L0,420 Z"
              fill="#FFFFFF"
              opacity="0.92"
              mask="url(#wave-logo-mask)"
            >
              <animate
                ref={animationRef}
                attributeName="d"
                dur="10s"
                repeatCount="1"
                fill="freeze"
                values="
                M0,420 Q250,420 500,420 Q750,420 1000,420 L1000,420 L0,420 Z;
                M0,340 Q250,400 500,340 Q750,280 1000,340 L1000,420 L0,420 Z;
                M0,260 Q250,380 500,260 Q750,140 1000,260 L1000,420 L0,420 Z;
                M0,180 Q250,320 500,180 Q750,0 1000,180 L1000,420 L0,420 Z;
                M0,100 Q250,220 500,100 Q750,-120 1000,100 L1000,420 L0,420 Z;
                M0,40 Q250,140 500,40 Q750,-200 1000,40 L1000,420 L0,420 Z
              "
              />
            </path>
            {/* Brillo animado sobre la ola */}
            <rect
              x="0"
              y="0"
              width="1000"
              height="420"
              fill="url(#shine)"
              opacity="0.18"
              mask="url(#wave-logo-mask)"
            >
              <animate
                attributeName="x"
                from="-1000"
                to="1000"
                dur="8s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
          {/* Logo Samsung SVG visible encima de la ola, con opacidad animada y filtro blanco */}
          <image
            href={LOGO_SRC}
            x="0"
            y="0"
            width="1000"
            height="420"
            crossOrigin="anonymous"
            style={{
              filter:
                "brightness(0) invert(1) drop-shadow(0 2px 8px #2020201a) drop-shadow(0 0px 80px #fff8)",
              opacity: 0,
              transform: "scale(1)",
              transition: "transform 1.2s cubic-bezier(0.77,0,0.175,1)",
            }}
          >
            <animate
              attributeName="opacity"
              values="0;0;0.1;0.5;0.85;0.99"
              keyTimes="0;0.18;0.32;0.55;0.75;1"
              dur="10s"
              fill="freeze"
            />
          </image>
        </svg>
        {/* Texto debajo del logo, responsive y legible con transición */}
        <span
          className="block mt-10 md:mt-20 text-white text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold logo-reload-animate-fadeInText text-center tracking-tight z-40 drop-shadow-2xl px-2 transition-all duration-1000"
          style={{
            wordBreak: "break-word",
            lineHeight: 1.1,
          }}
        >
          {showSecondText ? "Ya casi es tuya..." : "Procesando la compra..."}
        </span>
      </div>
    ),
    [showSecondText]
  ); // Solo se recrea cuando cambia el texto, manteniendo la animación SVG intacta

  // Early return después de todos los hooks para cumplir con Rules of Hooks
  // No mostrar hasta que la imagen esté cargada (fix Safari)
  if (!open || !imageLoaded) return null;

  // Render principal
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center logo-reload-animate-fadeInLogo"
      style={{
        minHeight: "100vh",
        background: "#000000",
        padding: "0 0.5rem",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Procesando compra"
    >
      {/* Logo Samsung animado con ola SVG subiendo y llenando el logo */}
      {animatedLogoWithWaveMask}
    </div>
  );
};

export default React.memo(LogoReloadAnimation);
