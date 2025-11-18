# 🔒 Sistema de Seguridad - Imagiq Frontend

## 📋 Descripción General

Este documento describe el sistema de seguridad implementado en el frontend de Imagiq, que incluye:

1. **Encriptación de LocalStorage** (Base64 + AES-256)
2. **Protección contra DevTools** (Detector + Bloqueador)
3. **Migración automática** de datos existentes
4. **Sistema de Keys** con derivación PBKDF2

---

## 🔐 Encriptación de LocalStorage

### Implementación

El sistema sobrescribe `window.localStorage` con una implementación personalizada que encripta automáticamente todo lo que se guarda.

### Características

- **Doble encriptación**: Base64 → AES-256
- **Encriptación de keys**: Los nombres de las variables también se encriptan
- **Migración automática**: Los datos existentes se migran sin intervención
- **Transparent**: No requiere cambios en el código existente
- **Whitelist**: Algunas keys como `app_version` no se encriptan

### Archivos principales

```
src/lib/security/encryption/
├── secureStorage.ts       # Implementación de Storage encriptado
├── keyManagement.ts       # Gestión de claves de encriptación
└── migrator.ts            # Migrador automático
```

### Uso

**Opción 1: Uso automático (recomendado)**

Como el sistema sobrescribe `localStorage` globalmente, todo el código existente funciona automáticamente:

```typescript
// Esto ya está encriptado automáticamente
localStorage.setItem('imagiq_user', JSON.stringify(user));
const user = JSON.parse(localStorage.getItem('imagiq_user') || '{}');
```

**Opción 2: Hook React**

```typescript
import { useSecureStorage } from '@/hooks/useSecureStorage';

function MyComponent() {
  const [user, setUser, removeUser] = useSecureStorage('imagiq_user', null);

  // El estado se sincroniza automáticamente con localStorage encriptado
  setUser({ name: 'John' });
}
```

**Opción 3: API directa**

```typescript
import { getSecureStorage } from '@/lib/security';

const secureStorage = getSecureStorage();

// Guardar objeto
secureStorage.setEncrypted('key', { data: 'value' });

// Leer objeto
const data = secureStorage.getDecrypted('key', defaultValue);
```

---

## 🛡️ Protección contra DevTools

### Protección Simplificada

El sistema de protección ahora se controla con una sola variable de entorno:

**`NEXT_PUBLIC_ENABLE_DEVTOOLS_PROTECTION`**

- **`true`**: Activa protección completa
  - Encripta todo el localStorage con AES-256
  - Bloquea shortcuts de DevTools (F12, Cmd+Option+I, etc.)
  - Bloquea click derecho
  - Bloquea Ctrl+U (ver código fuente)

- **`false`**: Desactiva protección (ideal para desarrollo)
  - localStorage en texto plano (sin encriptación)
  - Todos los shortcuts habilitados
  - Click derecho habilitado
  - Código fuente visible

#### 4. **Disabled**
- Completamente desactivado
- Útil para desarrollo local

### Técnicas de Detección

El detector usa 6 técnicas diferentes:

1. **Debugger timing**: Mide tiempo de ejecución de `debugger`
2. **Console detection**: Override de `console.log`
3. **Window size**: Diferencia entre outer e inner size
4. **toString override**: Detecta acceso a métodos toString
5. **Firebug check**: Legacy pero funcional
6. **Chrome Protocol**: Detecta React DevTools

### Archivos principales

```
src/lib/security/devtools/
├── detector.ts           # Detector de DevTools abierto
├── blocker.ts            # Bloqueador de shortcuts
└── protection.ts         # Coordinador de protección
```

### Uso

```typescript
import { initDevToolsProtection } from '@/lib/security/devtools/protection';

// Iniciar protección
const stop = initDevToolsProtection({
  mode: 'aggressive',
  redirectTo: '/login',
  showModal: true,
});

// Detener protección
stop();
```

---

## ⚙️ Configuración

### Variables de Entorno

```bash
# .env.local

# Clave maestra de encriptación (YA EXISTE)
# IMPORTANTE: NUNCA cambiar esta key en producción o se perderán todos los datos encriptados
NEXT_PUBLIC_FRONTEND_ENCRYPTION_KEY=7a8f9d2e6b4c1a5e3f7d9b2c4a6e8f0d1c3e5a7b9d2f4a6c8e0b3d5f7a9c1e3f

# Protección de seguridad (encriptación + bloqueo de DevTools)
# true = Activa encriptación de localStorage + bloqueo de DevTools
# false = Desactiva toda protección (ideal para desarrollo)
NEXT_PUBLIC_ENABLE_DEVTOOLS_PROTECTION=true
```

### Configuración por Entorno

**Desarrollo Local:**
```bash
# Sin protección para facilitar debugging
NEXT_PUBLIC_ENABLE_DEVTOOLS_PROTECTION=false
```

**Staging/Producción:**
```bash
# Protección completa activada
NEXT_PUBLIC_ENABLE_DEVTOOLS_PROTECTION=true
```

---

## 🔄 Migración Automática

### Cómo Funciona

1. Al cargar la app, el sistema detecta si hay datos sin encriptar
2. Migra automáticamente cada key al nuevo formato
3. Elimina las keys antiguas
4. Si hay errores críticos (>30%), ejecuta limpieza de emergencia

### Datos Preservados

En caso de error, se preservan:
- `app_version`: Versión de la aplicación

### Monitoreo

```typescript
import { analyzeMigrationNeeds } from '@/lib/security/encryption/migrator';

const stats = analyzeMigrationNeeds();
console.log(stats);
// {
//   totalKeys: 15,
//   encryptedKeys: 15,
//   plainTextKeys: 0,
//   whitelistKeys: 1,
//   needsMigration: false
// }
```

---

## 🔍 Inspección y Debug

### Desactivar Protección en Desarrollo

```typescript
// src/app/layout.tsx
<DevToolsGuard mode="disabled">
  {children}
</DevToolsGuard>
```

### Ver localStorage Encriptado

```javascript
// En consola (si DevTools está permitido)
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key));
});

// Verás algo como:
// _enc_Y2FydC1pdGVtcw== → U2FsdGVkX1+vupppZksvR...
```

### Desencriptar Manualmente (Admin Panel)

```typescript
import { getSecureStorage } from '@/lib/security';

const secureStorage = getSecureStorage();

// Ver todos los datos desencriptados
const allData = {};
for (let i = 0; i < localStorage.length; i++) {
  const key = secureStorage.key(i);
  if (key) {
    allData[key] = secureStorage.getDecrypted(key);
  }
}

console.log(allData);
```

---

## 🚨 Seguridad y Mejores Prácticas

### ✅ DO

- Mantener `NEXT_PUBLIC_FRONTEND_ENCRYPTION_KEY` secreta
- Usar modo `aggressive` en producción
- Rotar keys periódicamente (requiere migración manual)
- Monitorear logs de Sentry para errores de encriptación
- Testear en staging antes de producción

### ❌ DON'T

- NO cambiar la encryption key sin plan de migración
- NO commitear keys en el repositorio
- NO deshabilitar protección en producción
- NO asumir que esto previene 100% de manipulación
- NO almacenar datos extremadamente sensibles en localStorage

---

## 📊 Métricas de Seguridad

### Metadata de Configuración

```typescript
import { getSecurityMetadata } from '@/lib/security/encryption/keyManagement';

const metadata = getSecurityMetadata();
console.log(metadata);
// {
//   masterKeyConfigured: true,
//   masterKeyLength: 64,
//   masterKeyValid: true,
//   userSaltGenerated: true,
//   derivationMethod: 'PBKDF2',
//   iterations: 1000,
//   keySize: 256
// }
```

### Health Check

```typescript
import { getSecureStorage } from '@/lib/security';

const secureStorage = getSecureStorage();
const isHealthy = secureStorage.healthCheck();
console.log('SecureStorage healthy:', isHealthy);
```

---

## 🔧 Troubleshooting

### Error: "Encryption key inválida"

**Causa**: `NEXT_PUBLIC_FRONTEND_ENCRYPTION_KEY` no está configurada o es muy corta

**Solución**:
```bash
# Verificar .env.local
cat .env.local | grep NEXT_PUBLIC_FRONTEND_ENCRYPTION_KEY

# Debe tener al menos 32 caracteres
```

### Error: "Desencriptación falló"

**Causa**: Key cambió o datos corruptos

**Solución**:
```typescript
// Limpiar localStorage corrupto
import { performEmergencyCleanup } from '@/lib/security/encryption/migrator';

performEmergencyCleanup();
```

### DevTools no se bloquea

**Causa**: Variable de entorno mal configurada

**Solución**:
```bash
# Verificar
echo $NEXT_PUBLIC_ENABLE_DEVTOOLS_PROTECTION

# Debe ser "true" (string)
```

### Migración falla repetidamente

**Causa**: Datos muy corruptos o incompatibles

**Solución**:
```typescript
// Forzar limpieza y empezar de cero
localStorage.clear();
sessionStorage.clear();

// Recargar
window.location.reload();
```

---

## 📈 Performance

### Benchmarks

| Operación | Tiempo | Notas |
|-----------|--------|-------|
| `setItem()` | ~2ms | Encriptación Base64+AES |
| `getItem()` | ~1ms | Desencriptación |
| Migración (15 keys) | ~50ms | Una sola vez al cargar |
| Health check | <1ms | Sin I/O |
| Detector polling | ~5ms | Cada 1s en background |

### Optimizaciones

- Caché en memoria de keys desencriptadas (futuro)
- Lazy decryption (solo cuando se lee)
- Debounce de eventos `storage`
- Migración en background (no bloquea render)

---

## 🔐 Algoritmos y Especificaciones

### Encriptación

- **Algoritmo**: AES-256-CBC
- **Librería**: crypto-js
- **Derivación de Key**: PBKDF2
- **Iteraciones**: 1000
- **Encoding**: Base64 → AES → Base64

### Formato de Keys

```
Original: "imagiq_user"
↓
AES encrypt: "Y2FydC1pdGVtcw=="
↓
Prefijo: "_enc_Y2FydC1pdGVtcw=="
```

### Formato de Valores

```
Original: { name: "John" }
↓
JSON.stringify: '{"name":"John"}'
↓
Base64: "eyJuYW1lIjoiSm9obiJ9"
↓
AES encrypt: "U2FsdGVkX1+vupppZksvR..."
```

---

## 📚 Referencias

### Documentación Relacionada

- [crypto-js Documentation](https://cryptojs.gitbook.io/)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

### Archivos del Proyecto

- [layout.tsx](src/app/layout.tsx) - Inicialización
- [secureStorage.ts](src/lib/security/encryption/secureStorage.ts) - Core
- [DevToolsGuard.tsx](src/components/security/DevToolsGuard.tsx) - Componente React

---

## 📞 Soporte

Para preguntas o problemas:

1. Revisar este documento
2. Revisar logs en consola del navegador
3. Revisar logs en Sentry
4. Contactar al equipo de desarrollo

---

**Última actualización:** 2025-01-17
**Versión:** 1.0.0
**Autor:** Imagiq Security Team
