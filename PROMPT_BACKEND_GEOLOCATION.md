# Prompt para Backend - Endpoints de Geolocalización

## Endpoint Principal: Crear Dirección con Geolocalización (OPTIMIZADO)

**POST /api/addresses/create-from-geolocation**

Este endpoint hace TODO en una sola operación (geocoding + creación de dirección) para máxima eficiencia.

### Request Headers (Requeridos)
```
X-API-Key: {API_KEY}                    // API Key de la aplicación
Authorization: Bearer {token}            // Token JWT del usuario (opcional para guests)
Content-Type: application/json
```

### Request Body
```json
{
  "latitude": number,
  "longitude": number,
  "usuarioId": string,
  "tipoDireccion": "casa" | "trabajo" | "otro",
  "esPredeterminada": boolean
}
```

**Ejemplo:**
```json
{
  "latitude": 4.7109886,
  "longitude": -74.072092,
  "usuarioId": "guest_1701234567890_abc123xyz",
  "tipoDireccion": "casa",
  "esPredeterminada": true
}
```

**Nota sobre autenticación:**
- El frontend envía automáticamente `X-API-Key` (configurada en `.env.local`)
- Si el usuario está logueado, también envía `Authorization: Bearer {token}`
- Para usuarios guest, el `usuarioId` viene en el body (formato: `guest_{timestamp}_{random}`)

### Proceso Interno

El backend debe hacer TODO esto en una sola operación:

1. **Reverse Geocoding** con Google Maps API:
   ```
   https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={API_KEY}&language=es
   ```

2. **Extraer datos del geocoding:**
   - `formatted_address` → dirección completa
   - `place_id` → ID del lugar de Google
   - `address_components` → buscar:
     - `locality` → ciudad (o `administrative_area_level_2` como fallback)
     - `country` → país
     - Opcionalmente: código DANE si está disponible

3. **Crear PlaceDetails:**
   ```json
   {
     "placeId": "ChIJKcM...",
     "formattedAddress": "Calle 123 #45-67, Bogotá",
     "latitude": 4.7109886,
     "longitude": -74.072092,
     "city": "Bogotá",
     "addressComponents": [...],
     "types": ["street_address"]
   }
   ```

4. **Crear dirección en base de datos:**
   ```json
   {
     "nombreDireccion": "Mi ubicación (Bogotá)",
     "tipo": "AMBOS",
     "tipoDireccion": "casa",
     "esPredeterminada": true,
     "placeDetails": { ... },
     "ciudad": "Bogotá",
     "usuarioId": "guest_...",
     "direccionFormateada": "Calle 123 #45-67, Bogotá",
     "pais": "Colombia",
     "codigo_dane": null
   }
   ```

5. **Si `esPredeterminada = true`:**
   - Actualizar todas las otras direcciones del usuario a `esPredeterminada = false`

### Response Exitoso (200)
```json
{
  "success": true,
  "data": {
    "id": "dir_123abc",
    "usuarioId": "guest_1701234567890_abc123xyz",
    "nombreDireccion": "Mi ubicación (Bogotá)",
    "direccionFormateada": "Calle 123 #45-67, Bogotá, Colombia",
    "ciudad": "Bogotá",
    "pais": "Colombia",
    "codigo_dane": null,
    "tipo": "AMBOS",
    "tipoDireccion": "casa",
    "esPredeterminada": true,
    "placeDetails": {
      "placeId": "ChIJKcM...",
      "formattedAddress": "Calle 123 #45-67, Bogotá",
      "latitude": 4.7109886,
      "longitude": -74.072092,
      "city": "Bogotá",
      "addressComponents": [],
      "types": ["street_address"]
    },
    "createdAt": "2024-12-04T12:30:00.000Z",
    "updatedAt": "2024-12-04T12:30:00.000Z"
  }
}
```

### Response Error (400/500)
```json
{
  "success": false,
  "error": "INVALID_COORDINATES",
  "message": "Las coordenadas proporcionadas no son válidas"
}
```

### Validaciones

**Request:**
- `latitude`: requerido, debe estar entre -90 y 90
- `longitude`: requerido, debe estar entre -180 y 180
- `usuarioId`: requerido, string no vacío
- `tipoDireccion`: requerido, debe ser "casa", "trabajo" o "otro"
- `esPredeterminada`: requerido, boolean

**Errores posibles:**
- `INVALID_COORDINATES`: Coordenadas fuera de rango
- `GEOCODING_FAILED`: Google Maps API falló (ZERO_RESULTS, OVER_QUERY_LIMIT, REQUEST_DENIED, etc.)
- `INVALID_ADDRESS`: No se pudo obtener una dirección válida
- `DATABASE_ERROR`: Error al guardar en base de datos
- `MISSING_FIELDS`: Campos requeridos faltantes

### Ventajas de Este Enfoque

✅ **Una sola petición HTTP** (frontend → backend)
✅ **Reduce latencia de red** (de ~2 llamadas a 1)
✅ **Transacción atómica** (geocoding + creación)
✅ **Manejo de errores centralizado**
✅ **Código frontend más simple**
✅ **La API key de Google Maps solo está en el backend** (más seguro)

---

## Endpoint Alternativo (Opcional): Solo Reverse Geocoding

**POST /api/geocoding/reverse**

Si necesitan un endpoint solo para geocoding (sin crear dirección):

### Request Body
```json
{
  "latitude": number,
  "longitude": number
}
```

### Response Exitoso (200)
```json
{
  "success": true,
  "data": {
    "address": "Calle 123 #45-67, Bogotá, Colombia",
    "city": "Bogotá",
    "country": "Colombia",
    "codigoDane": null,
    "placeId": "ChIJKcM..."
  }
}
```

### Response Error (400/500)
```json
{
  "success": false,
  "error": "GEOCODING_FAILED",
  "message": "No se pudo obtener la dirección"
}
```

---

## Notas de Implementación

### Google Maps Geocoding API

**URL:**
```
https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={API_KEY}&language=es
```

**Response de Google Maps:**
```json
{
  "status": "OK",
  "results": [
    {
      "formatted_address": "Calle 123 #45-67, Bogotá, Colombia",
      "place_id": "ChIJKcM...",
      "address_components": [
        {
          "long_name": "Bogotá",
          "types": ["locality", "political"]
        },
        {
          "long_name": "Colombia",
          "types": ["country", "political"]
        }
      ]
    }
  ]
}
```

**Status codes de Google Maps:**
- `OK`: Éxito
- `ZERO_RESULTS`: No se encontró dirección
- `OVER_QUERY_LIMIT`: Límite de cuota excedido
- `REQUEST_DENIED`: API key inválida o sin permisos
- `INVALID_REQUEST`: Parámetros inválidos

### Manejo de Usuarios Guest

El frontend genera IDs de usuario guest con el formato:
```
guest_{timestamp}_{random}
```

Ejemplo: `guest_1701234567890_abc123xyz`

**Importante:**
- Estos IDs son válidos y deben aceptarse como `usuarioId`
- Cuando el usuario se registre/loguee, el frontend migrará sus direcciones guest al usuario real

---

## Testing

**Importante:** Incluir los headers de autenticación en todas las peticiones:
- `X-API-Key`: API Key de la aplicación (obtener del `.env` del backend)
- `Authorization`: Token JWT del usuario (opcional para usuarios guest)

### Caso 1: Usuario logueado en Bogotá
```bash
curl -X POST http://localhost:3000/api/addresses/create-from-geolocation \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY_HERE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "latitude": 4.7109886,
    "longitude": -74.072092,
    "usuarioId": "usr_real_123",
    "tipoDireccion": "casa",
    "esPredeterminada": true
  }'
```

### Caso 2: Usuario guest en Medellín
```bash
curl -X POST http://localhost:3000/api/addresses/create-from-geolocation \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY_HERE" \
  -d '{
    "latitude": 6.2442,
    "longitude": -75.5812,
    "usuarioId": "guest_1701234567890_abc123xyz",
    "tipoDireccion": "casa",
    "esPredeterminada": true
  }'
```

### Caso 3: Coordenadas inválidas (debe fallar)
```bash
curl -X POST http://localhost:3000/api/addresses/create-from-geolocation \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY_HERE" \
  -d '{
    "latitude": 999,
    "longitude": -999,
    "usuarioId": "usr_123",
    "tipoDireccion": "casa",
    "esPredeterminada": true
  }'
```

### Caso 4: Sin API Key (debe fallar con 401)
```bash
curl -X POST http://localhost:3000/api/addresses/create-from-geolocation \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 4.7109886,
    "longitude": -74.072092,
    "usuarioId": "test_user",
    "tipoDireccion": "casa",
    "esPredeterminada": true
  }'
```

---

## Uso desde el Frontend

El frontend ya está implementado y usa `apiPost` que incluye automáticamente los headers de autenticación:

```typescript
import { apiPost } from "@/lib/api-client";

// apiPost incluye automáticamente:
// - X-API-Key (desde NEXT_PUBLIC_API_KEY en .env.local)
// - Authorization: Bearer {token} (si el usuario está logueado)

const data = await apiPost<{ success: boolean; data: Address }>(
  "/api/addresses/create-from-geolocation",
  {
    latitude: location.latitude,
    longitude: location.longitude,
    usuarioId: userId,
    tipoDireccion: "casa",
    esPredeterminada: true,
  }
);

if (data.success) {
  const newAddress = data.data;
  // Usar la dirección...
}
```

**Variables de entorno requeridas en el frontend:**
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_KEY=your_api_key_here
```

Una vez implementado el endpoint con la autenticación correcta, el botón "Cerca de mí" funcionará automáticamente.
