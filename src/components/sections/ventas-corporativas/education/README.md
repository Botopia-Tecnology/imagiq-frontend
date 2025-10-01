# 🎓 Education Components - Ventas Corporativas

Componentes específicos para la página de Educación en Ventas Corporativas.

## 📁 Estructura

```
education/
├── HeroSection.tsx      # Sección hero principal con imagen de fondo
├── ValuesSection.tsx    # Sección "Nuestros valores" con 3 características
├── ContactSection.tsx   # CTA final con botón de contacto
├── index.ts            # Exports centralizados
└── README.md           # Este archivo
```

## 🎨 Componentes

### HeroSection

Sección principal con imagen hero y beneficios.

**Características:**

- Imagen de fondo desde Cloudinary
- Título y subtítulo
- 3 beneficios con iconos (Productos, Descuentos, Cuotas sin interés)
- Responsive design

### ValuesSection

Sección "Nuestros valores" con tarjetas de características educativas.

**Incluye:**

- 3 tarjetas de valores:
  - Aulas conectadas
  - Compromiso interactivo
  - Entornos saludables
- Imagen destacada de Galaxy Tab con S Pen
- Texto descriptivo

### ContactSection

Call-to-action final con botón para abrir modal de contacto.

**Props:**

- `onContactClick: () => void` - Función para abrir el modal

## 🔗 Uso

```tsx
import {
  HeroSection,
  ValuesSection,
  ContactSection,
} from "@/components/sections/ventas-corporativas/education";

// En tu página
<HeroSection />
<ValuesSection />
<ContactSection onContactClick={handleContactClick} />
```

## 📸 Imágenes Cloudinary

Las imágenes están configuradas en `src/constants/hero-images.ts`:

```typescript
SECTION_IMAGES.education = {
  hero: "Samsung/education/01_QB_BANNER_LANDING_EPP_PYMES_EDUCACION_DKTP_1366X607_hejdsk",
  values: "Samsung/education/education_section1_solution1_pc_1440x640_cpf0eg",
};
```

## ♻️ Componentes reutilizables

Estos componentes están diseñados para ser específicos de educación, pero pueden servir como plantilla para otras industrias (retail, finance, government, hotels).

## 📏 Límite de líneas

Todos los componentes mantienen < 250 líneas de código para mejor mantenibilidad.
