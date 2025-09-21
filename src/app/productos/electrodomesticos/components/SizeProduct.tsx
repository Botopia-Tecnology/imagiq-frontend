"use client";
import React, { useState } from "react";

import { GoScreenFull } from "react-icons/go";
import ModalWithoutBackground from "@/components/ModalWithoutBackground";
import Image, { StaticImageData } from "next/image";

import ButtonLabel from "../../components/Button";

interface SizeProductProps {
  img: StaticImageData | string; // acepta imagen local o URL
}

export default function SizeProduct({ img }: SizeProductProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="ml-auto mr-4 mt-4">
        <ButtonLabel
          onClick={() => setModalOpen(true)}
          title="Revisa aquí las medidas de tu producto"
          Icon={GoScreenFull}
        />
      </div>

      {modalOpen && (
        <ModalWithoutBackground
          onClose={() => setModalOpen(false)}
          isOpen={modalOpen}
          size="xl"
          title="Cómo medir"
        >
          <div className="flex flex-col items-center  ">
            <div className="w-full mb-6 flex justify-center px-4">
              {/* Renderizado condicional según tipo de imagen */}
              {typeof img === "string" ? (
                <img
                  src={img}
                  alt="Store"
                  className="object-contain w-full max-w-md h-auto"
                />
              ) : (
                <Image
                  src={img}
                  alt="Store"
                  className="object-contain w-full max-w-md h-auto"
                  width={500}
                  height={500}
                />
              )}
            </div>
          </div>
        </ModalWithoutBackground>
      )}
    </>
  );
}
