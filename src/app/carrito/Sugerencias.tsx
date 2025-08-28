import Image from "next/image";

const sugerencias = [
  {
    nombre: "Samsung Galaxy Watch7",
    precio: 1099900,
    imagen: "/img/categorias/galaxy_watch7.png",
  },
  {
    nombre: "Galaxy Buds3 Pro",
    precio: 629900,
    imagen: "/img/categorias/galaxy_buds.png",
  },
  {
    nombre: "Cargador Adaptador de carga rápida - Cable tipo-C (15W)",
    precio: 74900,
    imagen: "/img/categorias/cargador_tipo_c.png",
  },
];

export default function Sugerencias({
  onAdd,
}: {
  onAdd?: (nombre: string) => void;
}) {
  return (
    <section className="bg-[#EAEAEA] rounded-2xl p-8 shadow-md mt-8">
      <h2 className="font-bold text-lg mb-6">Agrega a tu compra</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {sugerencias.map((s, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center w-full md:w-1/3 px-2"
          >
            <div className="relative w-24 h-24 mb-2 flex items-center justify-center">
              <Image
                src={s.imagen}
                alt={s.nombre}
                fill
                className="object-contain rounded-xl bg-white"
                sizes="96px"
              />
              <button
                className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
                aria-label={`Agregar ${s.nombre}`}
                onClick={() => onAdd?.(s.nombre)}
              >
                <span className="text-2xl font-bold">+</span>
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
