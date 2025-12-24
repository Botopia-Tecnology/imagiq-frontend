import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getActivePageBySlug, type MultimediaPage, type LegalSection } from '@/services/multimedia-pages.service';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';
import { TiptapRenderer, extractSectionsFromContent } from '@/components/legal/TiptapRenderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generar metadata dinámica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getActivePageBySlug(slug);

  if (!data?.page) {
    return {
      title: 'Documento no encontrado - IMAGIQ',
    };
  }

  const { page } = data;

  return {
    title: page.meta_title || `${page.title} - IMAGIQ`,
    description: page.meta_description || `${page.title} - Términos y condiciones de IMAGIQ`,
    keywords: page.meta_keywords || undefined,
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description || '',
      images: page.og_image ? [page.og_image] : undefined,
    },
    robots: 'index, follow',
  };
}

export default async function LegalDocumentPage({ params }: PageProps) {
  const { slug } = await params;

  // Obtener datos de la página
  const data = await getActivePageBySlug(slug);

  // Si no existe o no es una página legal, mostrar 404
  if (!data?.page) {
    notFound();
  }

  const { page } = data;

  // Si no es una página de tipo legal, mostrar 404
  // (las páginas de tipo 'landing' se manejan en otra ruta)
  if (page.page_type !== 'legal') {
    notFound();
  }

  // Extraer secciones del contenido para el sidebar
  const sections: LegalSection[] = page.legal_sections?.length
    ? page.legal_sections
    : extractSectionsFromContent(page.legal_content || null);

  // Mapear secciones al formato esperado por LegalDocumentLayout
  const mappedSections = sections.map((s) => ({
    id: s.id,
    title: s.title,
    level: s.level,
  }));

  // Formatear fecha de última actualización
  const lastUpdated = page.last_updated_legal || page.updated_at;
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined;

  return (
    <LegalDocumentLayout
      title={page.title}
      sections={mappedSections}
      documentType="Términos y Condiciones"
      lastUpdated={formattedDate}
    >
      <TiptapRenderer content={page.legal_content || null} />
    </LegalDocumentLayout>
  );
}

// Revalidar cada hora
export const revalidate = 3600;
