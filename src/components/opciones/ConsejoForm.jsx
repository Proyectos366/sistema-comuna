"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ConsejoForm() {
  const [nombreConsejo, setNombreConsejo] = useState("");
  const [rifConsejo, setRifConsejo] = useState("");
  const [idParroquia, setIdParroquia] = useState(0);

  const [nombres, setNombres] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  const [nombreParroquiaSeleccionada, setNombreParroquiaSeleccionada] =
    useState("");

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const responseConsejos = await axios.get("/api/consejos/todos-consejos-comunales");
        const responseParroquias = await axios.get(
          "/api/parroquias/todas-parroquias"
        );

        setNombres(responseConsejos.data.consejos || []);
        setParroquias(responseParroquias.data.parroquias || []);
      } catch (error) {
        console.log("Error, al obtener los datos: " + error);
      }
    };

    fetchDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nombreConsejo.trim() && rifConsejo.trim()) {
      try {
        const response = await axios.post("/api/consejos/crear-consejo-comunal", {
          nombre: nombreConsejo,
          rif: rifConsejo,
          id_parroquia: idParroquia,
        });

        setNombres([...nombres, response.data.comuna]); // Suponiendo que la API devuelve el nombre guardado
        setNombreConsejo("");
        setRifConsejo("");
        setIdParroquia(""); // Cambié 0 por una cadena vacía en caso de que `idParroquia` sea un string
      } catch (error) {
        console.log(
          "Error al crear la comuna:",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      console.log("Todos los campos son obligatorios.");
    }
  };

  const handleChange = (e) => {
    const nuevoId = Number(e.target.value);
    setIdParroquia(nuevoId);

    const parroquiaSeleccionada = parroquias.find(
      (parroquia) => parroquia.id === nuevoId
    );

    setNombreParroquiaSeleccionada(
      parroquiaSeleccionada ? parroquiaSeleccionada.nombre : ""
    );
  };

  const comunasAgrupadas = nombres.reduce((acc, comuna) => {
    const parroquia = parroquias.find((p) => p.id === comuna.id_parroquia);
    const nombreParroquia = parroquia
      ? parroquia.nombre
      : "Parroquia desconocida";

    if (!acc[nombreParroquia]) {
      acc[nombreParroquia] = [];
    }

    acc[nombreParroquia].push(comuna);
    return acc;
  }, {});

  return (
    <section className="rounded-md p-6 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
      <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Crear comuna
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <label className="block">
            <span className="text-gray-700 font-medium">Parroquia:</span>
            <select
              value={idParroquia}
              onChange={(e) => setIdParroquia(e.target.value)}
              className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
            >
              <option value="">Selecciona una parroquia</option>
              {parroquias
                .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Ordena por nombre
                .map((parroquia) => (
                  <option key={parroquia.id} value={parroquia.id}>
                    {parroquia.nombre}
                  </option>
                ))}
            </select>
          </label> */}

          <label className="block">
            <span className="text-gray-700 font-medium">Parroquia:</span>
            <select
              value={idParroquia}
              onChange={handleChange}
              className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
            >
              <option value="">Selecciona una parroquia</option>
              {parroquias
                .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Ordena por nombre
                .map((parroquia) => (
                  <option key={parroquia.id} value={parroquia.id}>
                    {parroquia.nombre}
                  </option>
                ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Nombre comuna:</span>
            <input
              type="text"
              value={nombreConsejo}
              onChange={(e) => setNombreConsejo(e.target.value)}
              className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Rif comuna:</span>
            <input
              type="text"
              value={rifConsejo}
              onChange={(e) => setRifConsejo(e.target.value)}
              className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
            />
          </label>

          <button
            disabled={!nombreConsejo}
            type="submit"
            className={`${
              !nombreConsejo ? "cursor-not-allowed" : "cursor-pointer"
            } w-full color-fondo hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
          >
            Guardar
          </button>
        </form>
      </div>

      <ComunaFormMostrar
        comunasAgrupadas={comunasAgrupadas}
        nombreParroquiaSeleccionada={nombreParroquiaSeleccionada}
        setNombreParroquiaSeleccionada={setNombreParroquiaSeleccionada}
      />

      {/* <div className="w-full max-w-xl mt-6 bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
        <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">
          Comunas
        </h3>
        <div className="">
          {Object.entries(comunasAgrupadas).map(
            ([nombreParroquia, comunas]) => (
              <div key={nombreParroquia} className="mb-4">
                <h4 className="text-xl font-semibold text-gray-700">
                  {nombreParroquia}
                </h4>
                {comunas.map((comuna) => (
                  <div
                    key={comuna.id}
                    className="hover:bg-gray-200 transition-colors flex flex-col"
                  >
                    <span className="rounded-md p-3">{comuna.nombre}</span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div> */}
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
