"use client";

import { useState, useCallback } from 'react';
import { useDeviceType } from '@/components/responsive';

export type ViewMode = 'map' | 'list';

export function useViewMode() {
  const deviceType = useDeviceType();
  const isMobileOrTablet = deviceType === 'mobile' || deviceType === 'tablet';

  // Default a 'map' para mostrar el mapa primero
  const [viewMode, setViewMode] = useState<ViewMode>('map');

  const toggleView = useCallback(() => {
    setViewMode(prev => prev === 'map' ? 'list' : 'map');
  }, []);

  return {
    viewMode,
    setViewMode,
    toggleView,
    isMobileOrTablet
  };
}
