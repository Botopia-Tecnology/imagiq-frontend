/**
 * Hook reutilizable para integrar imágenes de Cloudinary con Next.js Image
 * Proporciona URLs optimizadas y props listas para usar con componentes de imagen
 */

"use client";

import { useMemo } from "react";
import {
  getCloudinaryUrl,
  getResponsiveSrcSet,
  IMAGE_DIMENSIONS,
  type ImageTransformType,
} from "@/lib/cloudinary";

interface UseCloudinaryImageOptions {
  /**
   * URL de la imagen original (puede ser Cloudinary o externa)
   */
  src: string | undefined | null;

  /**
   * Tipo de transformación a aplicar
   */
  transformType: ImageTransformType;

  /**
   * Si se debe generar srcset para imágenes responsive
   * @default true
   */
  responsive?: boolean;
}

interface CloudinaryImageResult {
  /**
   * URL optimizada de Cloudinary
   */
  src: string;

  /**
   * Srcset para imágenes responsive (1x, 1.5x, 2x)
   */
  srcSet?: string;

  /**
   * Ancho de la imagen en píxeles
   */
  width: number;

  /**
   * Alto de la imagen en píxeles
   */
  height: number;

  /**
   * Props listos para pasar a Next.js Image component
   */
  imageProps: {
    src: string;
    width: number;
    height: number;
    sizes?: string;
  };

  /**
   * Si la imagen es válida (no es placeholder)
   */
  isValid: boolean;
}

/**
 * Hook para obtener URLs optimizadas de Cloudinary con las transformaciones correctas
 *
 * @example
 * ```tsx
 * const { src, width, height, imageProps } = useCloudinaryImage({
 *   src: product.image,
 *   transformType: 'catalog'
 * });
 *
 * return <Image {...imageProps} alt="Product" />;
 * ```
 */
export function useCloudinaryImage({
  src,
  transformType,
  responsive = true,
}: UseCloudinaryImageOptions): CloudinaryImageResult {
  const optimizedUrl = useMemo(
    () => getCloudinaryUrl(src, transformType),
    [src, transformType]
  );

  const srcSet = useMemo(
    () => (responsive ? getResponsiveSrcSet(src, transformType) : undefined),
    [src, transformType, responsive]
  );

  const dimensions = useMemo(
    () => IMAGE_DIMENSIONS[transformType],
    [transformType]
  );

  const isValid = useMemo(
    () => !optimizedUrl.startsWith("/placeholder"),
    [optimizedUrl]
  );

  // Generar sizes según el tipo de transformación para optimización
  const sizes = useMemo(() => {
    if (!responsive) return undefined;

    switch (transformType) {
      case "catalog":
        return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px";
      case "product-main":
        return "(max-width: 768px) 100vw, 800px";
      case "product-detail":
        return "(max-width: 768px) 100vw, 1000px";
      case "thumbnail":
        return "150px";
      case "comparison":
        return "(max-width: 640px) 50vw, 300px";
      case "hero":
        return "100vw";
      default:
        return undefined;
    }
  }, [transformType, responsive]);

  return {
    src: optimizedUrl,
    srcSet,
    width: dimensions.width,
    height: dimensions.height,
    imageProps: {
      src: optimizedUrl,
      width: dimensions.width,
      height: dimensions.height,
      sizes,
    },
    isValid,
  };
}

/**
 * Hook simplificado para obtener solo la URL optimizada
 * Útil cuando solo necesitas la URL y no las dimensiones
 */
export function useCloudinaryUrl(
  src: string | undefined | null,
  transformType: ImageTransformType = "original"
): string {
  return useMemo(() => getCloudinaryUrl(src, transformType), [src, transformType]);
}

export type { UseCloudinaryImageOptions, CloudinaryImageResult };
