'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

/**
 * Contenedor que anima sus hijos en secuencia (stagger effect)
 * @param staggerDelay - Retraso entre cada elemento hijo en segundos (default: 0.1)
 */
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  className
}: StaggerContainerProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
