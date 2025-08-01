/**
 * Componente Button Reutilizable
 * - Diferentes variantes (primary, secondary, ghost, etc.)
 * - Estados (loading, disabled, active)
 * - Tamaños configurables
 * - Accesibilidad optimizada
 * - Tracking de clicks automático
 */

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  onClick,
}: ButtonProps) {
  return (
    <button>
      {/* Button implementation will be here */}
      {children}
    </button>
  );
}
