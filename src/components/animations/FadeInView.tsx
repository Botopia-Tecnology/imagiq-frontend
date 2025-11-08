'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Componente que anima la aparición de elementos con fade-in suave
 * @param delay - Retraso en segundos antes de iniciar la animación (default: 0)
 * @param duration - Duración de la animación en segundos (default: 0.5)
 */
export const FadeInView = ({
  children,
  delay = 0,
  duration = 0.5,
  className
}: FadeInViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // ease-out-cubic para suavidad
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
