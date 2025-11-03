# Visualización de Códigos de Producto (SKU y Código Market)

## 🎯 Descripción

La aplicación permite mostrar u ocultar los códigos SKU y Código Market de los productos mediante una variable de entorno. Esta funcionalidad es útil para:

- **Desarrollo/Testing**: Ver los códigos para debugging y verificación
- **Producción**: Ocultar los códigos para usuarios finales

## 🔧 Configuración

### Variable de entorno

```bash
NEXT_PUBLIC_SHOW_PRODUCT_CODES=true  # Mostrar códigos
NEXT_PUBLIC_SHOW_PRODUCT_CODES=false # Ocultar códigos (recomendado para producción)
```

### Archivo de configuración

Edita el archivo `.env.local`:

```bash
# Product Display Configuration
# Mostrar SKU y códigos de productos (true/false)
NEXT_PUBLIC_SHOW_PRODUCT_CODES=true
```

### ⚠️ Importante: Rebuild requerido

Las variables de entorno que comienzan con `NEXT_PUBLIC_` son inyectadas en tiempo de build por Next.js. Por lo tanto, **debes hacer un rebuild** después de cambiar el valor:

```bash
bun run build
```

O si estás en desarrollo:

```bash
# Detener el servidor de desarrollo (Ctrl+C)
# Volver a iniciar
bun run dev
```

## 📍 Ubicación de los códigos

Los códigos SKU y Código Market se muestran en:

### 1. ProductCard ([src/app/productos/components/ProductCard.tsx:440](../src/app/productos/components/ProductCard.tsx#L440))

Aparece debajo del nombre del producto, antes del selector de colores:

```
[Nombre del Producto]
SKU: ABC123
Código: XYZ789
```

**Comportamiento dinámico**: Los códigos cambian automáticamente cuando el usuario selecciona:
- Un color diferente
- Una capacidad diferente
- Una memoria RAM diferente

### 2. ProductHeader ([src/app/productos/dispositivos-moviles/detalles-producto/ProductHeader.tsx:62](../src/app/productos/dispositivos-moviles/detalles-producto/ProductHeader.tsx#L62))

Aparece en la página de detalles del producto (vista móvil), junto al stock:

```
SKU: ABC123 | Código: XYZ789 | Stock: 5
```

### 3. ProductInfo ([src/app/productos/viewpremium/components/ProductInfo.tsx:65](../src/app/productos/viewpremium/components/ProductInfo.tsx#L65))

Aparece en la vista premium del producto:

```
SKU: ABC123
Código: XYZ789
Stock disponible: 5 unidades
```

## 🔄 Actualización dinámica

Los códigos mostrados se actualizan automáticamente basándose en:

1. **Color seleccionado**: Cada color tiene su propio SKU y código
2. **Capacidad seleccionada**: Las capacidades pueden tener SKUs diferentes
3. **Memoria RAM**: Si aplica, también afecta el SKU

El sistema utiliza el hook `useProductSelection` para rastrear la variante actualmente seleccionada y mostrar sus códigos correspondientes.

## 🐛 Troubleshooting

### Los códigos no aparecen después de cambiar la variable

**Solución**: Asegúrate de hacer un rebuild completo:

```bash
# Limpiar caché
rm -rf .next

# Rebuild
bun run build
```

### Los códigos no cambian al seleccionar colores/capacidades

**Causa**: El producto no tiene códigos asociados a cada variante en el backend.

**Verificación**: Revisa que el objeto `apiProduct` tenga arrays de `sku` y `codigoMarket` con la misma longitud que los arrays de colores/capacidades.

### Los códigos aparecen como "undefined"

**Causa**: La variante seleccionada no tiene un SKU o código asignado.

**Solución**: Verifica los datos del backend para esa variante específica.

## 📋 Checklist de implementación

- [x] Variable de entorno documentada en `.env.example`
- [x] Implementación en ProductCard
- [x] Implementación en ProductHeader
- [x] Implementación en ProductInfo
- [x] Actualización dinámica basada en selección
- [x] Documentación de uso
- [x] Troubleshooting guide

## 🔗 Referencias

- [Commit original (8fa771e)](https://github.com/Botopia-Tecnology/imagiq-frontend/commit/8fa771e08b9203669cc9468fd806ab29b995395e)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
