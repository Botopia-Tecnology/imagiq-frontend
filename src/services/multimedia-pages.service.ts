/**
 * Servicio para páginas multimedia dinámicas
 */

import { apiGet } from "@/lib/api-client";

export interface ProductSection {
  id: string;
  name: string;
  order: number;
  product_card_ids: string[];
}

export interface ProductCardData {
  id: string;
  page_id: string;
  image_url: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cta_text: string | null;
  cta_url: string | null;
  url: string | null;
  content_position: string | null;
  text_styles: Record<string, unknown> | null;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Estructura del contenido de Tiptap
export interface TiptapContent {
  type: 'doc';
  content: TiptapNode[];
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

// Secciones para navegación lateral en documentos legales
export interface LegalSection {
  id: string;
  title: string;
  level: number;
}

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
  sections: ProductSection[];
  info_sections: unknown[];
  products_section_title: string | null;
  products_section_description: string | null;
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
  // Campos para documentos legales
  page_type?: 'landing' | 'legal' | 'promo';
  legal_content?: TiptapContent | null;
  legal_sections?: LegalSection[];
  last_updated_legal?: string | null;
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
  // LEGACY: Campos del sistema antiguo (mantener para compatibilidad)
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
  title_boxes: string | null;
  description_boxes: string | null;
  cta_boxes: string | null;
  // SISTEMA ACTUAL: ContentBlocks unificado
  content_blocks: string | null;
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
  product_cards: ProductCardData[];
}

/**
 * Obtiene una página multimedia activa por slug
 */
export async function getActivePageBySlug(slug: string): Promise<MultimediaPageData | null> {
  try {
    const response = await apiGet<MultimediaPageData>(
      `/api/multimedia/pages/slug/${slug}`
    );
    
    // Parsear posiciones y text_styles si vienen como strings JSON
    if (response?.banners) {
      response.banners = response.banners.map(banner => ({
        ...banner,
        position_desktop: typeof banner.position_desktop === 'string' 
          ? JSON.parse(banner.position_desktop) 
          : banner.position_desktop,
        position_mobile: typeof banner.position_mobile === 'string' 
          ? JSON.parse(banner.position_mobile) 
          : banner.position_mobile,
        text_styles: typeof banner.text_styles === 'string'
          ? JSON.parse(banner.text_styles)
          : banner.text_styles,
      }));
    }
    
    return response;
  } catch (error) {
    console.error(`Error fetching active page with slug "${slug}":`, error);
    return null;
  }
}
