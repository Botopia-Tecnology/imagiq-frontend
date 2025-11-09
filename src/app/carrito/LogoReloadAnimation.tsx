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

// Logo Samsung desde Cloudinary
const LOGO_SRC =
  "https://res.cloudinary.com/dnglv0zqg/image/upload/v1760575601/Samsung_white_logo.png";

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

  // Callback para finalizar solo cuando la animación SVG termina
  const animationRef = useRef<SVGAnimateElement | null>(null);
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
              <image href={LOGO_SRC} x="0" y="0" width="1000" height="420" />
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
          {/* Ola azul animada solo dentro del logo PNG */}
          <g>
            <path
              id="wave-path"
              d="M0,420 Q250,380 500,420 Q750,460 1000,420 L1000,420 L0,420 Z"
              fill="#0057B7"
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
          {/* Logo Samsung PNG visible encima de la ola, con opacidad animada */}
          <image
            href={LOGO_SRC}
            x="0"
            y="0"
            width="1000"
            height="420"
            style={{
              filter:
                "drop-shadow(0 32px 160px #0057B7) drop-shadow(0 0px 80px #fff8)",
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
  if (!open) return null;

  // Render principal
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center logo-reload-animate-fadeInLogo"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0057B7 0%, #0a2a5c 60%, #1e90ff 100%)",
        backgroundSize: "200% 200%",
        animation: "logo-reload-bgMove 16s ease-in-out infinite alternate",
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
