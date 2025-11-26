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
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Llamar al endpoint de manera asíncrona
  const pageData = await getActivePageBySlug(slug);

  // Si no existe, mostrar 404
  if (!pageData) {
    notFound();
  }

  console.log(`✅ Página cargada: ${pageData.page.title}`);
  console.log(`📦 Banners: ${pageData.banners.length}`);
  console.log(`❓ FAQs: ${pageData.faqs.length}`);

  return <MultimediaPageClient pageData={pageData} />;
}
