# 🏛️ Government Section - Sector Gubernamental

## 📋 Descripción

Componentes para la página de ventas corporativas del sector gubernamental (servicios públicos, seguridad, emergencias).

## 🎨 Características Visuales

- **Color Principal**: Indigo-600 / Blue-700 (gradiente)
- **Aspect Ratio Hero**: 1366/607
- **Imágenes**: 3 imágenes de Cloudinary

## 📦 Componentes

### 1. HeroSection.tsx

- Imagen hero con texto superpuesto
- Título: "Nuevo Samsung para Empresas"
- Subtítulo: "Transforma tus procesos con beneficios solo para empresas"
- Sin overlay oscuro, texto negro bold

### 2. ValuesSection.tsx

- 3 tarjetas de valores:
  - Resistencia y fiabilidad
  - Listos para cualquier misión
  - Seguridad
- 2 secciones con imágenes:
  - Permitir el trabajo sobre el terreno
  - Equipo limpio en todo momento

### 3. ContactSection.tsx

- CTA con gradiente indigo-600 a blue-700
- Botón blanco con texto índigo

## 🖼️ Imágenes Cloudinary

```typescript
government: {
  hero: "01_BANNER_LANDING_PYMES_SALUD_1366X607_og3irm",
  values: "government_section1_solution2_pc_1440x640_mshfcf",
  feature: "government_section2_solution1_pc_1440x640_mxtfhu",
}
```

## 🔗 Navegación

- **Secciones**: Características, Nuestros valores
- **IDs**: #hero, #valores
- **Brand Label**: "Gobierno"

## 📏 Líneas de Código

- HeroSection: ~50 líneas ✅
- ValuesSection: ~152 líneas ✅
- ContactSection: ~37 líneas ✅
- Total: ~239 líneas ✅

## ✅ Validación

- [x] Todos los archivos < 250 líneas
- [x] Imágenes configuradas en Cloudinary
- [x] Componentes exportados en index.ts
- [x] Reutiliza SecondaryNavbar y SpecializedConsultationModal
- [x] Topbar sticky desde scrollY > 1
- [x] Sin overlays oscuros en hero
- [x] Texto negro bold en hero

## 🎯 Enfoque del Contenido

- **Hero**: Transformación de procesos gubernamentales
- **Valores**: Resistencia, preparación y seguridad
- **Features**:
  - Trabajo en campo con conectividad
  - Mantenimiento de equipo de emergencia
- **CTA**: Modernización de servicios públicos
