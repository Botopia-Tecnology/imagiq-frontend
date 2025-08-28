"use client";

// Las funciones deben ir dentro del CartProvider para acceder a setItems

/**
 * Context del Carrito de Compras
 * - Estado global del carrito
 * - Provider para toda la aplicación
 * - Sincronización entre tabs del navegador
 * - Integración con microservicio de carrito
 * - Tracking de abandono de carrito
 */

import { createContext, useContext, useState, useEffect } from "react";

// Tipos para productos en el carrito
import type { CartProduct } from "./useCart";

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
 * Proveedor global del carrito. Maneja estado, persistencia y lógica.
 */
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Estado principal del carrito
  const [items, setItems] = useState<CartProduct[]>([]);

  /**
   * addProduct
   * Añade un producto al carrito. Si ya existe, suma la cantidad.
   * Actualiza localStorage automáticamente.
   */
  const addProduct = (product: CartProduct) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...currentItems, { ...product }];
    });
  };

  /**
   * removeProduct
   * Elimina un producto del carrito por id.
   */
  const removeProduct = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  /**
   * updateQuantity
   * Actualiza la cantidad de un producto. Si la cantidad es 0, lo elimina.
   */
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * clearCart
   * Vacía el carrito completamente.
   */
  const clearCart = () => {
    setItems([]);
  };

  /**
   * getProducts
   * Devuelve todos los productos del carrito.
   */
  const getProducts = () => items;

  /**
   * Persistencia: carga el carrito desde localStorage al montar.
   */
  useEffect(() => {
    const savedCart = localStorage.getItem("cart-items");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  /**
   * Persistencia: guarda el carrito en localStorage cada vez que cambia.
   */
  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(items));
  }, [items]);

  /**
   * itemCount
   * Calcula la cantidad total de productos para el badge del navbar.
   */
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  /**
   * value
   * Valor del contexto global del carrito.
   */
  const value: CartContextType = {
    cart: items,
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
    getProducts,
    itemCount,
  };

  /**
   * Renderiza el proveedor global del carrito.
   */
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
