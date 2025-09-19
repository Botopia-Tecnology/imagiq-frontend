"use client";
import { QRCodeCanvas } from "qrcode.react";
import { FaAndroid, FaApple } from "react-icons/fa";
import { useEffect, useState } from "react";
type QRDesktopProps = {
  glbUrl: string;
  usdzUrl: string;
  title?: string;
  link?: string;
};
export default function QRDesktop({
  glbUrl,
  usdzUrl,
  title,
  link,
}: QRDesktopProps) {
  const sceneViewerUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
    glbUrl
  )}${title ? `&title=${encodeURIComponent(title)}` : ""}${
    link ? `&link=${encodeURIComponent(link)}` : ""
  }&mode=ar_only`;
  return (
    <div className="flex flex-col items-center ml-8 mr-8 ">
      {" "}
      {/* Ajustamos el max-w a un tamaño mayor */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
        Visualiza tu producto en realidad aumentada
      </h2>
      <div className="flex justify-between w-full mb-10">
        {" "}
        {/* Flex row, gap reducido para alineación más natural */}
        <div className="flex flex-col items-center space-y-8">
          {" "}
          {/* Reducido el space-y para más equilibrio */}
          <div className="text-xl text-gray-900 mb-4">
            <FaAndroid /> {/* Icono de Android */}
          </div>
          <QRCodeCanvas value={sceneViewerUrl} size={220} />{" "}
          {/* Aumenté el tamaño del QR */}
        </div>
        <div className="flex flex-col items-center space-y-8">
          {" "}
          {/* Igual ajuste para iOS */}
          <div className="text-xl text-gray-900 mb-4">
            <FaApple /> {/* Icono de iOS */}
          </div>
          <QRCodeCanvas value={usdzUrl} size={220} />{" "}
          {/* Aumenté el tamaño del QR */}
        </div>
      </div>
      <p className="text-sm text-gray-600 text-center max-w-md mx-auto">
        Escanea cualquiera de los códigos QR para ver el producto en tu espacio
        de realidad aumentada.
      </p>
    </div>
  );
}
