/**
 * Componente de Loading Spinner
 * - Diferentes tamaños y variantes
 * - Animaciones suaves
 * - Indicador de carga para acciones async
 * - Overlay completo para páginas
 * - Texto de estado configurable
 */

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  text?: string;
  overlay?: boolean;
}

export default function LoadingSpinner({
  size = "md",
  variant = "primary",
  text,
  overlay,
}: LoadingSpinnerProps) {
  return (
    <div>
      {/* Loading spinner implementation will be here */}
      {text && <span>{text}</span>}
    </div>
  );
}
