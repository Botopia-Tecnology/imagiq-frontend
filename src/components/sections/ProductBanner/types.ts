/**
 * Types for ProductBanner - Reusable Banner Component
 */

export interface BannerImages {
  desktop: string;
  mobile: string;
}

export interface BannerContent {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref: string;
  ariaLabel: string;
}

export interface BannerConfig {
  images: BannerImages;
  content: BannerContent;
  theme?: "light" | "dark";
  textAlignment?: "left" | "center" | "right";
  trackingEvent?: string;
}
