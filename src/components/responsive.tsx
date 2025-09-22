"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { breakpoints } from '../app/breakpoints';

type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large';

const ResponsiveContext = createContext<DeviceType>('desktop');

export const useDeviceType = () => useContext(ResponsiveContext);

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [device, setDevice] = useState<DeviceType>('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const mobileUA = isMobileDevice();

      // Si es móvil por userAgent, lo tratamos como móvil aunque el ancho sea mayor
      if (mobileUA) {
        setDevice('mobile');
      } else if (width < parseInt(breakpoints.tablet)) {
        setDevice('mobile');
      } else if (width < parseInt(breakpoints.desktop)) {
        setDevice('tablet');
      } else if (width < parseInt(breakpoints.large)) {
        setDevice('desktop');
      } else {
        setDevice('large');
      }
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return (
    <ResponsiveContext.Provider value={device}>
      {children}
    </ResponsiveContext.Provider>
  );
};