"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function CargosForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
}) {
  const [nombreCargo, setNombreCargo] = useState("");
  const [nombres, setNombres] = useState([]);

  useEffect(() => {
    const fetchDatosCargos = async () => {
      try {
        const response = await axios.get("/api/cargos/todos-cargos");
        setNombres(response.data.cargos || []);
      } catch (error) {
        console.log("Error, al obtener las cargos: " + error);
      }
    };

    fetchDatosCargos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nombreCargo.trim()) {
      try {
        const response = await axios.post("/api/cargos/crear-cargo", {
          nombre: nombreCargo,
        });
        setNombres([...nombres, response.data.cargo]); // Suponiendo que la API devuelve el nombre guardado
        setNombreCargo("");
      } catch (error) {
        console.log("Error, al crear la cargo: " + error);
      }
    }
  };

  return (
    <section className="rounded-md p-6 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
      <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Crear cargo
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Nombre cargo:</span>
            <input
              type="text"
              value={nombreCargo}
              onChange={(e) => setNombreCargo(e.target.value)}
              className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
            />
          </label>
          <button
            disabled={!nombreCargo}
            type="submit"
            className={`${
              !nombreCargo ? "cursor-not-allowed" : "cursor-pointer"
            } w-full color-fondo hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
          >
            Guardar
          </button>
        </form>
      </div>

      <div className="w-full max-w-xl mt-6 bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
        <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">
          Cargos
        </h3>
        <div className="">
          {nombres.map((cargo, index) => (
            <div
              key={index}
              className="hover:bg-gray-200 transition-colors flex flex-col"
            >
              <span className=" rounded-md p-3">{cargo.nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 <section className="rounded-md p-6 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
  <div className="w-full max-w-lg bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Crear parroquia</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-gray-700 font-medium">Nombre:</span>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
        />
      </label>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        Guardar
      </button>
    </form>
  </div>

  <div className="w-full max-w-lg mt-6 bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
    <h3 className="text-lg font-bold mb-3 text-center text-gray-800">Nombres Guardados</h3>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="borde-fondo p-3 text-left">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {nombres.map((parroquia, index) => (
            <tr key={index} className="hover:bg-gray-100 transition-colors">
              <td className="borde-fondo p-3">{parroquia.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>
 */
