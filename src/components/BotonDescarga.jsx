"use client";

import { useState } from "react";

const BotonDescarga = ({ urlArchivo, detalleArchivo, mostrarModal }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    const a = document.createElement("a");
    a.href = urlArchivo;
    a.setAttribute("download", detalleArchivo.nombre_sistema);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Mostrar mensaje de confirmación después de la descarga
    setTimeout(() => {
      setLoading(false);
      mostrarModal();
    }, 3000); // Ajusta según el tamaño del archivo
  };

  return (
    <button
      onClick={() => {
        handleDownload();
      }}
      className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center gap-2 cursor-pointer hover:bg-blue-700 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? (
        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
      ) : (
        "Descargar PDF"
      )}
    </button>
  );
};

export default BotonDescarga;
