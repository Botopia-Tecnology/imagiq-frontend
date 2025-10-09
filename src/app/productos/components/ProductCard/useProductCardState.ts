/**
 * Custom hook para gestionar el estado del ProductCard
 * Extrae lógica de estado y handlers para reducir complejidad del componente
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/features/cart/CartContext";
import { ProductColor, ProductCapacity } from "../ProductCard";
import {
  trackColorSelection,
  trackCapacitySelection,
  trackAddToCart,
  trackMoreInfo,
} from "./productCardUtils";

interface UseProductCardStateProps {
  id: string;
  name: string;
  colors?: ProductColor[];
  capacities?: ProductCapacity[];
  selectedColorProp?: ProductColor;
  selectedCapacityProp?: ProductCapacity;
  sku?: string | null;
  puntos_q: number;
  currentPrice: string | null | undefined;
  image: string | { src: string };
}

export function useProductCardState({
  id,
  name,
  colors,
  capacities,
  selectedColorProp,
  selectedCapacityProp,
  sku,
  puntos_q,
  currentPrice,
  image,
}: UseProductCardStateProps) {
  const router = useRouter();
  const { addProduct } = useCartContext();
  const [isLoading, setIsLoading] = useState(false);

  // Estado local de selección
  const [selectedColorLocal, setSelectedColorLocal] = useState<ProductColor | null>(
    colors && colors.length > 0 ? colors[0] : null
  );
  const selectedColor = selectedColorProp ?? selectedColorLocal;

  const [selectedCapacityLocal, setSelectedCapacityLocal] = useState<ProductCapacity | null>(
    capacities && capacities.length > 0 ? capacities[0] : null
  );
  const selectedCapacity = selectedCapacityProp ?? selectedCapacityLocal;

  // Handlers de selección
  const handleColorSelect = (color: ProductColor) => {
    setSelectedColorLocal(color);
    trackColorSelection(id, name, color);
  };

  const handleCapacitySelect = (capacity: ProductCapacity) => {
    setSelectedCapacityLocal(capacity);
    trackCapacitySelection(id, name, capacity);
  };

  // Handler para agregar al carrito
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    trackAddToCart(id, name, selectedColor, sku);

    try {
      addProduct({
        id,
        name,
        image: typeof image === "string" ? image : image.src ?? "",
        price:
          typeof currentPrice === "string"
            ? parseInt(currentPrice.replace(/[^\d]/g, ""))
            : currentPrice ?? 0,
        quantity: 1,
        sku: selectedColor?.sku || sku || id,
        puntos_q,
      });
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  // Handler para más información
  const handleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/productos/multimedia/${id}`);
    trackMoreInfo(id, name);
  };

  // Handler para click en card completa
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isButton = target.closest("button") !== null;
    if (!isButton) {
      handleMoreInfo(e);
    }
  };

  // Handler para notificación
  const handleNotifyMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Te notificaremos cuando este producto esté disponible");
  };

  return {
    selectedColor,
    selectedCapacity,
    isLoading,
    handleColorSelect,
    handleCapacitySelect,
    handleAddToCart,
    handleMoreInfo,
    handleCardClick,
    handleNotifyMe,
  };
}
