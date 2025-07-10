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
    <div className="flex gap-2 items-center relative" ref={selectRef}>
      <div className="w-full">
        <div
          className={`uppercase flex justify-between items-center text-white w-full py-2 px-4 rounded-md shadow-sm transition-all cursor-pointer hover:border-[#082158]
          ${ordenAscendente ? "bg-[#4ade80]" : "bg-[#f43f5e]"}
          `}
          onClick={() => setAbierto(!abierto)}
        >
          <span>{seleccionActual?.nombre || "Seleccione"}</span>
        </div>

        {abierto && (
          <ul
            className={`absolute z-10 mt-1 w-full bg-white p-2 no-scrollbar border ${
              seleccionActual?.nombre
                ? ordenAscendente
                  ? "border-[#4ade80]"
                  : "border-[#f43f5e]"
                : ""
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

      <button
        onClick={() => setOrdenAscendente(!ordenAscendente)}
        className={`px-3 py-2 rounded-md text-white cursor-pointer transition-all shadow-md hover:scale-105 ${
          ordenAscendente ? "bg-[#4ade80]" : "bg-[#f43f5e]"
        }`}
      >
        <span className="hidden sm:block">
          {ordenAscendente ? "ASCENDENTE" : "DESCENDENTE"}
        </span>
        <span className="block sm:hidden">{ordenAscendente ? "⬆" : "⬇"}</span>
      </button>
    </div>
  );
}
