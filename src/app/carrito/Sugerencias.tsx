import { Watch, Headphones, Zap, Plus } from "lucide-react";

const sugerencias = [
  {
    nombre: "Samsung Galaxy Watch7",
    precio: 1099900,
    icon: Watch,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    nombre: "Galaxy Buds3 Pro",
    precio: 629900,
    icon: Headphones,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    nombre: "Cargador Adaptador de carga rápida - Cable tipo-C (15W)",
    precio: 74900,
    icon: Zap,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
];

export default function Sugerencias({
  onAdd,
}: {
  onAdd?: (nombre: string) => void;
}) {
  return (
    <section className="bg-[#F4F4F4] rounded-2xl p-8 shadow-md mt-8">
      <h2 className="font-bold text-xl mb-6">Agrega a tu compra</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {sugerencias.map((s, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center w-full md:w-1/3 px-2"
          >
            <div className="relative w-28 h-28 mb-2 flex items-center justify-center">
              <div className={`w-full h-full rounded-xl ${s.bgColor} flex items-center justify-center`}>
                <s.icon className={`w-12 h-12 ${s.iconColor}`} />
              </div>
              <button
                className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
                aria-label={`Agregar ${s.nombre}`}
                onClick={() => onAdd?.(s.nombre)}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-2">
              <div className="font-semibold text-gray-900 text-base mb-1">
                {s.nombre}
              </div>
              <div className="text-lg font-bold text-gray-900">
                $ {s.precio.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
