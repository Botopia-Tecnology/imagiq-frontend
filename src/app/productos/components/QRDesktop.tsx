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
  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    const userAgent =
      typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
    setIsSafari(
      /safari/.test(userAgent) && !/chrome|crios|fxios|android/.test(userAgent)
    );
  }, []);
  const sceneViewerUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
    glbUrl
  )}${title ? `&title=${encodeURIComponent(title)}` : ""}${
    link ? `&link=${encodeURIComponent(link)}` : ""
  }&mode=ar_only`;
  const quickLookUrl = usdzUrl;
  // URL final según navegador
  const finalUrl = isSafari ? quickLookUrl : sceneViewerUrl;
  return (
    <div className="flex flex-col items-center">
      <QRCodeCanvas value={finalUrl} size={200} />
      <span className="mt-2 text-sm text-gray-700 text-center">
        Escanea este código con tu celular para ver el producto en tu espacio
      </span>
    </div>
  );
}