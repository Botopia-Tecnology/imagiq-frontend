/**
 * Tipado de Variables de Entorno
 * - Variables de entorno requeridas
 * - Configuración de APIs externas
 * - Claves de servicios (PostHog, etc.)
 * - URLs de microservicios
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Next.js environment
    NODE_ENV: "development" | "production" | "test";
    NEXT_PUBLIC_APP_URL: string;

    // API Configuration
    NEXT_PUBLIC_API_URL: string;
    API_SECRET_KEY: string;

    // PostHog Analytics
    NEXT_PUBLIC_POSTHOG_KEY: string;
    NEXT_PUBLIC_POSTHOG_HOST: string;

    // Authentication
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    REFRESH_TOKEN_SECRET: string;

    // Payment Processing
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;

    // Email Service
    EMAIL_SERVICE_API_KEY: string;
    EMAIL_FROM_ADDRESS: string;

    // Cloud Storage
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_S3_BUCKET: string;
    AWS_REGION: string;

    // Database
    DATABASE_URL: string;
    REDIS_URL: string;

    // External Services
    GOOGLE_ANALYTICS_ID: string;
    FACEBOOK_PIXEL_ID: string;

    // Feature Flags
    NEXT_PUBLIC_ENABLE_ANALYTICS: string;
    NEXT_PUBLIC_ENABLE_AB_TESTING: string;
    NEXT_PUBLIC_ENABLE_SESSION_REPLAY: string;

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: string;
    RATE_LIMIT_MAX_REQUESTS: string;

    // SEO
    NEXT_PUBLIC_SITE_NAME: string;
    NEXT_PUBLIC_SITE_DESCRIPTION: string;
    NEXT_PUBLIC_SITE_URL: string;
  }
}
