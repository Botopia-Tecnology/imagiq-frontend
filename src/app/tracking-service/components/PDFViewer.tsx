"use client";

import { useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure worker using local file to ensure compatibility with Next.js 15+
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.mjs";
}

interface PDFViewerProps {
  pdfBase64: string;
  onDownload: () => void;
  orderNumber: string;
  shipments?: Array<{ numero_guia: string }>;
  selectedShipmentIndex?: number;
  onSelectShipment?: (index: number) => void;
}

export function PDFViewer({
  pdfBase64,
  onDownload,
  shipments = [],
  selectedShipmentIndex = 0,
  onSelectShipment,
}: Readonly<PDFViewerProps>) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(600); // Default width

  // Convert base64 to File object/BlobUrl for react-pdf
  // react-pdf can handle base64 data URI directly: "data:application/pdf;base64,..."
  // or a file object. Let's use the full data URI.
  const file = `data:application/pdf;base64,${pdfBase64}`;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF document:", error);
    setLoading(false);
    setError(true);
  }

  // Options for PDF.js to work with Next.js 15+ (memoized to avoid unnecessary reloads)
  const options = useMemo(
    () => ({
      cMapUrl: "https://unpkg.com/pdfjs-dist@5.4.449/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "https://unpkg.com/pdfjs-dist@5.4.449/standard_fonts/",
    }),
    []
  );

  // Effect to handle responsive width
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById("pdf-container");
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset page number when switching between guides
  useEffect(() => {
    setPageNumber(1);
  }, [selectedShipmentIndex]);

  if (error) {
    return (
      <div className="w-full rounded-xl bg-white overflow-hidden">
        <div className="px-5 pt-5">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Guía de envío (Error de visualización)
          </h3>
          <p className="text-sm text-gray-700 mb-3">No se pudo cargar el visor.</p>
        </div>
        <div className="w-full h-[300px] bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
          <p className="text-gray-600 mb-4">
            Ocurrió un error al procesar el documento.
          </p>
          <button
            onClick={onDownload}
            className="px-5 py-2 rounded-full bg-black text-white hover:brightness-110 transition shadow-md"
          >
            Descargar PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-white overflow-hidden" id="pdf-container">
      {/* Navigation arrows for multiple shipments */}
      {shipments && shipments.length > 1 && (
        <div className="px-5 pt-5 pb-3 flex items-center justify-center gap-3">
          <button
            onClick={() => onSelectShipment?.(Math.max(selectedShipmentIndex - 1, 0))}
            disabled={selectedShipmentIndex === 0}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
            aria-label="Guía anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
            Guía {selectedShipmentIndex + 1} de {shipments.length}
          </span>
          <button
            onClick={() => onSelectShipment?.(Math.min(selectedShipmentIndex + 1, shipments.length - 1))}
            disabled={selectedShipmentIndex === shipments.length - 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
            aria-label="Guía siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <div className="w-full bg-gray-100 min-h-[400px] flex flex-col items-center justify-center p-4 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-gray-300 border-t-black animate-spin" />
              <span className="text-gray-600 text-sm font-medium">Cargando PDF...</span>
            </div>
          </div>
        )}

        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null} // Handled by custom loader above
          className="shadow-lg max-w-full"
          options={options}
        >
          <Page
            pageNumber={pageNumber}
            width={Math.min(containerWidth - 32, 600)} // Responsive width, max 600px
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="bg-white"
          />
        </Document>
      </div>

      {/* Controls */}
      <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
        {numPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm text-gray-600">
              Página {pageNumber} de {numPages}
            </span>
            <button
              onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
              disabled={pageNumber >= numPages}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        <button
          onClick={onDownload}
          className="px-5 py-2 rounded-full bg-black text-white hover:brightness-110 transition shadow-md flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar PDF
        </button>
      </div>
    </div>
  );
}
