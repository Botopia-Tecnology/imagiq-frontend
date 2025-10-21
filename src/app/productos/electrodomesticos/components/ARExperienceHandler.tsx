"use client";
import React, { useState } from "react";


import ARMobile from "../../components/ARMobile";
import ModalWithoutBackground from "@/components/ModalWithoutBackground";
import QRDesktop from "../../components/QRDesktop";
import { BsFillHouseDoorFill } from "react-icons/bs";
import ButtonLabel from "../../components/Button";

interface ARExperienceHandlerProps {
  glbUrl: string;
  usdzUrl: string;
}

export default  function ARExperienceHandler({glbUrl,
  usdzUrl}:ARExperienceHandlerProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Botón House (solo en desktop) */}
      <div className="hidden md:block w-fit ml-4 mt-4">
        <ButtonLabel onClick={() => setModalOpen(true)} title='Mira el objeto en tu espacio' Icon={BsFillHouseDoorFill}/>
      </div>

      {/* Componente AR (solo en móvil) */}
      <div className="block md:hidden  mr-4 ml-4">
        <ARMobile glbUrl={glbUrl} usdzUrl={usdzUrl} />
      </div>

      {/* Modal con QR para desktop */}
      {modalOpen && (
        <ModalWithoutBackground
          onClose={() => setModalOpen(false)}
          isOpen={modalOpen}
          size="lg"
        >
          <QRDesktop glbUrl={glbUrl} usdzUrl={usdzUrl} />
        </ModalWithoutBackground>
      )}
    </>
  );
};


