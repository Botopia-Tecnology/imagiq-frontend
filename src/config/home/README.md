# Configuración del Hero (Video Principal)

Sistema simple y modular para configurar el video hero del home de Imagiq.

## 📁 Estructura

```
src/config/home/
├── types.ts          # Definiciones TypeScript
├── data.ts           # ⭐ ARCHIVO PRINCIPAL PARA MODIFICAR
├── useHomeConfig.ts  # Hook para cargar configuración
├── utils.ts          # Funciones utilitarias
├── index.ts          # Barrel exports
└── README.md         # Esta documentación
```

## 🎯 Cómo modificar el Hero

### 1. Cambiar el video

Edita `src/config/home/data.ts`:

```typescript
export const HERO_CONFIG: HeroConfig = {
  // Videos
  videoSrc: 'TU_NUEVO_VIDEO_DESKTOP.mp4',
  videoSrcMobile: 'TU_NUEVO_VIDEO_MOBILE.mp4',
};
```

### 2. Cambiar las imágenes que aparecen al final del video

```typescript
export const HERO_CONFIG: HeroConfig = {
  // Imágenes que aparecen al final del video
  posterSrc: 'TU_NUEVA_IMAGEN_DESKTOP.webp',
  posterSrcMobile: 'TU_NUEVA_IMAGEN_MOBILE.webp',
};
```

### 3. Cambiar el contenido que aparece al final

```typescript
export const HERO_CONFIG: HeroConfig = {
  title: 'Nuevo título',
  subtitle: 'Nuevo subtítulo',
  buttonText: 'Nuevo botón',
  buttonLink: '/nueva-ruta',  // A dónde lleva el botón
  showContentOnEnd: true,     // Mostrar al finalizar video
};
```

### 4. Hacer que el video se repita infinitamente (loop)

```typescript
export const HERO_CONFIG: HeroConfig = {
  loop: true,              // El video se repite
  showContentOnEnd: false, // No mostrar contenido al final
};
```

### 5. Cambiar el color de fondo

```typescript
export const HERO_CONFIG: HeroConfig = {
  bgColor: '#FF0000', // Color hex
};
```

## 🔧 Configuración disponible (HeroConfig)

| Propiedad | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `title` | `string` | Título que aparece al final | `"AI, just for you"` |
| `subtitle` | `string` | Subtítulo que aparece al final | `"0% de interés"` |
| `buttonText` | `string` | Texto del botón CTA | `"Más información"` |
| `buttonLink` | `string` | URL a donde dirige el botón | `"/productos/..."` |
| `videoSrc` | `string` | URL del video desktop | `"https://..."` |
| `videoSrcMobile` | `string` | URL del video mobile | `"https://..."` |
| `posterSrc` | `string` | Imagen final (desktop) | `"https://..."` |
| `posterSrcMobile` | `string` | Imagen final (mobile) | `"https://..."` |
| `bgColor` | `string` | Color de fondo (hex) | `"#000000"` |
| `showContentOnEnd` | `boolean` | Mostrar contenido al finalizar | `true` / `false` |
| `autoplay` | `boolean` | Reproducir automáticamente | `true` / `false` |
| `loop` | `boolean` | Repetir el video | `true` / `false` |
| `muted` | `boolean` | Sin sonido (requerido para autoplay) | `true` |

## 🎯 Configurar el Call to Action (CTA)

### Ejemplos de links para el botón

```typescript
// Link a categoría
buttonLink: '/productos/dispositivos-moviles'

// Link a categoría con filtros
buttonLink: '/productos/dispositivos-moviles?seccion=smartphones&serie=Galaxy+A'

// Link a producto específico
buttonLink: '/productos/view/BSM-A566E'

// Link externo
buttonLink: 'https://samsung.com/promocion'

// Link a ofertas
buttonLink: '/productos/ofertas'
```

## 🚀 Futuro: Integración con Dashboard

Actualmente los datos están en `data.ts`. Cuando implementes el dashboard:

### Paso 1: Crear endpoint en tu API

```typescript
// Backend
GET /api/home/hero-config

Response: {
  "title": "...",
  "videoSrc": "...",
  // ... resto de config
}
```

### Paso 2: Descomentar código en `useHomeConfig.ts`

```typescript
export function useHeroConfig() {
  useEffect(() => {
    fetchHeroConfig(); // ← Descomentar esta línea
    // loadMockedHeroConfig(); // ← Comentar esta línea
  }, []);

  // Ya está implementado, solo descomentarlo (línea 37-53)
}
```

### Paso 3: ¡Listo!

El sistema automáticamente:
- ✅ Carga datos desde la API
- ✅ Muestra loading state mientras carga
- ✅ Hace fallback a datos mockeados si falla
- ✅ No requiere cambios en componentes

## 📝 Ejemplos de configuraciones comunes

### Video que se repite infinitamente (sin contenido al final)

```typescript
export const HERO_CONFIG: HeroConfig = {
  videoSrc: 'https://cloudinary.com/video-loop.mp4',
  videoSrcMobile: 'https://cloudinary.com/video-loop-mobile.mp4',
  loop: true,
  showContentOnEnd: false,
  autoplay: true,
  muted: true,
};
```

### Solo imagen estática (sin video)

```typescript
export const HERO_CONFIG: HeroConfig = {
  videoSrc: '', // Dejar vacío
  posterSrc: 'https://cloudinary.com/imagen-estatica.webp',
  posterSrcMobile: 'https://cloudinary.com/imagen-mobile.webp',
  showContentOnEnd: true,
  title: 'Tu título',
  subtitle: 'Tu subtítulo',
  buttonText: 'Ver más',
  buttonLink: '/productos',
  autoplay: false,
};
```

### Video con CTA que dirige a una categoría con filtros

```typescript
export const HERO_CONFIG: HeroConfig = {
  videoSrc: 'https://cloudinary.com/video.mp4',
  videoSrcMobile: 'https://cloudinary.com/video-mobile.mp4',
  posterSrc: 'https://cloudinary.com/poster.webp',
  posterSrcMobile: 'https://cloudinary.com/poster-mobile.webp',
  title: 'Descubre Galaxy Z',
  subtitle: 'Plegables de última generación',
  buttonText: 'Ver Galaxy Z',
  buttonLink: '/productos/dispositivos-moviles?seccion=smartphones&serie=Galaxy+Z',
  showContentOnEnd: true,
  loop: false,
  muted: true,
};
```

## ⚠️ Reglas importantes

1. **Solo modificar `data.ts`** - No tocar componentes ni hooks
2. **URLs completas** - Siempre usar URLs completas (http/https)
3. **Hex colors válidos** - Formato: `#000000` o `#000`
4. **Autoplay requiere muted** - Los navegadores bloquean autoplay con sonido
5. **Archivos < 250 líneas** - Todo el sistema es modular y mantenible
6. **Sin `any`** - 100% tipado con TypeScript

## 🐛 Troubleshooting

**El video no se reproduce:**
- ✅ Verifica que `autoplay: true` y `muted: true`
- ✅ Verifica que la URL del video sea válida
- ✅ Los navegadores bloquean autoplay si no está muted

**El contenido no aparece al final:**
- ✅ Verifica que `showContentOnEnd: true`
- ✅ Verifica que `loop: false` (si loop está en true, el video nunca termina)

**La imagen del poster no se ve:**
- ✅ Verifica que las URLs de `posterSrc` y `posterSrcMobile` sean válidas
- ✅ Verifica que las imágenes existan en Cloudinary

**El botón no funciona:**
- ✅ Verifica que `buttonLink` tenga una ruta válida
- ✅ Para rutas internas usar `/productos/...`
- ✅ Para rutas externas usar `https://...`
