"use client";

import { useState, useEffect } from "react";

export default function SelectOpcion({
  nombre,
  idOpcion,
  handleChange,
  opciones,
  seleccione,
}) {
  const [abierto, setAbierto] = useState(false);
  const [seleccionado, setSeleccionado] = useState("");

  // Actualizar estado cuando idOpcion cambie (por props o reset)
  useEffect(() => {
    const opcionSeleccionada = opciones.find((p) => p.id === idOpcion);
    setSeleccionado(
      opcionSeleccionada ? opcionSeleccionada.nombre : seleccione
    );
  }, [idOpcion, opciones]);

  const manejarSeleccion = (id, nombre) => {
    setSeleccionado(nombre);
    handleChange({ target: { value: id } }); // Se actualiza el ID correctamente
    setAbierto(false);
  };

  return (
    <div className="w-full">
      <label className="block">
        <span className="text-gray-800 font-semibold">{nombre}:</span>
        <div
          className={`mt-1 uppercase flex justify-between items-center w-full p-2 
      rounded-md shadow-sm transition-all cursor-pointer 
      focus:outline-none hover:border-[#082158] 
      ${
        seleccionado === "Seleccione"
          ? "border border-gray-300"
          : "border border-[#082158]"
      } 
      ${abierto ? "focus:ring focus:ring-[#082158]" : ""}`}
          onClick={() => setAbierto(!abierto)}
        >
          <span
            className={`uppercase ${abierto ? "opacity-60" : "opacity-90"}`}
          >
            {seleccionado}
          </span>
          <span
            className={`transform pointer-events-none flex items-center ${
              abierto ? "opacity-60" : "opacity-90"
            }`}
          >
            {abierto ? "▲" : "▼"}
          </span>
        </div>
      </label>

      {abierto && (
        <ul
          className={`border ${
            abierto ? "border-[#082158]" : "border-gray-400"
          } w-full px-2 mt-1 bg-white rounded-lg shadow-md z-10`}
        >
          <li
            className="p-2 bg-gray-100 hover:bg-gray-300 uppercase cursor-pointer transition duration-150 rounded-md mt-2"
            onClick={() => manejarSeleccion("", seleccione)} // Opción para resetear
          >
            {seleccione}
          </li>
          {opciones.map((opc, index) => (
            <li
              key={opc.id}
              className={`p-2 bg-gray-100 hover:bg-gray-300 cursor-pointer transition duration-150 rounded-md mt-2 
                          ${index === opciones.length - 1 ? "mb-2" : ""}`}
              onClick={() => manejarSeleccion(opc.id, opc.nombre)}
            >
              {opc.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
