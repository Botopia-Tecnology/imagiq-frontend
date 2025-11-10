import React from "react";
import type { ProductCardProps } from "@/app/productos/components/ProductCard";
import FlixmediaDetails from "@/components/FlixmediaDetails";

interface SpecificationsProps {
  product: ProductCardProps;
  flix?: ProductCardProps;
  selectedSku?: string;
  selectedEan?: string;
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


const Specifications: React.FC<SpecificationsProps> = ({ product, flix, selectedSku, selectedEan }) => {
  // Recopilar TODOS los SKUs y EANs del producto (como en multimedia)
  const allSkus: string[] = [];
  const allEans: string[] = [];

  // Agregar SKUs del apiProduct si existen
  if (product.apiProduct?.sku) {
    product.apiProduct.sku.forEach(sku => {
      if (sku && sku.trim()) allSkus.push(sku.trim());
    });
  }

  // Agregar EANs del apiProduct si existen
  if (product.apiProduct?.ean) {
    product.apiProduct.ean.forEach(ean => {
      if (ean && ean.trim()) allEans.push(ean.trim());
    });
  }

  // Agregar SKUs de capacidades si existen
  if (product.capacities) {
    product.capacities.forEach(capacity => {
      if (capacity.sku && capacity.sku.trim()) allSkus.push(capacity.sku.trim());
      if (capacity.ean && capacity.ean.trim()) allEans.push(capacity.ean.trim());
    });
  }

  // Agregar el SKU seleccionado al inicio si existe (para que sea el primero en intentarse)
  if (selectedSku && selectedSku.trim() && !allSkus.includes(selectedSku.trim())) {
    allSkus.unshift(selectedSku.trim());
  }

  if (selectedEan && selectedEan.trim() && !allEans.includes(selectedEan.trim())) {
    allEans.unshift(selectedEan.trim());
  }

  // Unir todos los SKUs y EANs en un string separado por comas (formato esperado por Flixmedia)
  const productSku = allSkus.length > 0 ? allSkus.join(',') : null;
  const productEan = allEans.length > 0 ? allEans.join(',') : null;

  console.log('🎬 Specifications - SKUs para Flixmedia:', productSku);
  console.log('🎬 Specifications - EANs para Flixmedia:', productEan);


  // --- VISUAL: UX mejorada, tabs y contenido ---
  return (
    <section
      id="especificaciones-section"
      className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-6 mt-2 md:mt-4"
      aria-label="Especificaciones técnicas"
    >
      <FlixmediaDetails
          mpn={productSku}
          ean={productEan}
          productName={product.name}
          className="w-full"
        />
    </section>
  );
};

export default Specifications;
