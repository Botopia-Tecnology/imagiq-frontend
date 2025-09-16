"use client";

"use client";
import { QRCodeCanvas } from "qrcode.react";

export default function QRDesktop() {
  // URL directa al modelo AR
  //const iosUrl = "https://mi-bucket.s3.amazonaws.com/models/product.usdz";
  const androidUrl = "https://arvr.google.com/scene-viewer/1.0?file=https://inteligenciaartificial.s3.us-east-1.amazonaws.com/Astronaut.glb";

  // Para pruebas puedes usar uno de los dos:
  const url = androidUrl; // o androidUrl

  return (
    <div className="flex flex-col items-center">
      <QRCodeCanvas value={url} size={200} />
      <span>Escanea este código con tu celular para ver el producto en tu espacio</span>
    </div>
  );
}


// import { QRCodeCanvas } from "qrcode.react";

// export default function QRDesktop() {
//   const url = typeof window !== "undefined" ? window.location.href : "";

//   return (
//     <div className="flex flex-col items-center">
//       <QRCodeCanvas value={url} size={200} />
//       <span>Escanea este codigo QR con la camara de tu celular y descubre como se ve el objeto en tu espacio</span>
//     </div>
//   );
// }
