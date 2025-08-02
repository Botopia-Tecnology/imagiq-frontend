/**
 * 📊 ANALYTICS CONTEXT - IMAGIQ ECOMMERCE
 *
 * Context provider para métricas empresariales:
 * - Integración completa con PostHog
 * - Tracking de conversiones y ventas
 * - Análisis de patrones de comportamiento
 * - Segmentación de usuarios automática
 * - Métricas de performance y SEO
 */

"use client";

import { createContext, useContext, useEffect } from "react";
import { usePostHog } from "@/features/analytics/PostHogProvider";

interface AnalyticsContextType {
  // Tracking methods
  trackEvent: (event: string, properties?: Record<string, unknown>) => void;
  trackPageView: (page: string, properties?: Record<string, unknown>) => void;
  trackConversion: (
    type: string,
    value?: number,
    properties?: Record<string, unknown>
  ) => void;
  trackUserBehavior: (
    behavior: string,
    properties?: Record<string, unknown>
  ) => void;

  // User identification
  identifyUser: (userId: string, properties?: Record<string, unknown>) => void;
  updateUserProperties: (properties: Record<string, unknown>) => void;

  // Session management
  startSession: () => void;
  endSession: () => void;

  // Feature flags
  isFeatureEnabled: (flag: string) => boolean;

  // Performance tracking
  trackPerformance: (metric: string, value: number) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
};

export const AnalyticsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const posthog = usePostHog();

  // Initialize analytics on mount
  useEffect(() => {
    // Track initial page load
    if (typeof window !== "undefined") {
      posthog.capture("page_view", {
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
      });

      // Track performance metrics
      if ("performance" in window) {
        window.addEventListener("load", () => {
          const perfData = performance.getEntriesByType(
            "navigation"
          )[0] as PerformanceNavigationTiming;
          if (perfData) {
            posthog.capture("performance_metrics", {
              page_load_time: perfData.loadEventEnd - perfData.loadEventStart,
              dom_content_loaded:
                perfData.domContentLoadedEventEnd -
                perfData.domContentLoadedEventStart,
              time_to_first_byte:
                perfData.responseStart - perfData.requestStart,
            });
          }
        });
      }
    }
  }, [posthog]);

  const value: AnalyticsContextType = {
    trackEvent: (event: string, properties?: Record<string, unknown>) => {
      if (typeof window !== "undefined") {
        posthog.capture(event, {
          timestamp: new Date().toISOString(),
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          ...properties,
        });
      }
    },

    trackPageView: (page: string, properties?: Record<string, unknown>) => {
      posthog.capture("page_view_detailed", {
        page,
        timestamp: new Date().toISOString(),
        referrer: typeof document !== "undefined" ? document.referrer : "",
        ...properties,
      });
    },

    trackConversion: (
      type: string,
      value?: number,
      properties?: Record<string, unknown>
    ) => {
      posthog.capture("conversion", {
        conversion_type: type,
        conversion_value: value,
        timestamp: new Date().toISOString(),
        ...properties,
      });
    },

    trackUserBehavior: (
      behavior: string,
      properties?: Record<string, unknown>
    ) => {
      posthog.capture("user_behavior", {
        behavior_type: behavior,
        timestamp: new Date().toISOString(),
        ...properties,
      });
    },

    identifyUser: (userId: string, properties?: Record<string, unknown>) => {
      posthog.identify(userId, {
        identified_at: new Date().toISOString(),
        ...properties,
      });
    },

    updateUserProperties: (properties: Record<string, unknown>) => {
      posthog.capture("user_properties_updated", {
        updated_at: new Date().toISOString(),
        ...properties,
      });
    },

    startSession: () => {
      posthog.startSessionRecording();
      posthog.capture("session_start", {
        timestamp: new Date().toISOString(),
        page_url: typeof window !== "undefined" ? window.location.href : "",
      });
    },

    endSession: () => {
      posthog.capture("session_end", {
        timestamp: new Date().toISOString(),
        session_duration: typeof window !== "undefined" ? performance.now() : 0,
      });
      posthog.stopSessionRecording();
    },

    isFeatureEnabled: (flag: string) => {
      return posthog.isFeatureEnabled(flag);
    },

    trackPerformance: (metric: string, value: number) => {
      posthog.capture("performance_metric", {
        metric_name: metric,
        metric_value: value,
        timestamp: new Date().toISOString(),
        page_url: typeof window !== "undefined" ? window.location.href : "",
      });
    },
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
