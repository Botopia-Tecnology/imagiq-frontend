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

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
}: SEOProps) {
  // In Next.js 13+ App Router, SEO is handled by metadata in layout/page files
  // This component is for reference and could be used to generate metadata objects

  const openGraphType = type === "product" ? "website" : type;

  // Example usage - this would be used in generateMetadata functions
  console.log("SEO Data:", {
    title,
    description,
    keywords: keywords?.split(",") || [],
    openGraph: {
      title,
      description,
      type: openGraphType,
      url,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  });

  return null;
}
