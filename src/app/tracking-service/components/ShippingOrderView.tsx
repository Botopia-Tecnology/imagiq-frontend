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
  return (
    <div className="flex flex-col md:flex-row">
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

      <div className="md:w-1/2 w-full flex items-center justify-center p-4">
        <iframe
          title="Guía PDF Coordinadora"
          src={`data:application/pdf;base64,${
            orderNumber !== "..." ? pdfBase64 : ""
          }`}
          className="w-full h-[500px] rounded-xl border shadow"
          allowFullScreen

        />
      </div>
    </div>
  );
}
