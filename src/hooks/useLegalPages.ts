/**
 * Hook para obtener las páginas legales dinámicamente desde el backend
 * Similar a useVisibleCategories pero para documentos legales
 */

import { useState, useEffect, useCallback } from "react";
import { apiGet } from "@/lib/api-client";

interface LegalPage {
  id: string;
  slug: string;
  title: string;
  status: string;
  is_active: boolean;
  external_url?: string | null;
}

interface LegalPagesResponse {
  data: LegalPage[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export function useLegalPages() {
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLegalPages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener solo páginas legales publicadas
        const response = await apiGet<LegalPagesResponse>(
          "/api/multimedia/pages/legal?status=published&limit=50"
        );

        // Filtrar solo las activas y publicadas
        const activeLegalPages = (response?.data || []).filter(
          (page) => page.is_active && page.status === "published"
        );

        setLegalPages(activeLegalPages);
      } catch (err) {
        console.error("Error fetching legal pages:", err);
        setError("Error al cargar páginas legales");
        setLegalPages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLegalPages();
  }, []);

  /**
   * Convierte las páginas legales a formato de links para el footer
   * Si la página tiene external_url, se usa esa URL y se marca como externa
   */
  const getFooterLinks = useCallback(() => {
    return legalPages.map((page) => {
      const externalUrl = page.external_url?.trim() || '';
      const hasExternalUrl = externalUrl.length > 0;
      return {
        name: page.title,
        href: hasExternalUrl ? externalUrl : `/soporte/${page.slug}`,
        external: hasExternalUrl,
      };
    });
  }, [legalPages]);

  return {
    legalPages,
    loading,
    error,
    getFooterLinks,
  };
}
