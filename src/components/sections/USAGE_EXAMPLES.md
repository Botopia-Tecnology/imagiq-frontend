# 📘 Guía de Uso - Banners de Producto

## Componentes Disponibles

### 1. AITVsBanner
Banner específico para la sección "Nuevos AI TVs 2025"

### 2. ProductBanner (Reutilizable)
Componente genérico para crear cualquier banner de producto

## 🎯 Cómo usar en la página principal

### Ejemplo 1: Usar AITVsBanner directamente

```tsx
// src/app/page.tsx
import AITVsBanner from "@/components/sections/AITVsBanner";
import GalaxyShowcaseBanner from "@/components/sections/GalaxyShowcaseBanner";

export default function HomePage() {
  return (
    <main>
      {/* Banner de Galaxy Z Flip7 y Watch8 */}
      <GalaxyShowcaseBanner />

      {/* Banner de AI TVs */}
      <AITVsBanner />

      {/* Otros componentes... */}
    </main>
  );
}
```

### Ejemplo 2: Crear un nuevo banner usando ProductBanner

```tsx
// src/app/page.tsx
import ProductBanner from "@/components/sections/ProductBanner";
import GalaxyShowcaseBanner from "@/components/sections/GalaxyShowcaseBanner";
import AITVsBanner from "@/components/sections/AITVsBanner";

export default function HomePage() {
  // Configuración para un nuevo banner
  const smartphoneBannerConfig = {
    images: {
      desktop: "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1234567890/smartphone_desktop.avif",
      mobile: "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1234567890/smartphone_mobile.webp",
    },
    content: {
      title: "Galaxy S25 Ultra",
      subtitle: "El smartphone más potente del año",
      buttonText: "Conocer más",
      buttonHref: "/productos/smartphones/galaxy-s25-ultra",
      ariaLabel: "Galaxy S25 Ultra Banner",
    },
    theme: "light" as const,
    textAlignment: "center" as const,
    trackingEvent: "galaxy_s25_ultra_banner_click",
  };

  return (
    <main>
      <GalaxyShowcaseBanner />
      <AITVsBanner />

      {/* Nuevo banner usando ProductBanner */}
      <ProductBanner config={smartphoneBannerConfig} />
    </main>
  );
}
```

### Ejemplo 3: Crear múltiples configuraciones organizadas

```tsx
// src/config/banner-configs.ts
import { BannerConfig } from "@/components/sections/ProductBanner/types";

export const homeBanners = {
  aiTVs: {
    images: {
      desktop: "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1759811545/MDVD_Feature_KV_PC_1440x810_LTR_trxgtb.avif",
      mobile: "https://res.cloudinary.com/dqsdl9bwv/image/upload/v1759811702/MDVD_Feature_KV_MO_720X1120_e18si6.webp",
    },
    content: {
      title: "Nuevos AI TVs 2025",
      subtitle: "Sin interés a 3, 6 o 12 cuotas pagando con bancos aliados",
      buttonText: "Comprar",
      buttonHref: "/productos/tv-audio-video?categoria=televisores",
      ariaLabel: "Nuevos AI TVs 2025 Showcase",
    },
    theme: "dark" as const,
    textAlignment: "left" as const,
    trackingEvent: "ai_tvs_banner_click",
  },

  smartphones: {
    images: {
      desktop: "URL_DESKTOP",
      mobile: "URL_MOBILE",
    },
    content: {
      title: "Galaxy S25 Series",
      subtitle: "Innovación en cada detalle",
      buttonText: "Ver modelos",
      buttonHref: "/productos/smartphones",
      ariaLabel: "Galaxy S25 Series",
    },
    theme: "dark" as const,
    textAlignment: "left" as const,
    trackingEvent: "s25_series_banner_click",
  },
} satisfies Record<string, BannerConfig>;

// src/app/page.tsx
import ProductBanner from "@/components/sections/ProductBanner";
import { homeBanners } from "@/config/banner-configs";

export default function HomePage() {
  return (
    <main>
      <ProductBanner config={homeBanners.aiTVs} />
      <ProductBanner config={homeBanners.smartphones} />
    </main>
  );
}
```

## 🎨 Opciones de Personalización

### Temas disponibles
- `"dark"`: Fondo oscuro, texto blanco
- `"light"`: Fondo claro, texto negro

### Alineación de texto
- `"left"`: Texto alineado a la izquierda (recomendado)
- `"center"`: Texto centrado
- `"right"`: Texto alineado a la derecha

## 📸 Dimensiones de Imágenes Recomendadas

| Tipo     | Dimensiones | Formato recomendado |
|----------|-------------|---------------------|
| Desktop  | 1440x810    | .avif o .webp       |
| Mobile   | 720x1120    | .webp o .avif       |

## ✅ Checklist al crear un nuevo banner

- [ ] Imágenes subidas a Cloudinary
- [ ] URLs de imágenes desktop y mobile configuradas
- [ ] Título y subtítulo definidos
- [ ] Texto del botón y href configurados
- [ ] Tema seleccionado (dark/light)
- [ ] Alineación de texto definida
- [ ] ariaLabel descriptivo para accesibilidad
- [ ] Evento de tracking configurado

## 🚀 Pasos para crear un nuevo banner

1. **Subir imágenes a Cloudinary**
   - Desktop: 1440x810
   - Mobile: 720x1120

2. **Copiar las URLs de las imágenes**

3. **Crear la configuración**
   ```tsx
   const miNuevoBanner = {
     images: { desktop: "...", mobile: "..." },
     content: { title: "...", subtitle: "...", ... },
     theme: "dark",
     textAlignment: "left",
   };
   ```

4. **Usar en la página**
   ```tsx
   <ProductBanner config={miNuevoBanner} />
   ```

## 📝 Notas

- Los componentes están optimizados para Next.js 14+
- Usan el componente `Image` de Next.js para optimización automática
- Incluyen tracking con PostHog
- Son completamente responsive
- Soportan Samsung Sharp Sans como fuente principal
