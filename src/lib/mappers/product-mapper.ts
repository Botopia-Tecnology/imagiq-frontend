/**
 * Mapper para convertir datos de API a formato de Frontend
 */

import type { ProductOrBundle, ProductGrouped, ProductBundle } from "../types/api-types";
import type { ProductCardProps, ProductColor, ProductCapacity } from "@/app/productos/components/ProductCard";
import type { ProductApiData } from "@/lib/api";

/**
 * Mapea un ProductGrouped de la API a ProductCardProps para el frontend
 */
function mapProductGroupedToCard(product: ProductGrouped): ProductCardProps {
  // Extraer primer elemento de cada array (representa la variante principal)
  const mainName = Array.isArray(product.nombreMarket) ? product.nombreMarket[0] : product.nombreMarket;
  const mainImage = Array.isArray(product.imagePreviewUrl) ? product.imagePreviewUrl[0] : product.imagePreviewUrl;
  const mainPrice = Array.isArray(product.precioeccommerce) ? product.precioeccommerce[0] : product.precioeccommerce;
  const mainOriginalPrice = Array.isArray(product.precioNormal) ? product.precioNormal[0] : product.precioNormal;
  const mainSegmento = Array.isArray(product.segmento) ? product.segmento[0] : product.segmento;
  const mainSku = Array.isArray(product.sku) ? product.sku[0] : product.sku;
  const mainIndRetoma = Array.isArray(product.indRetoma) ? product.indRetoma[0] : product.indRetoma;
  const mainDesDetallada = Array.isArray(product.desDetallada) ? product.desDetallada[0] : product.desDetallada;

  // Calcular descuento
  const discount = mainOriginalPrice && mainPrice
    ? Math.round(((mainOriginalPrice - mainPrice) / mainOriginalPrice) * 100)
    : 0;

  // Construir colores
  const colors: ProductColor[] = [];
  const colorNames = Array.isArray(product.nombreColor) ? product.nombreColor : [product.nombreColor || ""];
  const colorHexes = Array.isArray(product.color) ? product.color : [product.color || "#000000"];
  const skus = Array.isArray(product.sku) ? product.sku : [product.sku || ""];
  const eans = Array.isArray(product.ean) ? product.ean : [product.ean || ""];
  const prices = Array.isArray(product.precioeccommerce) ? product.precioeccommerce : [product.precioeccommerce || 0];
  const originalPrices = Array.isArray(product.precioNormal) ? product.precioNormal : [product.precioNormal || 0];
  const images = Array.isArray(product.imagePreviewUrl) ? product.imagePreviewUrl : [product.imagePreviewUrl || ""];
  const capacities = Array.isArray(product.capacidad) ? product.capacidad : [product.capacidad || ""];
  const imagenesPremium = Array.isArray(product.imagenPremium) ? product.imagenPremium : [product.imagenPremium || []];
  const videosPremium = Array.isArray(product.videoPremium) ? product.videoPremium : [product.videoPremium || []];

  for (let i = 0; i < colorNames.length; i++) {
    const colorName = colorNames[i] || "";
    const colorHex = colorHexes[i] || "#000000";

    colors.push({
      name: colorName.toLowerCase().replace(/\s+/g, "-"),
      hex: colorHex,
      label: colorName,
      nombreColorDisplay: colorName,
      sku: skus[i] || "",
      ean: eans[i] || "",
      price: prices[i]?.toString() || "",
      originalPrice: originalPrices[i]?.toString() || "",
      discount: originalPrices[i] && prices[i]
        ? Math.round(((originalPrices[i] - prices[i]) / originalPrices[i]) * 100).toString()
        : "0",
      capacity: capacities[i] || "",
      imagePreviewUrl: images[i] || "",
      imagen_premium: Array.isArray(imagenesPremium[i]) ? imagenesPremium[i] : [],
      video_premium: Array.isArray(videosPremium[i]) ? videosPremium[i] : [],
    });
  }

  // Construir capacidades únicas
  const uniqueCapacities = new Set<string>();
  const capacitiesArray: ProductCapacity[] = [];

  for (let i = 0; i < capacities.length; i++) {
    const cap = capacities[i];
    if (cap && !uniqueCapacities.has(cap)) {
      uniqueCapacities.add(cap);
      capacitiesArray.push({
        value: cap,
        label: cap,
        price: prices[i]?.toString() || "",
        originalPrice: originalPrices[i]?.toString() || "",
        discount: originalPrices[i] && prices[i]
          ? Math.round(((originalPrices[i] - prices[i]) / originalPrices[i]) * 100).toString()
          : "0",
        sku: skus[i] || "",
        ean: eans[i] || "",
      });
    }
  }

  // Construir apiProduct para compatibilidad con sistema existente
  const apiProduct: ProductApiData = {
    codigoMarketBase: product.codigoMarketBase,
    codigoMarket: product.codigoMarket,
    nombreMarket: product.nombreMarket,
    modelo: product.modelo,
    descGeneral: product.descGeneral,
    categoria: product.categoria || "",
    subcategoria: product.subcategoria || "",
    color: product.color,
    nombreColor: product.nombreColor,
    capacidad: product.capacidad,
    sku: product.sku,
    ean: product.ean,
    desDetallada: product.desDetallada,
    urlImagenes: product.urlImagenes,
    urlRender3D: product.urlRender3D,
    precioNormal: product.precioNormal,
    precioeccommerce: product.precioeccommerce,
    imagePreviewUrl: product.imagePreviewUrl,
    imageDetailsUrls: product.imageDetailsUrls || [],
    imagenPremium: product.imagenPremium,
    videoPremium: product.videoPremium,
    stockTotal: product.stockTotal,
    cantidadTiendas: product.cantidadTiendas,
    cantidadTiendasReserva: product.cantidadTiendasReserva,
    segmento: product.segmento,
    memoriaram: product.memoriaram,
    indRetoma: product.indRetoma,
    indcerointeres: product.indcerointeres,
    skuPostback: product.skuPostback,
    ancho: product.ancho,
    alto: product.alto,
    largo: product.largo,
    peso: product.peso,
    fechaInicioVigencia: [], // No disponible en ProductGrouped
    fechaFinalVigencia: [], // No disponible en ProductGrouped
  };

  return {
    id: product.codigoMarketBase,
    name: mainName || "Producto Samsung",
    image: mainImage || "",
    colors,
    capacities: capacitiesArray.length > 0 ? capacitiesArray : undefined,
    price: mainPrice?.toString() || "0",
    originalPrice: mainOriginalPrice?.toString() || "0",
    discount: discount > 0 ? discount.toString() : undefined,
    segmento: mainSegmento,
    apiProduct,
    acceptsTradeIn: mainIndRetoma === 1,
    desDetallada: mainDesDetallada,
    skuflixmedia: mainSku,
  };
}

/**
 * Mapea un ProductBundle de la API a ProductCardProps para el frontend
 */
function mapProductBundleToCard(bundle: ProductBundle): ProductCardProps {
  // Para bundles, usar la primera opción como representación principal
  const mainOption = bundle.opciones[0];

  if (!mainOption) {
    throw new Error(`Bundle ${bundle.baseCodigoMarket} no tiene opciones`);
  }

  // Construir colores básicos desde las opciones del bundle
  const colors: ProductColor[] = bundle.opciones.map((option, index) => ({
    name: option.nombreColorProductSku?.toLowerCase().replace(/\s+/g, "-") || `option-${index}`,
    hex: option.colorProductSku || "#000000",
    label: option.nombreColorProductSku || "Color",
    nombreColorDisplay: option.nombreColorProductSku,
    sku: option.product_sku,
    ean: "", // Bundles no tienen EAN individual
    price: option.bundle_price?.toString() || "",
    originalPrice: option.bundle_price && option.bundle_discount
      ? (option.bundle_price + option.bundle_discount).toString()
      : "",
    discount: option.bundle_discount?.toString() || "0",
    capacity: option.capacidadProductSku || "",
    imagePreviewUrl: Array.isArray(option.imagePreviewUrl) ? option.imagePreviewUrl[0] : "",
  }));

  const mainImage = Array.isArray(mainOption.imagePreviewUrl)
    ? mainOption.imagePreviewUrl[0]
    : "";
  const mainPrice = mainOption.bundle_price || 0;
  const mainDiscount = mainOption.bundle_discount || 0;
  const mainOriginalPrice = mainPrice + mainDiscount;

  return {
    id: bundle.baseCodigoMarket,
    name: `Bundle ${mainOption.modelo}`,
    image: mainImage,
    colors,
    price: mainPrice.toString(),
    originalPrice: mainOriginalPrice > 0 ? mainOriginalPrice.toString() : undefined,
    discount: mainDiscount > 0 ? Math.round((mainDiscount / mainOriginalPrice) * 100).toString() : undefined,
    segmento: "bundle",
  };
}

/**
 * Mapea un ProductOrBundle (union type) a ProductCardProps
 */
export function mapApiProductToFrontend(product: ProductOrBundle): ProductCardProps {
  if ("isBundle" in product && product.isBundle) {
    return mapProductBundleToCard(product as ProductBundle);
  } else {
    return mapProductGroupedToCard(product as ProductGrouped);
  }
}

/**
 * Mapea un array de productos/bundles de la API a ProductCardProps[]
 */
export function mapApiProductsToFrontend(products: ProductOrBundle[]): ProductCardProps[] {
  return products.map(mapApiProductToFrontend);
}
