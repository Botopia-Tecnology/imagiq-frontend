# Configuración de Banners Promocionales

Sistema modular para agregar banners en páginas de ofertas.

## 📁 Estructura

```
src/config/banners/
├── types.ts      # Definiciones TypeScript
├── data.ts       # ⭐ ARCHIVO PRINCIPAL PARA MODIFICAR
├── index.ts      # Barrel exports
└── README.md     # Esta documentación
```

## 🎯 Cómo agregar/modificar un banner

### 1. Editar configuración del banner

Abre `src/config/banners/data.ts` y modifica el banner que necesites:

```typescript
export const SMARTPHONES_TABLETS_BANNER: BannerConfig = {
  // Imágenes del banner (requerido)
  imageUrl: 'https://cloudinary.com/tu-imagen-desktop.jpg',
  imageUrlMobile: 'https://cloudinary.com/tu-imagen-mobile.jpg',

  // Altura del banner
  height: '400px',        // Desktop
  heightMobile: '200px',  // Mobile

  // Control de visibilidad
  enabled: true,  // true = mostrar, false = ocultar
};
```

### 2. Opción A: Banner solo con imagen (recomendado)

```typescript
export const SMARTPHONES_TABLETS_BANNER: BannerConfig = {
  id: 'banner-smartphones-tablets-ofertas',

  // Solo imágenes
  imageUrl: 'https://res.cloudinary.com/banner-desktop.jpg',
  imageUrlMobile: 'https://res.cloudinary.com/banner-mobile.jpg',

  // Opcional: hacer toda la imagen clickeable
  buttonLink: '/productos/dispositivos-moviles?seccion=smartphones',

  // Altura
  height: '500px',
  heightMobile: '250px',

  enabled: true,
};
```

### 2. Opción B: Banner con texto superpuesto

```typescript
export const SMARTPHONES_TABLETS_BANNER: BannerConfig = {
  id: 'banner-smartphones-tablets-ofertas',

  // Imagen de fondo
  imageUrl: 'https://res.cloudinary.com/banner.jpg',
  imageUrlMobile: 'https://res.cloudinary.com/banner-mobile.jpg',

  // Textos sobre la imagen
  title: 'Ofertas especiales',
  subtitle: 'Hasta 40% de descuento',
  description: 'En smartphones y tablets seleccionados',

  // Botón Call to Action
  buttonText: 'Ver ofertas',
  buttonLink: '/productos/ofertas?seccion=smartphones-tablets',

  // Estilos del texto
  textColor: '#ffffff',
  backgroundColor: '#000000',

  enabled: true,
};
```

## 🔧 Configuración disponible

| Propiedad | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | `string` | ID único del banner | `"banner-smartphones"` |
| `imageUrl` | `string` | **Requerido** - URL imagen desktop | `"https://..."` |
| `imageUrlMobile` | `string` | URL imagen mobile (usa desktop si no se especifica) | `"https://..."` |
| `title` | `string` | Título sobre la imagen (opcional) | `"Ofertas especiales"` |
| `subtitle` | `string` | Subtítulo (opcional) | `"Hasta 40% OFF"` |
| `description` | `string` | Descripción (opcional) | `"En productos..."` |
| `buttonText` | `string` | Texto del botón CTA (opcional) | `"Ver más"` |
| `buttonLink` | `string` | URL del botón o imagen clickeable | `"/productos/..."` |
| `backgroundColor` | `string` | Color de fondo | `"#000000"` |
| `textColor` | `string` | Color del texto | `"#ffffff"` |
| `height` | `string` | Altura en desktop | `"400px"` |
| `heightMobile` | `string` | Altura en mobile | `"200px"` |
| `enabled` | `boolean` | **Requerido** - Mostrar/ocultar | `true` / `false` |

## 📍 Dónde se muestran los banners

Los banners aparecen en las páginas de ofertas, después del título y antes de los productos:

```
┌─────────────────────────────┐
│  Título: "Smartphones y     │
│          Tablets"           │
├─────────────────────────────┤
│  📸 BANNER AQUÍ             │  ← Tu banner aparece aquí
├─────────────────────────────┤
│  Productos en grid...       │
│  [📱] [📱] [📱]            │
└─────────────────────────────┘
```

## 🎯 Banners disponibles por sección

Puedes configurar un banner diferente para cada sección de ofertas:

```typescript
// Smartphones y Tablets
SMARTPHONES_TABLETS_BANNER

// Accesorios
ACCESORIOS_BANNER

// TV, Monitores y Audio
TV_MONITORES_AUDIO_BANNER

// Electrodomésticos
ELECTRODOMESTICOS_BANNER
```

## 📝 Ejemplos prácticos

### Banner simple con imagen clickeable

```typescript
export const SMARTPHONES_TABLETS_BANNER: BannerConfig = {
  id: 'banner-smartphones-tablets-ofertas',
  imageUrl: 'https://cloudinary.com/promo-samsung-desktop.jpg',
  imageUrlMobile: 'https://cloudinary.com/promo-samsung-mobile.jpg',
  buttonLink: '/productos/view/GALAXY-S24',  // Toda la imagen es clickeable
  height: '450px',
  heightMobile: '225px',
  enabled: true,
};
```

### Banner con botón visible

```typescript
export const SMARTPHONES_TABLETS_BANNER: BannerConfig = {
  id: 'banner-smartphones-tablets-ofertas',
  imageUrl: 'https://cloudinary.com/fondo.jpg',
  title: '¡Black Friday!',
  subtitle: 'Hasta 50% de descuento',
  buttonText: 'Comprar ahora',
  buttonLink: '/productos/ofertas?seccion=smartphones-tablets',
  textColor: '#ffffff',
  height: '500px',
  heightMobile: '300px',
  enabled: true,
};
```

### Deshabilitar un banner

```typescript
export const SMARTPHONES_TABLETS_BANNER: BannerConfig = {
  id: 'banner-smartphones-tablets-ofertas',
  imageUrl: '',
  enabled: false,  // ← Cambiar a false para ocultar
};
```

## 🚀 Para el futuro con Dashboard

Cuando implementes el dashboard:

1. Crear endpoint: `GET /api/banners/ofertas`
2. El endpoint debe retornar el objeto `OFERTAS_BANNERS_MAP`
3. Crear un hook `useBanners()` similar a `useHeroConfig()`
4. Integrar el hook en `OfertasSection.tsx`

## ⚠️ Reglas importantes

1. **URLs completas** - Siempre usar URLs completas de Cloudinary
2. **Imágenes optimizadas** - Usar WebP para mejor rendimiento
3. **Responsive** - Siempre proveer `imageUrlMobile` para mobile
4. **Enabled requerido** - Siempre incluir `enabled: true/false`
5. **Sin `any`** - Todo está tipado con TypeScript

## 🐛 Troubleshooting

**El banner no aparece:**
- ✅ Verifica que `enabled: true`
- ✅ Verifica que `imageUrl` tenga una URL válida
- ✅ Verifica que estés en la sección correcta (ej: `/productos/ofertas?seccion=smartphones-tablets`)

**La imagen se ve distorsionada:**
- ✅ Ajusta `height` y `heightMobile`
- ✅ Las imágenes deben tener las proporciones correctas

**El banner no es clickeable:**
- ✅ Agrega `buttonLink` para hacer la imagen clickeable
- ✅ O agrega `buttonText` + `buttonLink` para un botón visible

**La imagen mobile no se ve:**
- ✅ Especifica `imageUrlMobile`
- ✅ Si no se especifica, usa la misma imagen de desktop
