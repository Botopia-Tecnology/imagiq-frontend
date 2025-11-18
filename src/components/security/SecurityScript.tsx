import Script from 'next/script';

/**
 * 🔐 SECURITY SCRIPT
 *
 * Script que se ejecuta ANTES de cualquier JavaScript de la app (beforeInteractive)
 * para sobrescribir localStorage con SecureStorage lo más temprano posible.
 *
 * IMPORTANTE: Debe ser incluido en layout.tsx
 */
export default function SecurityScript() {
  // El código del script debe estar inline para que se ejecute INMEDIATAMENTE
  const securityCode = `
(function() {
  console.log('🔐 [Security Script] Ejecutando ANTES de cualquier JS...');

  // Este código se ejecutará al cargar la página, ANTES de que Next.js se hidrate
  // Por ahora solo logueamos, la sobrescritura real se hace en SecurityInitializer
  // porque necesitamos importar los módulos de encriptación

  if (typeof window !== 'undefined') {
    window.__IMAGIQ_SECURITY_EARLY_INIT__ = true;
  }
})();
  `;

  return (
    <Script
      id="security-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: securityCode }}
    />
  );
}
