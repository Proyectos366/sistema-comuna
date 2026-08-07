"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Document, Page, pdfjs } from "react-pdf";
import { useUser } from "@/app/context/AuthContext";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import ToolbarPdf from "@/components/dashboard/archivos/components/ToolbarPdf";
import Div from "@/components/padres/Div";

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function MostrarArchivo({ id }) {
  const { path, idArchivo } = useSelector(
    (state) => state.archivos.archivoActual,
  );

  const { screenSize } = useUser();

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const containerRef = useRef(null);

  useEffect(() => {
    if (screenSize.width < 640) {
      const newScale = Math.min((screenSize.width - 32) / 600, 1);
      setScale(Math.max(newScale, 0.5));
    } else {
      setScale(1);
    }
  }, [screenSize.width]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.5));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    if (screenSize.width < 640) {
      const newScale = Math.min((screenSize.width - 32) / 600, 1);
      setScale(Math.max(newScale, 0.5));
    } else {
      setScale(1);
    }
  };

  useEffect(() => {
    const originalError = console.error;
    console.error = function (...args) {
      if (
        args[0] &&
        typeof args[0] === "string" &&
        args[0].includes("chrome-extension://invalid/")
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  if (!path) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No hay archivo seleccionado
      </div>
    );
  }

  return (
    <Div
      ref={containerRef}
      className="w-full bg-[#f5f5f5] rounded-lg overflow-hidden relative border border-[#d1d5dc]"
      style={{ height: "calc(100vh - 280px)" }}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.preventDefault()}
    >
      <ToolbarPdf
        pageNumber={pageNumber}
        numPages={numPages}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
        scale={scale}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
      />

      <Div className="overflow-y-auto bg-[#fffbeb] h-[calc(100vh-255px)] no-scrollbar w-full overflow-auto flex justify-center items-start py-10">
        <Div className="w-full max-w-full overflow-hidden flex justify-center min-h-full">
          <Document
            file={`/api/archivos/mostrar-archivo?idArchivo=${idArchivo}`}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <Div className="flex items-center justify-center h-96">
                <Div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#082158]"></Div>
              </Div>
            }
            error={
              <Div className="text-[#E61C45] p-4 text-center">
                Error al cargar el PDF
              </Div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="max-w-full"
            />
          </Document>
        </Div>
      </Div>
    </Div>
  );
}
