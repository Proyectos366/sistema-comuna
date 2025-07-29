"use client";

import { useState, useEffect, useRef } from "react";
import Input from "./Input";

export default function SelectOpcion({
  nombre,
  idOpcion,
  handleChange,
  opciones,
  seleccione,
  setNombre,
  setDatos,
  indice,
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
    <div className="w-full relative overflow-visible" ref={selectRef}>
      <label className="block">
        <span className="text-gray-800 font-semibold">{nombre}:</span>
        <div
          className={` uppercase flex justify-between items-center w-full py-2 px-4 
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
          className={`overflow-y-auto max-h-[300px] no-scrollbar ${
            !indice ? "absolute" : "relative"
          } left-0 top-full border border-[#082158] w-full mt-1 py-2 bg-white rounded-lg shadow-md z-50`}
        >
          <div className="px-2">
            {/* Contenedor con sticky input */}
            <div className="bg-white sticky top-0 z-10 pb-2">
              <Input
                type="text"
                placeholder="Buscar..."
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <ul>
              {!busqueda && (
                <li
                  className={`p-2 bg-gray-100 hover:bg-gray-300 uppercase cursor-pointer transition duration-150 rounded-md`}
                  onClick={() => manejarSeleccion("", seleccione)}
                >
                  {seleccione}
                </li>
              )}

              {opciones &&
                opciones
                  .filter((opc) =>
                    opc.nombre.toLowerCase().includes(busqueda.toLowerCase())
                  )
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map((opc, index) => (
                    <li
                      key={opc.id}
                      className={`uppercase p-2 bg-gray-100 hover:bg-gray-300 cursor-pointer transition duration-150 rounded-md mt-2 ${
                        index === opciones.length - 1 ? "mb-2" : "mb-2"
                      }`}
                      onClick={() => {
                        manejarSeleccion(opc.id, opc.nombre);
                        if (typeof setNombre === "function")
                          setNombre(opc.nombre);
                        if (typeof setDatos === "function") setDatos(opc);
                      }}
                    >
                      {opc.nombre}
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      )}

      {/* {abierto && (
        <div
          className={`overflow-y-auto max-h-[300px] no-scrollbar ${
            !indice ? "absolute" : "relative"
          } left-0 top-full border border-[#082158] w-full px-2 mt-1 ${
            busqueda ? "pb-2" : ""
          } pt-2 bg-white rounded-lg shadow-md z-50`}
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

            {opciones &&
              opciones
                .filter((opc) =>
                  opc.nombre.toLowerCase().includes(busqueda.toLowerCase())
                )
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((opc, index) => (
                  <li
                    key={opc.id}
                    className={`uppercase p-2 bg-gray-100 hover:bg-gray-300 cursor-pointer transition duration-150 rounded-md mt-2 ${
                      index === opciones.length - 1 ? "mb-2" : ""
                    }`}
                    onClick={() => {
                      manejarSeleccion(opc.id, opc.nombre);
                      if (typeof setNombre === "function") {
                        setNombre(opc.nombre); // Solo se ejecuta si se pasó la función
                      }

                      if (typeof setDatos === "function") {
                        setDatos(opc); // Solo se ejecuta si se pasó la función
                      }
                    }}
                  >
                    {opc.nombre}
                  </li>
                ))}
          </ul>
        </div>
      )} */}
    </div>
  );
}
