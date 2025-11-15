# 🔐 Migración a API con Autenticación

## ✅ Cambios Implementados

### 1. Cliente HTTP Centralizado

**Archivo creado:** `src/lib/api-client.ts`

Este módulo proporciona funciones helper para hacer peticiones HTTP al backend con **API Key automática**.

**Funciones disponibles:**
- `apiGet<T>(endpoint)` - GET requests con tipado
- `apiPost<T>(endpoint, data)` - POST requests con tipado
- `apiPut<T>(endpoint, data)` - PUT requests con tipado
- `apiPatch<T>(endpoint, data)` - PATCH requests con tipado
- `apiDelete<T>(endpoint)` - DELETE requests con tipado
- `apiClient(endpoint, options)` - Cliente base para casos personalizados

**Características:**
- ✅ API Key incluida automáticamente en header `X-API-Key`
- ✅ Manejo de errores 401 (API Key inválida)
- ✅ Manejo de errores 429 (Rate limit excedido)
- ✅ TypeScript genéricos para tipado fuerte
- ✅ Advertencia en consola si falta API Key (desarrollo)

### 2. ApiClient Actualizado

**Archivo:** `src/lib/api.ts`

La clase `ApiClient` existente ahora incluye automáticamente el header de API Key.

**Cambios:**
```typescript
// Se agregó al constructor:
this.headers = {
  "Content-Type": "application/json",
  ...(API_KEY && { "X-API-Key": API_KEY }),
};
```

### 3. MaintenanceScreen Migrado

**Archivo:** `src/components/MaintenanceScreen.tsx`

Actualizado para usar `apiGet` en lugar de `fetch` directo.

**Antes:**
```typescript
const response = await fetch(
  `${API_URL}/api/products/search/grouped?modelo=${modelo}&limit=1`
);
const data = await response.json();
```

**Después:**
```typescript
const data = await apiGet<{
  success: boolean;
  data?: { products: ProductApiData[] };
}>(`/api/products/search/grouped?modelo=${modelo}&limit=1`);
```

---

## 📝 Guía de Migración para Otros Archivos

### Paso 1: Importar el cliente

```typescript
import { apiGet, apiPost } from '@/lib/api-client';
```

### Paso 2: Reemplazar llamadas fetch

#### GET Request

**Antes:**
```typescript
const response = await fetch(`${API_URL}/api/products`);
const data = await response.json();
```

**Después:**
```typescript
const data = await apiGet<Product[]>('/api/products');
```

#### POST Request

**Antes:**
```typescript
const response = await fetch(`${API_URL}/api/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData),
});
const data = await response.json();
```

**Después:**
```typescript
const data = await apiPost<Order>('/api/orders', orderData);
```

---

## 📂 Archivos Pendientes de Migración

Los siguientes archivos tienen llamadas `fetch` que deben revisarse y migrar:

### Alta Prioridad (llamadas al backend Imagiq)

- `src/services/addresses.service.ts`
- `src/app/carrito/Step2.tsx`
- `src/services/profile.service.ts`
- `src/hooks/useStockNotification.ts`
- `src/services/ceroInteresService.ts`
- `src/config/home/useHomeConfig.ts`
- `src/app/success-checkout/[orderId]/page.tsx`
- `src/app/verify-purchase/[id]/page.tsx`

### Media Prioridad (verificar si usan backend Imagiq)

- `src/components/dropdowns/dynamic/DesktopView.tsx`
- `src/components/Navbar.tsx`
- `src/app/productos/[categoria]/components/SubmenuCarousel.tsx`
- `src/app/login/create-account/page.tsx`
- `src/app/login/page.tsx`
- `src/app/carrito/utils/index.ts`
- `src/app/imagiq-tracking/components/DeliveryMap.tsx`
- `src/hooks/usePrefetchProducts.ts`
- `src/hooks/usePreloadAllProducts.ts`
- `src/app/productos/[categoria]/components/MenuCarousel.tsx`

### Baja Prioridad (probablemente servicios externos)

- `src/services/googleMapsLoader.ts` (Google Maps API)
- `src/lib/flixmedia.ts` (Flixmedia API)
- `src/app/api/gemini/route.ts` (Gemini API)
- `src/app/chatbot/apikey.tsx`
- `src/services/places.service.ts` (puede usar Google Places)
- `src/lib/sentry/client.ts` (Sentry API)

---

## 🧪 Testing

### Verificar que API Key está configurada

```typescript
import { isApiKeyConfigured } from '@/lib/api-client';

if (!isApiKeyConfigured()) {
  console.error('⚠️ API Key no configurada');
}
```

### Probar en desarrollo

1. Agregar a `.env.local`:
   ```bash
   NEXT_PUBLIC_API_KEY=IMAGIQ_4fe423f679538b1d4e12685b947337a49c589d358b4154b3981d005777e9a1e0
   ```

2. Reiniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Verificar en consola del navegador:
   - NO debería aparecer warning de API Key faltante
   - Las peticiones deberían incluir header `X-API-Key`

### Verificar headers en Chrome DevTools

1. Abrir DevTools → Network tab
2. Hacer una petición al API
3. Seleccionar la petición
4. Tab "Headers"
5. Verificar que aparezca: `X-API-Key: IMAGIQ_4fe423...`

---

## 🚨 Errores Comunes

### Error 401: "API key is required"

**Causa:** No se está enviando el header `X-API-Key`

**Solución:**
1. Verificar que `.env.local` tenga `NEXT_PUBLIC_API_KEY`
2. Reiniciar servidor de desarrollo
3. Usar `apiGet`, `apiPost`, etc. en lugar de `fetch` directo

### Error 401: "Invalid API key"

**Causa:** La key en `.env.local` no coincide con la del backend

**Solución:**
Verificar que la key sea exactamente:
```
IMAGIQ_4fe423f679538b1d4e12685b947337a49c589d358b4154b3981d005777e9a1e0
```

### Error 429: "Too Many Requests"

**Causa:** Se excedieron los límites de rate limiting (10 req/s, 50 req/10s, 200 req/min)

**Solución:**
- Implementar debouncing en búsquedas
- Usar caching (React Query, SWR)
- Esperar antes de reintentar

---

## 📊 Progreso de Migración

- [x] Cliente HTTP centralizado (`api-client.ts`)
- [x] ApiClient existente actualizado (`api.ts`)
- [x] MaintenanceScreen migrado
- [x] .env.example actualizado
- [ ] services/addresses.service.ts
- [ ] app/carrito/Step2.tsx
- [ ] services/profile.service.ts
- [ ] hooks/useStockNotification.ts
- [ ] Resto de archivos...

---

## 💡 Tips

1. **Usar ApiClient existente:** La clase `ApiClient` en `src/lib/api.ts` ya está actualizada con API Key. Código que la use no necesita cambios.

2. **Migración gradual:** No es necesario migrar todos los archivos de golpe. La clase `ApiClient` existente ya incluye la API Key.

3. **TypeScript:** Aprovechar los genéricos para tipado fuerte:
   ```typescript
   const products = await apiGet<Product[]>('/api/products');
   // products está tipado como Product[]
   ```

4. **Manejo de errores:** El cliente ya maneja errores 401 y 429 automáticamente.

---

**Última actualización:** 2025-11-15
