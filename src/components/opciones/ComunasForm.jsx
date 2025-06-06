"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ComunaFormMostrar from "./ComunaFormMostrar";

export default function ComunasForm() {
  const [nombreComuna, setNombreComuna] = useState("");
  const [rifComuna, setRifComuna] = useState("");
  const [idParroquia, setIdParroquia] = useState("");

  const [nuevaComuna, setNuevaComuna] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  useEffect(() => {
    const fetchParroquias = async () => {
      try {
        const response = await axios.get("/api/parroquias/todas-parroquias");
        setParroquias(response.data.parroquias || []);
      } catch (error) {
        console.error("Error al obtener las parroquias:", error);
      }
    };

    fetchParroquias();
  }, []);

  const handleChange = (e) => {
    setIdParroquia(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreComuna.trim() || !idParroquia) {
      console.log("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post("/api/comunas/crear-comuna", {
        nombre: nombreComuna,
        rif: rifComuna,
        id_parroquia: idParroquia,
      });

      setNuevaComuna(response.data.comuna);
      setNombreComuna("");
      setRifComuna("");
    } catch (error) {
      console.error(
        "Error al crear la comuna:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <section className="rounded-md p-2 sm:p-6 min-h-screen flex flex-col items-center sm:justify-center space-y-4 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
      
      <div className="w-full sm:max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Crear comuna
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Parroquia:</span>
            <select
              value={idParroquia}
              onChange={handleChange}
              className="mt-1 cursor-pointer uppercase block w-full p-3 rounded-lg shadow-sm"
            >
              <option value="">Selecciona una parroquia</option>
              {parroquias.map((parroquia) => (
                <option key={parroquia.id} value={parroquia.id}>
                  {parroquia.nombre}
                </option>
              ))}
            </select>
          </label>

          {idParroquia && (
            <>
              <label className="block">
                <span className="text-gray-700 font-medium">
                  Nombre comuna:
                </span>
                <input
                  type="text"
                  value={nombreComuna}
                  onChange={(e) => setNombreComuna(e.target.value)}
                  className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
                />
              </label>

              <button
                disabled={!nombreComuna || !idParroquia}
                type="submit"
                className={`${
                  !nombreComuna || !idParroquia
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } w-full color-fondo hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
              >
                Guardar
              </button>
            </>
          )}
        </form>
      </div>

      <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl">
        <ComunaFormMostrar
          idParroquia={idParroquia}
          nuevaComuna={nuevaComuna}
        />
      </div>
    </section>
  );
}
