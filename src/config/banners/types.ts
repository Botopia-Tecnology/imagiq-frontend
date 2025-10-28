/**
 * Type definitions for promotional banners
 */

export interface BannerConfig {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  imageUrlMobile?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  enabled: boolean;
  height?: string;
  heightMobile?: string;
}

export type BannerPosition = 'above-products' | 'below-title' | 'below-products';
