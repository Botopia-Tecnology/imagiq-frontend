import React, { useState } from "react";
import { useCartContext } from "@/features/cart/CartContext";
import { usePointsContext } from "@/contexts/PointsContext";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";
import FlixmediaDetails from "@/components/FlixmediaDetails";

interface SpecificationsProps {
  product: ProductCardProps;
  flix?: ProductCardProps;
}

// --- DATOS MOCK para visualización UX ---
type SpecItem = { label: string; value: string };

const MOCK_SPECS: Record<string, SpecItem[]> = {
  Pantalla: [
    { label: "Tipo", value: "Dynamic AMOLED 2X" },
    { label: "Tamaño", value: "7.6 pulgadas" },
    { label: "Resolución", value: "2176 x 1812 px" },
    { label: "Frecuencia", value: "120 Hz" },
  ],
  Rendimiento: [
    { label: "Procesador", value: "Snapdragon 8 Gen 2" },
    { label: "RAM", value: "12 GB" },
    { label: "Almacenamiento", value: "512 GB" },
  ],
  Cámaras: [
    { label: "Principal", value: "50 MP + 12 MP + 10 MP" },
    { label: "Frontal", value: "10 MP" },
    { label: "Video", value: "8K UHD" },
  ],
  "Batería y Carga": [
    { label: "Capacidad", value: "4400 mAh" },
    { label: "Carga rápida", value: "25W" },
    { label: "Carga inalámbrica", value: "Sí" },
  ],
  Conectividad: [
    { label: "5G", value: "Sí" },
    { label: "WiFi", value: "6E" },
    { label: "Bluetooth", value: "5.3" },
    { label: "SIM", value: "Dual SIM" },
  ],
  "Diseño y Características": [
    { label: "Color", value: "Phantom Black" },
    { label: "Peso", value: "253 g" },
    { label: "Resistencia", value: "IPX8" },
    { label: "Puntos Q", value: "4" },
  ],
};

// Categorías visuales y sus campos (solo los que existen en ProductCardProps)
const SPEC_CATEGORIES = [
  { key: "Pantalla" },
  { key: "Rendimiento" },
  { key: "Cámaras" },
  { key: "Batería y Carga" },
  { key: "Conectividad" },
  { key: "Diseño y Características" },
];

const Specifications: React.FC<SpecificationsProps> = ({ product, flix }) => {
  const { addProduct } = useCartContext();
  const { recalculatePoints } = usePointsContext();
  const [activeTab, setActiveTab] = useState(0);

  // Usar flix si está disponible, sino usar product
  const productToUse = flix || product;

  // Extraer TODOS los SKUs y EANs del producto desde los colores/capacidades
  const allSkus = productToUse.colors?.map(color => color.sku).filter(Boolean) || [];
  const allEans = productToUse.colors?.map(color => color.ean).filter(Boolean) || [];

  // Agregar SKUs de capacidades si existen
  if (productToUse.capacities) {
    productToUse.capacities.forEach(capacity => {
      if (capacity.sku) allSkus.push(capacity.sku);
      if (capacity.ean) allEans.push(capacity.ean);
    });
  }

  // Unir todos los SKUs y EANs en un string separado por comas (formato esperado por FlixmediaDetails)
  const skuToUse = allSkus.length > 0 ? allSkus.join(',') : undefined;
  const eanToUse = allEans.length > 0 ? allEans.join(',') : undefined;

  // Debug: Log para ver qué datos tenemos
  console.log('🔍 Specifications Debug:', {
    hasProduct: !!product,
    hasFlix: !!flix,
    productToUse: productToUse?.name,
    colorsCount: productToUse.colors?.length,
    capacitiesCount: productToUse.capacities?.length,
    skuToUse,
    eanToUse,
    allSkus,
    allEans
  });

  // --- VISUAL: Precio formateado y mostrado dentro del botón ---
  // Usar el precio real del producto, formateado
  const priceNumber =
    typeof product.price === "number"
      ? product.price
      : parseInt((product.price || "0").toString().replace(/[^\d]/g, ""));
  const displayPrice = priceNumber.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });

  // Handler para añadir al carrito y actualizar puntos Q (no cambia lógica)
  const handleAddToCart = () => {
    const image =
      typeof product.image === "string"
        ? product.image
        : product.image?.src || "";
    addProduct({
      id: product.id,
      name: product.name,
      image,
      price: priceNumber,
      sku: skuToUse || "SKU",
      ean: eanToUse || "EAN",
      quantity: 1,
      puntos_q: product.puntos_q ?? 4,
    });
    recalculatePoints();
  };

  // --- VISUAL: UX mejorada, tabs y contenido ---
  return (
    <section
      id="especificaciones-section"
      className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-6 mt-2 md:mt-4"
      aria-label="Especificaciones técnicas"
    >
      <FlixmediaDetails
          mpn={skuToUse}
          ean={eanToUse}
          productName={product.name}
          className="w-full"
        />
     

      {/* Botón grande con feedback visual y animación */}
      <div className="flex flex-col items-center w-full px-0 sm:px-0">
        <button
          type="button"
          className="w-full max-w-xs sm:max-w-md bg-[#0099FF] hover:bg-[#007ACC] active:scale-95 text-white font-bold py-3 sm:py-4 rounded-full shadow-lg text-base sm:text-lg lg:text-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:ring-offset-2 mb-2"
          onClick={handleAddToCart}
          aria-label={`Añadir al carrito por ${displayPrice}`}
        >
          Añadir al carrito – {displayPrice}
        </button>

      </div>
    </section>
  );
};

export default Specifications;
