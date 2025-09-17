"use client";
import { QRCodeCanvas } from "qrcode.react";
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
    <div className="flex flex-col items-center">
      <div className="flex  items-center ">
        <div className=" flex m-2 flex-col items-center">
          <span className="mt-2 text-sm text-gray-700 text-center font-bold">
            Android
          </span>

          <QRCodeCanvas value={sceneViewerUrl} size={200} />
        </div>
        <div className=" flex m-2 flex-col items-center">
          <span className="mt-2 text-sm text-gray-700 text-center font-bold">
            IOS
          </span>
          <QRCodeCanvas value={usdzUrl} size={200} />
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-700 text-center">
        Escanea este código con tu celular para ver el producto en tu espacio
      </p>
    </div>
  );
}
