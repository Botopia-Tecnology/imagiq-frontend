import React from "react";

interface TradeInSelectorProps {
  onOpenModal: () => void;
}

export default function TradeInSelector({ onOpenModal }: Readonly<TradeInSelectorProps>) {
  const [selectedOption, setSelectedOption] = React.useState<"no" | "yes">("no");

  const handleYesClick = () => {
    setSelectedOption("yes");
    onOpenModal();
  };

  const handleNoClick = () => {
    setSelectedOption("no");
  };

  return (
    <section className="mb-8">
      <p className="block text-base text-[#222] font-semibold mb-5">
        Obtén un descuento inmediato seleccionando Estreno y entrego.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleYesClick}
          className={`flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
            selectedOption === "yes"
              ? "border-[#0099FF] bg-[#F0F8FF]"
              : "border-gray-300 bg-white hover:border-[#222]"
          }`}
        >
          <div className="text-left">
            <div
              className={`text-base font-semibold ${
                selectedOption === "yes" ? "text-[#0099FF]" : "text-[#222]"
              }`}
            >
              SÍ
            </div>
            <div className="text-xs text-orange-600 font-medium mt-1">
              Ahorra hasta
            </div>
          </div>
          <div
            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedOption === "yes"
                ? "border-[#0099FF] bg-[#0099FF]"
                : "border-gray-300"
            }`}
          >
            {selectedOption === "yes" && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
        </button>

        <button
          onClick={handleNoClick}
          className={`flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
            selectedOption === "no"
              ? "border-[#0099FF] bg-[#F0F8FF]"
              : "border-gray-300 bg-white hover:border-[#222]"
          }`}
        >
          <div
            className={`text-base font-semibold ${
              selectedOption === "no" ? "text-[#0099FF]" : "text-[#222]"
            }`}
          >
            NO
          </div>
          <div
            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedOption === "no"
                ? "border-[#0099FF] bg-[#0099FF]"
                : "border-gray-300"
            }`}
          >
            {selectedOption === "no" && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
        </button>
      </div>
    </section>
  );
}
