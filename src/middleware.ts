import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cache de slugs válidos
let validSlugs: Set<string> | null = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Detecta si una ruta es potencialmente una página multimedia dinámica [slug]
 * vs una ruta estática del sistema
 */
function isPotentialDynamicSlug(pathname: string): boolean {
  // Excluir rutas del sistema Next.js
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')  // Archivos con extensión
  ) {
    return false;
  }

  // Si es la home
  if (pathname === '/') {
    return false;
  }

  // Extraer el primer segmento de la ruta
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  // Si no hay segmentos, es la home
  if (!firstSegment) {
    return false;
  }

  // Lista de prefijos de rutas estáticas conocidas
  // Solo primeros segmentos, no rutas completas
  const STATIC_ROUTE_PREFIXES = [
    'productos',
    'categorias',
    'carrito',
    'checkout',
    'cuenta',
    'buscar',
    'ofertas',
    'tiendas',
    'nosotros',
    'contacto',
    'ayuda',
    'auth',
    'login',
    'register',
    'admin',
  ];

  // Si el primer segmento coincide con una ruta estática conocida, no es dinámico
  if (STATIC_ROUTE_PREFIXES.includes(firstSegment.toLowerCase())) {
    return false;
  }

  // Si llegamos aquí, es potencialmente una página multimedia dinámica
  return true;
}

/**
 * Obtiene la lista de slugs válidos del backend
 * Cachea durante 5 minutos para reducir peticiones
 */
async function getValidSlugs(): Promise<Set<string>> {
  const now = Date.now();
  
  // Si tiene cache y no ha expirado, retornar cache
  if (validSlugs && (now - lastFetch) < CACHE_DURATION) {
    return validSlugs;
  }
  
  // Consultar backend
  try {
    // Usar variable de entorno o localhost por defecto
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const endpoint = `${apiUrl}/api/multimedia/pages/slugs/active`;
    
    console.log(`[Middleware] Fetching slugs from: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      cache: 'no-store', // No cachear en fetch, usamos nuestro propio cache
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const slugs: string[] = await response.json();
    validSlugs = new Set(slugs);
    lastFetch = now;
    
    console.log(`[Middleware] ✅ Loaded ${slugs.length} valid slugs:`, slugs);
  } catch (error) {
    console.error('[Middleware] ❌ Error fetching slugs:', error);
    // CRÍTICO: Si falla el backend, permitir acceso (fail-open)
    // Es mejor dejar pasar una petición inválida que bloquear todo el sitio
    if (!validSlugs) {
      console.warn('[Middleware] ⚠️  Backend error, allowing all requests (fail-open mode)');
      validSlugs = new Set(['*']); // Marcador especial para modo fail-open
    }
  }
  
  return validSlugs;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Si NO es una ruta dinámica potencial, dejar pasar
  if (!isPotentialDynamicSlug(pathname)) {
    return NextResponse.next();
  }
  
  // Extraer slug (solo primer segmento)
  const slug = pathname.split('/').filter(Boolean)[0];
  
  // Validar formato básico del slug
  // Solo letras minúsculas, números y guiones
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.log(`[Middleware] Invalid slug format: ${slug}`);
    return new NextResponse(null, { status: 404 });
  }
  
  // Obtener lista de slugs válidos
  const validSlugSet = await getValidSlugs();
  
  // Si el backend falló, modo fail-open: permitir acceso
  if (validSlugSet.has('*')) {
    console.log(`[Middleware] Fail-open mode: allowing ${slug}`);
    return NextResponse.next();
  }
  
  // Si el slug no está en la lista de válidos, retornar 404
  if (!validSlugSet.has(slug)) {
    console.log(`[Middleware] Slug not found in valid slugs: ${slug}`);
    return new NextResponse(null, { status: 404 });
  }
  
  // Slug válido, continuar con la petición normal
  return NextResponse.next();
}

// Configurar matcher para aplicar middleware a todas las rutas dinámicas
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/).*)',
  ],
};
