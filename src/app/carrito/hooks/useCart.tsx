import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

// Utilidad para obtener productos del carrito desde localStorage
function getCartProducts(): Product[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("cart-items");
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.map((p) => ({
          id: p.id,
          name: p.nombre || p.name || "Producto",
          image: p.imagen || p.image || "/img/logo_imagiq.png",
          price: p.precio || p.price || 0,
          quantity: p.cantidad || p.quantity || 1,
        }))
      : [];
  } catch {
    return [];
  }
}

export const useCart = () => {
  const [cartProducts, setCartProducts] = useState<Product[]>(
    getCartProducts()
  );
  const [appliedDiscount, setAppliedDiscount] = useState(() => {
    if (typeof window !== "undefined") {
      const d = localStorage.getItem("applied-discount");
      return d ? Number(d) : 0;
    }
    return 0;
  });

  // Sincronizar productos y descuento
  useEffect(() => {
    const syncCart = () => setCartProducts(getCartProducts());
    window.addEventListener("storage", syncCart);
    syncCart();
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const d = localStorage.getItem("applied-discount");
      setAppliedDiscount(d ? Number(d) : 0);
    }
  }, []);

  return {
    cartProducts,
    appliedDiscount,
  };
};
