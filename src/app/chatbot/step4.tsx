import HeaderStep1 from "@/components/headerStep1";
import Image from "next/image";

export default function Step4() {
  return (
    <div className="step1-overlay">
      <HeaderStep1 />
      <h1 className="text-white text-4xl font-bold mb-12 text-center mt-32">
        Este es el producto para ti
      </h1>
      <div className="bg-[#e5e5e5] rounded-2xl flex flex-col items-center px-12 py-10 shadow-lg">
        <Image
          src="/chatbot/hogar.png"
          alt="658 L Nevecon Tipo Europeo Bespoke - AI Home"
          width={150}
          height={180}
          className="mb-6 object-contain"
        />
        <div className="text-center text-gray-800 text-lg mb-2">
          658 L Nevecon Tipo Europeo<br />
          Bespoke - AI Home
        </div>
        <div className="text-center text-2xl font-bold text-black mb-6">
          $ 11.499.900
        </div>
        <div className="flex gap-4">
          <button
            className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition"
            type="button"
          >
            ¡Compra aquí!
          </button>
          <button
            className="bg-white border border-black text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
            type="button"
          >
            Ver en mi espacio
          </button>
        </div>
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