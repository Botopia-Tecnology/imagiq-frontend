# Pickup Tracking Page

Página dedicada para el seguimiento de pedidos con recogida en tienda.

## Características

- ✅ Token de recogida destacado
- ✅ Lista de productos con imágenes
- ✅ Información de la tienda (dirección, horarios, teléfono)
- ✅ Instrucciones de recogida
- ✅ Hora estimada de recogida
- ✅ Vista mejorada cuando hay productos disponibles
- ✅ Vista básica como fallback

## URL

```
/pickup-tracking/[orderId]
```

## Ejemplo

```
/pickup-tracking/123456
```

## Cuándo usar

Usar esta página cuando el método de envío es **recogida en tienda** o **pickup**.

## Vistas

### Vista Mejorada
Se muestra cuando hay productos o información de tienda disponible:
- Columna izquierda: Información de orden + datos de tienda
- Columna derecha: Lista de productos + token destacado

### Vista Básica
Se muestra como fallback cuando no hay productos:
- Información básica del pedido
- Token
- Instrucciones de recogida

## Diferencia con tracking-service

- `tracking-service` es la página general que detecta automáticamente el tipo de envío
- `pickup-tracking` es específica para pedidos de recogida en tienda
