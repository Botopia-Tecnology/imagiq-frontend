"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { useCartContext } from "@/features/cart/CartContext";
import { usePointsContext } from "@/contexts/PointsContext";
import type { ProductVariant, ColorOption } from "@/hooks/useProductSelection";
import { ProductCardProps } from "@/app/productos/components/ProductCard";
import fallbackImage from "@/img/dispositivosmoviles/cel1.png";
import { shouldRenderValue } from "@/app/productos/components/utils/shouldRenderValue";

// Type for the product selection data - subset of UseProductSelectionReturn
type ProductSelectionData = {
  selectedSku: string | null;
  selectedPrice: number | null;
  selectedOriginalPrice: number | null;
  selectedStockTotal: number | null;
  selectedVariant: ProductVariant | null;
  selectedSkuPostback: string | null;
  selection: {
    selectedColor: string | null;
    selectedCapacity: string | null;
    selectedMemoriaram: string | null;
  };
  getSelectedColorOption: () => ColorOption | null;
};

interface AddToCartButtonProps {
  product: ProductCardProps;
  productSelection: ProductSelectionData | null;
  onNotifyStock?: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, productSelection, onNotifyStock }) => {
  const { addProduct } = useCartContext();
  const { recalculatePoints } = usePointsContext();
  const [loading, setLoading] = React.useState(false);

  // Verificar si hay stock (con null check para productSelection)
  const hasStock = productSelection?.selectedStockTotal !== null &&
                   productSelection?.selectedStockTotal !== undefined &&
                   productSelection?.selectedStockTotal > 0;

  const handleAddToCart = async () => {
    if (!productSelection || !productSelection.selectedSku) {
      alert("Por favor selecciona todas las opciones del producto");
      return;
    }

    setLoading(true);
    try {
      await addProduct({
        id: product.id,
        name: product.name,
        price: productSelection.selectedPrice || 0,
        originalPrice: productSelection.selectedOriginalPrice || undefined,
        stock: productSelection.selectedStockTotal ?? 1,
        quantity: 1,
        image:
          productSelection.selectedVariant?.imagePreviewUrl ||
          (typeof product.image === "string"
            ? product.image
            : fallbackImage.src),
        sku: productSelection.selectedSku,
        ean: productSelection.selectedVariant?.ean || "",
        puntos_q: product.puntos_q ?? 4,
        color: (productSelection.getSelectedColorOption()?.hex && shouldRenderValue(productSelection.getSelectedColorOption()?.hex)) ? productSelection.getSelectedColorOption()?.hex : undefined,
        colorName: (() => {
          const colorDisplay = productSelection.getSelectedColorOption()?.nombreColorDisplay;
          if (colorDisplay && shouldRenderValue(colorDisplay)) return colorDisplay;
          const selectedColor = productSelection.selection.selectedColor;
          if (selectedColor && shouldRenderValue(selectedColor)) return selectedColor;
          return undefined;
        })(),
        capacity: (() => {
          const cap = productSelection.selection.selectedCapacity;
          return cap && shouldRenderValue(cap) ? cap : undefined;
        })(),
        ram: (() => {
          const ramValue = productSelection.selection.selectedMemoriaram;
          return ramValue && shouldRenderValue(ramValue) ? ramValue : undefined;
        })(),
        skuPostback: productSelection.selectedSkuPostback || '',
        desDetallada: productSelection.selectedVariant?.desDetallada,
        modelo: product.apiProduct?.modelo?.[0] || "",
        categoria: product.apiProduct?.categoria || "",
      });
      recalculatePoints();
      
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // No renderizar si productSelection es null
  if (!productSelection) return null;

  const currentPrice = productSelection.selectedPrice || 0;
  const displayPrice = formatPrice(currentPrice);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 md:py-12">
      <div className="flex flex-col items-center gap-4">
        {hasStock ? (
          // Botón con stock: Añadir al carrito
          <motion.button
            onClick={handleAddToCart}
            disabled={loading || !productSelection.selectedSku}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              w-full max-w-md
              flex items-center justify-center gap-3
              bg-[#0066CC] hover:bg-[#0052A3]
              disabled:bg-gray-400 disabled:cursor-not-allowed
              text-white
              px-8 py-4
              rounded-full
              font-bold text-lg
              transition-all duration-200
              shadow-lg hover:shadow-xl
            "
          >
            <FiShoppingCart className="text-2xl" />
            <span>
              {loading ? "Añadiendo..." : `Añadir al carrito - ${displayPrice}`}
            </span>
          </motion.button>
        ) : (
          // Botón sin stock: Notificarme
          <motion.button
            onClick={onNotifyStock}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              w-full max-w-md
              flex items-center justify-center gap-3
              bg-gray-800 hover:bg-gray-700
              text-white
              px-8 py-4
              rounded-full
              font-bold text-lg
              transition-all duration-200
              shadow-lg hover:shadow-xl
            "
          >
            <FiShoppingCart className="text-2xl" />
            <span>Notificarme cuando haya stock</span>
          </motion.button>
        )}

        {productSelection.selectedVariant && (
          <div className="text-center text-sm text-gray-600">
            {productSelection.selection.selectedColor && shouldRenderValue(productSelection.selection.selectedColor) && (
              <span className="mr-2">
                Color: {shouldRenderValue(productSelection.getSelectedColorOption()?.nombreColorDisplay) ? productSelection.getSelectedColorOption()?.nombreColorDisplay : productSelection.selection.selectedColor}
              </span>
            )}
            {productSelection.selection.selectedCapacity && shouldRenderValue(productSelection.selection.selectedCapacity) && (
              <span className="mr-2">
                | Almacenamiento: {productSelection.selection.selectedCapacity}
              </span>
            )}
            {productSelection.selection.selectedMemoriaram && shouldRenderValue(productSelection.selection.selectedMemoriaram) && (
              <span>| RAM: {productSelection.selection.selectedMemoriaram}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCartButton;
