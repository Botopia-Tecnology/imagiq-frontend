# ProductCard - Arquitectura Modular

## 📋 Resumen

Sistema de Product Card completamente modular siguiendo principios SOLID, diseñado para parecerse a Samsung Colombia Store con componentes reutilizables y mantenibles.

## 📊 Estructura de Archivos

```
ProductCard/
├── ProductCard.tsx (197 líneas) ✅ - Componente principal orquestador
├── ProductImage.tsx (85 líneas) ✅ - Imagen con badge y quick view
├── ProductSelectors.tsx (93 líneas) ✅ - Selectores de color y capacidad
├── ProductPricing.tsx (60 líneas) ✅ - Display de precios y descuentos
├── ProductRating.tsx (56 líneas) ✅ - Estrellas, reviews y stock
├── ProductActions.tsx (69 líneas) ✅ - Botones de compra y acciones
├── productCardUtils.ts (142 líneas) ✅ - Utilidades compartidas
├── useProductCardState.ts (127 líneas) ✅ - Hook de estado
└── README.md - Esta documentación
```

**Total: 829 líneas distribuidas en 8 archivos**  
**Todos los archivos <200 líneas ✅**

## 🎨 Diseño Samsung Colombia

### Características Visuales
- **Colores**: Negro (#000), Azul (#2563EB), Amarillo (#EAB308), Verde (#16A34A)
- **Tipografía**: Compacta (text-xs, text-sm)
- **Espaciado**: Reducido (p-3, gap-1.5, mb-3)
- **Bordes**: Redondeados (rounded-lg)
- **Sombras**: Sutiles (shadow-sm, hover:shadow-md)
- **Imágenes**: Compactas (w-40 h-40 en lista, aspect-square en grid)

### Componentes Visuales
1. **Badge "NUEVO"**: Fondo negro, texto blanco, esquina superior izquierda
2. **Botón "Vistazo rápido"**: Solo visible al hover
3. **Selectores de color**: Círculos w-7 h-7 con borde negro al seleccionar
4. **Selectores de capacidad**: Pills compactas px-3 py-1
5. **Estrellas de rating**: w-3.5 h-3.5 amarillas
6. **Badge "En existencia"**: Verde con checkmark
7. **Precio mensual**: Inline "Desde $XXX al mes en 12 cuotas*"
8. **Botones de acción**: Compactos py-2.5 text-xs

## 🏗️ Principios SOLID Aplicados

### 1️⃣ Single Responsibility Principle (SRP)
Cada componente tiene **una única responsabilidad**:

- **ProductCard.tsx**: Orquestar sub-componentes
- **ProductImage.tsx**: Mostrar imagen con badge
- **ProductSelectors.tsx**: Manejar selección de color/capacidad
- **ProductPricing.tsx**: Mostrar información de precios
- **ProductRating.tsx**: Mostrar rating y stock
- **ProductActions.tsx**: Botones de compra/info/notificar
- **productCardUtils.ts**: Funciones de utilidad puras
- **useProductCardState.ts**: Gestionar estado y side effects

### 2️⃣ Open/Closed Principle (OCP)
Los componentes son **abiertos para extensión, cerrados para modificación**:

```tsx
// Extendible mediante props
<ProductImage 
  onQuickView={customHandler}  // Personalizable
  isNew={true}                 // Configurable
/>
```

### 3️⃣ Liskov Substitution Principle (LSP)
Los componentes pueden sustituirse sin romper funcionalidad:

```tsx
// Puedes reemplazar ProductPricing con otro componente
// que acepte las mismas props
<ProductPricing {...pricingProps} />
```

### 4️⃣ Interface Segregation Principle (ISP)
Interfaces mínimas y específicas:

```tsx
// Cada componente recibe solo lo que necesita
interface ProductImageProps {
  src: string;
  alt: string;
  // Solo props relevantes para imagen
}
```

### 5️⃣ Dependency Inversion Principle (DIP)
Dependencias mediante abstracciones (props):

```tsx
// Componentes dependen de interfaces, no implementaciones
const ProductCard = (props: ProductCardProps) => {
  // Recibe datos abstractos, no implementaciones concretas
}
```

## 📦 Componentes Detallados

### ProductCard.tsx (197 líneas)
**Responsabilidad**: Componente orquestador principal

**Props clave**:
```tsx
{
  id: string;
  name: string;
  image: string | StaticImageData;
  colors: ProductColor[];
  capacities?: ProductCapacity[];
  price?: string;
  originalPrice?: string;
  isNew?: boolean;
  stock?: number;
  sku?: string | null;
  rating?: number;
  reviewCount?: number;
  viewMode?: "grid" | "list";
  monthlyInstallments?: number;
}
```

**Flujo**:
1. Calcula precios actuales según color/capacidad seleccionada
2. Usa hook `useProductCardState` para estado y handlers
3. Renderiza sub-componentes con props específicas
4. Gestiona animaciones (Framer Motion, scroll reveal)
5. Optimiza imágenes (Cloudinary hook)

---

### ProductImage.tsx (85 líneas)
**Responsabilidad**: Mostrar imagen del producto con interacciones

**Features**:
- Badge "NUEVO" (condicional)
- Botón "Vistazo rápido" (hover only)
- Click para ver detalles
- Accesibilidad completa (aria-label, button type)

**Props**:
```tsx
{
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  isNew?: boolean;
  viewMode?: "grid" | "list";
  onImageClick: (e: React.MouseEvent) => void;
  onQuickView: (e: React.MouseEvent) => void;
}
```

---

### ProductSelectors.tsx (93 líneas)
**Responsabilidad**: Selectores de color y capacidad

**Features**:
- Selector de colores (círculos con hex)
- Selector de capacidad (pills)
- Indicador visual de selección
- Manejo especial de color blanco (doble borde)

**Props**:
```tsx
{
  colors?: ProductColor[];
  selectedColor: ProductColor | null;
  onColorSelect: (color: ProductColor) => void;
  capacities?: ProductCapacity[];
  selectedCapacity: ProductCapacity | null;
  onCapacitySelect: (capacity: ProductCapacity) => void;
}
```

---

### ProductPricing.tsx (60 líneas)
**Responsabilidad**: Mostrar precios, descuentos y financiación

**Features**:
- Precio original tachado
- Badge de ahorro en azul
- Precio mensual inline
- Precio total
- Condiciones en texto tiny

**Props**:
```tsx
{
  currentPrice: string;
  currentOriginalPrice?: string;
  savings: number;
  monthlyPrice: string | null;
  monthlyInstallments: number;
  isOutOfStock: boolean;
}
```

---

### ProductRating.tsx (56 líneas)
**Responsabilidad**: Mostrar rating y disponibilidad

**Features**:
- 5 estrellas (llenas/vacías)
- Número de rating
- Cantidad de reviews
- Badge "En existencia" con checkmark

**Props**:
```tsx
{
  rating?: number;
  reviewCount?: number;
  isInStock: boolean;
}
```

---

### ProductActions.tsx (69 líneas)
**Responsabilidad**: Botones de acción

**Features**:
- "Comprar ahora" (negro, loading spinner)
- "Más información" (blanco con borde)
- "Notifícame" (cuando sin stock)
- Prevención de clicks múltiples

**Props**:
```tsx
{
  isOutOfStock: boolean;
  isLoading: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
  onMoreInfo: (e: React.MouseEvent) => void;
  onNotifyMe: (e: React.MouseEvent) => void;
}
```

---

### productCardUtils.ts (142 líneas)
**Responsabilidad**: Funciones de utilidad puras

**Funciones**:

#### `cleanProductName(name: string): string`
Limpia el nombre del producto removiendo conectividad y almacenamiento.

**Ejemplo**:
```tsx
cleanProductName("Samsung Galaxy S24 Ultra 5G 256GB")
// → "Samsung Galaxy S24 Ultra"
```

#### `calculateMonthlyPrice(price: string, installments: number): string | null`
Calcula el precio mensual con formato.

**Ejemplo**:
```tsx
calculateMonthlyPrice("$5,999,000", 12)
// → "499,916.67"
```

#### `calculateSavings(original: string, current: string): number`
Calcula el descuento numérico.

**Ejemplo**:
```tsx
calculateSavings("$6,999,000", "$5,999,000")
// → 1000000
```

#### Tracking Functions
- `trackColorSelection(id, name, color)` - PostHog event
- `trackCapacitySelection(id, name, capacity)` - PostHog event
- `trackAddToCart(id, name, color, sku)` - PostHog event
- `trackMoreInfo(id, name)` - PostHog event

---

### useProductCardState.ts (127 líneas)
**Responsabilidad**: Hook personalizado para gestionar estado

**Retorna**:
```tsx
{
  selectedColor: ProductColor | null;
  selectedCapacity: ProductCapacity | null;
  isLoading: boolean;
  handleColorSelect: (color: ProductColor) => void;
  handleCapacitySelect: (capacity: ProductCapacity) => void;
  handleAddToCart: (e: React.MouseEvent) => Promise<void>;
  handleMoreInfo: (e: React.MouseEvent) => void;
  handleCardClick: (e: React.MouseEvent) => void;
  handleNotifyMe: (e: React.MouseEvent) => void;
}
```

**Features**:
- Estado local de selecciones
- Gestión de loading
- Handlers de eventos
- Integración con cart context
- Tracking automático de eventos
- Navigation routing

## 🚀 Uso

### Ejemplo Básico
```tsx
import ProductCard from "@/app/productos/components/ProductCard";

<ProductCard
  id="samsung-s24-ultra"
  name="Samsung Galaxy S24 Ultra 5G 256GB Negro"
  image="/images/samsung-s24.webp"
  colors={[
    { name: "black", hex: "#000000", label: "Negro", sku: "S24U-256-BLK" },
    { name: "gray", hex: "#6B7280", label: "Gris", sku: "S24U-256-GRY" }
  ]}
  price="$5,999,000"
  originalPrice="$6,999,000"
  rating={4.8}
  reviewCount={429}
  isNew={true}
  stock={10}
  monthlyInstallments={12}
/>
```

### Con Capacidades
```tsx
<ProductCard
  {...basicProps}
  capacities={[
    { value: "128GB", label: "128 GB", price: "$4,999,000", sku: "S24U-128-BLK" },
    { value: "256GB", label: "256 GB", price: "$5,999,000", sku: "S24U-256-BLK" }
  ]}
/>
```

### Modo Lista
```tsx
<ProductCard
  {...basicProps}
  viewMode="list"  // Cambia layout a horizontal
/>
```

## 🎯 Beneficios de la Arquitectura

### ✅ Mantenibilidad
- Cada archivo <200 líneas (fácil de entender)
- Responsabilidades claramente separadas
- Código autoexplicativo

### ✅ Testabilidad
- Componentes pequeños y enfocados
- Funciones puras en utils (fácil de testear)
- Estado aislado en hook

### ✅ Reutilización
- Sub-componentes reutilizables
- Utilities compartidas
- Hook de estado extraíble

### ✅ Escalabilidad
- Fácil agregar nuevos sub-componentes
- Modificar un componente no afecta otros
- Extensible vía props

### ✅ Performance
- Componentes pequeños (re-renders eficientes)
- Imágenes optimizadas (Cloudinary)
- Lazy evaluation de cálculos

## 📝 Checklist de Calidad

- [x] Todos los archivos <200 líneas
- [x] Principios SOLID aplicados
- [x] Sin errores de TypeScript
- [x] Sin errores de lint
- [x] Accesibilidad (aria-labels, buttons)
- [x] Responsive (grid/list modes)
- [x] Animaciones (Framer Motion)
- [x] Tracking (PostHog)
- [x] Optimización de imágenes (Cloudinary)
- [x] Loading states
- [x] Error handling
- [x] Documentación completa

## 🔮 Próximas Mejoras

1. **Tests unitarios** para cada componente
2. **Storybook** para documentación visual
3. **A/B testing** de variantes de diseño
4. **Lazy loading** de sub-componentes
5. **Themes** para diferentes marcas (Samsung, Apple, etc.)
6. **Internacionalización** (i18n) de textos
7. **Skeleton loading** mientras carga data
8. **Error boundaries** para manejo robusto de errores

## 📚 Referencias

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Samsung Colombia Store](https://www.samsung.com/co/)
- [React Best Practices](https://react.dev/learn)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Última actualización**: Diciembre 2024  
**Autor**: IMAGIQ Development Team  
**Versión**: 2.0 - Arquitectura Modular SOLID
