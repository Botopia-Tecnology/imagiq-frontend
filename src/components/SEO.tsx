"use client"
/**
 * Componente SEO
 * - Meta tags dinámicos
 * - Open Graph para redes sociales
 * - Twitter Cards
 * - JSON-LD structured data
 * - Canonical URLs
 * - Tracking de métricas SEO con PostHog
 */

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
}

export default function SEO(_props: SEOProps) {
  // In Next.js 13+ App Router, SEO is handled by metadata in layout/page files
  // This component is for reference and could be used to generate metadata objects
  // SEO metadata is handled by Next.js 13+ generateMetadata function

  return null;
}
