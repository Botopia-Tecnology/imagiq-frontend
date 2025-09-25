/**
 * Contexto para manejar los botones de acción del producto en el navbar
 * Permite mostrar/ocultar botones y pasar información del producto seleccionado
 */

"use client";

import { createContext, useContext, useCallback, useState, ReactNode } from 'react';

interface NavbarProductState {
  productName?: string;
  selectedVariant?: any;
  showActionButtons: boolean;
}

interface NavbarProductContextType {
  state: NavbarProductState;
  setProductInfo: (productName: string, selectedVariant?: any) => void;
  showActionButtons: (show: boolean) => void;
  clearProductInfo: () => void;
}

const NavbarProductContext = createContext<NavbarProductContextType | undefined>(undefined);

export function NavbarProductProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavbarProductState>({
    showActionButtons: false,
  });

  const setProductInfo = useCallback((productName: string, selectedVariant?: any) => {
    setState(prev => ({
      ...prev,
      productName,
      selectedVariant,
    }));
  }, []);

  const showActionButtons = useCallback((show: boolean) => {
    setState(prev => ({
      ...prev,
      showActionButtons: show,
    }));
  }, []);

  const clearProductInfo = useCallback(() => {
    setState({
      showActionButtons: false,
    });
  }, []);

  return (
    <NavbarProductContext.Provider value={{
      state,
      setProductInfo,
      showActionButtons,
      clearProductInfo,
    }}>
      {children}
    </NavbarProductContext.Provider>
  );
}

export function useNavbarProduct() {
  const context = useContext(NavbarProductContext);
  if (context === undefined) {
    throw new Error('useNavbarProduct must be used within a NavbarProductProvider');
  }
  return context;
}