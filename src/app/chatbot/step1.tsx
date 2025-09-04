import HeaderStep1 from "@/components/headerStep1";
import Image from "next/image";

const opciones = [
  {
    label: "Juegos",
    img: "/chatbot/juegos.png",
    alt: "Smart Monitor M8",
  },
  {
    label: "Fotografía y video",
    img: "/chatbot/fotografia.png",
    alt: "Galaxy S24 Ultra",
  },
  {
    label: "Trabajo y productividad",
    img: "/chatbot/trabajo.png",
    alt: "Galaxy Tab S9",
  },
  {
    label: "Hogar inteligente",
    img: "/chatbot/hogar.png",
    alt: "Refrigerador Family Hub",
  },
];

export default function Step1({ onContinue }: { onContinue: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      <HeaderStep1 />
      <h1 className="text-white text-4xl font-bold mb-12 text-center mt-32">
        Necesidad Primaria
      </h1>
      <div className="flex flex-row gap-12">
        {opciones.map((op) => (
          <button
            key={op.label}
            className="flex flex-col items-center focus:outline-none group"
            onClick={onContinue}
            type="button"
          >
            <Image
              src={op.img}
              alt={op.alt}
              width={130}
              height={130}
              className="mb-2 object-contain group-hover:scale-105 transition-transform"
              draggable={false}
            />
            <span className="text-white text-lg font-semibold text-center group-hover:text-blue-400">
              {op.label}
            </span>
          </button>
        ))}
      </div>
      {/* Oculta el header y footer global solo en esta página */}
      <style>{`
        header:not([class*="bg-transparent"]),
        nav,
        .Footer,
        footer,
        #footer {
          display: none !important;
        }
        body {
          background: #000 !important;
        }
      `}</style>
    </div>
  );
}