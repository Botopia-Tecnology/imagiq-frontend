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
export const colorMap: Record<string, { hex: string; label: string }> = {
  // === NEGROS Y GRISES ===
  'negro': { hex: '#000000', label: 'Negro' },
  'black': { hex: '#000000', label: 'Negro' },
  'negro fantasma': { hex: '#1a1a1a', label: 'Negro Fantasma' },
  'phantom black': { hex: '#1a1a1a', label: 'Negro Fantasma' },
  'negro medianoche': { hex: '#0d1117', label: 'Negro Medianoche' },
  'midnight black': { hex: '#0d1117', label: 'Negro Medianoche' },
  'negro grafito': { hex: '#2d2d2d', label: 'Negro Grafito' },
  'graphite black': { hex: '#2d2d2d', label: 'Negro Grafito' },
  'negro titanio': { hex: '#303030', label: 'Negro Titanio' },
  'titanium black': { hex: '#303030', label: 'Negro Titanio' },
  'negro onyx': { hex: '#0f0f0f', label: 'Negro Onyx' },
  'onyx black': { hex: '#0f0f0f', label: 'Negro Onyx' },
  
  // Grises
  'gris': { hex: '#808080', label: 'Gris' },
  'gray': { hex: '#808080', label: 'Gris' },
  'grey': { hex: '#808080', label: 'Gris' },
  'gris fantasma': { hex: '#9e9e9e', label: 'Gris Fantasma' },
  'phantom gray': { hex: '#9e9e9e', label: 'Gris Fantasma' },
  'gris titanio': { hex: '#6b6b6b', label: 'Gris Titanio' },
  'titanium gray': { hex: '#6b6b6b', label: 'Gris Titanio' },
  'gris grafito': { hex: '#595959', label: 'Gris Grafito' },
  'graphite': { hex: '#595959', label: 'Gris Grafito' },
  'graphite gray': { hex: '#595959', label: 'Gris Grafito' },
  'gris plata': { hex: '#b8b8b8', label: 'Gris Plata' },
  'silver gray': { hex: '#b8b8b8', label: 'Gris Plata' },
  'gris niebla': { hex: '#c4c4c4', label: 'Gris Niebla' },
  'mystic gray': { hex: '#c4c4c4', label: 'Gris Místico' },
  
  // === BLANCOS Y PLATEADOS ===
  'blanco': { hex: '#FFFFFF', label: 'Blanco' },
  'white': { hex: '#FFFFFF', label: 'Blanco' },
  'blanco fantasma': { hex: '#f5f5f5', label: 'Blanco Fantasma' },
  'phantom white': { hex: '#f5f5f5', label: 'Blanco Fantasma' },
  'blanco perla': { hex: '#f8f8f8', label: 'Blanco Perla' },
  'pearl white': { hex: '#f8f8f8', label: 'Blanco Perla' },
  'blanco crema': { hex: '#fffdd0', label: 'Blanco Crema' },
  'cream white': { hex: '#fffdd0', label: 'Blanco Crema' },
  'blanco nieve': { hex: '#fffafa', label: 'Blanco Nieve' },
  'snow white': { hex: '#fffafa', label: 'Blanco Nieve' },
  
  'plateado': { hex: '#C0C0C0', label: 'Plateado' },
  'silver': { hex: '#C0C0C0', label: 'Plateado' },
  'plata': { hex: '#C0C0C0', label: 'Plata' },
  'plata titanio': { hex: '#d4d4d4', label: 'Plata Titanio' },
  'titanium silver': { hex: '#d4d4d4', label: 'Plata Titanio' },
  'plata místico': { hex: '#e8e8e8', label: 'Plata Místico' },
  'mystic silver': { hex: '#e8e8e8', label: 'Plata Místico' },
  
  // === AZULES ===
  'azul': { hex: '#1E40AF', label: 'Azul' },
  'blue': { hex: '#1E40AF', label: 'Azul' },
  'azul medianoche': { hex: '#003366', label: 'Azul Medianoche' },
  'midnight blue': { hex: '#003366', label: 'Azul Medianoche' },
  'azul marino': { hex: '#000080', label: 'Azul Marino' },
  'navy blue': { hex: '#000080', label: 'Azul Marino' },
  'azul océano': { hex: '#006994', label: 'Azul Océano' },
  'ocean blue': { hex: '#006994', label: 'Azul Océano' },
  'azul cielo': { hex: '#87CEEB', label: 'Azul Cielo' },
  'sky blue': { hex: '#87CEEB', label: 'Azul Cielo' },
  'azul índigo': { hex: '#4B0082', label: 'Azul Índigo' },
  'indigo blue': { hex: '#4B0082', label: 'Azul Índigo' },
  'azul cobalto': { hex: '#0047AB', label: 'Azul Cobalto' },
  'cobalt blue': { hex: '#0047AB', label: 'Azul Cobalto' },
  'azul hielo': { hex: '#99ccff', label: 'Azul Hielo' },
  'ice blue': { hex: '#99ccff', label: 'Azul Hielo' },
  'azul neblina': { hex: '#a0c4d9', label: 'Azul Neblina' },
  'cloud blue': { hex: '#a0c4d9', label: 'Azul Nube' },
  'phantom blue': { hex: '#2e5a88', label: 'Azul Fantasma' },
  
  // === VERDES ===
  'verde': { hex: '#10B981', label: 'Verde' },
  'green': { hex: '#10B981', label: 'Verde' },
  'verde menta': { hex: '#98FF98', label: 'Verde Menta' },
  'mint green': { hex: '#98FF98', label: 'Verde Menta' },
  'mint': { hex: '#98FF98', label: 'Menta' },
  'verde oliva': { hex: '#808000', label: 'Verde Oliva' },
  'olive green': { hex: '#808000', label: 'Verde Oliva' },
  'verde esmeralda': { hex: '#50C878', label: 'Verde Esmeralda' },
  'emerald green': { hex: '#50C878', label: 'Verde Esmeralda' },
  'verde bosque': { hex: '#228B22', label: 'Verde Bosque' },
  'forest green': { hex: '#228B22', label: 'Verde Bosque' },
  'verde lima': { hex: '#32CD32', label: 'Verde Lima' },
  'lime green': { hex: '#32CD32', label: 'Verde Lima' },
  'verde sage': { hex: '#9DC183', label: 'Verde Sage' },
  'sage green': { hex: '#9DC183', label: 'Verde Sage' },
  
  // === ROSAS Y ROJOS ===
  'rosado': { hex: '#FFC0CB', label: 'Rosa' },
  'rosa': { hex: '#FFC0CB', label: 'Rosa' },
  'pink': { hex: '#FFC0CB', label: 'Rosa' },
  'rosa oro': { hex: '#E8B4B8', label: 'Rosa Oro' },
  'rose gold': { hex: '#E8B4B8', label: 'Rosa Oro' },
  'oro rosa': { hex: '#E8B4B8', label: 'Oro Rosa' },
  'pink gold': { hex: '#E8B4B8', label: 'Rosa Oro' },
  'rosa coral': { hex: '#FF6F61', label: 'Rosa Coral' },
  'coral': { hex: '#FF6F61', label: 'Coral' },
  'coral pink': { hex: '#FF6F61', label: 'Rosa Coral' },
  'rosa pastel': { hex: '#FFD1DC', label: 'Rosa Pastel' },
  'pastel pink': { hex: '#FFD1DC', label: 'Rosa Pastel' },
  
  'rojo': { hex: '#DC2626', label: 'Rojo' },
  'red': { hex: '#DC2626', label: 'Rojo' },
  'rojo escarlata': { hex: '#FF2400', label: 'Rojo Escarlata' },
  'scarlet red': { hex: '#FF2400', label: 'Rojo Escarlata' },
  'rojo carmesí': { hex: '#DC143C', label: 'Rojo Carmesí' },
  'crimson red': { hex: '#DC143C', label: 'Rojo Carmesí' },
  'burgundy': { hex: '#800020', label: 'Burgundy' },
  'borgoña': { hex: '#800020', label: 'Borgoña' },
  
  // === MORADOS Y VIOLETAS ===
  'morado': { hex: '#7C3AED', label: 'Morado' },
  'purple': { hex: '#7C3AED', label: 'Morado' },
  'purpura': { hex: '#7C3AED', label: 'Morado' },
  'violeta': { hex: '#8B00FF', label: 'Violeta' },
  'violet': { hex: '#8B00FF', label: 'Violeta' },
  'morado lavanda': { hex: '#B19CD9', label: 'Morado Lavanda' },
  'lavender': { hex: '#B19CD9', label: 'Lavanda' },
  'lavanda': { hex: '#B19CD9', label: 'Lavanda' },
  'lavender purple': { hex: '#B19CD9', label: 'Morado Lavanda' },
  'lila': { hex: '#C8A2C8', label: 'Lila' },
  'lilac': { hex: '#C8A2C8', label: 'Lila' },
  'púrpura místico': { hex: '#9370DB', label: 'Púrpura Místico' },
  'mystic purple': { hex: '#9370DB', label: 'Púrpura Místico' },
  
  // === AMARILLOS Y DORADOS ===
  'amarillo': { hex: '#FBBF24', label: 'Amarillo' },
  'yellow': { hex: '#FBBF24', label: 'Amarillo' },
  'amarillo limón': { hex: '#FFF44F', label: 'Amarillo Limón' },
  'lemon yellow': { hex: '#FFF44F', label: 'Amarillo Limón' },
  'amarillo canario': { hex: '#FFEF00', label: 'Amarillo Canario' },
  'canary yellow': { hex: '#FFEF00', label: 'Amarillo Canario' },
  
  'dorado': { hex: '#D4AF37', label: 'Dorado' },
  'gold': { hex: '#D4AF37', label: 'Dorado' },
  'oro': { hex: '#D4AF37', label: 'Oro' },
  'dorado champagne': { hex: '#F7E7CE', label: 'Dorado Champagne' },
  'champagne gold': { hex: '#F7E7CE', label: 'Dorado Champagne' },
  'bronce': { hex: '#CD7F32', label: 'Bronce' },
  'bronze': { hex: '#CD7F32', label: 'Bronce' },
  
  // === NARANJAS ===
  'naranja': { hex: '#F97316', label: 'Naranja' },
  'orange': { hex: '#F97316', label: 'Naranja' },
  'naranja brillante': { hex: '#FF6600', label: 'Naranja Brillante' },
  'bright orange': { hex: '#FF6600', label: 'Naranja Brillante' },
  'durazno': { hex: '#FFE5B4', label: 'Durazno' },
  'peach': { hex: '#FFE5B4', label: 'Durazno' },
  
  // === MARRONES Y BEIGES ===
  'marron': { hex: '#8B4513', label: 'Marrón' },
  'marrón': { hex: '#8B4513', label: 'Marrón' },
  'brown': { hex: '#8B4513', label: 'Marrón' },
  'café': { hex: '#6F4E37', label: 'Café' },
  'coffee': { hex: '#6F4E37', label: 'Café' },
  'chocolate': { hex: '#7B3F00', label: 'Chocolate' },
  
  'beige': { hex: '#F5F5DC', label: 'Beige' },
  'crema': { hex: '#FFFDD0', label: 'Crema' },
  'cream': { hex: '#FFFDD0', label: 'Crema' },
  'arena': { hex: '#C2B280', label: 'Arena' },
  'sand': { hex: '#C2B280', label: 'Arena' },
  'beige místico': { hex: '#f0e5d8', label: 'Beige Místico' },
  'mystic beige': { hex: '#f0e5d8', label: 'Beige Místico' },
  
  // === COLORES ESPECIALES ===
  'transparente': { hex: '#F3F4F6', label: 'Transparente' },
  'transparent': { hex: '#F3F4F6', label: 'Transparente' },
  'no aplica': { hex: '#F3F4F6', label: 'Estándar' },
  'n/a': { hex: '#F3F4F6', label: 'Estándar' },
  'multicolor': { hex: '#FF6B9D', label: 'Multicolor' },
  'iridiscente': { hex: '#E0BBE4', label: 'Iridiscente' },
  'iridescent': { hex: '#E0BBE4', label: 'Iridiscente' },
  
  // === COLORES GALAXY ESPECÍFICOS ===
  'awesome navy': { hex: '#1a2332', label: 'Navy Impresionante' },
  'awesome black': { hex: '#0a0a0a', label: 'Negro Impresionante' },
  'awesome white': { hex: '#f7f7f7', label: 'Blanco Impresionante' },
  'awesome violet': { hex: '#6b5b95', label: 'Violeta Impresionante' },
  'awesome blue': { hex: '#2e5a88', label: 'Azul Impresionante' },
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
    name: apiProduct.nombreMarket,
    image,
    colors,
    capacities: capacities.length > 0 ? capacities : undefined,
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
    segmento: apiProduct.segmento?.[0], // Tomar el primer elemento del array de segmento
    capacity: apiProduct.capacidad?.join(', ') || null,
    stock: apiProduct.stock?.reduce((sum, s) => sum + s, 0) || 0,
    sku: apiProduct.sku?.join(', ') || null,
    ean: apiProduct.ean?.join(', ') || null,
    detailedDescription: apiProduct.desDetallada?.join(' ') || null,
    imageDetailsUrls: processedImageDetailsUrls, // URLs de imágenes adicionales procesadas
    // imagen_premium y video_premium se asignan a nivel de color en createProductColorsFromArray
    // Pasar los datos de la API para el nuevo sistema de selección
    apiProduct,
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
    const colorInfo = colorMap[normalizedColor] || { hex: '#808080', label: color };
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
