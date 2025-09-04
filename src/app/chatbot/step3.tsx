import HeaderStep1 from "@/components/headerStep1";

export default function Step3({ onContinue }: { onContinue: () => void }) {
  const opciones = [
    "Pantalla grande y diseño premium",
    "Compacto y fácil de llevar",
    "Minimalista y elegante",
  ];

  return (
    <div className="step1-overlay">
      <HeaderStep1 />
      <h1 className="text-white text-4xl font-bold mb-12 text-center mt-32">
        ¿Qué estilo y tamaño prefieres?
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