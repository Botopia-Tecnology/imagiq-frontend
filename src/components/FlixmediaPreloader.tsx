/**
 * FlixmediaPreloader Component
 * 
 * Precarga los recursos de Flixmedia al inicio de la aplicación
 * para acelerar la carga de contenido multimedia.
 * 
 * Implementa las mejores prácticas de Flixmedia:
 * - DNS prefetch para resolver el dominio antes
 * - Preconnect para establecer conexión anticipada
 * - Preload del script principal
 * 
 * Debe agregarse en el layout principal de la app.
 */

"use client";

import { useEffect } from 'react';

export default function FlixmediaPreloader() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. DNS Prefetch - Resuelve el DNS lo más pronto posible
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = '//media.flixfacts.com';
    
    if (!document.querySelector('link[rel="dns-prefetch"][href="//media.flixfacts.com"]')) {
      document.head.appendChild(dnsPrefetch);
    }

    // 2. Preconnect - Establece conexión anticipada (DNS + TCP + TLS)
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://media.flixfacts.com';
    preconnect.crossOrigin = 'anonymous';
    
    if (!document.querySelector('link[rel="preconnect"][href="https://media.flixfacts.com"]')) {
      document.head.appendChild(preconnect);
    }

    // 3. Preconnect para Flixcar (CDN alternativo usado por Flixmedia)
    const preconnectFlixcar = document.createElement('link');
    preconnectFlixcar.rel = 'preconnect';
    preconnectFlixcar.href = 'https://media.flixcar.com';
    preconnectFlixcar.crossOrigin = 'anonymous';
    
    if (!document.querySelector('link[rel="preconnect"][href="https://media.flixcar.com"]')) {
      document.head.appendChild(preconnectFlixcar);
    }

    // 4. Preload del script - Descarga el script sin ejecutarlo
    const preloadScript = document.createElement('link');
    preloadScript.rel = 'preload';
    preloadScript.as = 'script';
    preloadScript.href = '//media.flixfacts.com/js/loader.js';
    
    if (!document.querySelector('link[rel="preload"][href="//media.flixfacts.com/js/loader.js"]')) {
      document.head.appendChild(preloadScript);
    }
  }, []);

  // Este componente no renderiza nada visible
  return null;
}
