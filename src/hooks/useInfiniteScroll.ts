import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  /** Función a ejecutar cuando se llegue al final del scroll */
  onLoadMore: () => void | Promise<void>;
  /** Si hay más contenido para cargar */
  hasMore: boolean;
  /** Si está cargando actualmente */
  isLoading: boolean;
  /** Distancia en píxeles desde el final para disparar la carga (default: 100) */
  threshold?: number;
}

/**
 * Hook para implementar scroll infinito
 * Detecta cuando el usuario está cerca del final de la página y ejecuta onLoadMore
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 100,
}: UseInfiniteScrollOptions) {
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const option = {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0,
    };

    observer.current = new IntersectionObserver(handleObserver, option);
    observer.current.observe(element);

    return () => {
      if (observer.current && element) {
        observer.current.unobserve(element);
      }
    };
  }, [handleObserver, threshold]);

  return loadMoreRef;
}
