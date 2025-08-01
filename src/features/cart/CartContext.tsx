/**
 * Context del Carrito de Compras
 * - Estado global del carrito
 * - Provider para toda la aplicación
 * - Sincronización entre tabs del navegador
 * - Integración con microservicio de carrito
 * - Tracking de abandono de carrito
 */

import { createContext, useContext } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (product: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Cart context implementation will be here
  const value: CartContextType = {
    items: [],
    total: 0,
    itemCount: 0,
    addItem: () => {},
    removeItem: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    loading: false,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
