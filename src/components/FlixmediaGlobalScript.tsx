/**
 * FlixmediaGlobalScript Component
 * 
 * Carga el script de Flixmedia UNA SOLA VEZ de forma global al inicio de la aplicación.
 * Esto hace que el script ya esté disponible cuando los componentes lo necesiten,
 * eliminando el tiempo de carga y mejorando significativamente la velocidad.
 * 
 * Según la documentación de Flixmedia, el script puede ser cargado globalmente
 * y luego los componentes simplemente usan los atributos data-flix-* para
 * renderizar el contenido específico.
 */

"use client";

import { useEffect } from 'react';

export default function FlixmediaGlobalScript() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Verificar si el script ya fue agregado
    if (document.querySelector('script[src*="media.flixfacts.com/js/loader.js"]')) {
      console.log('🎯 [FLIXMEDIA GLOBAL] Script ya cargado');
      return;
    }

    const startTime = performance.now();
    console.log('⚡ [FLIXMEDIA GLOBAL] Iniciando carga del script global...');

    // Crear el script global de Flixmedia
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = '//media.flixfacts.com/js/loader.js';
    script.id = 'flixmedia-global-loader';

    script.onload = () => {
      const loadTime = performance.now() - startTime;
      console.log(`✅ [FLIXMEDIA GLOBAL] Script cargado globalmente - Tiempo: ${loadTime.toFixed(2)}ms`);
      console.log('🚀 [FLIXMEDIA GLOBAL] Listo para usar en componentes');
    };

    script.onerror = () => {
      console.error('❌ [FLIXMEDIA GLOBAL] Error cargando script');
    };

    // Agregar al head
    document.head.appendChild(script);

    // Cleanup (remover solo al desmontar la app completa, lo cual casi nunca pasa)
    return () => {
      const globalScript = document.getElementById('flixmedia-global-loader');
      if (globalScript) {
        globalScript.remove();
      }
    };
  }, []);

  // Este componente no renderiza nada visible
  return null;
}
