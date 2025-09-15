"use client";
import { QRCodeCanvas } from "qrcode.react";

export default function QRDesktop() {
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="flex flex-col items-center">
      <QRCodeCanvas value={url} size={200} />
      <span>Escanea este codigo QR con la camara de tu celular y descubre como se ve el objeto en tu espacio</span>
    </div>
  );
}
