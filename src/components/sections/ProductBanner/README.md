# 🎨 ProductBanner - Componente Reutilizable

Componente modular y reutilizable para crear banners de productos en el home.

## 📁 Estructura

```
ProductBanner/
├── index.tsx              # Componente principal
├── BannerImage.tsx        # Componente de imagen responsive
├── types.ts               # Tipos TypeScript
├── example-configs.ts     # Ejemplos de configuración
└── README.md             # Esta documentación
```

## 🚀 Uso Básico

### Opción 1: Usar el componente reutilizable

```tsx
import ProductBanner from "@/components/sections/ProductBanner";

// Definir configuración
const bannerConfig = {
  images: {
    desktop: "URL_DESKTOP",
    mobile: "URL_MOBILE",
  },
  content: {
    title: "Nuevos AI TVs 2025",
    subtitle: "Sin interés a 3, 6 o 12 cuotas",
    buttonText: "Comprar",
    buttonHref: "/productos/tvs",
    ariaLabel: "Banner de AI TVs",
  },
  theme: "dark", // "dark" | "light"
  textAlignment: "left", // "left" | "center" | "right"
  trackingEvent: "ai_tvs_click",
};

// Usar en tu página
<ProductBanner config={bannerConfig} />
```

### Opción 2: Crear un componente específico (como AITVsBanner)

Si necesitas más personalización, puedes crear un componente específico:

```tsx
// src/components/sections/AITVsBanner/index.tsx
import ProductBanner from "@/components/sections/ProductBanner";
import { aiTVsConfig } from "@/components/sections/ProductBanner/example-configs";

export default function AITVsBanner() {
  return <ProductBanner config={aiTVsConfig} />;
}
```

## ⚙️ Configuración

### BannerConfig

```typescript
interface BannerConfig {
  images: {
    desktop: string;  // URL de imagen para desktop (1440x810 recomendado)
    mobile: string;   // URL de imagen para mobile (720x1120 recomendado)
  };
  content: {
    title: string;          // Título principal
    subtitle?: string;      // Subtítulo (opcional)
    buttonText: string;     // Texto del botón
    buttonHref: string;     // Link del botón
    ariaLabel: string;      // Label para accesibilidad
  };
  theme?: "light" | "dark";              // Tema del banner (default: "dark")
  textAlignment?: "left" | "center" | "right";  // Alineación del texto (default: "left")
  trackingEvent?: string;                // Nombre del evento de tracking
}
```

## 🎨 Temas

### Tema Oscuro (dark)
- Texto blanco
- Fondo negro
- Botón con borde blanco que se rellena al hover

### Tema Claro (light)
- Texto negro
- Fondo blanco
- Botón con borde negro que se rellena al hover

## 📱 Responsive

El componente es completamente responsive:
- **Mobile**: Altura 680px, imagen vertical (720x1120)
- **Tablet**: Altura 500px
- **Desktop**: Altura 810px, imagen horizontal (1440x810)

## 🎯 Tracking

Cada banner envía eventos de tracking a PostHog:

```typescript
{
  event: trackingEvent,
  properties: {
    action: "click",
    source: "product_banner",
    href: content.buttonHref
  }
}
```

## 📋 Ejemplos

Ver el archivo `example-configs.ts` para ejemplos completos de configuración.

## ✅ Mejores Prácticas

1. **Imágenes**: Usa Cloudinary para optimizar las imágenes
2. **Dimensiones**: Respeta las dimensiones recomendadas (1440x810 desktop, 720x1120 mobile)
3. **Texto**: Usa títulos cortos y claros (máximo 2 líneas)
4. **Botones**: Texto de acción claro ("Comprar", "Ver más", "Conocer más")
5. **Accesibilidad**: Siempre incluye un `ariaLabel` descriptivo
