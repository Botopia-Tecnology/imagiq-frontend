'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScaleInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Componente que anima la aparición con efecto de escala suave
 * Ideal para imágenes y elementos destacados
 * @param delay - Retraso en segundos (default: 0)
 * @param duration - Duración en segundos (default: 0.4)
 */
export const ScaleInView = ({
  children,
  delay = 0,
  duration = 0.4,
  className
}: ScaleInViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
