/**
 * FlixmediaPreload Component
 *
 * Precarga el script de Flixmedia en el <head> para mejorar la velocidad de carga.
 * Se debe colocar en el layout principal o en páginas donde se use FlixmediaPlayer.
 */

"use client";

import { useEffect } from "react";

export default function FlixmediaPreload() {
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    // Verificar si ya existe el preload
    const existingPreload = document.querySelector('link[href*="flixfacts.com/js/loader.js"]');
    if (existingPreload) {
      console.log('⚡ Flixmedia script ya está precargado');
      return;
    }

    // Crear link preload para el script de Flixmedia
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = 'https://media.flixfacts.com/js/loader.js';
    preloadLink.as = 'script';
    preloadLink.crossOrigin = 'anonymous';

    // Agregar al head
    document.head.appendChild(preloadLink);
    console.log('⚡ Flixmedia script precargado');

    // Cleanup al desmontar (opcional, normalmente queremos mantenerlo)
    return () => {
      // No remover el preload para mantener la optimización
    };
  }, []);

  // Este componente no renderiza nada visible
  return null;
}
