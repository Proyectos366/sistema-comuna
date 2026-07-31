"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useSelector } from "react-redux";

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function MostrarArchivo({ id }) {
  const { nameArchivo, path } = useSelector(
    (state) => state.archivos.archivoActual,
  );

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  /** 
    // Detectar ancho del contenedor
    useEffect(() => {
      const updateWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.clientWidth - 16;
          setContainerWidth(width);

          if (width < 640) {
            const newScale = Math.min((width - 32) / 600, 1);
            setScale(Math.max(newScale, 0.5));
          } else {
            setScale(1);
          }
        }
      };

      updateWidth();
      window.addEventListener("resize", updateWidth);

      return () => window.removeEventListener("resize", updateWidth);
    }, []);
  */

  // Detectar ancho del contenedor
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth - 16;
        setContainerWidth(width);

        // Solo ajustar en móvil
        if (width < 640 && width > 0) {
          const newScale = Math.min((width - 32) / 600, 1);
          setScale(Math.max(newScale, 0.5));
        }
      }
    };

    // Inicializar en 100%
    setScale(1);

    const timer = setTimeout(updateWidth, 200);
    window.addEventListener("resize", updateWidth);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

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
    if (containerWidth < 640) {
      const newScale = Math.min((containerWidth - 32) / 600, 1);
      setScale(Math.max(newScale, 0.5));
    } else {
      setScale(1);
    }
  };

  // Silenciar error de extensión de Chrome
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
    <div
      ref={containerRef}
      className="w-full bg-[#f5f5f5] rounded-lg overflow-hidden relative"
      style={{ height: "calc(100vh - 280px)" }}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.preventDefault()}
    >
      {/* Controles del visor */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-[white] shadow-lg p-2 flex items-center justify-center gap-1 sm:gap-2 flex-wrap border border-gray-200 rounded-t-lg">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm"
        >
          ◀
        </button>

        <span className="px-2 text-sm">
          {pageNumber} / {numPages || "?"}
        </span>

        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm"
        >
          ▶
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          onClick={zoomOut}
          disabled={scale <= 0.5}
          className="px-2 sm:px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors text-sm"
        >
          −
        </button>

        <span className="px-1 text-xs sm:text-sm">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={zoomIn}
          disabled={scale >= 2.5}
          className="px-2 sm:px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors text-sm"
        >
          +
        </button>

        <button
          onClick={resetZoom}
          className="px-2 sm:px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
        >
          Reset
        </button>
      </div>

      {/* Visor del PDF */}
      <div className="overflow-y-auto bg-[amber-50] h-[calc(100vh-255px)] no-scrollbar w-full overflow-auto flex justify-center items-start py-10">
        <div className="w-full max-w-full overflow-hidden flex justify-center min-h-full">
          <Document
            file={`/api/archivos/mostrar-archivo?path=${path.replace(/^\/+/, "")}`}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            }
            error={
              <div className="text-red-500 p-4 text-center">
                Error al cargar el PDF
              </div>
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
        </div>
      </div>
    </div>
  );
}

// export default function MostrarArchivo({ id }) {
//   const { nameArchivo, path } = useSelector(
//     (state) => state.archivos.archivoActual,
//   );

//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [scale, setScale] = useState(1);
//   const [containerWidth, setContainerWidth] = useState(0);
//   const containerRef = useRef(null);

//   // Detectar ancho del contenedor
//   useEffect(() => {
//     const updateWidth = () => {
//       if (containerRef.current) {
//         const width = containerRef.current.clientWidth - 16; // Restar padding
//         setContainerWidth(width);

//         // Ajustar escala automática para móvil
//         if (width < 640) {
//           const newScale = Math.min((width - 32) / 600, 1);
//           setScale(Math.max(newScale, 0.5));
//         } else {
//           setScale(1);
//         }
//       }
//     };

//     updateWidth();
//     window.addEventListener('resize', updateWidth);

//     return () => window.removeEventListener('resize', updateWidth);
//   }, []);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//     setPageNumber(1);
//   };

//   const goToPrevPage = () => {
//     setPageNumber(prev => Math.max(prev - 1, 1));
//   };

//   const goToNextPage = () => {
//     setPageNumber(prev => Math.min(prev + 1, numPages));
//   };

//   const zoomIn = () => {
//     setScale(prev => Math.min(prev + 0.25, 2.5));
//   };

//   const zoomOut = () => {
//     setScale(prev => Math.max(prev - 0.25, 0.5));
//   };

//   const resetZoom = () => {
//     if (containerWidth < 640) {
//       const newScale = Math.min((containerWidth - 32) / 600, 1);
//       setScale(Math.max(newScale, 0.5));
//     } else {
//       setScale(1);
//     }
//   };

//   // Silenciar error de extensión de Chrome
//   useEffect(() => {
//     const originalError = console.error;
//     console.error = function(...args) {
//       if (args[0] && typeof args[0] === 'string' &&
//           args[0].includes('chrome-extension://invalid/')) {
//         return;
//       }
//       originalError.apply(console, args);
//     };

//     return () => {
//       console.error = originalError;
//     };
//   }, []);

//   if (!path) {
//     return (
//       <div className="flex items-center justify-center h-64 text-gray-500">
//         No hay archivo seleccionado
//       </div>
//     );
//   }

//   return (
//     <div
//       ref={containerRef}
//       className="w-full bg-[#f5f5f5] rounded-md overflow-hidden relative border-4 border-red-500"
//       style={{ height: 'calc(100vh - 300px)' }}
//       onContextMenu={(e) => e.preventDefault()}
//       onMouseDown={(e) => e.preventDefault()}
//       onClick={(e) => e.preventDefault()}
//     >
//       {/* Controles del visor */}
//       <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-md p-2 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
//         <button
//           onClick={goToPrevPage}
//           disabled={pageNumber <= 1}
//           className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm"
//         >
//           ◀
//         </button>

//         <span className="px-2 text-sm">
//           {pageNumber} / {numPages || '?'}
//         </span>

//         <button
//           onClick={goToNextPage}
//           disabled={pageNumber >= numPages}
//           className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm"
//         >
//           ▶
//         </button>

//         <div className="w-px h-6 bg-gray-300 mx-1"></div>

//         <button
//           onClick={zoomOut}
//           disabled={scale <= 0.5}
//           className="px-2 sm:px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors text-sm"
//         >
//           −
//         </button>

//         <span className="px-1 text-xs sm:text-sm">
//           {Math.round(scale * 100)}%
//         </span>

//         <button
//           onClick={zoomIn}
//           disabled={scale >= 2.5}
//           className="px-2 sm:px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors text-sm"
//         >
//           +
//         </button>

//         <button
//           onClick={resetZoom}
//           className="px-2 sm:px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Visor del PDF */}
//       <div className="h-full w-full overflow-auto flex justify-center items-start pt-12 border-4 border-yellow-500">
//         <div className="w-full max-w-full overflow-hidden flex justify-center min-h-full">
//           <Document
//             file={`/api/archivos/mostrar-archivo?path=${path.replace(/^\/+/, "")}`}
//             onLoadSuccess={onDocumentLoadSuccess}
//             loading={
//               <div className="flex items-center justify-center h-96">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//               </div>
//             }
//             error={
//               <div className="text-red-500 p-4 text-center">
//                 Error al cargar el PDF
//               </div>
//             }
//           >
//             <Page
//               pageNumber={pageNumber}
//               scale={scale}
//               renderTextLayer={true}
//               renderAnnotationLayer={true}
//               className="max-w-full"
//             />
//           </Document>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/Page/TextLayer.css';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import { useSelector } from 'react-redux';

// // Configurar el worker de PDF.js
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();

// export default function MostrarArchivo({ id }) {
//   const { nameArchivo, path } = useSelector(
//     (state) => state.archivos.archivoActual,
//   );

//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [scale, setScale] = useState(1);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//     setPageNumber(1);
//   };

//   const goToPrevPage = () => {
//     setPageNumber(prev => Math.max(prev - 1, 1));
//   };

//   const goToNextPage = () => {
//     setPageNumber(prev => Math.min(prev + 1, numPages));
//   };

//   const zoomIn = () => {
//     setScale(prev => Math.min(prev + 0.25, 2.5));
//   };

//   const zoomOut = () => {
//     setScale(prev => Math.max(prev - 0.25, 0.5));
//   };

//   // Silenciar error de extensión de Chrome
//   useEffect(() => {
//     const originalError = console.error;
//     console.error = function(...args) {
//       if (args[0] && typeof args[0] === 'string' &&
//           args[0].includes('chrome-extension://invalid/')) {
//         return;
//       }
//       originalError.apply(console, args);
//     };

//     return () => {
//       console.error = originalError;
//     };
//   }, []);

//   if (!path) {
//     return (
//       <div className="flex items-center justify-center h-64 text-gray-500">
//         No hay archivo seleccionado
//       </div>
//     );
//   }

//   return (
//     <div
//       className="w-full bg-[#f5f5f5] rounded-md overflow-hidden relative"
//       style={{ height: 'calc(100vh - 300px)' }}
//       onContextMenu={(e) => e.preventDefault()}
//       onMouseDown={(e) => e.preventDefault()}
//       onClick={(e) => e.preventDefault()}
//     >
//       {/* Controles del visor */}
//       <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-md p-2 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
//         <button
//           onClick={goToPrevPage}
//           disabled={pageNumber <= 1}
//           className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm"
//         >
//           ◀
//         </button>

//         <span className="px-2 text-sm">
//           {pageNumber} / {numPages || '?'}
//         </span>

//         <button
//           onClick={goToNextPage}
//           disabled={pageNumber >= numPages}
//           className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm"
//         >
//           ▶
//         </button>

//         <div className="w-px h-6 bg-gray-300 mx-1"></div>

//         <button
//           onClick={zoomOut}
//           disabled={scale <= 0.5}
//           className="px-2 sm:px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors text-sm"
//         >
//           −
//         </button>

//         <span className="px-1 text-xs sm:text-sm">
//           {Math.round(scale * 100)}%
//         </span>

//         <button
//           onClick={zoomIn}
//           disabled={scale >= 2.5}
//           className="px-2 sm:px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors text-sm"
//         >
//           +
//         </button>

//         <button
//           onClick={() => setScale(1)}
//           className="px-2 sm:px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
//         >
//           Reset
//         </button>
//       </div>

//       {/* Visor del PDF */}
//       <div className="pt-14 h-full overflow-auto flex justify-center items-start p-2">
//         <Document
//           file={`/api/archivos/mostrar-archivo?path=${path.replace(/^\/+/, "")}`}
//           onLoadSuccess={onDocumentLoadSuccess}
//           loading={
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//             </div>
//           }
//           error={
//             <div className="text-red-500 p-4 text-center">
//               Error al cargar el PDF
//             </div>
//           }
//         >
//           <Page
//             pageNumber={pageNumber}
//             scale={scale}
//             renderTextLayer={true}
//             renderAnnotationLayer={true}
//           />
//         </Document>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/TextLayer.css";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import { useSelector } from "react-redux";

// /**
//   // En algún lugar de tu interfaz fuera de este componente
//   <button onClick={() => window.open(`/api/archivos/descargar?path=${path}`)}>
//     Descargar PDF
//   </button>
// */

// // Configurar el worker de PDF.js
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url,
// ).toString();

// export default function MostrarArchivo({ id }) {
//   const { nameArchivo, path } = useSelector(
//     (state) => state.archivos.archivoActual,
//   );

//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [scale, setScale] = useState(1);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//     setPageNumber(1);
//   };

//   const goToPrevPage = () => {
//     setPageNumber((prev) => Math.max(prev - 1, 1));
//   };

//   const goToNextPage = () => {
//     setPageNumber((prev) => Math.min(prev + 1, numPages));
//   };

//   const zoomIn = () => {
//     setScale((prev) => Math.min(prev + 0.25, 2.5));
//   };

//   const zoomOut = () => {
//     setScale((prev) => Math.max(prev - 0.25, 0.5));
//   };

//   // Silenciar error de extensión de Chrome
//   useEffect(() => {
//     const originalError = console.error;
//     console.error = function (...args) {
//       if (
//         args[0] &&
//         typeof args[0] === "string" &&
//         args[0].includes("chrome-extension://invalid/")
//       ) {
//         return;
//       }
//       originalError.apply(console, args);
//     };

//     return () => {
//       console.error = originalError;
//     };
//   }, []);

//   if (!path) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-100">
//         <p className="text-gray-500">No hay archivo seleccionado</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="relative w-full  bg-[#f5f5f5]"
//       onContextMenu={(e) => e.preventDefault()}
//       onMouseDown={(e) => e.preventDefault()}
//       onClick={(e) => e.preventDefault()}
//     >
//       <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-md p-2 flex items-center justify-center gap-2 flex-wrap">
//         <button
//           onClick={goToPrevPage}
//           disabled={pageNumber <= 1}
//           className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
//         >
//           ◀ Anterior
//         </button>

//         <span className="px-3 py-1">
//           Página {pageNumber} de {numPages || "?"}
//         </span>

//         <button
//           onClick={goToNextPage}
//           disabled={pageNumber >= numPages}
//           className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
//         >
//           Siguiente ▶
//         </button>

//         <div className="w-px h-6 bg-gray-300 mx-2"></div>

//         <button
//           onClick={zoomOut}
//           disabled={scale <= 0.5}
//           className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
//         >
//           −
//         </button>

//         <span className="px-2 text-sm">{Math.round(scale * 100)}%</span>

//         <button
//           onClick={zoomIn}
//           disabled={scale >= 2.5}
//           className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
//         >
//           +
//         </button>

//         <div className="w-px h-6 bg-gray-300 mx-2"></div>

//         <button
//           onClick={() => setScale(1)}
//           className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
//         >
//           Reset
//         </button>
//       </div>

//       <div className="pt-16 h-full overflow-auto flex justify-center items-start p-4">
//         <Document
//           file={`/api/archivos/mostrar-archivo?path=${path.replace(/^\/+/, "")}`}
//           onLoadSuccess={onDocumentLoadSuccess}
//           loading={
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//             </div>
//           }
//           error={
//             <div className="text-red-500 p-4">
//               Error al cargar el PDF. Verifica que el archivo sea válido.
//             </div>
//           }
//         >
//           <Page
//             pageNumber={pageNumber}
//             scale={scale}
//             renderTextLayer={true}
//             renderAnnotationLayer={true}
//           />
//         </Document>
//       </div>

//       <div
//         className="absolute ms-[42%] top-0 left-0 w-[60%] h-5 sm:h-14 bg-[#000000] pointer-events-none"
//         onContextMenu={(e) => e.preventDefault()}
//         onMouseDown={(e) => e.preventDefault()}
//         onClick={(e) => e.preventDefault()}
//       ></div>

//       <div
//         className="absolute sm:top-14 left-0 w-[98%] h-full bg-[#ddddd7] opacity-10 pointer-events-none"
//         onContextMenu={(e) => e.preventDefault()}
//         onMouseDown={(e) => e.preventDefault()}
//         onClick={(e) => e.preventDefault()}
//       ></div>
//     </div>
//   );
// }

/** 
import { useSelector } from "react-redux";

export default function MostrarArchivo({ id }) {
  const { nameArchivo, path } = useSelector(
    (state) => state.archivos.archivoActual,
  );

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden shadow-lg bg-[#ffffff] p-4"
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.preventDefault()}
    >
      <iframe
        id={id ? id : "iframe"}
        className=""
        src={`/api/archivos/mostrar-archivo?path=${path.replace(/^\/+/, "")}`}
      />
      <div
        className="absolute ms-[42%] top-0 left-0 w-[60%] h-5 sm:h-14 bg-[#000000]"
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => e.preventDefault()}
      ></div>

      <div
        className="absolute sm:top-14 left-0 w-[98%] h-full bg-[#ddddd7] opacity-10"
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => e.preventDefault()}
      ></div>
    </div>
  );
}
*/
