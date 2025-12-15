/**
 * Client wrapper para HomePage
 * Maneja animaciones con framer-motion y scroll reveal
 */

"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface HomePageClientProps {
  children: React.ReactNode;
}

export default function HomePageClient({ children }: HomePageClientProps) {
  // Efecto para manejar el scroll al footer cuando se carga la página con #footer
  useEffect(() => {
    // Verificar si la URL contiene #footer
    if (window.location.hash === "#footer") {
      // Función para hacer scroll al footer
      const scrollToFooter = () => {
        const footer = document.getElementById("footer");
        if (footer) {
          // Calcular la posición del footer
          const footerPosition =
            footer.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: footerPosition,
            behavior: "smooth",
          });
        }
      };

      // Intentar scroll después de que todo el contenido se haya cargado
      // Múltiples intentos para asegurar que llegue al footer
      const timeouts = [500, 1500, 3000, 5000];
      const timeoutIds = timeouts.map((delay) =>
        setTimeout(scrollToFooter, delay)
      );

      // Cleanup
      return () => {
        timeoutIds.forEach((id) => clearTimeout(id));
      };
    }
  }, []);

  return <>{children}</>;
}
