/**
 * Type definitions for home page configuration
 * These types will be used for both mocked data and future API responses
 */

/**
 * Hero section configuration
 */
export interface HeroConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  videoSrc: string;
  videoSrcMobile: string;
  posterSrc: string;
  posterSrcMobile: string;
  bgColor: string;
  showContentOnEnd: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}

/**
 * Banner section configuration
 */
export interface BannerConfig {
  id: string;
  type: 'galaxy-showcase' | 'ai-tvs' | 'bespoke-ai' | 'custom';
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  imageUrlMobile?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  enabled: boolean;
  order: number;
}

/**
 * Product grid section configuration
 */
export interface ProductGridConfig {
  id: string;
  type: 'tv' | 'appliances' | 'mobile' | 'custom';
  title: string;
  subtitle?: string;
  categorySlug?: string;
  sectionSlug?: string;
  maxProducts?: number;
  enabled: boolean;
  order: number;
}

/**
 * Section types that can be rendered on home page
 */
export type HomeSectionType =
  | 'hero'
  | 'banner'
  | 'product-grid'
  | 'stories'
  | 'reviews'
  | 'locations'
  | 'cta'
  | 'product-showcase';

/**
 * Generic home section configuration
 */
export interface HomeSectionConfig {
  id: string;
  type: HomeSectionType;
  enabled: boolean;
  order: number;
  config: HeroConfig | BannerConfig | ProductGridConfig | Record<string, unknown>;
}

/**
 * Complete home page configuration
 */
export interface HomePageConfig {
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  sections: HomeSectionConfig[];
}

/**
 * Configuration for fallback/end state after video
 */
export interface VideoEndConfig {
  showImage: boolean;
  showContent: boolean;
  fadeTransitionMs: number;
}
