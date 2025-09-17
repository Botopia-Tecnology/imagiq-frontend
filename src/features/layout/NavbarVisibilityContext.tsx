"use client";

import React, { createContext, useContext, useState } from "react";

/**
 * Contexto global para controlar la visibilidad del Navbar.
 * Úsalo con el hook useNavbarVisibility en cualquier componente.
 * Proporciona hideNavbar (boolean) y setHideNavbar (función).
 * Debe envolver el layout principal para funcionar correctamente.
 */
interface NavbarVisibilityContextType {
  hideNavbar: boolean;
  setHideNavbar: (hide: boolean) => void;
}

const NavbarVisibilityContext = createContext<
  NavbarVisibilityContextType | undefined
>(undefined);

export const NavbarVisibilityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [hideNavbar, setHideNavbar] = useState(false);
  return (
    <NavbarVisibilityContext.Provider value={{ hideNavbar, setHideNavbar }}>
      {children}
    </NavbarVisibilityContext.Provider>
  );
};

/**
 * Hook para acceder y modificar la visibilidad global del Navbar.
 * Debe usarse dentro de un NavbarVisibilityProvider.
 * Lanza error si no está dentro del provider.
 */
export const useNavbarVisibility = () => {
  const context = useContext(NavbarVisibilityContext);
  if (!context) {
    throw new Error(
      "useNavbarVisibility must be used within a NavbarVisibilityProvider"
    );
  }
  return context;
};
