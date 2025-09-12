/**
 * Product Mapper - Convierte datos de API a formato del frontend
 * - Mapea ProductApiData a ProductCardProps
 * - Usa imágenes mock mientras se implementan
 */

import { ProductApiData } from './api';
import { ProductCardProps, ProductColor } from '@/app/productos/components/ProductCard';

// Importar imágenes mock para usar temporalmente
import smartphonesImg from '@/img/categorias/Smartphones.png';
import tabletasImg from '@/img/categorias/Tabletas.png';
import galaxyWatchImg from '@/img/categorias/galaxy_watch.png';
import galaxyBudsImg from '@/img/categorias/galaxy_buds.png';
import tvImg from '@/img/categorias/Tabletas.png';
import monitorImg from '@/img/categorias/Tabletas.png';
import audioImg from '@/img/electrodomesticos/electrodomesticos2.png';
import aireImg from '@/img/electrodomesticos/electrodomesticos4.png';
import aspiradoraImg from '@/img/electrodomesticos/electrodomesticos3.png';
import hornosImg from '@/img/electrodomesticos/electrodomesticos4.png';
import lavadoraImg from '@/img/electrodomesticos/electrodomesticos2.png';
import lavavajillasImg from '@/img/electrodomesticos/electrodomesticos4.png';
import microondasImg from '@/img/electrodomesticos/electrodomesticos1.png';
import refrigeradorImg from '@/img/electrodomesticos/electrodomesticos1.png';

// Mapeo de categorías a imágenes
const categoryImageMap: Record<string, any> = {
  'IM': smartphonesImg, // Dispositivos móviles
  'Celulares': smartphonesImg,
  'Tablets': tabletasImg,
  'Relojes': galaxyWatchImg,
  'Audífonos': galaxyBudsImg,
  'Accesorios': smartphonesImg, // Accesorios usan imagen de smartphones por defecto
  'TV': tvImg,
  'Monitores': monitorImg,
  'Audio': audioImg,
  'Aire Acondicionado': aireImg,
  'Aspiradoras': aspiradoraImg,
  'Hornos': hornosImg,
  'Lavadoras': lavadoraImg,
  'Lavavajillas': lavavajillasImg,
  'Microondas': microondasImg,
  'Refrigeradores': refrigeradorImg,
};

// Mapeo de colores de la API a colores del frontend
const colorMap: Record<string, { hex: string; label: string }> = {
  'Azul': { hex: '#1E40AF', label: 'Azul' },
  'Negro': { hex: '#000000', label: 'Negro' },
  'Blanco': { hex: '#FFFFFF', label: 'Blanco' },
  'Verde': { hex: '#10B981', label: 'Verde' },
  'Rosado': { hex: '#EC4899', label: 'Rosa' },
  'Gris': { hex: '#808080', label: 'Gris' },
  'Plateado': { hex: '#C0C0C0', label: 'Plateado' },
  'Dorado': { hex: '#D4AF37', label: 'Dorado' },
  'NO APLICA': { hex: '#F3F4F6', label: 'Estándar' },
};

/**
 * Convierte un producto de la API al formato del frontend
 */
export function mapApiProductToFrontend(apiProduct: ProductApiData): ProductCardProps {
  // Determinar imagen basada en categoría/subcategoría
  const image = getProductImage(apiProduct);
  
  // Crear colores del producto
  const colors: ProductColor[] = createProductColors(apiProduct);
  
  // Calcular precios y descuentos
  const { price, originalPrice, discount, isNew } = calculatePricing(apiProduct);
  
  // Generar ID único basado en SKU y color
  const id = `${apiProduct.sku}-${apiProduct.color.toLowerCase().replace(/\s+/g, '-')}`;
  
  return {
    id,
    name: apiProduct.nombreMarket,
    image,
    colors,
    price,
    originalPrice,
    discount,
    isNew,
    rating: 4.5, // Valor por defecto, se puede obtener de reviews en el futuro
    reviewCount: Math.floor(Math.random() * 500) + 50, // Valor temporal
  };
}

/**
 * Obtiene la imagen apropiada para el producto
 */
function getProductImage(apiProduct: ProductApiData): any {
  // Si hay URL de imagen en la API, usarla (cuando esté disponible)
  if (apiProduct.urlImagenes && apiProduct.urlImagenes.trim() !== '') {
    return apiProduct.urlImagenes;
  }
  
  // Detectar productos específicos por nombre para usar imágenes correctas
  const productName = apiProduct.nombreMarket.toLowerCase();
  const modelName = apiProduct.modelo?.toLowerCase() || '';
  
  // Galaxy Watch - usar imagen específica de relojes
  if (productName.includes('watch') || modelName.includes('watch')) {
    console.log(`🔍 Galaxy Watch detectado: ${apiProduct.nombreMarket} - usando imagen de relojes`);
    return galaxyWatchImg;
  }
  
  // Galaxy Buds - usar imagen específica de audífonos
  if (productName.includes('buds') || modelName.includes('buds')) {
    console.log(`🔍 Galaxy Buds detectado: ${apiProduct.nombreMarket} - usando imagen de audífonos`);
    return galaxyBudsImg;
  }
  
  // Galaxy Tab - usar imagen específica de tabletas
  if (productName.includes('tab') || modelName.includes('tab')) {
    console.log(`🔍 Galaxy Tab detectado: ${apiProduct.nombreMarket} - usando imagen de tabletas`);
    return tabletasImg;
  }
  
  // Usar imagen mock basada en subcategoría o categoría
  return categoryImageMap[apiProduct.subcategoria] || 
         categoryImageMap[apiProduct.categoria] || 
         smartphonesImg;
}

/**
 * Crea el array de colores para el producto
 */
function createProductColors(apiProduct: ProductApiData): ProductColor[] {
  const colorInfo = colorMap[apiProduct.color] || { hex: '#808080', label: apiProduct.color };
  
  return [{
    name: apiProduct.color.toLowerCase().replace(/\s+/g, '-'),
    hex: colorInfo.hex,
    label: colorInfo.label,
  }];
}

/**
 * Calcula precios, descuentos y si es producto nuevo
 */
function calculatePricing(apiProduct: ProductApiData) {
  const precioNormal = apiProduct.precioNormal;
  const precioDescto = apiProduct.precioDescto;
  
  // Formatear precios a formato colombiano
  const formatPrice = (price: number) => `$ ${price.toLocaleString('es-CO')}`;
  
  let price = formatPrice(precioDescto);
  let originalPrice: string | undefined;
  let discount: string | undefined;
  
  // Si hay descuento real
  if (precioDescto < precioNormal) {
    originalPrice = formatPrice(precioNormal);
    const discountPercent = Math.round(((precioNormal - precioDescto) / precioNormal) * 100);
    discount = `-${discountPercent}%`;
  }
  
  // Determinar si es producto nuevo (basado en fechas de vigencia)
  const fechaInicio = new Date(apiProduct.fechaInicioVigencia);
  const fechaActual = new Date();
  const diasDesdeInicio = (fechaActual.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24);
  const isNew = diasDesdeInicio < 90; // Producto nuevo si tiene menos de 90 días
  
  return {
    price,
    originalPrice,
    discount,
    isNew,
  };
}

/**
 * Convierte múltiples productos de la API
 */
export function mapApiProductsToFrontend(apiProducts: ProductApiData[]): ProductCardProps[] {
  return apiProducts.map(mapApiProductToFrontend);
}

/**
 * Agrupa productos por categoría 
 */
export function groupProductsByCategory(products: ProductCardProps[]): Record<string, ProductCardProps[]> {
  const grouped: Record<string, ProductCardProps[]> = {
    'accesorios': [],
    'tv-monitores-audio': [],
    'smartphones-tablets': [],
    'electrodomesticos': [],
  };
  
  products.forEach(product => {
    // Mapear categorías de la API a categorías del frontend
    if (product.name.toLowerCase().includes('buds') || 
        product.name.toLowerCase().includes('watch') ||
        product.name.toLowerCase().includes('cargador') ||
        product.name.toLowerCase().includes('funda')) {
      grouped['accesorios'].push(product);
    } else if (product.name.toLowerCase().includes('tv') ||
               product.name.toLowerCase().includes('monitor') ||
               product.name.toLowerCase().includes('soundbar')) {
      grouped['tv-monitores-audio'].push(product);
    } else if (product.name.toLowerCase().includes('galaxy') ||
               product.name.toLowerCase().includes('tab') ||
               product.name.toLowerCase().includes('celular')) {
      grouped['smartphones-tablets'].push(product);
    } else {
      grouped['electrodomesticos'].push(product);
    }
  });
  
  return grouped;
}
