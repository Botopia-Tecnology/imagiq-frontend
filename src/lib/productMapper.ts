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


// Mapeo robusto de colores de la API a colores del frontend
// Incluye variaciones, sinónimos y colores específicos de Samsung
const colorMap: Record<string, { hex: string; label: string }> = {
  // ===== NEGROS =====
  'negro': { hex: '#000000', label: 'Negro' },
  'black': { hex: '#000000', label: 'Negro' },
  'negro medianoche': { hex: '#191970', label: 'Negro Medianoche' },
  'midnight black': { hex: '#191970', label: 'Negro Medianoche' },
  'negro titanio': { hex: '#2C2C2C', label: 'Negro Titanio' },
  'titanium black': { hex: '#2C2C2C', label: 'Negro Titanio' },
  'negro grafito': { hex: '#1C1C1C', label: 'Negro Grafito' },
  'graphite black': { hex: '#1C1C1C', label: 'Negro Grafito' },
  'negro phantom': { hex: '#1A1A1A', label: 'Negro Phantom' },
  'phantom black': { hex: '#1A1A1A', label: 'Negro Phantom' },
  'negro fantasma': { hex: '#1A1A1A', label: 'Negro Fantasma' },
  'negro espacial': { hex: '#0A0A0A', label: 'Negro Espacial' },
  'space black': { hex: '#0A0A0A', label: 'Negro Espacial' },
  
  // ===== BLANCOS =====
  'blanco': { hex: '#FFFFFF', label: 'Blanco' },
  'white': { hex: '#FFFFFF', label: 'Blanco' },
  'blanco perla': { hex: '#F8F8F8', label: 'Blanco Perla' },
  'pearl white': { hex: '#F8F8F8', label: 'Blanco Perla' },
  'blanco nube': { hex: '#F5F5F5', label: 'Blanco Nube' },
  'cloud white': { hex: '#F5F5F5', label: 'Blanco Nube' },
  'blanco phantom': { hex: '#F0F0F0', label: 'Blanco Phantom' },
  'phantom white': { hex: '#F0F0F0', label: 'Blanco Phantom' },
  'blanco lunar': { hex: '#FAFAFA', label: 'Blanco Lunar' },
  'lunar white': { hex: '#FAFAFA', label: 'Blanco Lunar' },
  'blanco crema': { hex: '#FFFDD0', label: 'Blanco Crema' },
  'cream white': { hex: '#FFFDD0', label: 'Blanco Crema' },
  
  // ===== GRISES =====
  'gris': { hex: '#808080', label: 'Gris' },
  'gray': { hex: '#808080', label: 'Gris' },
  'grey': { hex: '#808080', label: 'Gris' },
  'gris titanio': { hex: '#5A6978', label: 'Gris Titanio' },
  'titanium gray': { hex: '#5A6978', label: 'Gris Titanio' },
  'gris grafito': { hex: '#4B5563', label: 'Gris Grafito' },
  'graphite gray': { hex: '#4B5563', label: 'Gris Grafito' },
  'gris phantom': { hex: '#6B7280', label: 'Gris Phantom' },
  'phantom gray': { hex: '#6B7280', label: 'Gris Phantom' },
  'gris espacial': { hex: '#52575D', label: 'Gris Espacial' },
  'space gray': { hex: '#52575D', label: 'Gris Espacial' },
  'gris niebla': { hex: '#9CA3AF', label: 'Gris Niebla' },
  'misty gray': { hex: '#9CA3AF', label: 'Gris Niebla' },
  'gris plata': { hex: '#C0C0C0', label: 'Gris Plata' },
  'silver gray': { hex: '#C0C0C0', label: 'Gris Plata' },
  
  // ===== PLATEADOS / PLATAS =====
  'plateado': { hex: '#C0C0C0', label: 'Plateado' },
  'silver': { hex: '#C0C0C0', label: 'Plateado' },
  'plata': { hex: '#C0C0C0', label: 'Plata' },
  'plateado titanio': { hex: '#B8C5D6', label: 'Plateado Titanio' },
  'titanium silver': { hex: '#B8C5D6', label: 'Plateado Titanio' },
  'plata phantom': { hex: '#D3D3D3', label: 'Plata Phantom' },
  'phantom silver': { hex: '#D3D3D3', label: 'Plata Phantom' },
  
  // ===== AZULES =====
  'azul': { hex: '#1E40AF', label: 'Azul' },
  'blue': { hex: '#1E40AF', label: 'Azul' },
  'azul medianoche': { hex: '#003366', label: 'Azul Medianoche' },
  'midnight blue': { hex: '#003366', label: 'Azul Medianoche' },
  'azul marino': { hex: '#000080', label: 'Azul Marino' },
  'navy blue': { hex: '#000080', label: 'Azul Marino' },
  'azul naval': { hex: '#1e3a8a', label: 'Azul Naval' },
  'azul cielo': { hex: '#87CEEB', label: 'Azul Cielo' },
  'sky blue': { hex: '#87CEEB', label: 'Azul Cielo' },
  'azul hielo': { hex: '#B0E0E6', label: 'Azul Hielo' },
  'ice blue': { hex: '#B0E0E6', label: 'Azul Hielo' },
  'azul océano': { hex: '#006994', label: 'Azul Océano' },
  'ocean blue': { hex: '#006994', label: 'Azul Océano' },
  'azul cobalto': { hex: '#0047AB', label: 'Azul Cobalto' },
  'cobalt blue': { hex: '#0047AB', label: 'Azul Cobalto' },
  'azul phantom': { hex: '#2563EB', label: 'Azul Phantom' },
  'phantom blue': { hex: '#2563EB', label: 'Azul Phantom' },
  
  // ===== VERDES =====
  'verde': { hex: '#10B981', label: 'Verde' },
  'green': { hex: '#10B981', label: 'Verde' },
  'verde menta': { hex: '#86EFAC', label: 'Verde Menta' },
  'mint green': { hex: '#86EFAC', label: 'Verde Menta' },
  'menta': { hex: '#86EFAC', label: 'Menta' },
  'mint': { hex: '#86EFAC', label: 'Menta' },
  'verde oliva': { hex: '#6B8E23', label: 'Verde Oliva' },
  'olive green': { hex: '#6B8E23', label: 'Verde Oliva' },
  'verde bosque': { hex: '#228B22', label: 'Verde Bosque' },
  'forest green': { hex: '#228B22', label: 'Verde Bosque' },
  'verde esmeralda': { hex: '#50C878', label: 'Verde Esmeralda' },
  'emerald green': { hex: '#50C878', label: 'Verde Esmeralda' },
  'verde lima': { hex: '#32CD32', label: 'Verde Lima' },
  'lime green': { hex: '#32CD32', label: 'Verde Lima' },
  
  // ===== ROSAS / ROSADOS =====
  'rosa': { hex: '#EC4899', label: 'Rosa' },
  'pink': { hex: '#EC4899', label: 'Rosa' },
  'rosado': { hex: '#EC4899', label: 'Rosado' },
  'rosa oro': { hex: '#E8B4B8', label: 'Rosa Oro' },
  'rose gold': { hex: '#E8B4B8', label: 'Rosa Oro' },
  'oro rosa': { hex: '#E8B4B8', label: 'Oro Rosa' },
  'pink gold': { hex: '#E8B4B8', label: 'Oro Rosa' },
  'rosa claro': { hex: '#FFB6C1', label: 'Rosa Claro' },
  'light pink': { hex: '#FFB6C1', label: 'Rosa Claro' },
  'rosa pastel': { hex: '#FFD1DC', label: 'Rosa Pastel' },
  'pastel pink': { hex: '#FFD1DC', label: 'Rosa Pastel' },
  
  // ===== MORADOS / PÚRPURAS / VIOLETAS =====
  'morado': { hex: '#9333EA', label: 'Morado' },
  'purple': { hex: '#9333EA', label: 'Morado' },
  'purpura': { hex: '#9333EA', label: 'Púrpura' },
  'violeta': { hex: '#8B5CF6', label: 'Violeta' },
  'violet': { hex: '#8B5CF6', label: 'Violeta' },
  'morado lavanda': { hex: '#B19CD9', label: 'Morado Lavanda' },
  'lavender purple': { hex: '#B19CD9', label: 'Morado Lavanda' },
  'lavanda': { hex: '#E6E6FA', label: 'Lavanda' },
  'lavender': { hex: '#E6E6FA', label: 'Lavanda' },
  'lila': { hex: '#C8A2C8', label: 'Lila' },
  'lilac': { hex: '#C8A2C8', label: 'Lila' },
  'ciruela': { hex: '#8E4585', label: 'Ciruela' },
  'plum': { hex: '#8E4585', label: 'Ciruela' },
  
  // ===== ROJOS =====
  'rojo': { hex: '#DC2626', label: 'Rojo' },
  'red': { hex: '#DC2626', label: 'Rojo' },
  'rojo cereza': { hex: '#D2042D', label: 'Rojo Cereza' },
  'cherry red': { hex: '#D2042D', label: 'Rojo Cereza' },
  'rojo carmesí': { hex: '#DC143C', label: 'Rojo Carmesí' },
  'crimson red': { hex: '#DC143C', label: 'Rojo Carmesí' },
  'rojo vino': { hex: '#722F37', label: 'Rojo Vino' },
  'wine red': { hex: '#722F37', label: 'Rojo Vino' },
  'borgoña': { hex: '#800020', label: 'Borgoña' },
  'burgundy': { hex: '#800020', label: 'Borgoña' },
  
  // ===== AMARILLOS / DORADOS =====
  'amarillo': { hex: '#EAB308', label: 'Amarillo' },
  'yellow': { hex: '#EAB308', label: 'Amarillo' },
  'dorado': { hex: '#FFD700', label: 'Dorado' },
  'gold': { hex: '#FFD700', label: 'Dorado' },
  'oro': { hex: '#FFD700', label: 'Oro' },
  'amarillo limón': { hex: '#FFF44F', label: 'Amarillo Limón' },
  'lemon yellow': { hex: '#FFF44F', label: 'Amarillo Limón' },
  'champagne': { hex: '#F7E7CE', label: 'Champagne' },
  'champaña': { hex: '#F7E7CE', label: 'Champaña' },
  
  // ===== NARANJAS =====
  'naranja': { hex: '#F97316', label: 'Naranja' },
  'orange': { hex: '#F97316', label: 'Naranja' },
  'coral': { hex: '#FF7F50', label: 'Coral' },
  'durazno': { hex: '#FFE5B4', label: 'Durazno' },
  'peach': { hex: '#FFE5B4', label: 'Durazno' },
  
  // ===== MARRONES / BEIGES =====
  'marron': { hex: '#8B4513', label: 'Marrón' },
  'brown': { hex: '#8B4513', label: 'Marrón' },
  'café': { hex: '#6F4E37', label: 'Café' },
  'coffee': { hex: '#6F4E37', label: 'Café' },
  'beige': { hex: '#F5F5DC', label: 'Beige' },
  'arena': { hex: '#C2B280', label: 'Arena' },
  'sand': { hex: '#C2B280', label: 'Arena' },
  'bronce': { hex: '#CD7F32', label: 'Bronce' },
  'bronze': { hex: '#CD7F32', label: 'Bronce' },
  'cobre': { hex: '#B87333', label: 'Cobre' },
  'copper': { hex: '#B87333', label: 'Cobre' },
  
  // ===== ESPECIALES / OTROS =====
  'transparente': { hex: '#F9FAFB', label: 'Transparente' },
  'transparent': { hex: '#F9FAFB', label: 'Transparente' },
  'cristal': { hex: '#E5E7EB', label: 'Cristal' },
  'clear': { hex: '#E5E7EB', label: 'Cristal' },
  'no aplica': { hex: '#F3F4F6', label: 'Estándar' },
  'n/a': { hex: '#F3F4F6', label: 'Estándar' },
  'sin color': { hex: '#F3F4F6', label: 'Estándar' },
  'default': { hex: '#F3F4F6', label: 'Estándar' },
  'multicolor': { hex: '#A855F7', label: 'Multicolor' },
  'multi': { hex: '#A855F7', label: 'Multicolor' },
  
  // ===== COLORES SAMSUNG ESPECÍFICOS =====
  'phantom violet': { hex: '#8B5CF6', label: 'Violeta Phantom' },
  'violeta phantom': { hex: '#8B5CF6', label: 'Violeta Phantom' },
  'burgundy red': { hex: '#800020', label: 'Rojo Borgoña' },
  'bora purple': { hex: '#9333EA', label: 'Púrpura Bora' },
  'purpura bora': { hex: '#9333EA', label: 'Púrpura Bora' },
  'awesome black': { hex: '#000000', label: 'Negro Awesome' },
  'awesome white': { hex: '#FFFFFF', label: 'Blanco Awesome' },
  'awesome blue': { hex: '#1E40AF', label: 'Azul Awesome' },
  'awesome violet': { hex: '#8B5CF6', label: 'Violeta Awesome' },
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

  // Crear highlights desde desDetallada (tomar las primeras 3 líneas)
  const highlights: string[] = apiProduct.desDetallada
    ? apiProduct.desDetallada
        .filter((desc) => desc && desc.trim() !== '')
        .slice(0, 3)
        .map((desc) => desc.trim().replace(/^-\s*/, '')) // Eliminar guiones iniciales
    : [];

  const id = apiProduct.codigoMarketBase;


  return {
    id,
    name: apiProduct.nombreMarket,
    image,
    colors,
    capacities: capacities.length > 0 ? capacities : undefined,
    price,
    originalPrice,
    isNew,
    rating: 4.8, // Valor por defecto hasta que tengamos reviews reales
    reviewCount: Math.floor(Math.random() * 500) + 50, // Valor temporal
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
  apiProduct.color.forEach((color, index) => {
    const precioNormal = apiProduct.precioNormal[index] || 0;
    const precioDescto = apiProduct.precioDescto[index] || 0;

    // Solo incluir colores con precios válidos (mayores a 0 y menores al máximo)
    if ((precioNormal > 0 && precioNormal < MAX_PRICE) || (precioDescto > 0 && precioDescto < MAX_PRICE)) {
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
      colorData.preciosDescuento.push(precioDescto);
      colorData.indices.push(index);
    }
  });
  
  // Convertir el mapa a array de ProductColor
  colorPriceMap.forEach(({ color, preciosNormales, preciosDescuento, indices }) => {
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
    
    colorsWithPrices.push({
      name: normalizedColor.replace(/\s+/g, '-'),
      hex: colorInfo.hex,
      label: colorInfo.label,
      price,
      originalPrice,
      discount,
      sku: apiProduct.sku[firstIndex]
    });
  });
  
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
    const precioDescto = apiProduct.precioDescto[index] || 0;

    // Solo incluir capacidades con precios válidos (mayores a 0 y menores al máximo)
    if (((precioNormal > 0 && precioNormal < MAX_PRICE) || (precioDescto > 0 && precioDescto < MAX_PRICE))
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
      capacityData.preciosDescuento.push(precioDescto);
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
      sku: apiProduct.sku[firstIndex]
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
  const preciosDescuentoValidos = apiProduct.precioDescto.filter(p => p > 0 && p < MAX_PRICE);
  
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
  
  // Formatear precios a formato colombiano - asegurar números enteros
  const formatPrice = (price: number) => {
    if (!price || isNaN(price) || price <= 0) return "Precio no disponible";
    return `$ ${Math.round(price).toLocaleString('es-CO')}`;
  };

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
