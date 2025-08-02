/**
 * Componente LoadingSpinner
 * - Spinner de carga reutilizable
 * - Diferentes tamaños y variantes
 * - Overlay opcional para pantalla completa
 */

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  className?: string;
  overlay?: boolean;
}

export default function LoadingSpinner({
  size = "md",
  variant = "primary",
  className,
  overlay = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const variantClasses = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${className || ""}`}
    />
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
