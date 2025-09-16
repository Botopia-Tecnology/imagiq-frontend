import React, { useState } from 'react';
import { BsFillHouseDoorFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

type HouseButtonProps = {
  onClick: () => void;
};

export default function HouseButton({ onClick }: HouseButtonProps) {
  const [showLabel, setShowLabel] = useState(true);

  return (
    <div className="relative flex items-center">
      {/* Etiqueta a la izquierda */}
      {showLabel && (
        <div className="flex items-center bg-white text-black border border-gray-300 rounded-md shadow px-4 py-2 mr-3"
             style={{ fontFamily: "SamsungSharpSans" }}>
          <span className="mr-2">Mira el objeto en tu espacio</span>
          <button onClick={() => setShowLabel(false)} className="text-gray-500 hover:text-gray-300 cursor-pointer">
            <IoClose size={18} />
          </button>
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center bg-black text-white p-4 rounded-full shadow hover:bg-gray-900 transition-all border border-black cursor-pointer"
      >
        <BsFillHouseDoorFill size={20} />
      </button>
    </div>
  );
}
