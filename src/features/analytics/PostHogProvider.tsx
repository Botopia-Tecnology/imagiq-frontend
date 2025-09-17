"use client";
/**
 * 📊 POSTHOG PROVIDER - IMAGIQ ECOMMERCE
 *
 * Provider para PostHog Analytics:
 * - Inicialización del SDK
 * - Context para acceso global
 * - Session management
 * - Feature flags
 */


import { createContext, useContext, useEffect } from "react";
import { posthogUtils } from "@/lib/posthogClient";

interface PostHogContextType {
  capture: (event: string, properties?: Record<string, unknown>) => void;
  identify: (userId: string, properties?: Record<string, unknown>) => void;
  isFeatureEnabled: (flag: string) => boolean;
  startSessionRecording: () => void;
  stopSessionRecording: () => void;
  reset: () => void;
}

const PostHogContext = createContext<PostHogContextType | null>(null);

export const usePostHog = () => {
  const context = useContext(PostHogContext);
  if (!context) {
    console.warn("usePostHog must be used within PostHogProvider");
    return posthogUtils; // Return mock utils as fallback
  }
  return context;
};

export const PostHogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    // Initialize PostHog when component mounts
    if (typeof window !== "undefined") {
      console.log("PostHog Provider initialized on client");

      // Track initial page load
      posthogUtils.capturePageView(window.location.pathname);
    }
  }, []);

  const value: PostHogContextType = {
    capture: posthogUtils.capture,
    identify: posthogUtils.identify,
    isFeatureEnabled: posthogUtils.isFeatureEnabled,
    startSessionRecording: posthogUtils.startSessionRecording,
    stopSessionRecording: posthogUtils.stopSessionRecording,
    reset: posthogUtils.reset,
  };

  return (
    <PostHogContext.Provider value={value}>{children}</PostHogContext.Provider>
  );
};
