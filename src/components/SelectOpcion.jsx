"use client";

import { useState, useEffect, useRef } from "react";
import Input from "./Input";

export default function SelectOpcion({
  nombre,
  idOpcion,
  handleChange,
  opciones,
  seleccione,
}) {
  const [abierto, setAbierto] = useState(false);
  const [seleccionado, setSeleccionado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const selectRef = useRef(null); // Referencia para detectar clics fuera

  useEffect(() => {
    const opcionSeleccionada = opciones.find((p) => p.id === idOpcion);
    setSeleccionado(
      opcionSeleccionada ? opcionSeleccionada.nombre : seleccione
    );
  }, [idOpcion, opciones]);

  const manejarSeleccion = (id, nombre) => {
    setSeleccionado(nombre);
    handleChange({ target: { value: id } });
    setAbierto(false);
    setBusqueda("");
  };

  // Detectar clics fuera del menú para cerrarlo
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
    <div className="w-full" ref={selectRef}>
      {" "}
      {/* Se asigna la referencia */}
      <label className="block">
        <span className="text-gray-800 font-semibold">{nombre}:</span>
        <div
          className={`mt-1 uppercase flex justify-between items-center w-full p-2 
          rounded-md shadow-sm transition-all cursor-pointer focus:outline-none hover:border-[#082158]
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
        <div
          className={`border border-[#082158] w-full px-2 mt-1 ${
            busqueda ? "pb-2" : ""
          } pt-2 bg-white rounded-lg shadow-md z-10`}
        >
          <Input
            type={"text"}
            placeholder={"Buscar..."}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <ul>
            {!busqueda && (
              <li
                className="p-2 bg-gray-100 hover:bg-gray-300 uppercase cursor-pointer transition duration-150 rounded-md mt-2"
                onClick={() => manejarSeleccion("", seleccione)}
              >
                {seleccione}
              </li>
            )}

            {opciones
              .filter((opc) =>
                opc.nombre.toLowerCase().includes(busqueda.toLowerCase())
              )
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((opc, index) => (
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
        </div>
      )}
    </div>
  );
}
