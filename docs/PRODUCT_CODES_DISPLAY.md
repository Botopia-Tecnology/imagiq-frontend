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

### Desarrollo Local

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

### 🚀 Configuración en Vercel (Producción)

**⚠️ IMPORTANTE**: Vercel NO lee el archivo `.env.local`. Debes configurar las variables manualmente.

#### Paso 1: Añadir variable en Vercel Dashboard

1. Ve a tu proyecto en Vercel: https://vercel.com/[tu-equipo]/imagiq-frontend
2. Navega a **Settings** → **Environment Variables**
3. Click en **Add New**
4. Configura:
   - **Key (Name)**: `NEXT_PUBLIC_SHOW_PRODUCT_CODES`
   - **Value**: `true` o `false`
   - **Environments**: Selecciona según necesidad:
     - ✅ **Production** - Para el sitio en producción
     - ✅ **Preview** - Para PRs y branches
     - ⬜ **Development** - Para desarrollo local (opcional, usa `.env.local`)

#### Paso 2: Redeploy

**Las variables de entorno solo se aplican en nuevos deploys**, no afectan deploys existentes.

**Opción A - Redeploy manual desde Dashboard**:
1. Ve a **Deployments**
2. Encuentra el último deployment exitoso
3. Click en los 3 puntos (...) → **Redeploy**
4. Confirma el redeploy

**Opción B - Redeploy desde Git**:
```bash
# Commit vacío para trigger deploy
git commit --allow-empty -m "chore: trigger redeploy para aplicar env vars"
git push origin main
```

**Opción C - Desde CLI de Vercel**:
```bash
vercel --prod
```

#### Verificación en Vercel

Después del deploy, verifica que la variable esté aplicada:

1. Ve al deployment en Vercel
2. Click en **Runtime Logs** o **Function Logs**
3. Los códigos SKU/Market deberían aparecer si está en `true`

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

### Los códigos no aparecen en desarrollo local

**Causa**: No se hizo rebuild después de cambiar `.env.local`

**Solución**:
```bash
# Limpiar caché
rm -rf .next

# Rebuild
bun run build

# Reiniciar dev server
bun run dev
```

### Los códigos no aparecen en Vercel (Producción)

**Causa más común**: La variable NO está configurada en Vercel Dashboard

**Solución**:
1. ✅ Verifica que la variable existe en Vercel:
   - Settings → Environment Variables
   - Debe existir `NEXT_PUBLIC_SHOW_PRODUCT_CODES=true`
2. ✅ Verifica que esté habilitada para el environment correcto:
   - Production (para producción)
   - Preview (para PRs/branches)
3. ✅ Haz un redeploy:
   ```bash
   git commit --allow-empty -m "chore: trigger redeploy"
   git push origin main
   ```

**Verificación**:
- Ve al deployment en Vercel
- Click en "Environment Variables" del deployment
- Confirma que `NEXT_PUBLIC_SHOW_PRODUCT_CODES` aparece como `true`

### Los códigos no cambian al seleccionar colores/capacidades

**Causa**: El producto no tiene códigos asociados a cada variante en el backend.

**Verificación**: Revisa que el objeto `apiProduct` tenga arrays de `sku` y `codigoMarket` con la misma longitud que los arrays de colores/capacidades.

**Debug**:
```typescript
console.log('Product SKUs:', apiProduct?.sku);
console.log('Product Codes:', apiProduct?.codigoMarket);
console.log('Selected index:', variantIndex);
```

### Los códigos aparecen como "undefined"

**Causa**: La variante seleccionada no tiene un SKU o código asignado.

**Solución**: Verifica los datos del backend para esa variante específica.

### Rebuild en Vercel pero los cambios no se ven

**Causa**: Cache del navegador

**Solución**:
1. Hard refresh: `Cmd/Ctrl + Shift + R`
2. Limpiar caché del navegador
3. Probar en modo incógnito
4. Verificar que estás viendo el deployment correcto (revisa la URL)

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
