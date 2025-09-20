"use client";

/**
 * Context del Carrito de Compras
 * Ahora usa el hook centralizado useCart para toda la lógica
 * - Estado global del carrito
 * - Provider para toda la aplicación
 * - Sincronización entre tabs del navegador
 * - Integración con microservicio de carrito
 * - Tracking de abandono de carrito
 */

import { createContext, useContext } from "react";
import { useCart, CartProduct } from "@/hooks/useCart";

/**
 * CartContextType
 * Define la interfaz del contexto global del carrito.
 */
type CartContextType = {
  /** Array de productos en el carrito */
  cart: CartProduct[];
  /** Añade un producto al carrito (o suma cantidad si ya existe) */
  addProduct: (product: CartProduct) => void;
  /** Elimina un producto por id */
  removeProduct: (id: string) => void;
  /** Actualiza la cantidad de un producto */
  updateQuantity: (id: string, cantidad: number) => void;
  /** Vacía el carrito */
  clearCart: () => void;
  /** Devuelve todos los productos */
  getProducts: () => CartProduct[];
  /** Cantidad total de productos (para el badge del navbar) */
  itemCount: number;
  /** Si el carrito está vacío */
  isEmpty: boolean;
  /** Formatear precios */
  formatPrice: (price: number) => string;
};

/**
 * CartContext
 * Contexto global para el carrito de compras.
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * useCartContext
 * Hook para acceder al contexto del carrito.
 * @throws Error si se usa fuera del CartProvider
 */
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
};

/**
 * CartProvider
 * Proveedor global del carrito. Ahora usa el hook centralizado useCart.
 */
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Usar el hook centralizado useCart
  const {
    products,
    calculations,
    addProduct: addToCart,
    removeProduct,
    updateQuantity: updateQty,
    clearCart,
    isEmpty,
    formatPrice,
  } = useCart();

  // Adaptar la interfaz para mantener compatibilidad
  const addProduct = (product: CartProduct) => {
    addToCart(product);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    updateQty(productId, quantity);
  };

  const getProducts = () => products;

  /**
   * value
   * Valor del contexto global del carrito usando el hook centralizado.
   */
  const value: CartContextType = {
    cart: products,
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
    getProducts,
    itemCount: calculations.productCount,
    isEmpty,
    formatPrice,
  };

  /**
   * Renderiza el proveedor global del carrito.
   */
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
