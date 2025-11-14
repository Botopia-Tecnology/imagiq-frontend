import React, { useMemo } from "react";
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
  // Memoizar SKUs/EANs para evitar re-renders innecesarios
  const { productSku, productEan } = useMemo(() => {
    // Recopilar TODOS los SKUs y EANs del producto (igual que en multimedia)
    const allSkus: string[] = [];
    const allEans: string[] = [];

    // 1. Si hay SKU/EAN seleccionado, agregarlo PRIMERO (prioridad)
    if (selectedSku && selectedSku.trim()) {
      allSkus.push(selectedSku.trim());
    }
    if (selectedEan && selectedEan.trim()) {
      allEans.push(selectedEan.trim());
    }

    // 2. Agregar SKUs de colores si existen (SIEMPRE, como en multimedia)
    if (product.colors) {
      product.colors.forEach(color => {
        if (color.sku && color.sku.trim() && !allSkus.includes(color.sku.trim())) {
          allSkus.push(color.sku.trim());
        }
        if (color.ean && color.ean.trim() && !allEans.includes(color.ean.trim())) {
          allEans.push(color.ean.trim());
        }
      });
    }

    // 3. Agregar SKUs de capacidades si existen (SIEMPRE, como en multimedia)
    if (product.capacities) {
      product.capacities.forEach(capacity => {
        if (capacity.sku && capacity.sku.trim() && !allSkus.includes(capacity.sku.trim())) {
          allSkus.push(capacity.sku.trim());
        }
        if (capacity.ean && capacity.ean.trim() && !allEans.includes(capacity.ean.trim())) {
          allEans.push(capacity.ean.trim());
        }
      });
    }

    // 4. Fallback a apiProduct SKUs/EANs si existen
    if (product.apiProduct?.sku) {
      product.apiProduct.sku.forEach(sku => {
        if (sku && sku.trim() && !allSkus.includes(sku.trim())) {
          allSkus.push(sku.trim());
        }
      });
    }

    if (product.apiProduct?.ean) {
      product.apiProduct.ean.forEach(ean => {
        if (ean && ean.trim() && !allEans.includes(ean.trim())) {
          allEans.push(ean.trim());
        }
      });
    }

    // Unir todos los SKUs y EANs en un string separado por comas (formato esperado por Flixmedia)
    const skuString = allSkus.length > 0 ? allSkus.join(',') : null;
    const eanString = allEans.length > 0 ? allEans.join(',') : null;

    console.log('🎬 Specifications - SKUs para Flixmedia:', skuString);
    console.log('🎬 Specifications - EANs para Flixmedia:', eanString);
    console.log('🎬 Specifications - Total SKUs:', allSkus.length, 'Total EANs:', allEans.length);

    return {
      productSku: skuString,
      productEan: eanString,
    };
  }, [product.id, product.colors, product.capacities, product.apiProduct, selectedSku, selectedEan]);


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
