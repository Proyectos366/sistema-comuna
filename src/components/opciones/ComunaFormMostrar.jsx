"use client";

import { useState } from "react";

export default function ComunaFormMostrar({
  comunasAgrupadas,
  nombreParroquiaSeleccionada,
  setNombreParroquiaSeleccionada,
}) {
  const [parroquiasVisibles, setParroquiasVisibles] = useState({});

  const toggleParroquia = (nombreParroquia) => {
    setNombreParroquiaSeleccionada(nombreParroquia);
    setParroquiasVisibles((prev) => ({
      [nombreParroquia]: !prev[nombreParroquia], // Abre la seleccionada y cierra las demás
    }));
  };

  return (
    <div className="w-full max-w-xl mt-6 bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
      <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">
        Comunas por parroquia
      </h3>
      <div className="">
        {Object.entries(comunasAgrupadas).map(([nombreParroquia, comunas]) => (
          <div key={nombreParroquia} className="mb-2">
            <h4
              className={`text-lg font-semibold bg-gray-100 hover:bg-gray-300 p-2 rounded-md cursor-pointer ${
                nombreParroquia === nombreParroquiaSeleccionada
                  ? "borde-fondo"
                  : ""
              }`}
              onClick={() => toggleParroquia(nombreParroquia)}
            >
              {nombreParroquia}
            </h4>
            {parroquiasVisibles[nombreParroquia] && (
              <div className="mt-2 ps-5">
                {comunas.map((comuna) => (
                  <div
                    key={comuna.id}
                    className="hover:bg-gray-200 border border-gray-300 rounded-md transition-colors flex flex-col"
                  >
                    <span className="rounded-md p-3">{comuna.nombre}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
