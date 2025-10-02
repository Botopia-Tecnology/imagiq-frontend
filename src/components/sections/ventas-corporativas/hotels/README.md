# 🏨 Hotels Section - Sector Hotelero

## 📋 Descripción

Componentes para la página de ventas corporativas del sector hotelero (hoteles, resorts, turismo).

## 🎨 Características Visuales

- **Color Principal**: Amber-600 / Orange-600 (gradiente)
- **Aspect Ratio Hero**: 1366/607
- **Imágenes**: 3 imágenes de Cloudinary

## 📦 Componentes

### 1. HeroSection.tsx

- Imagen hero con texto superpuesto
- Título: "Nuevo Samsung para Empresas"
- Subtítulo: "Moderniza tu negocio con tecnología y beneficios únicos"
- Sin overlay oscuro, texto negro bold

### 2. ValuesSection.tsx

- 3 tarjetas de valores:
  - Espacios conectados
  - Servicio e Integridad
  - Innovación sostenible
- 2 secciones con imágenes:
  - Conexiones que trascienden
  - Zonas funcionales que inspiran

### 3. ContactSection.tsx

- CTA con gradiente amber-600 a orange-600
- Botón blanco con texto amber

## 🖼️ Imágenes Cloudinary

```typescript
hotels: {
  hero: "01_BANNER_LANDING_PYMES_TURISMO_1366X607_l9ir4m",
  values: "BANNER_SECCION_1366x607_qgj1tj",
  feature: "BANNER_BENEFICIOS_1366x607_cpqa36",
}
```

## 🔗 Navegación

- **Secciones**: Características, Nuestros valores
- **IDs**: #hero, #valores
- **Brand Label**: "Hoteles"

## 📏 Líneas de Código

- HeroSection: ~50 líneas ✅
- ValuesSection: ~148 líneas ✅
- ContactSection: ~37 líneas ✅
- Total: ~235 líneas ✅

## ✅ Validación

- [x] Todos los archivos < 250 líneas
- [x] Imágenes configuradas en Cloudinary
- [x] Componentes exportados en index.ts
- [x] Reutiliza SecondaryNavbar y SpecializedConsultationModal
- [x] Topbar sticky desde scrollY > 1
- [x] Sin overlays oscuros en hero
- [x] Texto negro bold en hero

## 🎯 Enfoque del Contenido

- **Hero**: Modernización de negocios hoteleros
- **Valores**: Conectividad, servicio e innovación sostenible
- **Features**:
  - Conexiones de dispositivos en cualquier lugar
  - Espacios funcionales sostenibles
- **CTA**: Transformación de experiencia hotelera
