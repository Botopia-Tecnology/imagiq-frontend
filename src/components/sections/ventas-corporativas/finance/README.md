# 💼 Finance Section - Servicios Financieros

## 📋 Descripción

Componentes para la página de ventas corporativas del sector financiero (bancos, instituciones financieras, etc.).

## 🎨 Características Visuales

- **Color Principal**: Blue-600 / Green-600 (gradiente)
- **Aspect Ratio Hero**: 1366/607
- **Imágenes**: 3 imágenes de Cloudinary

## 📦 Componentes

### 1. HeroSection.tsx

- Imagen hero con texto superpuesto
- Título: "Nuevo Samsung para Empresas"
- Subtítulo: "Lleva más allá la productividad con beneficios exclusivos para negocios"
- Sin overlay oscuro, texto negro bold

### 2. ValuesSection.tsx

- 3 tarjetas de valores:
  - Productividad optimizada
  - Visión de conjunto
  - El servicio digital es lo primero
- 2 secciones con imágenes:
  - Servicio de atención al cliente instantáneo
  - Pantallas que muestran el panorama general

### 3. ContactSection.tsx

- CTA con gradiente blue-600 a green-600
- Botón blanco con texto azul

## 🖼️ Imágenes Cloudinary

```typescript
finance: {
  hero: "OB_BANNER_LANDING_EPP_PYMES_SERVICIOS_DKTP_1366X607_de3mik",
  values: "finance_section1_solution1_pc_1440x640_d79szd",
  feature: "finance_section2_solution1_pc_1440x640_s4nteh",
}
```

## 🔗 Navegación

- **Secciones**: Características, Nuestros valores
- **IDs**: #hero, #valores
- **Brand Label**: "Financiero"

## 📏 Líneas de Código

- HeroSection: ~51 líneas ✅
- ValuesSection: ~147 líneas ✅
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
