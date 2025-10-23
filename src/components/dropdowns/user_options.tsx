import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/features/auth/context";
import { cn } from "@/lib/utils";

/**
 *
 * Props para UserOptionsDropdown
 */
interface UserOptionsDropdownProps {
  showWhiteItems: boolean;
}

/**
 * Dropdown de usuario para el Navbar
 * Diseño limpio y simétrico con posicionamiento relativo
 */
const UserOptionsDropdown: React.FC<UserOptionsDropdownProps> = ({
  showWhiteItems,
}) => {
  const { isAuthenticated, user, logout } = useAuthContext();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const primerNombre = user?.nombre?.split(" ")[0] || "";

  // Manejo simple del dropdown
  const handleToggle = () => setOpen(!open);

  const handleClose = () => setOpen(false);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!isAuthenticated || !user?.nombre) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón del usuario */}
      <button
        className={cn(
          "flex flex-col items-center justify-center px-3 py-2 text-xs md:text-sm font-medium leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md transition-colors duration-300 hover:opacity-80",
          showWhiteItems ? "text-white" : "text-black"
        )}
        aria-label={`Opciones de usuario para ${primerNombre}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleToggle}
        type="button"
      >
        <span>Hola,</span>
        <span className="font-semibold">{primerNombre}</span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000] overflow-hidden"
          role="menu"
          aria-label="Menú de usuario"
        >
          <button
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 border-b border-gray-100"
            role="menuitem"
            onClick={() => {
              handleClose();
              router.push("/perfil");
            }}
          >
            <span className="block font-medium">Ver perfil</span>
            <span className="block text-sm text-gray-500">
              Gestiona tu cuenta
            </span>
          </button>

          <button
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
            role="menuitem"
            onClick={() => {
              handleClose();
              logout();
            }}
          >
            <span className="block font-medium">Cerrar sesión</span>
            <span className="block text-sm text-gray-500">
              Salir de tu cuenta
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserOptionsDropdown;
