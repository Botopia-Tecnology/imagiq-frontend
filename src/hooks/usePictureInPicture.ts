'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePictureInPictureOptions {
  enabled: boolean;
}

interface UsePictureInPictureReturn {
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  isPip: boolean;
  isDismissed: boolean;
  dismiss: () => void;
  restore: () => void;
}

export function usePictureInPicture({
  enabled,
}: UsePictureInPictureOptions): UsePictureInPictureReturn {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // IntersectionObserver: detect when sentinel leaves viewport
  useEffect(() => {
    if (!enabled) return;

    const element = sentinelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);

        // Reset dismiss when video comes back into view
        if (entry.isIntersecting) {
          setIsDismissed(false);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  const isPip = enabled && !isIntersecting && !isDismissed;

  const dismiss = useCallback(() => {
    setIsDismissed(true);
  }, []);

  const restore = useCallback(() => {
    const element = sentinelRef.current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return {
    sentinelRef,
    isPip,
    isDismissed,
    dismiss,
    restore,
  };
}
