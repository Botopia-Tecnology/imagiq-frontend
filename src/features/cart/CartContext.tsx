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

import { useAuthContext } from "@/features/auth/context";
import { CartProduct, useCart } from "@/hooks/useCart";
import { useAnalyticsWithUser } from "@/lib/analytics";
import { apiClient } from "@/lib/api";
import { apiPost } from "@/lib/api-client";
import React, { createContext, useCallback, useContext } from "react";

/**
 * CartContextType
 * Define la interfaz del contexto global del carrito.
 */
type CartContextType = {
  /** Array de productos en el carrito */
  cart: CartProduct[];
  /** Añade un producto al carrito (o suma cantidad si ya existe) */
  addProduct: (product: CartProduct) => Promise<void>;
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
  /** Puntos Q acumulados en el carrito (valor global reactivo) */
  pointsQ: number;
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
  // Obtener el usuario autenticado
  const { user } = useAuthContext();

  // Hook de analytics para tracking con datos de usuario
  const { trackAddToCart } = useAnalyticsWithUser();

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

  // Calcular puntos Q globales (reactivo)
  const pointsQ = products.reduce(
    (acc, p) => acc + Number(p.puntos_q || 0) * Number(p.quantity || 1),
    0
  );

  // Memoizar funciones para evitar que cambien en cada render
  const addProduct = useCallback(
    async (product: CartProduct) => {
      // Extraer quantity del producto y pasarlo por separado para evitar problemas de tipo
      const { quantity, ...productWithoutQuantity } = product;
      await addToCart(productWithoutQuantity, quantity || 1, user?.id);

      apiPost("/api/cart/add", {
        item: product,
      });

      // Track del evento add_to_cart para analytics
      trackAddToCart({
        item_id: product.sku || product.id,
        item_name: product.name,
        item_brand: "Samsung",
        price: Number(product.price),
        quantity: quantity || 1,
        currency: "COP",
      });
    },
    [addToCart, user?.id, trackAddToCart]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      apiClient.put(
        `/api/cart/items/${productId}`,
        {
          quantity,
        }
      );
      updateQty(productId, quantity);
    },
    [updateQty, user?.id]
  );

  const getProducts = useCallback(() => products, [products]);

  // Memoizar el value para evitar renders innecesarios y cumplir con las reglas de React Context
  const value = React.useMemo(
    () => ({
      cart: products,
      addProduct,
      removeProduct,
      updateQuantity,
      clearCart,
      getProducts,
      itemCount: calculations.productCount,
      isEmpty,
      formatPrice,
      pointsQ,
    }),
    [
      products,
      addProduct,
      removeProduct,
      updateQuantity,
      clearCart,
      getProducts,
      calculations.productCount,
      isEmpty,
      formatPrice,
      pointsQ,
    ]
  );

  /**
   * Renderiza el proveedor global del carrito.
   */
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
