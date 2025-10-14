# 🎯 Prompt para Integración de Analytics Empresariales desde Backend

## 📋 Contexto del Proyecto

Estamos trabajando en **IMAGIQ**, una plataforma de e-commerce tipo Samsung Store que consta de:

### 🏗️ Arquitectura General

#### **Frontend: Next.js 14 (App Router)**

- **Stack**: Next.js 14, TypeScript, TailwindCSS, Bun como runtime
- **Ubicación**: `imagiq-frontend`
- **Características**:
  - Aplicación de comercio electrónico completa
  - Sistema de carrito, checkout, pagos y tracking
  - Autenticación y gestión de perfiles
  - Dashboard administrativo
  - Sistema de puntos y ofertas
  - Chatbot integrado
  - SEO optimizado

#### **Backend: Arquitectura de Microservicios (NestJS + Python)**

- **Stack**: Node.js (NestJS), Python, PostgreSQL, Redis, MongoDB
- **Ubicación**: `imagiq-backend`
- **Microservicios**:
  1. **api-gateway**: Puerta de entrada principal (NestJS)
  2. **auth-ms**: Autenticación y usuarios (NestJS)
  3. **products-ms**: Catálogo de productos conectado a Novasoft (NestJS)
  4. **payments-ms**: Pagos con Addi y Epyco (NestJS)
  5. **deliveries-ms**: Logística con Coordinadora (NestJS)
  6. **customer-success-ms**: ML, segmentación y **ANALYTICS** (Python)
  7. **campaigns-ms**: Campañas de marketing (NestJS)
  8. **addresses-ms**: Gestión de direcciones (NestJS)

---

## 📊 Estado Actual de Analytics

### Frontend (Implementado con PostHog)

**Ubicación**: `src/features/analytics/`

- `AnalyticsContext.tsx`: Context provider con PostHog
- `PostHogProvider.tsx`: Wrapper de PostHog para Next.js
- `posthog.ts`: Funciones helper de tracking

**Funcionalidades implementadas**:

```typescript
// Tipos de tracking actual
- trackEvent(event: string, properties?: Record<string, unknown>)
- trackPageView(page: string, properties?: Record<string, unknown>)
- trackConversion(type: string, value?: number, properties?)
- trackUserBehavior(behavior: string, properties?)
- identifyUser(userId: string, properties?)
- updateUserProperties(properties: Record<string, unknown>)
- startSession() / endSession()
- isFeatureEnabled(flag: string)
- trackPerformance(metric: string, value: number)
```

**Eventos rastreados actualmente**:

- Page views automáticos
- Performance metrics (LCP, FID, CLS, TTFB)
- User interactions
- Conversions
- Session replays
- Feature flags
- A/B testing

### Backend (Microservicio de Analytics)

**Ubicación**: `customer-success-ms/src/analytics/`

**Estructura actual**:

```
analytics/
├── analytics.controller.ts       # Handlers de MessagePattern
├── analytics.module.ts            # Configuración del módulo
├── dto/
│   └── create-analytics-event.dto.ts
├── entities/
│   ├── analytics-event.entity.ts
│   ├── conversion-event.entity.ts
│   ├── page-view-event.entity.ts
│   └── user-interaction-event.entity.ts
├── interfaces/
│   └── analytics-event.interface.ts
└── services/
    ├── analytics-event.service.ts
    ├── conversion-event.service.ts
    ├── page-view-event.service.ts
    └── user-interaction-event.service.ts
```

**Endpoints disponibles**:

```typescript
// API Gateway expone (HTTP REST):
POST /analytics/track/event
POST /analytics/track/page-view
POST /analytics/track/conversion
POST /analytics/track/interaction
GET  /analytics/events/category/:category
GET  /analytics/events/user/:userId
GET  /analytics/events/session/:sessionId
GET  /analytics/page-views/popular
GET  /analytics/page-views/session/:sessionId/duration
GET  /analytics/interactions/top
GET  /analytics/interactions/heatmap?pageUrl=
GET  /analytics/conversions/user/:userId

// Customer Success MS procesa (TCP MessagePattern):
analytics.track.event
analytics.track.pageView
analytics.track.conversion
analytics.track.interaction
analytics.events.byCategory
analytics.events.byUser
analytics.events.bySession
analytics.pageViews.popular
analytics.session.duration
analytics.conversions.byUser
analytics.interactions.top
analytics.interactions.heatmap
```

**Modelos de datos (MongoDB)**:

```typescript
// AnalyticsEventEntity
{
  eventName: string;
  eventCategory: string; // 'page_view' | 'user_interaction' | 'conversion' | 'custom'
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// PageViewEventEntity
{
  pageUrl: string;
  pageTitle: string;
  referrer?: string;
  userId?: string;
  sessionId: string;
  deviceInfo?: DeviceInfoDto;
  location?: LocationInfoDto;
  timestamp: Date;
}

// ConversionEventEntity
{
  conversionType: string;
  conversionValue: number;
  currency: string;
  userId?: string;
  sessionId: string;
  productIds?: string[];
  orderId?: string;
  timestamp: Date;
}

// UserInteractionEventEntity
{
  interactionType: string;
  elementId?: string;
  elementClass?: string;
  elementText?: string;
  pageUrl: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
}
```

---

## 🎯 OBJETIVO PRINCIPAL

**Implementar tracking de analytics empresariales desde el BACKEND usando:**

1. **Microsoft Clarity** (Heatmaps, Session Recordings, User Behavior)
2. **Google Tag Manager (GTM)** (Event tracking, Conversions, Custom Events)
3. **Meta Pixel (Facebook Pixel)** (Conversions, Ads tracking, Retargeting)

### ⚠️ Restricciones Importantes

1. **NO queremos integración client-side** (ya tenemos PostHog para eso)
2. **Queremos enviar eventos desde el BACKEND** (server-side tracking)
3. Mantener la arquitectura de microservicios existente
4. Usar el microservicio `customer-success-ms` como punto central
5. Preservar los endpoints y estructura actual
6. Asegurar cumplimiento con GDPR/CCPA

---

## 🔍 PREGUNTAS CLAVE A RESOLVER (Deep Search)

Por favor, realiza una investigación profunda sobre:

### 1. **Microsoft Clarity Server-Side Integration**

- ¿Clarity tiene API para server-side tracking?
- ¿Podemos enviar eventos de heatmap/clicks desde el backend?
- ¿Cómo manejar session IDs entre frontend y backend?
- ¿Hay limitaciones comparado con el script client-side?
- Documentación oficial y mejores prácticas
- ¿Alternativas si no hay API server-side completa?

### 2. **Google Tag Manager Server-Side Tracking**

- Server-side GTM vs Client-side GTM
- Google Tag Manager Server Container setup
- ¿Cómo enviar eventos desde NestJS/Python a GTM?
- Measurement Protocol (GA4) integration
- Enhanced ecommerce events desde backend
- Configuración de triggers y tags para server events
- ¿Necesitamos Google Cloud Platform?

### 3. **Meta Pixel (Facebook Pixel) Server-Side API**

- Meta Conversions API documentation
- ¿Cómo enviar eventos desde el backend?
- Event matching y deduplicación (evitar doble conteo)
- Event types soportados (PageView, Purchase, AddToCart, etc.)
- Authentication y App Secret
- Handling de datos de usuario (hashing de PII)
- Mejores prácticas para e-commerce

### 4. **Arquitectura e Integración**

- ¿Cómo estructurar un servicio centralizado de analytics?
- Patrón queue/buffer para evitar bloqueo de requests
- Manejo de rate limits de las APIs externas
- Retry logic y error handling
- Logging y monitoring de eventos
- Testing de integraciones externas
- ¿Usar un message broker (Redis, RabbitMQ) para eventos?

### 5. **Seguridad y Compliance**

- GDPR compliance en server-side tracking
- Consentimiento de cookies y tracking
- Hash de datos sensibles (email, teléfono)
- IP anonymization
- Manejo de opt-out de usuarios
- Audit logs de eventos enviados

### 6. **Performance y Escalabilidad**

- Impacto en latencia de requests
- Async/background processing de eventos
- Batch processing de eventos
- Caching strategies
- Horizontal scaling considerations

---

## 📐 ESTRUCTURA PROPUESTA (Para Evaluación)

Basándome en la investigación, evalúa y sugiere mejoras a esta propuesta:

```
customer-success-ms/src/analytics/
├── analytics.controller.ts
├── analytics.module.ts
├── integrations/                      # NUEVO
│   ├── base-analytics-provider.ts     # Interface común
│   ├── clarity/
│   │   ├── clarity.service.ts
│   │   └── clarity.config.ts
│   ├── gtm/
│   │   ├── gtm.service.ts
│   │   ├── gtm-server.service.ts      # Server-side container
│   │   └── gtm.config.ts
│   ├── meta/
│   │   ├── meta-pixel.service.ts
│   │   ├── meta-conversions-api.service.ts
│   │   └── meta.config.ts
│   └── analytics-orchestrator.service.ts  # Coordina todos los providers
├── queue/                             # NUEVO (opcional)
│   ├── analytics-queue.service.ts
│   └── analytics-processor.ts
└── [archivos existentes...]
```

---

## 💡 CASOS DE USO A CUBRIR

### Eventos Críticos del E-commerce:

1. **Page Views**: Tracking de navegación
2. **Product Views**: Usuario ve un producto
3. **Add to Cart**: Agregar producto al carrito
4. **Remove from Cart**: Remover producto del carrito
5. **Begin Checkout**: Iniciar proceso de pago
6. **Add Payment Info**: Agregar método de pago
7. **Purchase**: Compra completada
8. **Search**: Búsquedas de productos
9. **Lead**: Usuario se registra
10. **Custom Events**: Chatbot interactions, etc.

### Conversiones:

- Registro de usuario
- Primera compra
- Compra recurrente
- Valor del carrito promedio
- Abandono de carrito

---

## 🎨 OUTPUT ESPERADO

Por favor, proporciona:

### 1. **Análisis Técnico Detallado**

- Viabilidad de server-side tracking para cada plataforma
- Pros y contras de cada enfoque
- Limitaciones conocidas

### 2. **Arquitectura Recomendada**

- Diagrama de flujo de datos
- Estructura de archivos y módulos
- Patrones de diseño recomendados
- Manejo de errores y reintentos

### 3. **Implementación Paso a Paso**

Para cada plataforma (Clarity, GTM, Meta):

- Setup inicial (credenciales, configuración)
- Código de ejemplo para servicios
- Configuración de módulos NestJS
- Variables de entorno necesarias
- Testing strategy

### 4. **Código de Ejemplo**

- Interface base de analytics provider
- Implementación de al menos un provider completo
- Orchestrator service
- Controller updates para exponer nuevos endpoints
- DTOs actualizados

### 5. **Best Practices y Consideraciones**

- Performance optimization
- Error handling
- Rate limiting
- Monitoring y logging
- Security checklist
- GDPR compliance

### 6. **Migration Path**

- Cómo integrar sin romper funcionalidad actual
- Feature flags para activar/desactivar providers
- A/B testing de la integración
- Rollback strategy

### 7. **Documentación**

- Environment variables necesarias
- API documentation actualizada
- Setup guide para desarrollo
- Troubleshooting común

---

## 🔧 Tecnologías y Constraints

**Backend Stack**:

- NestJS (Node.js)
- TypeORM con MongoDB para analytics
- PostgreSQL para datos críticos
- Redis para cache
- Transport: TCP entre microservicios
- API Gateway expone REST HTTP

**Variables de entorno disponibles**:

```typescript
// Ya disponibles en frontend
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
GOOGLE_ANALYTICS_ID
FACEBOOK_PIXEL_ID

// A definir para backend
MICROSOFT_CLARITY_PROJECT_ID
MICROSOFT_CLARITY_API_KEY (si existe)
GTM_SERVER_CONTAINER_URL
GTM_MEASUREMENT_ID
GTM_API_SECRET
META_PIXEL_ID
META_CONVERSION_API_TOKEN
META_APP_SECRET
```

---

## 📚 Referencias Útiles

Por favor investiga estos recursos oficiales:

1. **Microsoft Clarity**:

   - https://learn.microsoft.com/en-us/clarity/
   - Developer documentation
   - API documentation (si existe)

2. **Google Tag Manager Server-Side**:

   - https://developers.google.com/tag-platform/tag-manager/server-side
   - Measurement Protocol (GA4)
   - Server Container setup guide

3. **Meta Conversions API**:

   - https://developers.facebook.com/docs/marketing-api/conversions-api
   - Event Reference
   - Best practices for e-commerce

4. **Server-Side Tracking General**:
   - GDPR compliance guides
   - Privacy best practices
   - Comparison of approaches

---

## ✅ DELIVERABLES FINALES

1. **Documento técnico completo** con toda la investigación
2. **Arquitectura detallada** con diagramas
3. **Código funcional** listo para implementar (al menos un provider completo)
4. **Guía de implementación** paso a paso
5. **Testing strategy** y ejemplos
6. **Documentation updates** para el equipo
7. **Alternativas** si alguna plataforma no soporta server-side completamente

---

## 🚀 Prioridad de Investigación

1. **ALTA**: Meta Conversions API (crítico para ads)
2. **ALTA**: Google Tag Manager Server-Side (analytics core)
3. **MEDIA**: Microsoft Clarity (nice-to-have para UX insights)

---

## 💬 Preguntas Adicionales

- ¿Hay herramientas third-party que faciliten la integración?
- ¿Segment.com o similar podría ser una solución intermedia?
- ¿Cómo manejan otras empresas esto en arquitecturas de microservicios?
- ¿Hay trade-offs significativos vs client-side tracking?

---

**Nota final**: Queremos la solución más robusta, escalable y mantenible posible. Prioriza quality over speed. Si alguna plataforma no tiene soporte server-side real, propón alternativas o híbridos razonables.

---

## 📊 Contexto de Negocio

- **Volumen esperado**: ~10,000 eventos/día inicialmente
- **Crecimiento proyectado**: 5x en 12 meses
- **Presupuesto**: Moderate - open to paid solutions if they add significant value
- **Timeline**: MVP en 3-4 semanas
- **Team**: 2 backend developers (NestJS + Python), 1 frontend developer
