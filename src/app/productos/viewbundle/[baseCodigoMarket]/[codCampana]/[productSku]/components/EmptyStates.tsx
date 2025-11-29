/**
 * Componentes de estados vacíos y errores para la página de bundle
 */

interface EmptyStateProps {
  title: string;
  description: string;
}

function EmptyStateWrapper({ title, description }: EmptyStateProps) {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function BundleNotFound() {
  return (
    <EmptyStateWrapper
      title="Bundle no encontrado"
      description="El bundle que buscas no está disponible o ha expirado."
    />
  );
}

export function BundleNoOptions() {
  return (
    <EmptyStateWrapper
      title="Bundle sin opciones"
      description="Este bundle no tiene opciones disponibles."
    />
  );
}
