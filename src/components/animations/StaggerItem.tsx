'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * Elemento hijo que debe usarse dentro de StaggerContainer
 * Anima con fade-in y slide-up suave
 */
export const StaggerItem = ({ children, className }: StaggerItemProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1], // ease-out-cubic
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
