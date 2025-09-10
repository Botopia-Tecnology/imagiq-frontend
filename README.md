# Imagiq E-commerce Frontend

## 🏗️ Arquitectura del Proyecto

Este proyecto es un e-commerce escalable desarrollado con Next.js 14, TypeScript y TailwindCSS, con integración avanzada de PostHog para analytics, session replay y experimentación. El código está organizado para facilitar el desarrollo colaborativo y la escalabilidad.

### 📁 Estructura del Proyecto

```
src/
├── app/                     # App Router de Next.js
│   ├── layout.tsx          # Layout principal y global
│   ├── page.tsx            # Página de inicio (Home)
│   ├── productos/          # Catálogo de productos y vistas
│   ├── login/              # Autenticación de usuarios
│   ├── perfil/             # Perfil y preferencias del usuario
│   ├── carrito/            # Flujo de compra y checkout
│   ├── soporte/            # Soporte y contacto
│   ├── dashboard/          # Panel administrativo
│   │   ├── analytics/      # Métricas y reportes de negocio
│   │   └── ventas/         # Gestión de ventas
│   └── ...                 # Otras rutas y módulos
│
├── components/             # Componentes reutilizables y UI
│   ├── Navbar.tsx         # Navegación principal
│   ├── Footer.tsx         # Pie de página
│   ├── Button.tsx         # Botón personalizable
│   ├── Modal.tsx          # Modal reutilizable
│   ├── LoadingSpinner.tsx # Indicador de carga
│   ├── SEO.tsx            # Componente SEO
│   ├── LocationMap.tsx    # Mapa de ubicaciones (Leaflet)
│   └── ...                # Otros componentes y secciones
│
├── features/              # Lógica por dominio
│   ├── auth/              # Autenticación y registro
│   ├── cart/              # Carrito de compras
│   ├── analytics/         # Integración PostHog y métricas
│   ├── products/          # Gestión y lógica de productos
│   └── user/              # Preferencias y datos de usuario
│
├── hooks/                 # Custom hooks
│   ├── useDebounce.ts     # Debounce para optimización
│   ├── useLocalStorage.ts # Persistencia local
│   ├── useIntersectionObserver.ts # Lazy loading
│   └── usePurchaseFlow.ts # Flujo de compra y navegación
│
├── lib/                   # Integraciones externas y utilidades
│   ├── api.ts             # Cliente API
│   ├── posthogClient.ts   # Configuración PostHog
│   └── seo.ts             # Utilidades SEO
│
├── constants/             # Constantes globales
│   ├── routes.ts          # Rutas de la aplicación
│   └── categories.ts      # Categorías de productos
│
├── types/                 # Tipos TypeScript
│   ├── user.ts            # Tipos de usuario
│   ├── product.ts         # Tipos de productos
│   └── analytics.ts       # Tipos de analytics
│
├── assets/                # Recursos estáticos
│   ├── logos/             # Logos de la marca
│   ├── icons/             # Iconografía
│   └── banners/           # Banners promocionales
│
├── middleware.ts          # Middleware de Next.js para rutas protegidas
└── env.d.ts              # Tipado de variables de entorno
```

### Explicación de Módulos Clave

- **app/**: Contiene todas las páginas y rutas del proyecto, organizadas por dominio. Cada subcarpeta representa una funcionalidad o vista principal.
- **components/**: Componentes reutilizables, UI y secciones. Todos tipados con TypeScript y documentados para facilitar su uso.
- **features/**: Lógica de negocio separada por dominio (auth, cart, analytics, etc.), lo que permite escalar y mantener el código fácilmente.
- **hooks/**: Custom hooks para lógica compartida y optimización de UX.
- **lib/**: Integraciones externas y utilidades (API, PostHog, SEO).
- **constants/**: Rutas y categorías globales, centralizadas para evitar duplicidad.
- **types/**: Tipos TypeScript para datos y props, asegurando tipado estricto y mantenible.
- **assets/**: Recursos estáticos para branding y marketing.
- **middleware.ts**: Protección de rutas y validación de acceso.
- **env.d.ts**: Tipado de variables de entorno para seguridad y DX.

## 🚀 Características Principales

### 📊 Analytics Avanzado con PostHog

- **Tracking de eventos**: Cada interacción relevante (clicks, conversiones, abandonos) se trackea con PostHog.
- **Session Replays**: Grabación y análisis de sesiones para debugging y UX.
- **Heat Maps**: Mapas de calor para entender el comportamiento del usuario.
- **A/B Testing**: Experimentación y optimización continua.
- **Segmentación de usuarios**: Análisis de patrones y personalización.

### 🛒 Funcionalidades E-commerce

- **Catálogo avanzado**: Navegación, filtrado y búsqueda de productos.
- **Carrito persistente**: Gestión de productos en localStorage y sincronización.
- **Checkout optimizado**: Flujo de compra con validaciones, estados de carga y feedback.
- **Gestión de usuarios**: Registro, login, perfil y preferencias.
- **Recomendaciones**: Personalización basada en analytics y comportamiento.

### 🎯 Métricas de Negocio

- **Ventas por tiempo y región**: Analytics geográfico y temporal.
- **Patrones de consumo**: Análisis de comportamiento de compra.
- **Conversión y abandono**: Tracking de funnels y optimización.
- **Segmentación de clientes**: Clasificación automática y reporting.
- **ROI y KPIs**: Métricas clave para toma de decisiones.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Analytics**: PostHog (eventos, session replay, heat maps)
- **State Management**: Context API + Custom Hooks
- **API Client**: Fetch API con interceptors
- **Routing**: Next.js App Router
- **SEO**: Next.js Metadata API + Structured Data
- **Leaflet**: Mapa interactivo de ubicaciones de tiendas

## 🏃‍♂️ Comandos de Desarrollo

```bash
# Instalar dependencias
bun install

# Ejecutar en desarrollo
bun dev

# Build de producción
bun build

# Iniciar servidor de producción
bun start

# Linting
bun lint

# Testing
bun test
```


## 🎨 Guía de Desarrollo

### Estructura y Convenciones

- Todos los componentes y hooks deben estar tipados con TypeScript.
- Usar `interface` para props complejas y documentar cada componente.
- Implementar loading states y manejo de errores en cada vista.
- Incluir tracking de eventos relevantes en interacciones clave.
- Naming:
  - Componentes: PascalCase (`UserProfile.tsx`)
  - Hooks: camelCase con prefijo `use` (`useProductData.ts`)
  - Constantes: UPPER_SNAKE_CASE (`API_ROUTES`)
  - Archivos: kebab-case para páginas, PascalCase para componentes

### Analytics Implementation

- Cada interacción importante debe ser trackeada con PostHog.
- Usar eventos descriptivos y propiedades consistentes.
- Implementar tracking de conversion funnels y session replay.
- Configurar experimentos A/B y feature flags para pruebas controladas.

## 🔒 Seguridad

- Middleware para protección de rutas y validación de tokens JWT.
- Rate limiting en APIs y headers de seguridad configurados.
- Sanitización de inputs de usuario y validación estricta en formularios.

## 📈 Performance

- Lazy loading de componentes e imágenes.
- Code splitting automático con Next.js.
- Optimización de imágenes con Next.js Image.
- Debouncing en búsquedas y filtros.
- Caching estratégico de datos y revalidación.

## 🧑‍💻 Flujo de Trabajo Recomendado

1. Clona el repositorio y crea tu rama feature/tu-nombre.
2. Instala dependencias con `bun install`.
3. Configura tu `.env.local` según el ejemplo.
4. Sigue la estructura y convenciones del proyecto.
5. Documenta tus componentes y funciones.
6. Usa PostHog para trackear nuevas interacciones.
7. Realiza PRs descriptivos y solicita revisión.

---

**Nota**: Este proyecto está diseñado para escalar y mantener un código limpio y organizacional. Cada módulo tiene responsabilidades bien definidas y la integración con PostHog permite un análisis profundo del comportamiento del usuario y métricas de negocio. Si tienes dudas, revisa los comentarios en el código y pregunta en el equipo.
