/**
 * Página dinámica para contenido multimedia
 * Ruta: /[slug]
 */

import { notFound } from 'next/navigation';
import { getActivePageBySlug } from '@/services/multimedia-pages.service';
import MultimediaPageClient from './components/MultimediaPageClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { mode } = await searchParams;

  // Si es modo preview (query param ?mode=preview), retornamos datos vacíos iniciales
  // El cliente se encargará de hidratar esto via postMessage
  if (mode === 'preview') {
    const emptyData = {
      page: { title: 'Cargando Vista Previa...', slug: slug, status: 'preview', is_active: true, is_public: false, valid_from: '', valid_until: '', banner_ids: [], faq_ids: [], sections: [], info_sections: [], products_section_title: '', products_section_description: '', meta_title: '', meta_description: '', meta_keywords: null, og_image: null, category: 'preview', subcategory: null, tags: null, view_count: 0, created_at: '', updated_at: '', created_by: '' },
      banners: [],
      faqs: [],
      product_cards: []
    } as any;

    return <MultimediaPageClient pageData={emptyData} />;
  }

  // Llamar al endpoint de manera asíncrona
  const pageData = await getActivePageBySlug(slug);

  // Si no existe, mostrar 404
  if (!pageData) {
    notFound();
  }

  return <MultimediaPageClient pageData={pageData} />;
}
