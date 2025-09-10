
import React from "react";

interface ChatbotExitAnimationProps {
  children: React.ReactNode;
  isVisible: boolean;
  duration?: number; // ms
  className?: string;
}


export const ChatbotExitAnimation: React.FC<ChatbotExitAnimationProps> = ({
  children,
  isVisible,
  duration = 400,
  className = "",
}) => {
  // Solo animación, sin modificar layout ni tamaño
  const style: React.CSSProperties = {
    pointerEvents: isVisible ? "auto" : "none",
    transition:
      `opacity ${duration}ms cubic-bezier(.34,1.56,.64,1), ` +
      `transform ${duration}ms cubic-bezier(.34,1.56,.64,1), ` +
      `box-shadow ${duration}ms cubic-bezier(.34,1.56,.64,1)`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translateY(0) scale(1.04)"
      : "translateY(40px) scale(0.98)",
    boxShadow: isVisible
      ? "0 8px 32px rgba(0,0,0,0.12)"
      : "0 2px 8px rgba(0,0,0,0.06)",
    filter: isVisible
      ? "blur(0px) brightness(1)"
      : "blur(2px) brightness(0.98)",
    willChange: "opacity, transform, box-shadow, filter",
  };

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};