import { TrackingHeader } from "./TrackingHeader";
import { TrackingTimeline } from "./TrackingTimeline";

interface ShippingOrderViewProps {
  orderNumber: string;
  estimatedInitDate: string;
  estimatedFinalDate: string;
  trackingSteps: Array<{
    evento: string;
    time_stamp: string;
  }>;
  pdfBase64: string;
}

export function ShippingOrderView({
  orderNumber,
  estimatedInitDate,
  estimatedFinalDate,
  trackingSteps,
  pdfBase64,
}: Readonly<ShippingOrderViewProps>) {
  const isLikelyImage = (b64: string) => {
    // Common base64 headers: PNG (iVBOR), JPEG (/9j/), GIF (R0lGOD), WEBP (UklGR)
    return /^(iVBOR|\/9j\/|R0lGOD|UklGR)/.test(b64);
  };

  const handleDownload = () => {
    if (!pdfBase64) return;
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Guia-${orderNumber || "coordinadora"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
      {/* Timeline column */}
      <div className="md:w-1/2 w-full">
        <TrackingHeader
          orderNumber={orderNumber}
          estimatedInitDate={estimatedInitDate}
          estimatedFinalDate={estimatedFinalDate}
        />

        {/* Tracking Steps - Timeline */}
        <div className="px-4 sm:px-8 py-8">
          <h2 className="text-lg font-semibold text-black mb-4">
            Historial de eventos
          </h2>
          <TrackingTimeline events={trackingSteps} />
        </div>
      </div>

      <div className="md:w-1/2 w-full px-0">
        {orderNumber !== "..." && pdfBase64 ? (
          <div className="w-full mx-auto max-w-[400px] sm:max-w-[580px] md:max-w-none">
            {/* Vista limpia: si es imagen, la mostramos; si es PDF, evitamos el visor */}
            {isLikelyImage(pdfBase64) ? (
              <div className="w-full rounded-xl bg-white overflow-hidden">
                <div className="px-5 pt-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Guía de envío</h3>
                  <p className="text-sm text-gray-700 mb-3">Vista previa del documento.</p>
                </div>
                <div className="w-full h-[380px] sm:h-[480px] md:h-[600px] bg-white flex items-center justify-center p-0 overflow-hidden">
                  <img
                    src={`data:image/*;base64,${pdfBase64}`}
                    alt="Guía de envío"
                    className="w-full h-full object-contain rounded-none"
                  />
                </div>
                <div className="px-5 pt-3 pb-4 flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2 rounded-full bg-[#17407A] text-white hover:brightness-110 transition shadow-md"
                    aria-label="Descargar guía"
                  >
                    Descargar PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full rounded-xl bg-white overflow-hidden">
                <div className="px-5 pt-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Guía de envío</h3>
                  <p className="text-sm text-gray-700 mb-3">Vista previa del documento.</p>
                </div>
                {/* PDF preview */}
                <div className="w-full h-[380px] sm:h-[480px] md:h-[600px] bg-white overflow-hidden">
                  <iframe
                    title="Vista previa guía"
                    src={`data:application/pdf;base64,${pdfBase64}#toolbar=0&navpanes=0&scrollbar=0&view=Fit&page=1`}
                    className="w-full h-full border-0"
                    style={{ border: 'none' }}
                    onError={() => {
                      // Fallback: si el iframe falla, mostrar mensaje
                      console.log('PDF preview not supported on this device');
                    }}
                  />
                </div>
                <div className="px-5 pt-3 pb-4 flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2 rounded-full bg-[#17407A] text-white hover:brightness-110 transition shadow-md"
                    aria-label="Descargar guía"
                  >
                    Descargar PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full rounded-xl border shadow bg-white p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Guía de envío</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#17407A] animate-spin" />
              <p className="text-sm text-gray-600">Generando guía…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
