/**
 * 🔐 SECURITY INITIALIZATION SCRIPT
 *
 * Este script se ejecuta ANTES de que Next.js se hydrate
 * para garantizar que localStorage esté sobrescrito lo más temprano posible.
 *
 * IMPORTANTE: Este archivo se sirve como static asset desde /public
 */

(function () {
  console.log('🔐 [Static Script] Marcando flag de inicialización temprana...');

  if (typeof window !== 'undefined') {
    // Marcar que este script se ejecutó
    window.__IMAGIQ_STATIC_SCRIPT_LOADED__ = true;

    // La sobrescritura real se hará en SecurityInitializer
    // porque necesitamos los módulos de crypto-js
  }
})();
