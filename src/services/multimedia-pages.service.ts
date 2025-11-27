/**
 * Servicio para páginas multimedia dinámicas
 */

import { apiGet } from "@/lib/api-client";

export interface MultimediaPage {
  id: string;
  slug: string;
  title: string;
  status: string;
  is_active: boolean;
  is_public: boolean;
  valid_from: string;
  valid_until: string;
  banner_ids: string[];
  faq_ids: string[];
  sections: unknown[];
  info_sections: unknown[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string | null;
  og_image: string | null;
  category: string;
  subcategory: string | null;
  tags: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface MultimediaPageBanner {
  id: string;
  name: string;
  placement: string;
  desktop_image_url: string | null;
  desktop_video_url: string | null;
  mobile_image_url: string | null;
  mobile_video_url: string | null;
  link_url: string;
  status: string;
  description: string;
  cta: string;
  title: string;
  color_font: string;
  coordinates: string;
  coordinates_mobile: string;
  position_desktop: {
    x: number;
    y: number;
  };
  position_mobile: {
    x: number;
    y: number;
  };
  text_styles: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface MultimediaPageFAQ {
  id: string;
  pregunta: string;
  respuesta: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface MultimediaPageData {
  page: MultimediaPage;
  banners: MultimediaPageBanner[];
  faqs: MultimediaPageFAQ[];
}

/**
 * Obtiene una página multimedia activa por slug
 */
export async function getActivePageBySlug(slug: string): Promise<MultimediaPageData | null> {
  try {
    const response = await apiGet<MultimediaPageData>(
      `/api/multimedia/pages/slug/${slug}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching active page with slug "${slug}":`, error);
    return null;
  }
}
