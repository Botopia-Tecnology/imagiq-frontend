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
import { posthogUtils, initPostHog, checkAndTrackInWebDestination } from "@/lib/posthogClient";

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
      try {
        // Initialize PostHog first
        initPostHog();
        // Track initial page load
        posthogUtils.capturePageView(window.location.pathname);
        // Check if this page is a destination from an InWeb campaign redirect
        checkAndTrackInWebDestination();
      } catch (error) {
        console.error("Error initializing PostHog in provider:", error);
      }
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
