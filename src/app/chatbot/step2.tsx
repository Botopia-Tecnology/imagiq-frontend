import HeaderStep1 from "@/components/headerStep1";

export default function Step2({ onContinue }: { onContinue: () => void }) {
  const opciones = [
    "Menos de $1.500.000",
    "$1.500.000 – $3.000.000",
    "Más de $3.000.000",
  ];

  return (
    <div className="step1-overlay">
      <HeaderStep1 />
      <h1 className="text-white text-4xl font-bold mb-12 text-center mt-32">
        ¿Cuál es tu rango de inversión?
      </h1>
      <div className="flex flex-col gap-6">
        {opciones.map((op) => (
          <button
            key={op}
            className="text-white text-lg font-medium bg-transparent border-none hover:text-blue-400 transition-colors"
            onClick={onContinue}
            type="button"
          >
            {op}
          </button>
        ))}
      </div>
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