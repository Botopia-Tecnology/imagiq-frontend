/**
 * Product Mapper - Convierte datos de API a formato del frontend
 * - Mapea ProductApiData a ProductCardProps
 * - Usa imágenes mock mientras se implementan
 */

import { ProductApiData } from './api';
import { ProductCardProps, ProductColor, ProductCapacity } from '@/app/productos/components/ProductCard';
import { StaticImageData } from 'next/image';

// Importar imágenes mock para usar temporalmente
import emptyImg from '@/img/empty.jpeg';


// Mapeo de colores robusto basado en colores reales de Samsung y otros fabricantes
// colorMap deprecado: el API ahora entrega hex, por lo que no se requiere mapeo nombre->hex

/**
 * Convierte un producto de la API al formato del frontend
 * Ahora agrupa por codigoMarket y maneja múltiples variantes de color
 */
export function mapApiProductToFrontend(apiProduct: ProductApiData): ProductCardProps {

  // Determinar imagen basada en categoría/subcategoría
  const image = getProductImage(apiProduct);

  // Crear colores del producto (ahora maneja arrays)
  const colors: ProductColor[] = createProductColorsFromArray(apiProduct);

  // Crear capacidades del producto
  const capacities: ProductCapacity[] = createProductCapacitiesFromArray(apiProduct);

  // Calcular precios y descuentos (usar el primer precio disponible)
  const { price, originalPrice, discount, isNew } = calculatePricingFromArray(apiProduct);

  const id = apiProduct.codigoMarketBase;


  // Procesar imageDetailsUrls: aplanar array de arrays a array simple
  const processedImageDetailsUrls = apiProduct.imageDetailsUrls?.flat().filter((url) => {
    if (Array.isArray(url)) {
      return url[0] && typeof url[0] === 'string' && url[0].trim() !== "";
    }
    return url && typeof url === 'string' && url.trim() !== "";
  }).map((url) => {
    if (Array.isArray(url)) {
      return url[0];
    }
    return url;
  }) || [];

  return {
    id,
    name: apiProduct.modelo || apiProduct.nombreMarket,
    image,
    colors,
    capacities: capacities.length > 0 ? capacities : undefined,
    price,
    originalPrice,
    discount,
    segmento: apiProduct.segmento?.[0], // Tomar el primer elemento del array de segmento
    stock: apiProduct.stockTotal?.reduce((sum, s) => sum + s, 0) || 0, // Usar stockTotal en lugar de stock
    apiProduct: apiProduct, // Incluir el producto original de la API para acceso a campos adicionales
  };
}

/**
 * Obtiene la imagen apropiada para el producto
 */
function getProductImage(apiProduct: ProductApiData): string | StaticImageData {
  // Priorizar imagePreviewUrl si existe y tiene elementos
  if (apiProduct.imagePreviewUrl && apiProduct.imagePreviewUrl.length > 0) {
    const firstPreviewUrl = apiProduct.imagePreviewUrl[0];
    if (firstPreviewUrl && firstPreviewUrl.trim() !== '') {
      return firstPreviewUrl;
    }
  }

  // Si no hay imagePreviewUrl, usar urlImagenes como fallback
  const firstImageUrl = apiProduct.urlImagenes?.find(url => url && url.trim() !== '');
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
  const colorPriceMap = new Map<string, {
    color: string;
    preciosNormales: number[];
    preciosDescuento: number[];
    indices: number[]
  }>();

  // Agrupar precios por color
  const MAX_PRICE = 100000000; // Filtrar precios corruptos
  for (let index = 0; index < apiProduct.color.length; index++) {
    const color = apiProduct.color[index];
    const precioNormal = apiProduct.precioNormal[index] || 0;
    const precioeccommerce = apiProduct.precioeccommerce[index] || 0;

    // Solo incluir colores con precios válidos (mayores a 0 y menores al máximo)
    if ((precioNormal > 0 && precioNormal < MAX_PRICE) || (precioeccommerce > 0 && precioeccommerce < MAX_PRICE)) {
      const key = color.toLowerCase();

      if (!colorPriceMap.has(key)) {
        colorPriceMap.set(key, {
          color,
          preciosNormales: [],
          preciosDescuento: [],
          indices: []
        });
      }

      const colorData = colorPriceMap.get(key)!;
      colorData.preciosNormales.push(precioNormal);
      colorData.preciosDescuento.push(precioeccommerce);
      colorData.indices.push(index);
    }
  }

  // Convertir el mapa a array de ProductColor
  for (const { color, preciosNormales, preciosDescuento, indices } of colorPriceMap.values()) {
    // Normalizar el color para búsqueda consistente
    const normalizedColor = color.toLowerCase().trim();

    // Determinar si el color ya es un hexadecimal
    const isHexColor = /^#[0-9A-F]{6}$/i.test(color.trim());

    // Si ya es hex, usarlo directamente; sino buscar en colorMap
    const colorInfo = isHexColor
      ? { hex: color.trim(), label: color.trim() } // Usar el hex directamente
      : { hex: '#808080', label: color };
    const formatPrice = (price: number) => {
      if (!price || isNaN(price) || price <= 0) return "Precio no disponible";
      return `$ ${Math.round(price).toLocaleString('es-CO')}`;
    };

    // Encontrar el precio más bajo entre todas las variantes de este color
    // Filtrar precios corruptos (mayores a 100 millones)
    const MAX_PRICE = 100000000;
    const preciosNormalesValidos = preciosNormales.filter(p => p > 0 && p < MAX_PRICE);
    const preciosDescuentoValidos = preciosDescuento.filter(p => p > 0 && p < MAX_PRICE);

    const precioNormalMin = preciosNormalesValidos.length > 0
      ? Math.min(...preciosNormalesValidos)
      : 0;
    const precioDesctoMin = preciosDescuentoValidos.length > 0
      ? Math.min(...preciosDescuentoValidos)
      : precioNormalMin;

    const price = formatPrice(precioDesctoMin);
    let originalPrice: string | undefined;
    let discount: string | undefined;

    // Si hay descuento real
    if (precioDesctoMin > 0 && precioDesctoMin < precioNormalMin && precioNormalMin > 0) {
      originalPrice = formatPrice(precioNormalMin);
      const discountPercent = Math.round(((precioNormalMin - precioDesctoMin) / precioNormalMin) * 100);
      discount = `-${discountPercent}%`;
    }

    // Usar el primer SKU disponible para este color
    const firstIndex = indices[0];

    // Obtener imágenes y videos premium específicos para este color
    // imagenPremium y videoPremium vienen como arrays de arrays desde el API
    // Intentar primero con el nombre sin guión bajo (imagenPremium), luego con guión bajo (imagen_premium)
    const imagenesPremiumColor = ((apiProduct.imagenPremium?.[firstIndex] || apiProduct.imagen_premium?.[firstIndex]) || []) as string[];
    const videosPremiumColor = ((apiProduct.videoPremium?.[firstIndex] || apiProduct.video_premium?.[firstIndex]) || []) as string[];

    // Filtrar URLs vacías o inválidas
    const imagenesPremiumValidas = Array.isArray(imagenesPremiumColor)
      ? imagenesPremiumColor.filter((url: string) => url && typeof url === 'string' && url.trim() !== '')
      : [];
    const videosPremiumValidos = Array.isArray(videosPremiumColor)
      ? videosPremiumColor.filter((url: string) => url && typeof url === 'string' && url.trim() !== '')
      : [];

    colorsWithPrices.push({
      name: normalizedColor.replaceAll(/\s+/g, '-'),
      hex: colorInfo.hex,
      label: colorInfo.label,
      price,
      originalPrice,
      discount,
      sku: apiProduct.sku[firstIndex],
      ean: apiProduct.ean[firstIndex],
      imagePreviewUrl: apiProduct.imagePreviewUrl?.[firstIndex] || undefined,
      imagen_premium: imagenesPremiumValidas, // Imágenes premium para este color específico
      video_premium: videosPremiumValidos // Videos premium para este color específico
    });
  }

  return colorsWithPrices;
}

/**
 * Crea el array de capacidades para el producto desde el array de capacidades de la API
 * Incluye información de precios específica por variante de capacidad
 */
function createProductCapacitiesFromArray(apiProduct: ProductApiData): ProductCapacity[] {
  const capacitiesWithPrices: ProductCapacity[] = [];

  // Crear un mapa de capacidades únicas con sus precios correspondientes
  const capacityPriceMap = new Map<string, {
    capacity: string;
    preciosNormales: number[];
    preciosDescuento: number[];
    indices: number[]
  }>();

  // Agrupar precios por capacidad
  const MAX_PRICE = 100000000; // Filtrar precios corruptos
  apiProduct.capacidad.forEach((capacity, index) => {
    const precioNormal = apiProduct.precioNormal[index] || 0;
    const precioeccommerce = apiProduct.precioeccommerce[index] || 0;

    // Solo incluir capacidades con precios válidos (mayores a 0 y menores al máximo)
    if (((precioNormal > 0 && precioNormal < MAX_PRICE) || (precioeccommerce > 0 && precioeccommerce < MAX_PRICE))
      && capacity && capacity.trim() !== '' && capacity.toLowerCase() !== 'no aplica') {
      const key = capacity.toLowerCase().trim();

      if (!capacityPriceMap.has(key)) {
        capacityPriceMap.set(key, {
          capacity,
          preciosNormales: [],
          preciosDescuento: [],
          indices: []
        });
      }

      const capacityData = capacityPriceMap.get(key)!;
      capacityData.preciosNormales.push(precioNormal);
      capacityData.preciosDescuento.push(precioeccommerce);
      capacityData.indices.push(index);
    }
  });

  // Convertir el mapa a array de ProductCapacity
  capacityPriceMap.forEach(({ capacity, preciosNormales, preciosDescuento, indices }) => {
    const formatPrice = (price: number) => {
      if (!price || isNaN(price) || price <= 0) return "Precio no disponible";
      return `$ ${Math.round(price).toLocaleString('es-CO')}`;
    };

    // Encontrar el precio más bajo entre todas las variantes de esta capacidad
    // Filtrar precios corruptos (mayores a 100 millones)
    const MAX_PRICE = 100000000;
    const preciosNormalesValidos = preciosNormales.filter(p => p > 0 && p < MAX_PRICE);
    const preciosDescuentoValidos = preciosDescuento.filter(p => p > 0 && p < MAX_PRICE);

    const precioNormalMin = preciosNormalesValidos.length > 0
      ? Math.min(...preciosNormalesValidos)
      : 0;
    const precioDesctoMin = preciosDescuentoValidos.length > 0
      ? Math.min(...preciosDescuentoValidos)
      : precioNormalMin;

    const price = formatPrice(precioDesctoMin);
    let originalPrice: string | undefined;
    let discount: string | undefined;

    // Si hay descuento real
    if (precioDesctoMin > 0 && precioDesctoMin < precioNormalMin && precioNormalMin > 0) {
      originalPrice = formatPrice(precioNormalMin);
      const discountPercent = Math.round(((precioNormalMin - precioDesctoMin) / precioNormalMin) * 100);
      discount = `-${discountPercent}%`;
    }

    // Formatear label para mostrar (ej: "128GB" -> "128 GB")
    const label = capacity.replace(/(\d+)([A-Z]+)/gi, '$1 $2').toUpperCase();

    // Usar el primer SKU disponible para esta capacidad
    const firstIndex = indices[0];

    capacitiesWithPrices.push({
      value: capacity.toLowerCase().replace(/\s+/g, ''),
      label,
      price,
      originalPrice,
      discount,
      sku: apiProduct.sku[firstIndex],
      ean: apiProduct.ean[firstIndex]
    });
  });

  // Ordenar por capacidad numérica (128GB antes de 256GB)
  return capacitiesWithPrices.sort((a, b) => {
    const aNum = parseInt(a.value.match(/\d+/)?.[0] || '0');
    const bNum = parseInt(b.value.match(/\d+/)?.[0] || '0');
    return aNum - bNum;
  });
}

/**
 * Calcula precios, descuentos y si es producto nuevo desde arrays
 * Retorna información completa de precios por variante de color
 */
function calculatePricingFromArray(apiProduct: ProductApiData) {
  // Filtrar precios válidos (mayores a 0 y menores a 100 millones - filtrar datos corruptos)
  const MAX_PRICE = 100000000; // 100 millones
  const preciosNormalesValidos = apiProduct.precioNormal.filter(p => p > 0 && p < MAX_PRICE);
  const preciosDescuentoValidos = apiProduct.precioeccommerce.filter(p => p > 0 && p < MAX_PRICE);

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
  const precioeccommerce = preciosDescuentoValidos.length > 0
    ? Math.min(...preciosDescuentoValidos)
    : precioNormal;

  // Formatear precios a formato colombiano - asegurar números enteros
  const formatPrice = (price: number) => {
    if (!price || isNaN(price) || price <= 0) return "Precio no disponible";
    return `$ ${Math.round(price).toLocaleString('es-CO')}`;
  };

  const price = formatPrice(precioeccommerce);
  let originalPrice: string | undefined;
  let discount: string | undefined;

  // Si hay descuento real
  if (precioeccommerce < precioNormal && precioNormal > 0) {
    originalPrice = formatPrice(precioNormal);
    const discountPercent = Math.round(((precioNormal - precioeccommerce) / precioNormal) * 100);
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
  // Con API en hex, devolver el propio valor si es hex; si no, fallback gris
  const isHexColor = /^#[0-9A-F]{6}$/i.test(color.trim());
  const colorInfo = isHexColor
    ? { hex: color.trim(), label: color.trim() }
    : { hex: '#808080', label: color };

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
