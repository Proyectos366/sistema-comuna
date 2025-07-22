"use client";

import { useState, useEffect, useRef } from "react";

export default function OrdenarListaUsuarios({
  ordenCampo,
  setOrdenCampo,
  setOrdenAscendente,
  ordenAscendente,
}) {
  const [abierto, setAbierto] = useState(false);
  const selectRef = useRef(null);

  // Opciones de orden disponibles
  const opcionesOrden = [
    { id: "nombre", nombre: "Nombre" },
    { id: "cedula", nombre: "Cédula" },
    { id: "borrado", nombre: "Activo" },
    { id: "validado", nombre: "Autorizado" },
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
          className={`uppercase flex justify-between items-center border w-full py-2 px-4 rounded-md shadow-sm transition-all cursor-pointer hover:font-semibold
            ${
              ordenAscendente
                ? "border-[#2FA807] text-[#2FA807]"
                : "border-[#E61C45] text-[#E61C45]"
            }`}
          onClick={() => setAbierto(!abierto)}
        >
          <span className="whitespace-nowrap">
            {seleccionActual?.nombre || "Seleccione"}
          </span>
        </div>

        {abierto && (
          <ul
            className={`absolute z-10 mt-1 w-full bg-white px-2 no-scrollbar border ${
              ordenAscendente ? "border-[#2FA807]" : "border-[#E61C45]"
            } rounded-md shadow-md max-h-[300px] overflow-y-auto`}
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
        className={`px-3 py-2 rounded-md text-white font-medium cursor-pointer transition-all shadow-md hover:scale-105 ${
          ordenAscendente ? "bg-[#2FA807]" : "bg-[#E61C45]"
        }`}
      >
        <span className="hidden sm:block">
          {ordenAscendente ? "ASCENDENTE" : "DESCENDENTE"}
        </span>
        <span className="block sm:hidden">
          {ordenAscendente ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M12 4l-8 8h6v8h4v-8h6z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M12 20l8-8h-6v-8h-4v8h-6z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
