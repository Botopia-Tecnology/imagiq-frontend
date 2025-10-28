// Configuración Unlighthouse con Puppeteer usando Chrome local
const config = {
  // Sitio web a escanear
  site: "http://localhost:3000",

  // Configuración del escáner
  scanner: {
    // Número de páginas a escanear simultáneamente
    threads: 2,

    // Tiempo máximo de espera por página (ms)
    maxRoutes: 50,

    // Excluir rutas específicas
    exclude: ["/api/*", "/_next/*", "/admin/*"],

    // Incluir rutas dinámicas manualmente si es necesario
    // samples: 3, // número de muestras para rutas dinámicas
  },

  // Configuración de Lighthouse
  lighthouseOptions: {
    // Opciones para ejecutar Lighthouse
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],

    // Configuración de throttling (simular conexión 4G)
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
    },

    // Viewport
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
    },
  },

  // Configuración de Puppeteer para usar Chrome instalado localmente
  puppeteer: {
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  },

  // Configuración de CI
  ci: {
    // Umbral mínimo de puntaje para pasar el test
    budget: {
      performance: 50,
      accessibility: 80,
      "best-practices": 80,
      seo: 80,
    },
  },

  // Configuración de salida
  outputPath: ".unlighthouse",

  // Debug mode
  debug: false,

  // Configuración de cookies (si necesitas autenticación)
  // cookies: [
  //   {
  //     name: 'auth-token',
  //     value: 'tu-token-aqui',
  //     domain: 'localhost',
  //     path: '/',
  //   },
  // ],
};

export default config;
