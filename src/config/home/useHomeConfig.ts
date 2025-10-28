/**
 * Hook to load Hero configuration
 * Currently uses mocked data, but prepared for future API integration
 */

import { useState, useEffect } from 'react';
import type { HeroConfig } from './types';
import { HERO_CONFIG } from './data';

/**
 * Hook to get hero section configuration
 *
 * Para integrar con API en el futuro:
 * 1. Crear endpoint: GET /api/home/hero-config
 * 2. Descomentar la función fetchHeroConfig() abajo
 * 3. Llamar fetchHeroConfig() en lugar de loadMockedHeroConfig()
 *
 * @returns Hero configuration object
 */
export function useHeroConfig() {
  const [config, setConfig] = useState<HeroConfig>(HERO_CONFIG);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMockedHeroConfig();
  }, []);

  const loadMockedHeroConfig = () => {
    setLoading(true);
    setTimeout(() => {
      setConfig(HERO_CONFIG);
      setLoading(false);
    }, 0);
  };

  // Función preparada para integración con dashboard
  // const fetchHeroConfig = async () => {
  //   setLoading(true);
  //
  //   try {
  //     const response = await fetch('/api/home/hero-config');
  //     if (!response.ok) throw new Error('Failed to fetch hero config');
  //
  //     const data = await response.json();
  //     setConfig(data);
  //   } catch (err) {
  //     console.error('Error loading hero config:', err);
  //     // Fallback a datos mockeados si falla
  //     setConfig(HERO_CONFIG);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    config,
    loading,
  };
}
