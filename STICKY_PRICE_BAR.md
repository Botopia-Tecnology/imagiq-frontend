# 🎯 StickyPriceBar - Barra de Precio Sticky

## 📋 Descripción

Componente sticky que se muestra en la parte inferior de la página de detalle del producto, mostrando información dinámica de precios con financiación Addi y un CTA prominente.

## ✨ Características Implementadas

### 1. Layout de 3 Columnas

```
┌──────────────────────────────────────────────────────────────┐
│  Nombre del Dispositivo  │  Precio + Financiación  │   CTA   │
│  (Izquierda)             │  (Centro)               │ (Derecha)│
└──────────────────────────────────────────────────────────────┘
```

### 2. Información Mostrada

#### **Izquierda - Nombre del Dispositivo**
- Nombre completo del producto
- Capacidad seleccionada (si aplica)
- Color seleccionado (si aplica)
- Ejemplo: `Samsung Galaxy S24 Ultra 256GB - Negro`

#### **Centro - Precio Dinámico**

**Con Financiación Addi:**
```
Desde $ 316.658 al mes en 12 cuotas sin intereses*
o $ 3.799.900

Precio original: $ 4.042.447
Ahorra $ 242.547

*Aplican condiciones. Sujeto a aprobación crediticia.
```

**Sin Financiación Addi:**
```
$ 3.799.900
Precio original: $ 4.042.447
Ahorra $ 242.547
```

#### **Derecha - CTA**
- Botón "Comprar ahora" con icono de carrito
- Color Samsung: `#0066CC`
- Animaciones suaves con Framer Motion

### 3. Comportamiento

- ✅ **Aparece después de 300px de scroll** (para no molestar al inicio)
- ✅ **Animación suave** de entrada/salida
- ✅ **Actualización en tiempo real** según configuración seleccionada
- ✅ **Responsive** - se adapta a móviles y desktop
- ✅ **Fixed position** - siempre visible al hacer scroll

---

## 📁 Archivos Modificados/Creados

### Creado:
- `src/app/productos/dispositivos-moviles/detalles-producto/StickyPriceBar.tsx`

### Modificado:
- `src/app/productos/dispositivos-moviles/detalles-producto/DetailsProductSection.tsx`

---

## 🔧 Props del Componente

```typescript
interface StickyPriceBarProps {
  deviceName: string;           // Nombre del dispositivo
  basePrice: number;            // Precio base actual
  originalPrice?: number;       // Precio original (para mostrar descuento)
  discount?: number;            // Monto del descuento
  selectedStorage?: string;     // Capacidad seleccionada (ej: "256GB")
  selectedColor?: string;       // Color seleccionado (ej: "Negro")
  hasAddiFinancing?: boolean;   // Si muestra financiación Addi
  onBuyClick?: () => void;      // Callback al hacer click en "Comprar"
  isVisible?: boolean;          // Control manual de visibilidad
}
```

---

## 💡 Cómo Funciona

### 1. Cálculo de Precio Mensual
```typescript
const monthlyPayment = basePrice / 12;
// Ejemplo: $3,799,900 / 12 = $316,658.33
```

### 2. Cálculo de Ahorro
```typescript
const savings = discount || (originalPrice ? originalPrice - basePrice : 0);
// Ejemplo: $4,042,447 - $3,799,900 = $242,547
```

### 3. Detección de Scroll
```typescript
useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 300); // Mostrar después de 300px
  };
  window.addEventListener("scroll", handleScroll);
}, []);
```

### 4. Actualización Dinámica

El componente se actualiza automáticamente cuando el usuario:
- Cambia la capacidad del dispositivo
- Selecciona un color diferente
- Elige una variante diferente

---

## 🎨 Estilos y Diseño

### Colores Samsung
- Azul principal: `#0066CC`
- Azul hover: `#0052A3`
- Gradiente decorativo: `linear-gradient(90deg, #0066CC 0%, #00A3E0 100%)`

### Typography
- Font family: `SamsungSharpSans`
- Tamaños:
  - Precio mensual: `text-2xl md:text-3xl`
  - Detalles: `text-sm`
  - Notas: `text-xs`

### Responsive
- **Mobile (`< 768px`):**
  - Oculta nombre del dispositivo
  - CTA más compacto
  - Texto más pequeño

- **Desktop (`>= 768px`):**
  - Layout completo de 3 columnas
  - CTA con texto completo
  - Más espacio entre elementos

---

## 🧪 Ejemplo de Uso

```tsx
<StickyPriceBar
  deviceName="Samsung Galaxy S24 Ultra"
  basePrice={3799900}
  originalPrice={4042447}
  discount={242547}
  selectedStorage="256GB"
  selectedColor="Negro"
  hasAddiFinancing={true}
  onBuyClick={() => router.push("/carrito")}
  isVisible={true}
/>
```

---

## 🚀 Mejoras Futuras Posibles

- [ ] Integración directa con API de Addi para calcular cuotas reales
- [ ] Opción de elegir número de cuotas (6, 12, 18, 24 meses)
- [ ] Mostrar tasa de interés según cuotas
- [ ] Comparador de métodos de pago
- [ ] Badge de "Envío gratis" si aplica
- [ ] Tiempo estimado de entrega
- [ ] Stock disponible en tiempo real

---

## 📱 Screenshots de Comportamiento

### Estado Inicial (antes de scroll)
```
┌─────────────────────────────────┐
│                                 │
│  Contenido de la página...      │
│                                 │
└─────────────────────────────────┘
     (StickyPriceBar oculto)
```

### Después de 300px de scroll
```
┌─────────────────────────────────┐
│                                 │
│  Contenido de la página...      │
│                                 │
├─────────────────────────────────┤
│ Galaxy S24 │ $316,658/mes │ 🛒  │ ← StickyPriceBar
└─────────────────────────────────┘
```

---

## 🔗 Integración con Contextos

El componente se integra con:

1. **useDeviceVariants** - Para obtener precio dinámico según variante
2. **useCartContext** - Para agregar al carrito al hacer clic
3. **useRouter** - Para navegar al carrito

---

## ✅ Checklist de Implementación

- [x] Componente StickyPriceBar creado
- [x] Integrado en DetailsProductSection
- [x] Cálculo de precio mensual Addi
- [x] Cálculo de ahorro/descuento
- [x] Actualización dinámica con variantes
- [x] Animaciones con Framer Motion
- [x] Responsive design
- [x] Detección de scroll
- [x] CTA funcional
- [x] Formateo de precios en COP

---

## 🎯 Resultado Final

El usuario ahora ve una barra sticky inferior que:

✅ Muestra el precio actualizado según su configuración
✅ Presenta opciones de financiación con Addi de forma clara
✅ Permite comprar con un click desde cualquier punto de la página
✅ Se mantiene visible mientras navega por los detalles del producto
✅ Es responsive y funciona en móvil y desktop

---

**Desarrollado para Imagiq** 🚀
