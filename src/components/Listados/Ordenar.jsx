"use client";

import { useState, useEffect, useRef } from "react";

export default function OrdenarLista({
  ordenCampo,
  setOrdenCampo,
  setOrdenAscendente,
  ordenAscendente,
}) {
  const [abierto, setAbierto] = useState(false);
  const selectRef = useRef(null);
  const opcionesOrden = [
    { id: "nombre", nombre: "Nombre" },
    { id: "comuna", nombre: "Comuna" },
    { id: "consejo", nombre: "Consejo" },
    { id: "parroquia", nombre: "Parroquia" },
    { id: "edad", nombre: "Edad" },
    { id: "cedula", nombre: "Cédula" },
  ];

  const seleccionActual = opcionesOrden.find((o) => o.id === ordenCampo);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex gap-2 items-start relative" ref={selectRef}>
      <div className="w-full">
        <div
          className={`uppercase flex justify-between items-center w-full py-2 px-4 rounded-md shadow-sm transition-all cursor-pointer hover:border-[#082158]
          ${
            abierto
              ? "focus:ring focus:ring-[#082158]"
              : "border border-gray-300"
          }
          ${
            seleccionActual?.nombre
              ? "border border-[#082158]"
              : "border border-gray-300"
          }`}
          onClick={() => setAbierto(!abierto)}
        >
          <span>{seleccionActual?.nombre || "Seleccione"}</span>
        </div>

        {abierto && (
          <ul
            className={`absolute z-10 mt-2 w-full bg-white p-2 no-scrollbar border ${
              seleccionActual?.nombre ? "border-[#082158]" : "border-gray-300"
            }  rounded-md shadow-md max-h-[300px] overflow-y-auto`}
          >
            {opcionesOrden.map((opcion, index) => (
              <li
                key={opcion.id}
                className={`uppercase p-2 bg-gray-100 hover:bg-gray-300 cursor-pointer transition duration-150 rounded-md mt-2 ${
                  index === opcionesOrden.length - 1 ? "mb-2" : ""
                }`}
                onClick={() => {
                  setOrdenCampo(opcion.id);
                  setAbierto(false);
                }}
              >
                {opcion.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón de orden */}
      <button
        onClick={() => setOrdenAscendente(!ordenAscendente)}
        className="px-3 py-2 rounded-md bg-[#6c7aa1] text-white self-end"
      >
        <span className="hidden sm:block">
          {ordenAscendente ? "Ascendente" : "Descendente"}
        </span>
        <span className="block sm:hidden">{ordenAscendente ? "⬆" : "⬇"}</span>
      </button>
    </div>
  );
}
