import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface CartProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
}

interface CartCalculations {
  productCount: number;
  subtotal: number;
  shipping: number;
  taxes: number;
  discount: number;
  total: number;
}

interface UseCartReturn {
  // Estado
  products: CartProduct[];
  appliedDiscount: number;
  isLoading: boolean;

  // Cálculos
  calculations: CartCalculations;

  // Acciones
  addProduct: (
    product: Omit<CartProduct, "quantity">,
    quantity?: number
  ) => void;
  removeProduct: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (discount: number) => void;

  // Utilidades
  isEmpty: boolean;
  formatPrice: (price: number) => string;
}

const STORAGE_KEYS = {
  CART_ITEMS: "cart-items",
  APPLIED_DISCOUNT: "applied-discount",
} as const;

const SHIPPING_COST = 20000;
const TAX_RATE = 0.09;

// Función para normalizar productos del localStorage
function normalizeCartProducts(rawProducts: unknown[]): CartProduct[] {
  if (!Array.isArray(rawProducts)) return [];

  return rawProducts
    .filter(
      (p): p is Record<string, unknown> => typeof p === "object" && p !== null
    )
    .map((p) => ({
      id: String(p.id || ""),
      name: String(p.nombre || p.name || "Producto"),
      image: String(p.imagen || p.image || "/img/logo_imagiq.png"),
      price: Number(p.precio || p.price || 0),
      quantity: Number(p.cantidad || p.quantity || 1),
      sku: String(
        p.sku || `SKU-${p.id || Math.random().toString(36).slice(2, 10)}`
      ),
    }))
    .filter((p) => p.id && p.price > 0); // Filtrar productos inválidos
}

// Función para obtener productos del localStorage
function getStoredProducts(): CartProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return normalizeCartProducts(parsed);
  } catch (error) {
    console.warn("Error parsing cart items from localStorage:", error);
    return [];
  }
}

// Función para obtener descuento aplicado
function getStoredDiscount(): number {
  if (typeof window === "undefined") return 0;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APPLIED_DISCOUNT);
    return stored ? Number(stored) : 0;
  } catch (error) {
    console.warn("Error parsing discount from localStorage:", error);
    return 0;
  }
}

// Función para formatear precios en COP
export const formatPrice = (price: number): string => {
  if (!isFinite(price) || isNaN(price)) return "$0";
  return price.toLocaleString("es-CO", { style: "currency", currency: "COP" });
};

export function useCart(): UseCartReturn {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializar datos del carrito
  useEffect(() => {
    setProducts(getStoredProducts());
    setAppliedDiscount(getStoredDiscount());
    setIsLoading(false);
  }, []);

  // Sincronizar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setProducts(getStoredProducts());
      setAppliedDiscount(getStoredDiscount());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Función para guardar productos en localStorage
  const saveProducts = useCallback((newProducts: CartProduct[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CART_ITEMS,
        JSON.stringify(newProducts)
      );
      setProducts(newProducts);
    } catch (error) {
      console.error("Error saving products to localStorage:", error);
    }
  }, []);

  // Función para guardar descuento en localStorage
  const saveDiscount = useCallback((discount: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLIED_DISCOUNT, String(discount));
      setAppliedDiscount(discount);
    } catch (error) {
      console.error("Error saving discount to localStorage:", error);
    }
  }, []);

  // Acciones del carrito
  const addProduct = useCallback(
    (product: Omit<CartProduct, "quantity">, quantity: number = 1) => {
      setProducts((currentProducts) => {
        const existingIndex = currentProducts.findIndex(
          (p) => p.id === product.id
        );
        let newProducts: CartProduct[];
        let wasUpdated = false;

        if (existingIndex >= 0) {
          // Actualizar cantidad si el producto ya existe
          newProducts = [...currentProducts];
          newProducts[existingIndex] = {
            ...newProducts[existingIndex],
            quantity: newProducts[existingIndex].quantity + quantity,
          };
          wasUpdated = true;
        } else {
          // Agregar nuevo producto
          newProducts = [...currentProducts, { ...product, quantity }];
        }

        saveProducts(newProducts);

        // Mostrar notificación de éxito
        toast.success(
          wasUpdated ? `Cantidad actualizada` : `Producto añadido al carrito`,
          {
            description: `${product.name} - Cantidad: ${quantity}`,
            duration: 3000,
            className: "toast-success",
          }
        );

        return newProducts;
      });
    },
    [saveProducts]
  );

  const removeProduct = useCallback(
    (productId: string) => {
      setProducts((currentProducts) => {
        // Encontrar el producto que se va a eliminar para la notificación
        const productToRemove = currentProducts.find((p) => p.id === productId);
        const newProducts = currentProducts.filter((p) => p.id !== productId);

        saveProducts(newProducts);

        // Mostrar notificación de eliminación
        if (productToRemove) {
          toast.info(`Producto eliminado`, {
            description: `${productToRemove.name} se quitó del carrito`,
            duration: 2500,
            className: "toast-info",
          });
        }

        return newProducts;
      });
    },
    [saveProducts]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeProduct(productId);
        return;
      }

      setProducts((currentProducts) => {
        const newProducts = currentProducts.map((p) =>
          p.id === productId ? { ...p, quantity } : p
        );
        saveProducts(newProducts);
        return newProducts;
      });
    },
    [removeProduct, saveProducts]
  );

  const clearCart = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
      setProducts([]);

      // Mostrar notificación de carrito limpiado
      toast.info("Carrito vacío", {
        description: "Todos los productos fueron eliminados",
        duration: 2500,
        className: "toast-info",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }, []);

  const applyDiscount = useCallback(
    (discount: number) => {
      const validDiscount = Math.max(0, discount);
      saveDiscount(validDiscount);
    },
    [saveDiscount]
  );

  // Cálculos derivados
  const calculations: CartCalculations = {
    productCount: products.reduce((acc, p) => {
      const qty = Number(p.quantity);
      return acc + (isNaN(qty) ? 0 : qty);
    }, 0),

    subtotal: products.reduce((acc, p) => {
      const price = Number(p.price);
      const quantity = Number(p.quantity);
      const safePrice = isNaN(price) ? 0 : price;
      const safeQuantity = isNaN(quantity) ? 0 : quantity;
      return acc + safePrice * safeQuantity;
    }, 0),

    shipping: SHIPPING_COST,
    discount: Math.max(0, appliedDiscount),

    get taxes() {
      return Math.round(this.subtotal * TAX_RATE);
    },

    get total() {
      return Math.max(0, this.subtotal - this.discount + this.shipping);
    },
  };

  const isEmpty = products.length === 0;

  return {
    // Estado
    products,
    appliedDiscount,
    isLoading,

    // Cálculos
    calculations,

    // Acciones
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
    applyDiscount,

    // Utilidades
    isEmpty,
    formatPrice,
  };
}
