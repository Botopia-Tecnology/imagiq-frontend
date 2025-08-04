import { LocationMap } from "@/components/LocationMap";

export default function TiendasPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <LocationMap />
      </div>
    </div>
  );
}

export const metadata = {
  title: "Tiendas Samsung - Encuentra tu tienda más cercana",
  description:
    "Localiza las tiendas Samsung más cercanas a ti. Información completa de contacto, horarios y ubicación.",
};
