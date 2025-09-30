// Botón flotante Entrego y Estreno
// Componente reutilizable para mostrar el botón flotante con animación y acceso a Entrego y Estreno
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import entregoEstrenoLogo from "@/img/entrego-estreno/entrego-estreno-logo.png";
import gifEntregoEstreno from "@/img/gif/gif-entrego-estreno.gif";

/**
 * Botón flotante Entrego y Estreno, con animación de hover y navegación.
 */
const FloatingEntregoEstrenoButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push("/productos/components/entrego-estreno");
  };

  return (
    <button
      type="button"
      aria-label="Entrego y Estreno flotante"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed left-4 bottom-6 z-50 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-gray-200 focus:outline-none bg-white shadow-xl transition-all duration-300 ease-in-out group"
      style={{
        boxShadow: "0 4px 24px 0 rgba(30,64,175,0.16)",
        position: "fixed",
        left: "1rem",
        bottom: "1.5rem",
      }}
    >
      {/* Imagen GIF por defecto, cambia a logo en hover */}
      <span className="absolute inset-0 flex items-center justify-center">
        <Image
          src={gifEntregoEstreno}
          alt="Entrego y Estreno GIF"
          width={56}
          height={56}
          className={`object-contain transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${
            isHovered ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
          priority
        />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110"
        }`}
      >
        <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-2xl flex items-center justify-center">
          <Image
            src={entregoEstrenoLogo}
            alt="Entrego y Estreno Logo"
            width={80}
            height={80}
            className="object-contain drop-shadow-2xl transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
            priority
          />
        </span>
      </span>
    </button>
  );
};

export default FloatingEntregoEstrenoButton;
