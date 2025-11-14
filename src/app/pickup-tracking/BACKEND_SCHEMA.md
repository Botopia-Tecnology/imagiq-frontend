# Backend Schema para Pickup Tracking

## Endpoint

```
GET /api/orders/shipping-info/{orderId}
```

## Estructura de Respuesta Esperada

```typescript
{
  // Datos básicos de la orden
  "orden_id": "078a7d31-65d5-47ed-b786-48a0eb440c26",
  "fecha_creacion": "2025-11-14T10:30:00Z",
  "metodo_envio": "recogida_tienda", // o "tienda" o que incluya "recoger"
  "token": "ABC123",
  "hora_recogida_autorizada": "14:00:00", // o null si está pendiente

  // Array de productos (de la tabla orden_items)
  "productos": [
    {
      "id": "142f64e8-22bd-40...",
      "nombre": "Galaxy Tab S9",
      "imagen": "https://imagiq.com/productos/galaxy-tab-s9.jpg", // URL de imagen
      "cantidad": 1,
      "precio": 4499900.00
    },
    {
      "id": "89d04542-9691-47...",
      "nombre": "Galaxy Z Flip 7 FE 5G",
      "imagen": "https://imagiq.com/productos/galaxy-z-flip.jpg",
      "cantidad": 1,
      "precio": 5399900.00
    }
  ],

  // Información de la tienda (opcional pero recomendado)
  "tienda": {
    "nombre": "IMAGIQ Centro Comercial Andino",
    "direccion": "Carrera 11 #82-71, Local 203",
    "ciudad": "Bogotá",
    "telefono": "+57 (601) 234-5678",
    "horario": "Lunes a Sábado: 10:00 AM - 8:00 PM"
  }
}
```

## Campos Requeridos vs Opcionales

### ✅ Requeridos
- `orden_id` - Identificador de la orden
- `fecha_creacion` - Fecha de creación de la orden
- `metodo_envio` - Debe contener "recoger" o "tienda"
- `token` - Token de recogida

### ⚠️ Opcionales pero Importantes
- `hora_recogida_autorizada` - Hora estimada de recogida (puede ser null si está pendiente)
- `productos` - Array de productos (si no se provee, se usa vista básica)
- `tienda` - Información de la tienda (si no se provee, se oculta esa sección)

## Consulta SQL Sugerida

```sql
SELECT
  o.orden_id,
  o.fecha_creacion,
  o.metodo_envio,
  rt.token,
  rt.hora_recogida_autorizada,

  -- Array de productos
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'id', oi.orden_id || '-' || oi.sku,
      'nombre', oi.nombre,
      'imagen', p.imagen_url, -- Desde tabla productos
      'cantidad', oi.cantidad,
      'precio', oi.unit_price
    )
  ) as productos,

  -- Información de la tienda
  JSON_BUILD_OBJECT(
    'nombre', t.nombre,
    'direccion', t.direccion,
    'ciudad', t.ciudad,
    'telefono', t.telefono,
    'horario', t.horario
  ) as tienda

FROM ordenes o
LEFT JOIN recogida_tienda rt ON rt.orden_id = o.orden_id
LEFT JOIN orden_items oi ON oi.orden_id = o.orden_id
LEFT JOIN productos p ON p.sku = oi.sku
LEFT JOIN tiendas t ON t.codigo = rt.codbodega

WHERE o.orden_id = $1
  AND o.metodo_envio IN ('recogida_tienda', 'recoger_en_tienda')

GROUP BY o.orden_id, rt.token, rt.hora_recogida_autorizada, t.nombre, t.direccion, t.ciudad, t.telefono, t.horario;
```

## Ejemplo de Respuesta Completa

```json
{
  "orden_id": "078a7d31-65d5-47ed-b786-48a0eb440c26",
  "fecha_creacion": "2025-11-14T10:30:00.000Z",
  "metodo_envio": "recogida_tienda",
  "token": "PICK-2025-001",
  "hora_recogida_autorizada": "16:00:00",
  "productos": [
    {
      "id": "078a7d31-SM-X710NZADCOO",
      "nombre": "Galaxy Tab S9 11\" 128GB WiFi - Gris",
      "imagen": "https://cdn.imagiq.com/products/sm-x710nzadcoo.jpg",
      "cantidad": 1,
      "precio": 4499900
    }
  ],
  "tienda": {
    "nombre": "IMAGIQ Centro Andino",
    "direccion": "Carrera 11 #82-71, Local 203",
    "ciudad": "Bogotá",
    "telefono": "+57 601 234 5678",
    "horario": "Lun-Sáb: 10AM - 8PM, Dom: 11AM - 6PM"
  }
}
```

## Comportamiento del Frontend

### Con Productos y Tienda (Vista Mejorada)
- ✅ Muestra información de orden en columna izquierda
- ✅ Muestra información de tienda en columna izquierda
- ✅ Muestra lista de productos con imágenes en columna derecha
- ✅ Muestra token destacado

### Sin Productos (Vista Básica)
- ✅ Muestra solo información básica de orden
- ✅ Muestra token
- ✅ Muestra instrucciones de recogida

## Notas Importantes

1. **Imágenes**: Las URLs de imágenes deben ser accesibles públicamente o estar configuradas en Next.js config (`next.config.js`) en el array `images.domains`

2. **Token**: El token debe ser único y fácil de leer para el cliente

3. **Hora de Recogida**: Si es `null` o vacío, se mostrará "Pendiente por asignar"

4. **Estado**: El estado se calcula automáticamente:
   - Con hora = "Listo para recoger"
   - Sin hora = "Preparando pedido"
