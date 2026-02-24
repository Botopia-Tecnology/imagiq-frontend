'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface ActiveStream {
  videoId: string;
  slug: string;
}

interface GlobalPipContextType {
  activeStream: ActiveStream | null;
  isGlobalPipVisible: boolean;
  registerStream: (stream: ActiveStream) => void;
  clearStream: () => void;
  dismissPip: () => void;
}

const PIP_HIDDEN_ROUTES = [
  '/carrito',
  '/charging-result',
  '/success-checkout',
  '/error-checkout',
  '/verify-purchase',
];

const GlobalPipContext = createContext<GlobalPipContextType | undefined>(undefined);

export function GlobalPipProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [activeStream, setActiveStream] = useState<ActiveStream | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isGlobalPipVisible, setIsGlobalPipVisible] = useState(false);

  // Route-based visibility: show PiP when NOT on the stream page
  useEffect(() => {
    if (!activeStream || isDismissed) {
      setIsGlobalPipVisible(false);
      return;
    }

    const isOnStreamPage = pathname === '/' + activeStream.slug;
    const isOnHiddenRoute = PIP_HIDDEN_ROUTES.some((route) => pathname.startsWith(route));

    setIsGlobalPipVisible(!isOnStreamPage && !isOnHiddenRoute);
  }, [pathname, activeStream, isDismissed]);

  const registerStream = useCallback((stream: ActiveStream) => {
    setActiveStream((prev) => {
      // Only update if videoId or slug changed
      if (prev?.videoId === stream.videoId && prev?.slug === stream.slug) return prev;
      return stream;
    });
    setIsDismissed(false);
  }, []);

  const clearStream = useCallback(() => {
    setActiveStream(null);
    setIsDismissed(false);
  }, []);

  const dismissPip = useCallback(() => {
    setIsDismissed(true);
  }, []);

  return (
    <GlobalPipContext.Provider
      value={{ activeStream, isGlobalPipVisible, registerStream, clearStream, dismissPip }}
    >
      {children}
    </GlobalPipContext.Provider>
  );
}

export function useGlobalPip() {
  const context = useContext(GlobalPipContext);
  if (!context) {
    throw new Error('useGlobalPip must be used within a GlobalPipProvider');
  }
  return context;
}
