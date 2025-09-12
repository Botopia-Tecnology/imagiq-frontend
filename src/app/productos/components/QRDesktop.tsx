"use client";
import { QRCodeCanvas } from "qrcode.react";

export default function QRDesktop() {
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="flex flex-col items-center">
      <p>Escanea este código con tu celular para ver en AR:</p>
      <QRCodeCanvas value={url} size={200} />
    </div>
  );
}
