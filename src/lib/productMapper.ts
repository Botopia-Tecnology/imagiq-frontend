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
 * Ahora agrupa por codigoMarket y maneja múltiples variantes de color
 */
export function mapApiProductToFrontend(apiProduct: ProductApiData): ProductCardProps {
  // Log para productos de accesorios para debug
  if (apiProduct.subcategoria === 'Accesorios') {
    console.log(`🔧 Accesorio detectado: ${apiProduct.nombreMarket}`);
    console.log(`📝 Descripción: ${apiProduct.desDetallada[0]}`);
    console.log(`🏷️ Modelo: ${apiProduct.modelo}`);
  }

  // Log para debug de IDs
  console.log(`🏷️ CodigoMarket: ${apiProduct.codigoMarket}, Colores: ${apiProduct.color.join(', ')}`);

  // Determinar imagen basada en categoría/subcategoría
  const image = getProductImage(apiProduct);
  
  // Crear colores del producto (ahora maneja arrays)
  const colors: ProductColor[] = createProductColorsFromArray(apiProduct);
  
  // Calcular precios y descuentos (usar el primer precio disponible)
  const { price, originalPrice, discount, isNew } = calculatePricingFromArray(apiProduct);
  
  // Usar codigoMarket como ID único
  const id = apiProduct.codigoMarket;
  
  console.log(`🆔 ID generado: ${id}`);
  
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
  const firstImageUrl = apiProduct.urlImagenes.find(url => url && url.trim() !== '');
  if (firstImageUrl) {
    return firstImageUrl;
  }
  
  // Detectar productos específicos por nombre para usar imágenes correctas
  const productName = apiProduct.nombreMarket.toLowerCase();
  const modelName = apiProduct.modelo?.toLowerCase() || '';
  
  // Galaxy Watch - usar imagen específica de relojes
  if (productName.includes('watch') || modelName.includes('watch')) {
    console.log(`🔍 Galaxy Watch detectado: ${apiProduct.nombreMarket} - usando imagen de relojes`);
    console.log(`📝 Descripción: ${apiProduct.desDetallada}`);
    return galaxyWatchImg;
  }
  
  // Galaxy Buds - usar imagen específica de audífonos
  if (productName.includes('buds') || modelName.includes('buds')) {
    console.log(`🔍 Galaxy Buds detectado: ${apiProduct.nombreMarket} - usando imagen de audífonos`);
    console.log(`📝 Descripción: ${apiProduct.desDetallada}`);
    return galaxyBudsImg;
  }
  
  // Galaxy Tab - usar imagen específica de tabletas
  if (productName.includes('tab') || modelName.includes('tab')) {
    console.log(`🔍 Galaxy Tab detectado: ${apiProduct.nombreMarket} - usando imagen de tabletas`);
    console.log(`📝 Descripción: ${apiProduct.desDetallada}`);
    return tabletasImg;
  }
  
  // Usar imagen mock basada en subcategoría o categoría
  return categoryImageMap[apiProduct.subcategoria] || 
         categoryImageMap[apiProduct.categoria] || 
         smartphonesImg;
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
  colorPriceMap.forEach(({ color, precioNormal, precioDescto }) => {
    const colorInfo = colorMap[color] || { hex: '#808080', label: color };
    const formatPrice = (price: number) => `$ ${price.toLocaleString('es-CO')}`;
    
    let price = formatPrice(precioDescto > 0 ? precioDescto : precioNormal);
    let originalPrice: string | undefined;
    let discount: string | undefined;
    
    // Si hay descuento real
    if (precioDescto > 0 && precioDescto < precioNormal && precioNormal > 0) {
      originalPrice = formatPrice(precioNormal);
      const discountPercent = Math.round(((precioNormal - precioDescto) / precioNormal) * 100);
      discount = `-${discountPercent}%`;
    }
    
    colorsWithPrices.push({
      name: color.toLowerCase().replace(/\s+/g, '-'),
      hex: colorInfo.hex,
      label: colorInfo.label,
      price,
      originalPrice,
      discount,
    });
  });
  
  return colorsWithPrices;
}

/**
 * Crea el array de colores para el producto (función legacy - para compatibilidad)
 */
function createProductColors(apiProduct: any): ProductColor[] {
  // Si es un string (formato legacy), convertir a array
  const colors = Array.isArray(apiProduct.color) ? apiProduct.color : [apiProduct.color];
  
  return colors.map((color: string) => {
    const colorInfo = colorMap[color] || { hex: '#808080', label: color };
    return {
      name: color.toLowerCase().replace(/\s+/g, '-'),
      hex: colorInfo.hex,
      label: colorInfo.label,
    };
  });
}

/**
 * Calcula precios, descuentos y si es producto nuevo (función legacy - para compatibilidad)
 */
function calculatePricing(apiProduct: any) {
  // Manejar tanto arrays como valores únicos
  const precioNormal = Array.isArray(apiProduct.precioNormal) 
    ? Math.min(...apiProduct.precioNormal.filter((p: number) => p > 0))
    : apiProduct.precioNormal;
  const precioDescto = Array.isArray(apiProduct.precioDescto)
    ? Math.min(...apiProduct.precioDescto.filter((p: number) => p > 0))
    : apiProduct.precioDescto;
  
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
  const fechaInicio = Array.isArray(apiProduct.fechaInicioVigencia) 
    ? new Date(apiProduct.fechaInicioVigencia[0])
    : new Date(apiProduct.fechaInicioVigencia);
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
 * Calcula precios, descuentos y si es producto nuevo desde arrays
 * Retorna información completa de precios por variante de color
 */
function calculatePricingFromArray(apiProduct: ProductApiData) {
  // Filtrar precios válidos (mayores a 0)
  const preciosNormalesValidos = apiProduct.precioNormal.filter(p => p > 0);
  const preciosDescuentoValidos = apiProduct.precioDescto.filter(p => p > 0);
  
  console.log(`💰 Precios para ${apiProduct.nombreMarket}:`, {
    precioNormal: apiProduct.precioNormal,
    precioDescto: apiProduct.precioDescto,
    validosNormal: preciosNormalesValidos,
    validosDescuento: preciosDescuentoValidos
  });
  
  // Si no hay precios válidos, usar valores por defecto
  if (preciosNormalesValidos.length === 0 && preciosDescuentoValidos.length === 0) {
    console.log(`⚠️ Sin precios válidos para ${apiProduct.nombreMarket}`);
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
  
  let price = formatPrice(precioDescto);
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
    .map(mapApiProductToFrontend)
    .filter(product => {
      // Filtrar productos sin precios válidos
      const hasValidPrice = product.colors.some(color => 
        color.price && color.price !== "Precio no disponible"
      );
      
      if (!hasValidPrice) {
        console.log(`🚫 Filtrando producto sin precios válidos: ${product.name}`);
      }
      
      return hasValidPrice;
    });
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
