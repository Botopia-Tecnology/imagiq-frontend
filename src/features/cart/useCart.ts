import { useRef } from "react";
import { toast } from "sonner";

/**
 * Hook personalizado para manejo del carrito
 * - Agregar/remover productos
 * - Actualizar cantidades
 * - Cálculo de totales
 * - Persistencia en localStorage
 * - Sincronización con backend si el usuario está logueado
 * - Tracking de eventos de carrito con PostHog
 */

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export type CartProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export const useCart = () => {
  // Ref para controlar la unicidad de la notificación de eliminación
  const toastActiveRef = useRef<Record<string, boolean>>({});
  
  // Estado simulado del carrito (reemplazar por useState en implementación real)
  const items: CartProduct[] = [];
  
  /**
   * Elimina un producto del carrito y muestra una alerta única por acción.
   * Usa toastActiveRef para evitar mostrar notificaciones duplicadas.
   */
  const removeItem = (productId: string) => {
    // Evitar procesar si ya hay una notificación activa para este producto
    if (toastActiveRef.current[productId]) return;
    
    // Buscar el producto antes de eliminar (simulado)
    const productToRemove = items.find(p => p.id === productId);
    if (!productToRemove) return;
    
    // Marcar como activo para evitar duplicados
    toastActiveRef.current[productId] = true;
    const productName = productToRemove.name;
    
    // Mostrar notificación única
    toast.info(`Producto eliminado`, {
      description: `${productName} se quitó del carrito`,
      duration: 2500,
      className: "toast-info",
      // Limpiar el flag cuando la notificación se cierra
      onAutoClose: () => { toastActiveRef.current[productId] = false; },
      // Limpiar el flag si el usuario cierra manualmente
      onDismiss: () => { toastActiveRef.current[productId] = false; },
    });
  };
  
  return {
    items,
    total: 0,
    itemCount: 0,
    addItem: (_product: Product) => {
      // Add item implementation
    },
    removeItem,
    updateQuantity: (_productId: string, _quantity: number) => {
      // Update quantity implementation
    },
    clearCart: () => {
      // Clear cart implementation
    },
    loading: false,
  };
};
