"use client";

import { useState, useEffect, useRef } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

interface PDFViewerProps {
  pdfBase64: string;
  onDownload: () => void;
  orderNumber: string;
}

export function PDFViewer({
  pdfBase64,
  onDownload,
}: Readonly<PDFViewerProps>) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageRendering, setPageRendering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(false);

        // Dynamically import pdfjs-dist only on client side
        const pdfjsLib = await import("pdfjs-dist");

        // Set worker source from local public folder
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.mjs";

        // Convert base64 to Uint8Array
        const binaryString = atob(pdfBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        const pdf = await loadingTask.promise;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError(true);
        setLoading(false);
      }
    };

    if (pdfBase64) {
      loadPDF();
    }
  }, [pdfBase64]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || pageRendering) return;

    const renderPage = async () => {
      setPageRendering(true);
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        // Get container width for responsive sizing
        const container = canvas.parentElement;
        const containerWidth = container?.offsetWidth || 800;

        // Calculate scale to fit container
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(containerWidth / viewport.width, 2);
        const scaledViewport = page.getViewport({ scale });

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
          canvas: canvas,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error("Error rendering page:", err);
      } finally {
        setPageRendering(false);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, pageRendering]);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="w-full rounded-xl bg-white overflow-hidden">
        <div className="px-5 pt-5">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Guía de envío
          </h3>
          <p className="text-sm text-gray-700 mb-3">Vista previa del documento.</p>
        </div>
        <div className="w-full h-[380px] sm:h-[480px] md:h-[600px] bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#17407A] animate-spin" />
            <p className="text-sm text-gray-600">Cargando documento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-xl bg-white overflow-hidden">
        <div className="px-5 pt-5">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Guía de envío
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            No se pudo cargar el PDF en el visor.
          </p>
        </div>
        <div className="w-full h-[380px] sm:h-[480px] md:h-[600px] bg-gray-50 flex items-center justify-center">
          <div className="text-center p-6">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-600 mb-4">
              El visor no está disponible en este navegador.
            </p>
            <button
              onClick={onDownload}
              className="px-5 py-2 rounded-full bg-[#17407A] text-white hover:brightness-110 transition shadow-md"
            >
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-white overflow-hidden">
      <div className="px-5 pt-5">
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          Guía de envío
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          Vista previa del documento.
        </p>
      </div>

      {/* PDF Canvas Container */}
      <div className="w-full h-[380px] sm:h-[480px] md:h-[600px] bg-gray-50 overflow-auto flex items-start justify-center p-4">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto shadow-lg"
        />
      </div>

      {/* Controls */}
      <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Page Navigation */}
        {numPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Página anterior"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm text-gray-600 min-w-[80px] text-center">
              Página {currentPage} de {numPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Página siguiente"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={onDownload}
          className="px-5 py-2 rounded-full bg-[#17407A] text-white hover:brightness-110 transition shadow-md"
          aria-label="Descargar guía"
        >
          Descargar PDF
        </button>
      </div>
    </div>
  );
}
