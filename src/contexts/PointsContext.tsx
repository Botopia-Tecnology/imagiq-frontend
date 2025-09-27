"use client";
/**
 * PointsContext - Contexto global para puntos Q acumulados en el carrito
 * Proporciona el total de puntos y funciones para sumar, restar y resetear puntos.
 *
 * - El contador de puntos se actualiza en tiempo real al agregar/quitar productos del carrito.
 * - Si el carrito se vacía, los puntos se resetean a 0.
 * - El valor de puntos de cada producto se define en el campo `puntos_q` (tipado estricto).
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useCartContext } from "@/features/cart/CartContext";

/**
 * Interfaz estricta para el campo de puntos de producto
 */
export type ProductPoints = {
  id: string;
  puntos_q: number;
  quantity: number;
};

interface PointsContextType {
  totalPoints: number;
  /** Forzar recálculo manual (opcional) */
  recalculatePoints: () => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const usePointsContext = () => {
  const ctx = useContext(PointsContext);
  if (!ctx)
    throw new Error("usePointsContext must be used within PointsProvider");
  return ctx;
};

/**
 * PointsProvider - Calcula y expone los puntos acumulados en el carrito
 *
 * Suma los puntos de todos los productos (producto.puntos_q * cantidad).
 * Si el carrito se vacía, los puntos se resetean automáticamente.
 */
export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const { cart } = useCartContext();
  const [totalPoints, setTotalPoints] = useState(0);

  // Recalcula los puntos cada vez que cambia el carrito
  const recalculatePoints = () => {
    let sum = 0;
    for (const item of cart) {
      // Si el producto no tiene puntos_q, se asume 0
      sum += (item.puntos_q ?? 0) * (item.quantity ?? 1);
    }
    setTotalPoints(sum);
  };

  useEffect(() => {
    recalculatePoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  return (
    <PointsContext.Provider value={{ totalPoints, recalculatePoints }}>
      {children}
    </PointsContext.Provider>
  );
};
