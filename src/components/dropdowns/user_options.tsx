import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/features/auth/context";
import { useNavbarLogic } from "@/hooks/navbarLogic";

/**
 * Dropdown de usuario para el Navbar
 * UX mejorada: cierre con Escape, navegación por teclado, animación fade, foco automático, integración visual.
 */
const UserOptionsDropdown: React.FC = () => {
  // Contexto de autenticación
  const { isAuthenticated, user, logout } = useAuthContext();
  // Contexto visual del navbar para color de texto
  const navbar = useNavbarLogic();
  const router = useRouter();

  // Estado para controlar apertura/cierre del dropdown
  const [open, setOpen] = useState(false);
  const [fade, setFade] = useState(false); // Para animación fade
  const dropdownRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  // Obtiene el primer nombre para el saludo
  const primerNombre = user?.nombre?.split(" ")[0] || "";
  // Color de texto según contexto visual
  const textColor = navbar?.showWhiteItems ? "text-white" : "text-black";

  // Handler para abrir/cerrar con animación
  const handleToggle = () => {
    if (!open) {
      setOpen(true);
      setTimeout(() => setFade(true), 10);
    } else {
      setFade(false);
      setTimeout(() => setOpen(false), 150);
    }
  };

  // Cierra el dropdown al hacer click fuera o Escape
  useEffect(() => {
    if (!open) return;
    setFade(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFade(false);
        setTimeout(() => setOpen(false), 150);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFade(false);
        setTimeout(() => setOpen(false), 150);
      }
      // Navegación por teclado
      if (event.key === "Tab" && open) {
        // Si el foco sale del dropdown, ciérralo
        setTimeout(() => {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(document.activeElement)
          ) {
            setFade(false);
            setTimeout(() => setOpen(false), 150);
          }
        }, 0);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Foco automático en la primera opción al abrir
  useEffect(() => {
    if (open && firstOptionRef.current) {
      firstOptionRef.current.focus();
    }
  }, [open]);

  // Accesibilidad: cierra con blur si el foco sale del dropdown
  const handleDropdownBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setFade(false);
      setTimeout(() => setOpen(false), 150);
    }
  };

  // No renderiza si no está autenticado
  if (!isAuthenticated || !user?.nombre) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón que muestra el saludo y abre/cierra el menú */}
      <button
        className={`max-w-[130px] min-w-[90px] truncate flex flex-col items-center leading-tight text-xs md:text-sm font-medium px-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors duration-150 ${textColor}`}
        aria-label={`Opciones de usuario para ${primerNombre}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="user-options-menu"
        onClick={handleToggle}
        type="button"
        tabIndex={0}
      >
        Hola,
        <br />
        {primerNombre}
      </button>
      {/* Dropdown */}
      {open && (
        <div
          id="user-options-menu"
          className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-200 ease-in-out ${
            fade
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          role="menu"
          aria-label="Menú de usuario"
          style={{ minWidth: 180 }}
          tabIndex={-1}
          onBlur={handleDropdownBlur}
        >
          <button
            ref={firstOptionRef}
            className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-t-lg transition-colors duration-150 focus:outline-none"
            role="menuitem"
            tabIndex={0}
            onClick={() => {
              setFade(false);
              setTimeout(() => setOpen(false), 150);
              router.push("/perfil");
            }}
          >
            Ver perfil
          </button>
          <button
            className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-b-lg transition-colors duration-150 focus:outline-none"
            role="menuitem"
            tabIndex={0}
            onClick={() => {
              setFade(false);
              setTimeout(() => setOpen(false), 150);
              logout();
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserOptionsDropdown;
