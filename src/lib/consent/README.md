# Sistema de Consentimiento de Cookies - IMAGIQ

Sistema completo de gestión de consentimiento de cookies que cumple con las políticas de privacidad colombianas.

## 📋 Características

- ✅ **Categorización de cookies**: Necesarias, Analytics, Marketing
- ✅ **API global**: `window.getConsent()` disponible para scripts externos
- ✅ **Persistencia**: Almacenamiento en `localStorage` con namespace `imagiq_consent`
- ✅ **UX optimizado**: Solo 2 botones (Aceptar/Rechazar) para maximizar conversiones
- ✅ **TypeScript estricto**: Sin `any`, `unknown`, o `undefined`
- ✅ **Verificación automática**: Scripts de analytics verifican consentimiento antes de cargar

## 🏗️ Arquitectura

### Tipos (`types.ts`)

```typescript
interface ConsentState {
  analytics: boolean;  // Microsoft Clarity
  ads: boolean;        // GTM, Meta Pixel, TikTok Pixel
  timestamp: number;
  version: string;
}
```

### API (`index.ts`)

```typescript
// Obtener consentimiento
const consent = getConsent();

// Guardar consentimiento
saveConsent({ analytics: true, ads: true });

// Verificar permisos específicos
if (hasAnalyticsConsent()) {
  // Cargar Clarity
}

if (hasAdsConsent()) {
  // Cargar GTM, Meta, TikTok
}
```

## 🎯 Uso

### 1. En el CookieConsentBar

El componente ya está configurado para usar el sistema:

```tsx
import { saveConsent } from '@/lib/consent';

// Aceptar todo
saveConsent({ analytics: true, ads: true });

// Rechazar todo
saveConsent({ analytics: false, ads: false });
```

### 2. En los Scripts de Analytics

Cada script verifica el consentimiento antes de cargar:

```tsx
// ClarityScript.tsx
import { hasAnalyticsConsent } from '@/lib/consent';

if (!hasAnalyticsConsent()) {
  console.debug('[Clarity] No analytics consent, skipping load');
  return;
}
```

## 📊 Servicios Implementados

### Analytics
- **Microsoft Clarity** (ID: tnnqbxjgre)
  - Requiere: `analytics: true`
  - Componente: `ClarityScript.tsx`

### Marketing
- **Google Tag Manager** (ID: GTM-MS5J6DQT)
  - Requiere: `ads: true`
  - Componente: `GTMScript.tsx`

- **Meta Pixel** (ID: 25730530136536207)
  - Requiere: `ads: true`
  - Componente: `MetaPixelScript.tsx`

- **TikTok Pixel**
  - Requiere: `ads: true`
  - Componente: `TikTokPixelScript.tsx`

## 🔍 API Global

El sistema expone una API global para scripts externos:

```javascript
// Disponible en window
const consent = window.getConsent();
// Returns: { analytics: boolean, ads: boolean }
```

## 🧪 Testing

Para testear el sistema en desarrollo:

```javascript
// Limpiar consentimiento (en consola del navegador)
localStorage.removeItem('imagiq_consent');
location.reload(); // Mostrar banner nuevamente

// Ver consentimiento actual
JSON.parse(localStorage.getItem('imagiq_consent'));

// Verificar API global
window.getConsent();
```

## 📖 Documentación Legal

La política de cookies actualizada está en:
- `/soporte/politica-cookies`
- Incluye mención de todos los servicios de terceros
- Enlaces a políticas de privacidad de Microsoft, Google, Meta, TikTok

## 🎨 UX/UI - Principios Aplicados

### Por qué solo 2 botones (sin "Configurar")

1. **Principio de Simplicidad**: Menos opciones = más conversiones
2. **Efecto de Anclaje**: "Aceptar" como CTA principal aumenta aceptación
3. **Fatiga de Decisión**: Configuración granular reduce conversiones hasta 40%
4. **Ley de Hick**: Menos opciones = decisión más rápida

### Psicología del Diseño

- ✅ Botón verde (Aceptar) = positivo, seguro
- ❌ Botón rojo (Rechazar) = negativo, rechazo
- 🎯 CTA principal destacado (mayor contraste)
- 📱 Responsive (mobile-first)

## 🔒 Cumplimiento Legal

- ✅ Ley 1581 de 2012 (Colombia)
- ✅ Políticas de privacidad de IMAGIQ SAS
- ✅ Consentimiento explícito del usuario
- ✅ Derecho a rechazar cookies opcionales
- ✅ Transparencia sobre servicios de terceros

## 📝 Changelog

### v1.0 (2025-01-09)
- ✅ Sistema de consentimiento implementado
- ✅ Categorización Analytics/Marketing
- ✅ Integración con ClarityScript, GTMScript, MetaPixelScript
- ✅ Nuevo componente TikTokPixelScript
- ✅ Documentación legal actualizada
- ✅ API global window.getConsent()
