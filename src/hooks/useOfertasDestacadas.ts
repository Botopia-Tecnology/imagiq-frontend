import { useState, useEffect } from 'react';

interface ProductoDestacado {
  uuid: string;
  producto_id: string;
  producto_nombre: string;
  producto_imagen: string | null;
  link_url: string | null;
  orden: number;
}

interface UseOfertasDestacadasReturn {
  productos: ProductoDestacado[];
  loading: boolean;
  error: Error | null;
}

export function useOfertasDestacadas(): UseOfertasDestacadasReturn {
  const [productos, setProductos] = useState<ProductoDestacado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchOfertas() {
      try {
        setLoading(true);
        const response = await fetch('/api/multimedia/ofertas-destacadas/active');

        if (!response.ok) {
          throw new Error('Error al obtener ofertas destacadas');
        }

        const data = await response.json();
        setProductos(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido'));
      } finally {
        setLoading(false);
      }
    }

    fetchOfertas();
  }, []);

  return { productos, loading, error };
}
