/**
 * 📊 PRODUCTS DATA - IMAGIQ ECOMMERCE
 *
 * Archivo centralizado con todos los productos del ecommerce.
 * - Evita duplicación de datos
 * - Facilita mantenimiento
 * - Permite reutilización en diferentes contextos
 * - Tipado estricto para mejor developer experience
 */

import type { ProductColor } from "../components/ProductCard";

// Imágenes de categorías
import smartphonesImg from "../../../img/categorias/Smartphones.png";
import tabletasImg from "../../../img/categorias/Tabletas.png";
import galaxyWatchImg from "../../../img/categorias/galaxy_watch.png";
import galaxyBudsImg from "../../../img/categorias/galaxy_buds.png";

// Imágenes de electrodomésticos (usar las correctas según disponibilidad)
import tvImg from "../../../img/categorias/Tabletas.png"; // Temporal, cambiar cuando esté disponible
import monitorImg from "../../../img/categorias/Tabletas.png"; // Temporal, cambiar cuando esté disponible
import audioImg from "../../../img/electrodomesticos/electrodomesticos2.png";
import aireImg from "../../../img/electrodomesticos/electrodomesticos4.png";
import aspiradoraImg from "../../../img/electrodomesticos/electrodomesticos3.png";
import hornosImg from "../../../img/electrodomesticos/electrodomesticos4.png";
import lavadoraImg from "../../../img/electrodomesticos/electrodomesticos2.png";
import lavavajillasImg from "../../../img/electrodomesticos/electrodomesticos4.png";
import microondasImg from "../../../img/electrodomesticos/electrodomesticos1.png";
import refrigeradorImg from "../../../img/electrodomesticos/electrodomesticos1.png";

export const productsData = {
  // 📱 DISPOSITIVOS MÓVILES - ACCESORIOS
  accesorios: [
    // Accesorios generales
    {
      id: "cargador-rapido-25w",
      sku: "cargador-rapido-25w",
      name: "Samsung Cargador Rápido 25W USB-C",
      image: smartphonesImg,
      colors: [
        { name: "white", hex: "#FFFFFF", label: "Blanco" },
        { name: "black", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      rating: 4.6,
      reviewCount: 1245,
      price: "$ 89.000",
      originalPrice: "$ 119.000",
      discount: "-25%",
    },
    {
      id: "funda-silicona-s24",
      sku: "funda-silicona-s24",
      name: "Samsung Funda Silicona Galaxy S24 Ultra",
      image: tabletasImg,
      colors: [
        { name: "black", hex: "#000000", label: "Negro" },
        { name: "blue", hex: "#1E40AF", label: "Azul" },
        { name: "green", hex: "#10B981", label: "Verde" },
        { name: "pink", hex: "#EC4899", label: "Rosa" },
      ] as ProductColor[],
      rating: 4.4,
      reviewCount: 567,
      price: "$ 129.000",
    },
    {
      id: "correa-cuero-watch",
      sku: "correa-cuero-watch",
      name: "Samsung Correa de Cuero Galaxy Watch",
      image: galaxyWatchImg,
      colors: [
        { name: "brown", hex: "#8B4513", label: "Marrón" },
        { name: "black", hex: "#000000", label: "Negro" },
        { name: "tan", hex: "#D2B48C", label: "Tostado" },
      ] as ProductColor[],
      rating: 4.7,
      reviewCount: 324,
      price: "$ 199.000",
      originalPrice: "$ 249.000",
      discount: "-20%",
      isNew: true,
    },
    {
      id: "protector-pantalla-tab",
      sku: "protector-pantalla-tab",
      name: "Protector de Pantalla Galaxy Tab S9",
      image: tabletasImg,
      colors: [
        { name: "clear", hex: "#F8F8FF", label: "Transparente" },
      ] as ProductColor[],
      rating: 4.3,
      reviewCount: 189,
      price: "$ 79.000",
    },
    // Galaxy Buds
    {
      id: "galaxy-buds2-pro",
      sku: "galaxy-buds2-pro",
      name: "Samsung Galaxy Buds2 Pro",
      image: galaxyBudsImg,
      colors: [
        { name: "purple", hex: "#800080", label: "Púrpura" },
        { name: "white", hex: "#FFFFFF", label: "Blanco" },
        { name: "graphite", hex: "#2F4F4F", label: "Grafito" },
      ] as ProductColor[],
      rating: 4.7,
      reviewCount: 892,
      price: "$ 549.000",
      originalPrice: "$ 649.000",
      discount: "-15%",
      isNew: true,
    },
    {
      id: "galaxy-buds-pro",
      sku: "galaxy-buds-pro",
      name: "Samsung Galaxy Buds Pro",
      image: galaxyBudsImg,
      colors: [
        { name: "black", hex: "#000000", label: "Negro" },
        { name: "silver", hex: "#C0C0C0", label: "Plateado" },
        { name: "violet", hex: "#8A2BE2", label: "Violeta" },
      ] as ProductColor[],
      rating: 4.5,
      reviewCount: 634,
      price: "$ 399.000",
      originalPrice: "$ 499.000",
      discount: "-20%",
    },
    {
      id: "galaxy-buds-fe",
      sku: "galaxy-buds-fe",
      name: "Samsung Galaxy Buds FE",
      image: galaxyBudsImg,
      colors: [
        { name: "white", hex: "#FFFFFF", label: "Blanco" },
        { name: "graphite", hex: "#2F4F4F", label: "Grafito" },
      ] as ProductColor[],
      rating: 4.3,
      reviewCount: 421,
      price: "$ 249.000",
    },
    // Galaxy Watch
    {
      id: "galaxy-watch6-44mm",
      sku: "galaxy-watch6-44mm",
      name: "Samsung Galaxy Watch 6 44mm",
      image: galaxyWatchImg,
      colors: [
        { name: "black", hex: "#000000", label: "Negro" },
        { name: "silver", hex: "#C0C0C0", label: "Plateado" },
        { name: "gold", hex: "#D4AF37", label: "Dorado" },
      ] as ProductColor[],
      rating: 4.6,
      reviewCount: 342,
      price: "$ 899.000",
      originalPrice: "$ 1.099.000",
      discount: "-18%",
    },
    // ...más productos de relojes
  ],
  "tv-monitores-audio": [
    {
      id: "samsung-qled-55",
      sku: "samsung-qled-55",
      name: "Samsung QLED 55",
      image: tvImg,
      colors: [
        { name: "black", hex: "#000000", label: "Negro" },
        { name: "silver", hex: "#C0C0C0", label: "Plateado" },
      ] as ProductColor[],
      rating: 4.8,
      reviewCount: 210,
      price: "$ 3.299.000",
      originalPrice: "$ 3.999.000",
      discount: "-18%",
    },
    {
      id: "samsung-crystal-50",
      sku: "samsung-crystal-50",
      name: "Samsung Crystal UHD 50",
      image: tvImg,
      colors: [
        { name: "black", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      rating: 4.7,
      reviewCount: 180,
      price: "$ 2.499.000",
      originalPrice: "$ 2.899.000",
      discount: "-14%",
    },
    {
      id: "samsung-monitor-smart",
      sku: "samsung-monitor-smart",
      name: "Samsung Monitor Smart 27",
      image: monitorImg,
      colors: [
        { name: "white", hex: "#FFFFFF", label: "Blanco" },
        { name: "black", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      rating: 4.6,
      reviewCount: 95,
      price: "$ 899.000",
      originalPrice: "$ 1.099.000",
      discount: "-18%",
    },
    {
      id: "samsung-soundbar-a550",
      sku: "samsung-soundbar-a550",
      name: "Samsung Soundbar HW-A550",
      image: audioImg,
      colors: [
        { name: "black", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      rating: 4.5,
      reviewCount: 60,
      price: "$ 599.000",
      originalPrice: "$ 799.000",
      discount: "-25%",
    },
  ],
  "smartphones-tablets": [
    // Smartphones
    {
      id: "galaxy-a16",
      sku: "galaxy-a16",
      name: "Samsung Galaxy A16",
      image: smartphonesImg,
      colors: [
        { name: "navy", hex: "#1E3A8A", label: "Azul Marino" },
        { name: "black", hex: "#000000", label: "Negro" },
        { name: "white", hex: "#FFFFFF", label: "Blanco" },
      ] as ProductColor[],
      rating: 4.5,
      reviewCount: 128,
      price: "$ 812.900",
      originalPrice: "$ 999.000",
      discount: "-19%",
    },
    {
      id: "galaxy-a25",
      sku: "galaxy-a25",
      name: "Samsung Galaxy A25",
      image: smartphonesImg,
      colors: [
        { name: "navy", hex: "#1E3A8A", label: "Azul Marino" },
        { name: "black", hex: "#000000", label: "Negro" },
        { name: "silver", hex: "#C0C0C0", label: "Plateado" },
      ] as ProductColor[],
      rating: 4.3,
      reviewCount: 89,
      price: "$ 1.250.000",
    },
    {
      id: "galaxy-a26",
      sku: "galaxy-a26",
      name: "Samsung Galaxy A26",
      image: smartphonesImg,
      colors: [
        { name: "white", hex: "#FFFFFF", label: "Blanco" },
        { name: "black", hex: "#000000", label: "Negro" },
        { name: "mint", hex: "#10B981", label: "Menta" },
      ] as ProductColor[],
      rating: 4.4,
      reviewCount: 156,
      price: "$ 1.450.000",
      originalPrice: "$ 1.600.000",
      discount: "-9%",
    },
    {
      id: "galaxy-a15-256gb",
      sku: "galaxy-a15-256gb",
      name: "Samsung Galaxy A15 256 GB",
      image: smartphonesImg,
      colors: [
        { name: "white", hex: "#FFFFFF", label: "Blanco" },
        { name: "black", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      rating: 4.2,
      reviewCount: 203,
      price: "$ 999.000",
    },
    {
      id: "galaxy-a15-4gb",
      sku: "galaxy-a15-4gb",
      name: "Samsung Galaxy A15 4GB 128GB",
      image: smartphonesImg,
      colors: [
        { name: "yellow", hex: "#FCD34D", label: "Amarillo" },
        { name: "black", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      rating: 4.1,
      reviewCount: 94,
      price: "$ 750.000",
      isNew: true,
    },
    {
      id: "galaxy-a15-128gb",
      sku: "galaxy-a15-128gb",
      name: "Samsung Galaxy A15 4GB 128GB",
      image: smartphonesImg,
      colors: [
        { name: "white", hex: "#FFFFFF", label: "Blanco" },
        { name: "blue", hex: "#1E40AF", label: "Azul" },
      ] as ProductColor[],
      rating: 4.0,
      reviewCount: 67,
      price: "$ 850.000",
    },
    // Tablets
    {
      id: "galaxy-tab-s9",
      sku: "galaxy-tab-s9",
      name: "Samsung Galaxy Tab S9",
      image: tabletasImg,
      colors: [
        { name: "gray", hex: "#A9A9A9", label: "Gris" },
        { name: "black", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      rating: 4.8,
      reviewCount: 210,
      price: "$ 2.199.000",
      originalPrice: "$ 2.499.000",
      discount: "-12%",
    },
    {
      id: "galaxy-tab-s9-11",
      sku: "galaxy-tab-s9-11",
      name: 'Samsung Galaxy Tab S9 11" WiFi',
      image: tabletasImg,
      colors: [
        { name: "gray", hex: "#808080", label: "Gris" },
        { name: "beige", hex: "#F5F5DC", label: "Beige" },
        { name: "mint", hex: "#98FB98", label: "Menta" },
      ] as ProductColor[],
      rating: 4.8,
      reviewCount: 245,
      price: "$ 2.299.000",
      originalPrice: "$ 2.699.000",
      discount: "-15%",
      isNew: true,
    },
    {
      id: "galaxy-tab-a9-10",
      sku: "galaxy-tab-a9-10",
      name: 'Samsung Galaxy Tab A9+ 10.4" WiFi',
      image: tabletasImg,
      colors: [
        { name: "gray", hex: "#696969", label: "Gris Grafito" },
        { name: "silver", hex: "#C0C0C0", label: "Plateado" },
      ] as ProductColor[],
      rating: 4.4,
      reviewCount: 189,
      price: "$ 899.000",
    },
    {
      id: "galaxy-tab-s9-fe",
      sku: "galaxy-tab-s9-fe",
      name: 'Samsung Galaxy Tab S9 FE 10.9" WiFi',
      image: tabletasImg,
      colors: [
        { name: "mint", hex: "#98FB98", label: "Menta" },
        { name: "gray", hex: "#708090", label: "Gris" },
        { name: "lavender", hex: "#E6E6FA", label: "Lavanda" },
      ] as ProductColor[],
      rating: 4.6,
      reviewCount: 156,
      price: "$ 1.599.000",
      originalPrice: "$ 1.899.000",
      discount: "-16%",
    },
  ],
  electrodomesticos: [
    // Aire Acondicionado
    {
      id: "ar12t93",
      sku: "ar12t93",
      name: "Samsung Aire Acondicionado Split Inverter 12000 BTU AR12T93",
      image: aireImg,
      colors: [
        { name: "white", hex: "#FFFFFF", label: "Blanco" },
        { name: "gray", hex: "#808080", label: "Gris" },
      ] as ProductColor[],
      rating: 4.8,
      reviewCount: 45,
      price: "$ 2.199.000",
      originalPrice: "$ 2.499.000",
      discount: "-12%",
      isNew: true,
    },
    {
      id: "ar18t93",
      sku: "ar18t93",
      name: "Samsung Aire Acondicionado Split Inverter 18000 BTU AR18T93",
      image: aireImg,
      colors: [
        { name: "white", hex: "#FFFFFF", label: "Blanco" },
        { name: "gray", hex: "#808080", label: "Gris" },
      ] as ProductColor[],
      rating: 4.7,
      reviewCount: 32,
      price: "$ 2.799.000",
      originalPrice: "$ 3.099.000",
      discount: "-10%",
    },
    // Aspiradoras
    {
      id: "asp-1",
      sku: "asp-1",
      name: "Aspiradora Samsung Jet 90",
      image: aspiradoraImg,
      colors: [
        { name: "white", hex: "#ffffff", label: "Blanco" },
        { name: "black", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      rating: 4.5,
      reviewCount: 120,
      price: "$299.99",
      originalPrice: "$399.99",
      discount: "-25%",
      isNew: true,
    },
    {
      id: "asp-2",
      sku: "asp-2",
      name: "Aspiradora LG CordZero",
      image: aspiradoraImg,
      colors: [
        { name: "white", hex: "#ffffff", label: "Blanco" },
      ] as ProductColor[],
      rating: 4.7,
      reviewCount: 95,
      price: "$349.99",
      originalPrice: "$449.99",
      discount: "-22%",
      isNew: false,
    },
    {
      id: "asp-3",
      sku: "asp-3",
      name: "Aspiradora de cilindro Whirlpool",
      image: aspiradoraImg,
      colors: [
        { name: "red", hex: "#ff0000", label: "Rojo" },
        { name: "blue", hex: "#0000ff", label: "Azul" },
      ] as ProductColor[],
      rating: 4.2,
      reviewCount: 80,
      price: "$199.99",
      originalPrice: "$249.99",
      discount: "-20%",
      isNew: false,
    },
    {
      id: "asp-4",
      sku: "asp-4",
      name: "Robot Aspirador Philips",
      image: aspiradoraImg,
      colors: [
        { name: "black", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      rating: 4.8,
      reviewCount: 60,
      price: "$499.99",
      originalPrice: "$599.99",
      discount: "-16%",
      isNew: true,
    },
    // Hornos
    {
      id: "horno-1",
      sku: "horno-1",
      name: "Horno Samsung Digital",
      price: "$299.99",
      image: hornosImg,
      colors: [
        { name: "negro", hex: "#000000", label: "Negro" },
        { name: "acero", hex: "#B0B0B0", label: "Acero inoxidable" },
      ] as ProductColor[],
      isNew: true,
      discount: "-10%",
      originalPrice: "$349.99",
      rating: 4.7,
      reviewCount: 32,
    },
    {
      id: "horno-2",
      sku: "horno-2",
      name: "Horno Whirlpool Convencional",
      price: "$199.99",
      image: hornosImg,
      colors: [
        { name: "blanco", hex: "#FFFFFF", label: "Blanco" },
        { name: "negro", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      isNew: false,
      discount: "-15%",
      originalPrice: "$229.99",
      rating: 4.5,
      reviewCount: 21,
    },
    {
      id: "horno-3",
      sku: "horno-3",
      name: "Horno LG Microondas",
      price: "$149.99",
      image: hornosImg,
      colors: [
        { name: "plateado", hex: "#C0C0C0", label: "Plateado" },
        { name: "negro", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      isNew: false,
      discount: "-8%",
      originalPrice: "$159.99",
      rating: 4.2,
      reviewCount: 12,
    },
    // Lavadoras
    {
      id: "ww22k6800ew",
      sku: "ww22k6800ew",
      name: "Samsung Lavadora Carga Frontal 22kg WW22K6800EW",
      image: lavadoraImg,
      colors: [
        { name: "white", hex: "#F3F4F6", label: "Blanco" },
        { name: "gray", hex: "#71717A", label: "Gris" },
      ] as ProductColor[],
      rating: 4.7,
      reviewCount: 210,
      price: "$ 2.199.000",
      originalPrice: "$ 2.499.000",
      discount: "-12%",
      isNew: true,
    },
    {
      id: "wa16t6260bw",
      sku: "wa16t6260bw",
      name: "Samsung Lavadora Carga Superior 16kg WA16T6260BW",
      image: lavadoraImg,
      colors: [
        { name: "white", hex: "#F3F4F6", label: "Blanco" },
        { name: "inox", hex: "#A3A3A3", label: "Inox" },
      ] as ProductColor[],
      rating: 4.5,
      reviewCount: 134,
      price: "$ 1.499.000",
      originalPrice: "$ 1.799.000",
      discount: "-17%",
    },
    // Lavavajillas
    {
      id: "dw60m5052fs",
      sku: "dw60m5052fs",
      name: "Samsung Lavavajillas Integrable 14 cubiertos DW60M5052FS",
      image: lavavajillasImg,
      colors: [
        { name: "inox", hex: "#A3A3A3", label: "Inox" },
        { name: "white", hex: "#F3F4F6", label: "Blanco" },
      ] as ProductColor[],
      rating: 4.6,
      reviewCount: 98,
      price: "$ 1.799.000",
      originalPrice: "$ 2.099.000",
      discount: "-14%",
      isNew: true,
    },
    {
      id: "dw60m6050fs",
      sku: "dw60m6050fs",
      name: "Samsung Lavavajillas Libre Instalación 13 cubiertos DW60M6050FS",
      image: lavavajillasImg,
      colors: [
        { name: "inox", hex: "#A3A3A3", label: "Inox" },
        { name: "gray", hex: "#71717A", label: "Gris" },
      ] as ProductColor[],
      rating: 4.4,
      reviewCount: 56,
      price: "$ 1.499.000",
      originalPrice: "$ 1.799.000",
      discount: "-17%",
    },
    // Microondas
    {
      id: "ms23k3513aw",
      sku: "ms23k3513aw",
      name: "Samsung Microondas 23L MS23K3513AW",
      image: microondasImg,
      colors: [
        { name: "white", hex: "#F3F4F6", label: "Blanco" },
        { name: "gray", hex: "#71717A", label: "Gris" },
      ] as ProductColor[],
      rating: 4.7,
      reviewCount: 120,
      price: "$ 599.000",
      originalPrice: "$ 699.000",
      discount: "-14%",
      isNew: true,
    },
    {
      id: "mg23t5018ak",
      sku: "mg23t5018ak",
      name: "Samsung Microondas Grill 23L MG23T5018AK",
      image: microondasImg,
      colors: [
        { name: "black", hex: "#000000", label: "Negro" },
        { name: "inox", hex: "#A3A3A3", label: "Inox" },
      ] as ProductColor[],
      rating: 4.5,
      reviewCount: 85,
      price: "$ 799.000",
      originalPrice: "$ 899.000",
      discount: "-11%",
    },
    // Refrigeradores
    {
      id: "rf28r7351sr",
      sku: "rf28r7351sr",
      name: "Samsung Refrigerador French Door 27.4 pies RF28R7351SR",
      image: refrigeradorImg,
      colors: [
        { name: "steel", hex: "#71717A", label: "Acero Inoxidable" },
      ] as ProductColor[],
      rating: 4.8,
      reviewCount: 452,
      price: "$ 4.499.000",
      originalPrice: "$ 4.999.000",
      discount: "-10%",
      isNew: true,
    },
    {
      id: "rs27t5200s9",
      sku: "rs27t5200s9",
      name: "Samsung Refrigerador Side by Side 27 pies RS27T5200S9",
      image: refrigeradorImg,
      colors: [
        { name: "steel", hex: "#71717A", label: "Acero Inoxidable" },
        { name: "black", hex: "#000000", label: "Negro" },
      ] as ProductColor[],
      rating: 4.6,
      reviewCount: 326,
      price: "$ 2.899.000",
      originalPrice: "$ 3.299.000",
      discount: "-12%",
    },
  ],
};

// 🔧 UTILIDADES Y EXPORTS TIPADOS

// Tipo base para productos
export interface BaseProduct {
  id: string;
  sku: string;
  name: string;
  image: string | import("next/image").StaticImageData;
  colors: ProductColor[];
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice?: string;
  discount?: string;
  isNew?: boolean;
}

// Exports específicos por categoría para compatibilidad con componentes existentes
export const accessoryProducts = productsData.accesorios;
export const smartphonesAndTabletsProducts = productsData["smartphones-tablets"];
export const tvMonitorsAudioProducts = productsData["tv-monitores-audio"];
export const electrodomesticosProducts = productsData.electrodomesticos;

// Separar productos específicos para los componentes de dispositivos móviles
export const watchProducts = productsData.accesorios.filter(product => 
  product.name.toLowerCase().includes("watch") || product.name.toLowerCase().includes("reloj")
);

export const budsProducts = productsData.accesorios.filter(product => 
  product.name.toLowerCase().includes("buds") || product.name.toLowerCase().includes("auricular")
);

export const tabletsProducts = productsData["smartphones-tablets"].filter(product => 
  product.name.toLowerCase().includes("tab") || product.name.toLowerCase().includes("tablet")
);

export const smartphonesProducts = productsData["smartphones-tablets"].filter(product => 
  !product.name.toLowerCase().includes("tab") && !product.name.toLowerCase().includes("tablet")
);

// Función para obtener todos los productos de una categoría
export const getProductsByCategory = (category: keyof typeof productsData) => {
  return productsData[category] || [];
};

// Función para buscar un producto por ID en todas las categorías
export const findProductById = (id: string): BaseProduct | undefined => {
  for (const category of Object.values(productsData)) {
    const product = category.find(p => p.id === id);
    if (product) return product;
  }
  return undefined;
};

// Función para obtener todos los productos (útil para búsquedas globales)
export const getAllProducts = (): BaseProduct[] => {
  return Object.values(productsData).flat();
};

// Export por defecto del objeto completo
export default productsData;
