/**
 * ProductCard - Componente compacto tipo Samsung Store
 * Arquitectura modular con principios SOLID
 */
"use client";

import { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCloudinaryImage } from "@/hooks/useCloudinaryImage";
import { useState } from "react";
import ProductImage from "./ProductCard/ProductImage";
import ProductSelectors from "./ProductCard/ProductSelectors";
import ProductPricing from "./ProductCard/ProductPricing";
import ProductRating from "./ProductCard/ProductRating";
import ProductActions from "./ProductCard/ProductActions";
import ProductQuickView from "./ProductCard/ProductQuickView";
import {
  cleanProductName,
  calculateMonthlyPrice,
  calculateSavings,
} from "./ProductCard/productCardUtils";
import { useProductCardState } from "./ProductCard/useProductCardState";

export interface ProductColor {
  name: string;
  hex: string;
  label: string;
  sku: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  capacity?: string;
}

export interface ProductCapacity {
  value: string;
  label: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  sku?: string;
}

export interface ProductCardProps {
  id: string;
  name: string;
  image: string | StaticImageData;
  colors: ProductColor[];
  capacities?: ProductCapacity[];
  rating?: number;
  reviewCount?: number;
  price?: string;
  originalPrice?: string;
  isNew?: boolean;
  className?: string;
  viewMode?: "grid" | "list";
  stock?: number;
  sku?: string | null;
  selectedColor?: ProductColor;
  selectedCapacity?: ProductCapacity;
  puntos_q?: number;
  monthlyInstallments?: number;
}

export default function ProductCard({
  id,
  name,
  image,
  colors,
  capacities,
  price,
  originalPrice,
  isNew = false,
  className,
  sku,
  selectedColor: selectedColorProp,
  selectedCapacity: selectedCapacityProp,
  puntos_q = 4,
  viewMode = "grid",
  stock = 1,
  rating = 4.8,
  reviewCount = 429,
  monthlyInstallments = 12,
}: ProductCardProps & { puntos_q?: number }) {
  // Cálculos de precios
  const currentPrice = (selectedCapacityProp ?? capacities?.[0])?.price || 
    (selectedColorProp ?? colors?.[0])?.price || price;
  const currentOriginalPrice = (selectedCapacityProp ?? capacities?.[0])?.originalPrice || 
    (selectedColorProp ?? colors?.[0])?.originalPrice || originalPrice;
  const savings = calculateSavings(currentOriginalPrice, currentPrice);
  const monthlyPrice = calculateMonthlyPrice(currentPrice, monthlyInstallments);
  const isOutOfStock = stock === 0;

  // Estado del Quick View Modal
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Hook personalizado para gestionar estado y handlers
  const {
    selectedColor,
    selectedCapacity,
    isLoading,
    handleColorSelect,
    handleCapacitySelect,
    handleAddToCart,
    handleMoreInfo,
    handleCardClick,
    handleNotifyMe,
  } = useProductCardState({
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
  });

  // Animación de scroll reveal
  const cardReveal = useScrollReveal<HTMLDivElement>({
    offset: 60,
    duration: 500,
    direction: "up",
  });

  // Imagen optimizada con Cloudinary
  const cloudinaryImage = useCloudinaryImage({
    src: typeof image === "string" ? image : image.src,
    transformType: "catalog",
    responsive: true,
  });

  return (
    <motion.div
      ref={cardReveal.ref}
      {...cardReveal.motionProps}
      className={cn(
        "bg-white rounded-lg w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 flex flex-col",
        viewMode === "list" && "flex-row h-auto max-w-full",
        viewMode === "grid" && "h-full",
        isOutOfStock && "opacity-60",
        className
      )}
    >
      {/* Imagen */}
      <ProductImage
        src={cloudinaryImage.src}
        alt={name}
        width={cloudinaryImage.width}
        height={cloudinaryImage.height}
        sizes={cloudinaryImage.imageProps.sizes}
        isNew={isNew}
        viewMode={viewMode}
        onImageClick={handleCardClick}
        onQuickView={() => setIsQuickViewOpen(true)}
      />

      {/* Contenido */}
      <div className={cn("bg-white p-2 md:p-3 flex flex-col flex-1", viewMode === "list" && "justify-between")}>
        {/* Título - Más grande solo en mobile */}
        <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1.5 md:mb-2 line-clamp-2 leading-tight">
          {cleanProductName(name)}
        </h3>

        {/* Selectores */}
        <ProductSelectors
          colors={colors}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelect}
          capacities={capacities}
          selectedCapacity={selectedCapacity}
          onCapacitySelect={handleCapacitySelect}
        />

        {/* Precios */}
        <ProductPricing
          currentPrice={currentPrice ?? ""}
          currentOriginalPrice={currentOriginalPrice}
          savings={savings}
          monthlyPrice={monthlyPrice}
          monthlyInstallments={monthlyInstallments}
          isOutOfStock={isOutOfStock}
        />

        {/* Rating */}
        <ProductRating rating={rating} reviewCount={reviewCount} />

        {/* Botones de acción */}
        <ProductActions
          isOutOfStock={isOutOfStock}
          isLoading={isLoading}
          onAddToCart={handleAddToCart}
          onMoreInfo={handleMoreInfo}
          onNotifyMe={handleNotifyMe}
        />
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={{
          id,
          name,
          image,
          price,
          originalPrice,
          colors,
          capacities,
          rating,
          reviewCount,
        }}
        selectedColor={selectedColor}
        selectedCapacity={selectedCapacity}
        onColorSelect={handleColorSelect}
        onCapacitySelect={handleCapacitySelect}
        onAddToCart={() => {
          handleAddToCart({} as React.MouseEvent);
          setIsQuickViewOpen(false);
        }}
        onViewDetails={() => {
          setIsQuickViewOpen(false);
          handleMoreInfo({} as React.MouseEvent);
        }}
      />
    </motion.div>
  );
}
