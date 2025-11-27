/**
 * Hook para obtener las ofertas destacadas desde el endpoint directo
 * Consume el endpoint /api/products/ofertas-destacadas/direct
 * Este endpoint ya devuelve los datos enriquecidos con información del producto
 * 
 * CACHE PERSISTENTE: Los datos se mantienen en memoria entre montajes del componente
 * para evitar mostrar el skeleton loader cuando se reabre el dropdown
 */

import { useState, useEffect } from "react";

export interface OfertaDirecta {
    uuid: string;
    codigo_market: string;
    nombre: string;
    orden: number;
    activo: boolean;
    created_at: string;
    updated_at: string;
    producto: {
        codigoMarket: string;
        nombreMarket: string;
        imagen: string;
        categoria: string;
        menu: string;
        sku: string;
    };
}

interface UseOfertasDirectasReturn {
    ofertas: OfertaDirecta[];
    loading: boolean;
    error: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Cache persistente fuera del componente para mantener datos entre montajes
let cachedOfertas: OfertaDirecta[] | null = null;
let isFetching = false;
let fetchPromise: Promise<void> | null = null;

export function useOfertasDirectas(): UseOfertasDirectasReturn {
    // Si ya hay datos en caché, iniciar sin loading
    const [ofertas, setOfertas] = useState<OfertaDirecta[]>(cachedOfertas || []);
    const [loading, setLoading] = useState(!cachedOfertas);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchOfertasDirectas = async () => {
            // Si ya hay datos en caché, no mostrar loading
            if (cachedOfertas) {
                return;
            }

            // Si ya se está haciendo fetch, esperar a que termine
            if (isFetching && fetchPromise) {
                await fetchPromise;
                if (isMounted && cachedOfertas) {
                    setOfertas(cachedOfertas);
                    setLoading(false);
                }
                return;
            }

            try {
                isFetching = true;
                setLoading(true);
                setError(null);

                console.log('[Ofertas Directas] Fetching from direct endpoint...');

                fetchPromise = (async () => {
                    const response = await fetch(
                        `${API_BASE_URL}/api/products/ofertas-destacadas/direct`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Error al cargar ofertas destacadas");
                    }

                    const data = await response.json();
                    console.log('[Ofertas Directas] Response:', data);

                    // El endpoint devuelve { success: true, data: [...] }
                    const ofertasData = data.success && Array.isArray(data.data)
                        ? data.data as OfertaDirecta[]
                        : [];

                    // Filtrar solo ofertas activas y ordenar
                    const ofertasActivas = ofertasData
                        .filter((oferta) => oferta.activo)
                        .sort((a, b) => a.orden - b.orden);

                    console.log(`[Ofertas Directas] ${ofertasActivas.length} ofertas activas cargadas y cacheadas`);

                    // Guardar en caché persistente
                    cachedOfertas = ofertasActivas;

                    if (isMounted) {
                        setOfertas(ofertasActivas);
                    }
                })();

                await fetchPromise;
            } catch (err) {
                if (!isMounted) return;
                console.error("Error fetching ofertas directas:", err);
                setError("Error al cargar ofertas destacadas");
                setOfertas([]);
            } finally {
                isFetching = false;
                fetchPromise = null;
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchOfertasDirectas();

        return () => {
            isMounted = false;
        };
    }, []);

    return { ofertas, loading, error };
}
