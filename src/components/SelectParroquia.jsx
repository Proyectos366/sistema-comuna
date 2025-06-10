"use client";

import { useState, useEffect } from "react";

export default function SelectParroquia({
  nombre,
  idParroquia,
  handleChange,
  parroquias,
  seleccione,
}) {
  const [abierto, setAbierto] = useState(false);
  const [seleccionado, setSeleccionado] = useState("");

  // Actualizar estado cuando idParroquia cambie (por props o reset)
  useEffect(() => {
    const parroquiaSeleccionada = parroquias.find((p) => p.id === idParroquia);
    setSeleccionado(
      parroquiaSeleccionada ? parroquiaSeleccionada.nombre : seleccione
    );
  }, [idParroquia, parroquias]);

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
          className={`${abierto ? "border-[#082158]" : "border-gray-300"} 
              mt-1 uppercase flex justify-between items-center w-full p-2 
              border rounded-md shadow-sm 
              focus:ring focus:ring-[#082158] hover:border-[#082158] 
              focus:outline-none transition-all cursor-pointer`}
          onClick={() => setAbierto(!abierto)}
        >
          <span className="uppercase">{seleccionado}</span>
          <span className="transform pointer-events-none flex items-center">
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
          {parroquias.map((parroquia, index) => (
            <li
              key={parroquia.id}
              className={`p-2 bg-gray-100 hover:bg-gray-300 cursor-pointer transition duration-150 rounded-md mt-2 
                          ${index === parroquias.length - 1 ? "mb-2" : ""}`}
              onClick={() => manejarSeleccion(parroquia.id, parroquia.nombre)}
            >
              {parroquia.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
