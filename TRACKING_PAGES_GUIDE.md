# 📦 Guía de Páginas de Tracking - IMAGIQ

## Resumen

Se crearon **3 páginas** diferentes para tracking de órdenes:

1. **`/tracking-service/[orderId]`** - Página general (auto-detecta tipo)
2. **`/imagiq-tracking/[orderId]`** - Específica para envíos IMAGIQ (sin PDF)
3. **`/pickup-tracking/[orderId]`** - Específica para recogida en tienda

---

## 🎯 1. Tracking Service (General)

**Ruta:** `/tracking-service/[orderId]`

### Descripción
Página inteligente que **detecta automáticamente** el tipo de envío y muestra la vista correspondiente.

### Lógica de Detección
```typescript
// Detecta si es pickup
const showPickup = metodoEnvio.includes("recoger") || metodoEnvio.includes("tienda");

// Detecta si usa vista mejorada de pickup
const showEnhancedPickup = showPickup && (productos.length > 0 || tiendaInfo);

// Detecta si es IMAGIQ (sin PDF)
const showImagiqShipping = !showPickup && !pdfBase64;

// Detecta si es Coordinadora (con PDF)
const showCoordinadoraShipping = !showPickup && pdfBase64;
```

### Vistas que Puede Mostrar
- ✅ ShippingOrderView (Coordinadora con PDF)
- ✅ ImagiqShippingView (IMAGIQ sin PDF)
- ✅ EnhancedPickupOrderView (Pickup con productos)
- ✅ PickupOrderView (Pickup básico)

---

## 📬 2. IMAGIQ Tracking (Sin PDF)

**Ruta:** `/imagiq-tracking/[orderId]`

### Descripción
Página específica para envíos realizados por **IMAGIQ** que NO generan PDF.

### Características
- ✅ Timeline de eventos de tracking
- ✅ Información de entrega (dirección, destinatario)
- ✅ Fechas estimadas de entrega
- ✅ Botones de contacto (WhatsApp + Teléfono)
- ❌ **NO muestra PDF**

### Layout
```
┌─────────────────────────────────────────────────┐
│           Header: Información de Envío          │
├──────────────────────┬──────────────────────────┤
│  Timeline Eventos    │  Info de Entrega         │
│                      │  - Orden #               │
│  • Creado           │  - Dirección             │
│  • En tránsito      │  - Destinatario          │
│  • En ruta          │  - Teléfono              │
│                      │                          │
│                      │  ℹ️  Instrucciones       │
│                      │                          │
│                      │  📞 Contacto             │
└──────────────────────┴──────────────────────────┘
```

### Datos del Backend Requeridos
```typescript
{
  numero_guia: string,
  tiempo_entrega_estimado: string,
  eventos: Array<{evento: string, time_stamp: string}>,
  direccion_entrega?: string,
  ciudad_entrega?: string,
  nombre_destinatario?: string,
  telefono_destinatario?: string
}
```

---

## 🏪 3. Pickup Tracking (Recogida en Tienda)

**Ruta:** `/pickup-tracking/[orderId]`

### Descripción
Página específica para órdenes de **recogida en tienda** con lista de productos.

### Características
- ✅ Token de recogida destacado
- ✅ Lista de productos con imágenes
- ✅ Información de tienda (dirección, horarios)
- ✅ Instrucciones de recogida
- ✅ Estado de preparación

### Layout Vista Mejorada (con productos)
```
┌─────────────────────────────────────────────────┐
│       ✅ Pedido listo para recoger              │
├──────────────────────┬──────────────────────────┤
│  📋 Info del Pedido  │  🛍️  Productos          │
│  - Orden #           │                          │
│  - Token: ABC123     │  ┌────────────────────┐  │
│  - Fecha             │  │ 🖼️  Galaxy Tab S9  │  │
│  - Hora recogida     │  │    Cantidad: 1     │  │
│  - Estado            │  │    $4,499,900     │  │
│                      │  └────────────────────┘  │
│  📍 Tienda          │                          │
│  - Nombre            │  ┌────────────────────┐  │
│  - Dirección         │  │ 🖼️  Galaxy Z Flip  │  │
│  - Teléfono          │  │    Cantidad: 1     │  │
│  - Horario           │  │    $5,399,900     │  │
│                      │  └────────────────────┘  │
│  ℹ️  Instrucciones   │                          │
│                      │  🎫 Token: ABC123        │
└──────────────────────┴──────────────────────────┘
```

### Layout Vista Básica (sin productos)
```
┌─────────────────────────────────────────┐
│   ✅ Pedido listo para recoger          │
│                                         │
│   📋 Información del Pedido             │
│   - Orden #                             │
│   - Token: ABC123                       │
│   - Fecha                               │
│   - Hora de recogida                    │
│   - Estado                              │
│                                         │
│   ℹ️  Instrucciones para recoger        │
└─────────────────────────────────────────┘
```

### Datos del Backend Requeridos

**Mínimo (Vista Básica):**
```typescript
{
  orden_id: string,
  token: string,
  fecha_creacion: string,
  metodo_envio: "recogida_tienda",
  hora_recogida_autorizada?: string | null
}
```

**Completo (Vista Mejorada):**
```typescript
{
  orden_id: string,
  token: string,
  fecha_creacion: string,
  metodo_envio: "recogida_tienda",
  hora_recogida_autorizada?: string | null,

  // Array de productos
  productos: [
    {
      id: string,
      nombre: string,
      imagen?: string,  // URL de imagen
      cantidad: number,
      precio?: number
    }
  ],

  // Info de tienda
  tienda: {
    nombre: string,
    direccion: string,
    ciudad: string,
    telefono: string,
    horario: string
  }
}
```

---

## 🔀 Flujo de Decisión

```
Usuario accede a orden
         │
         ├─→ /tracking-service/[orderId] (Recomendado - Auto-detecta)
         │        │
         │        ├─→ metodo_envio incluye "recoger"?
         │        │   ├─ SÍ → ¿Tiene productos?
         │        │   │       ├─ SÍ → EnhancedPickupOrderView
         │        │   │       └─ NO → PickupOrderView
         │        │   │
         │        │   └─ NO → ¿Tiene PDF?
         │        │           ├─ SÍ → ShippingOrderView (Coordinadora)
         │        │           └─ NO → ImagiqShippingView
         │
         ├─→ /imagiq-tracking/[orderId] (Directo IMAGIQ)
         │        └─→ ImagiqShippingView
         │
         └─→ /pickup-tracking/[orderId] (Directo Pickup)
                  └─→ EnhancedPickupOrderView o PickupOrderView
```

---

## 🎨 Características de Diseño

### Colores Principales
- **Azul Corporativo:** `#17407A`
- **Verde Éxito:** `#10B981`
- **Morado Acento:** `#8B5CF6`

### Responsive
- ✅ Mobile First
- ✅ Layout de 2 columnas en desktop (lg:)
- ✅ Stack vertical en móvil

### Componentes Reutilizables
- `TrackingHeader` - Header con info de orden
- `TrackingTimeline` - Timeline de eventos
- `OrderInfoCard` - Tarjeta de información
- `InstructionsBox` - Caja de instrucciones
- `PDFViewer` - Visor de PDF

---

## 📝 Notas para el Backend

1. **Endpoint:** `/api/orders/shipping-info/{orderId}`

2. **Imágenes de Productos:**
   - Deben venir del JOIN con tabla `productos` usando el `sku`
   - Las URLs deben ser accesibles públicamente
   - Configurar dominio en `next.config.js`:
   ```javascript
   images: {
     domains: ['cdn.imagiq.com', 'imagiq.com']
   }
   ```

3. **Token:**
   - Debe ser único y fácil de leer
   - Formato sugerido: `PICK-2025-001`

4. **Consulta SQL de Ejemplo:**
   Ver archivo: `/src/app/pickup-tracking/BACKEND_SCHEMA.md`

---

## 🚀 Uso

### Para Enlaces Directos
```typescript
// IMAGIQ Shipping
<Link href={`/imagiq-tracking/${orderId}`}>Ver Envío</Link>

// Pickup
<Link href={`/pickup-tracking/${orderId}`}>Ver Orden</Link>

// Auto-detecta
<Link href={`/tracking-service/${orderId}`}>Ver Seguimiento</Link>
```

### Para Emails/SMS
```
Envío IMAGIQ: https://imagiq.com/imagiq-tracking/123456
Recogida: https://imagiq.com/pickup-tracking/789012
General: https://imagiq.com/tracking-service/123456
```

---

## ✅ Testing

```bash
# Build
npm run build

# Verificar rutas
npm run build | grep tracking

# Resultado esperado:
# ├ ƒ /imagiq-tracking/[orderId]
# ├ ƒ /pickup-tracking/[orderId]
# ├ ƒ /tracking-service/[orderId]
```
