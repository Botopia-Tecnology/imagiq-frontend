/**
 * Product Mapper - Convierte datos de API a formato del frontend
 * - Mapea ProductApiData a ProductCardProps
 * - Usa imágenes mock mientras se implementan
 */

import { ProductApiData } from './api';
import { ProductCardProps, ProductColor } from '@/app/productos/components/ProductCard';
import { StaticImageData } from 'next/image';
import { encodeCodigoMarketForUrl } from './api';

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
import emptyImg from '@/img/empty.jpeg';

// Mapeo de categorías a imágenes (no usado actualmente)
const categoryImageMap: Record<string, StaticImageData> = {
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
  'azul': { hex: '#1E40AF', label: 'Azul' },
  'negro': { hex: '#000000', label: 'Negro' },
  'blanco': { hex: '#FFFFFF', label: 'Blanco' },
  'verde': { hex: '#10B981', label: 'Verde' },
  'rosado': { hex: '#EC4899', label: 'Rosa' },
  'rosa': { hex: '#EC4899', label: 'Rosa' },
  'gris': { hex: '#808080', label: 'Gris' },
  'gris titanio': { hex: '#4B5563', label: 'Gris Titanio' },
  'negro titanio': { hex: '#1F2937', label: 'Negro Titanio' },
  'plateado': { hex: '#C0C0C0', label: 'Plateado' },
  'dorado': { hex: '#D4AF37', label: 'Dorado' },
  'rojo': { hex: '#DC2626', label: 'Rojo' },
  'amarillo': { hex: '#F59E0B', label: 'Amarillo' },
  'morado': { hex: '#7C3AED', label: 'Morado' },
  'purpura': { hex: '#7C3AED', label: 'Morado' },
  'beige': { hex: '#F5F5DC', label: 'Beige' },
  'marron': { hex: '#8B4513', label: 'Marrón' },
  'no aplica': { hex: '#F3F4F6', label: 'Estándar' },
  // Variaciones comunes
  'azul medianoche': { hex: '#1E40AF', label: 'Azul Medianoche' },
  'negro medianoche': { hex: '#000000', label: 'Negro Medianoche' },
  'blanco perla': { hex: '#FFFFFF', label: 'Blanco Perla' },
  'gris grafito': { hex: '#4B5563', label: 'Gris Grafito' },
  'rosa oro': { hex: '#F59E0B', label: 'Rosa Oro' },
};

/**
 * Convierte un producto de la API al formato del frontend
 * Ahora agrupa por codigoMarket y maneja múltiples variantes de color
 */
export function mapApiProductToFrontend(apiProduct: ProductApiData): ProductCardProps {

  // Determinar imagen basada en categoría/subcategoría
  const image = getProductImage(apiProduct);
  
  // Crear colores del producto (ahora maneja arrays)
  const colors: ProductColor[] = createProductColorsFromArray(apiProduct);
  
  // Calcular precios y descuentos (usar el primer precio disponible)
  const { price, originalPrice, discount, isNew } = calculatePricingFromArray(apiProduct);
  
  // Usar codigoMarket como ID único (codificado para URL)
  const id = encodeCodigoMarketForUrl(apiProduct.codigoMarket);

  
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
    // Datos adicionales para la página de detalle
    description: apiProduct.descGeneral || null,
    brand: "Samsung", // Por defecto, se puede obtener de la API en el futuro
    model: apiProduct.modelo,
    category: apiProduct.categoria,
    subcategory: apiProduct.subcategoria,
    capacity: apiProduct.capacidad?.join(', ') || null,
    stock: apiProduct.stock?.reduce((sum, s) => sum + s, 0) || 0,
    sku: apiProduct.sku?.join(', ') || null,
    detailedDescription: apiProduct.desDetallada?.join(' ') || null,
  };
}

/**
 * Obtiene la imagen apropiada para el producto
 */
function getProductImage(apiProduct: ProductApiData): string | StaticImageData {
  // Si hay URL de imagen en la API, usarla (cuando esté disponible)
  const firstImageUrl = apiProduct.urlImagenes.find(url => url && url.trim() !== '');
  if (firstImageUrl) {
    return firstImageUrl;
  }
    
  // Usar imagen por defecto cuando no hay imagen de la API
  return emptyImg;
}

/**
 * Crea el array de colores para el producto desde el array de colores de la API
 * Incluye información de precios específica por variante de color
 */
function createProductColorsFromArray(apiProduct: ProductApiData): ProductColor[] {
  const colorsWithPrices: ProductColor[] = [];
  
  // Crear un mapa de colores únicos con sus precios correspondientes
  const colorPriceMap = new Map<string, { color: string; precioNormal: number; precioDescto: number; index: number }>();
  
  apiProduct.color.forEach((color, index) => {
    const precioNormal = apiProduct.precioNormal[index] || 0;
    const precioDescto = apiProduct.precioDescto[index] || 0;
    
    // Solo incluir colores con precios válidos (mayores a 0)
    if (precioNormal > 0 || precioDescto > 0) {
      const key = color.toLowerCase();
      if (!colorPriceMap.has(key) || precioDescto > 0) {
        colorPriceMap.set(key, { color, precioNormal, precioDescto, index });
      }
    }
  });
  
  // Convertir el mapa a array de ProductColor
  colorPriceMap.forEach(({ color, precioNormal, precioDescto, index }) => {
    // Normalizar el color para búsqueda consistente
    const normalizedColor = color.toLowerCase().trim();
    const colorInfo = colorMap[normalizedColor] || { hex: '#808080', label: color };
    const formatPrice = (price: number) => `$ ${price.toLocaleString('es-CO')}`;
    
    const price = formatPrice(precioDescto > 0 ? precioDescto : precioNormal);
    let originalPrice: string | undefined;
    let discount: string | undefined;
    
    // Si hay descuento real
    if (precioDescto > 0 && precioDescto < precioNormal && precioNormal > 0) {
      originalPrice = formatPrice(precioNormal);
      const discountPercent = Math.round(((precioNormal - precioDescto) / precioNormal) * 100);
      discount = `-${discountPercent}%`;
    }
    
    // Debug: Log para verificar consistencia de colores
    if (color !== colorInfo.label) {
      console.log(`🎨 Color mapping: "${color}" -> "${colorInfo.label}" (hex: ${colorInfo.hex})`);
    }
    
    colorsWithPrices.push({
      name: normalizedColor.replace(/\s+/g, '-'),
      hex: colorInfo.hex,
      label: colorInfo.label,
      price,
      originalPrice,
      discount,
      sku: apiProduct.sku[index]
    });
  });
  
  return colorsWithPrices;
}

/**
 * Calcula precios, descuentos y si es producto nuevo desde arrays
 * Retorna información completa de precios por variante de color
 */
function calculatePricingFromArray(apiProduct: ProductApiData) {
  // Filtrar precios válidos (mayores a 0)
  const preciosNormalesValidos = apiProduct.precioNormal.filter(p => p > 0);
  const preciosDescuentoValidos = apiProduct.precioDescto.filter(p => p > 0);
  
  // Si no hay precios válidos, usar valores por defecto
  if (preciosNormalesValidos.length === 0 && preciosDescuentoValidos.length === 0) {
    return {
      price: "Precio no disponible",
      originalPrice: undefined,
      discount: undefined,
      isNew: false,
    };
  }
  
  // Usar el primer precio disponible (o el más bajo si hay múltiples)
  const precioNormal = preciosNormalesValidos.length > 0 
    ? Math.min(...preciosNormalesValidos) 
    : 0;
  const precioDescto = preciosDescuentoValidos.length > 0 
    ? Math.min(...preciosDescuentoValidos) 
    : precioNormal;
  
  // Formatear precios a formato colombiano
  const formatPrice = (price: number) => `$ ${price.toLocaleString('es-CO')}`;
  
  const price = formatPrice(precioDescto);
  let originalPrice: string | undefined;
  let discount: string | undefined;
  
  // Si hay descuento real
  if (precioDescto < precioNormal && precioNormal > 0) {
    originalPrice = formatPrice(precioNormal);
    const discountPercent = Math.round(((precioNormal - precioDescto) / precioNormal) * 100);
    discount = `-${discountPercent}%`;
  }
  
  // Determinar si es producto nuevo (menos de 30 días desde fecha de inicio)
  const fechaInicio = new Date(apiProduct.fechaInicioVigencia[0]);
  const ahora = new Date();
  const diasDiferencia = (ahora.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24);
  const isNew = diasDiferencia < 30;
  
  return {
    price,
    originalPrice,
    discount,
    isNew,
  };
}

/**
 * Convierte múltiples productos de la API
 * Filtra productos sin precios válidos
 */
export function mapApiProductsToFrontend(apiProducts: ProductApiData[]): ProductCardProps[] {
  return apiProducts
    .map(mapApiProductToFrontend);
}

/**
 * Función de utilidad para debuggear colores
 * Útil para identificar inconsistencias en el mapeo de colores
 */
export function debugColorMapping(color: string): { hex: string; label: string; normalized: string } {
  const normalizedColor = color.toLowerCase().trim();
  const colorInfo = colorMap[normalizedColor] || { hex: '#808080', label: color };
  
  return {
    hex: colorInfo.hex,
    label: colorInfo.label,
    normalized: normalizedColor
  };
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
