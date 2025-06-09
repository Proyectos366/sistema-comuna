"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ConsejoFormMostrar from "./ConsejoFormMostrar";

export default function ConsejoForm() {
  // Estados para los selectores
  const [nombreConsejo, setNombreConsejo] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");

  // Estados para almacenar datos consultados
  const [parroquias, setParroquias] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [consejoPorComuna, setConsejoPorComuna] = useState([]);

  const [circuitoComuna, setCircuitoComuna] = useState(0);

  // Consultar parroquias al cargar el componente
  useEffect(() => {
    const fetchParroquias = async () => {
      try {
        const response = await axios.get("/api/parroquias/todas-parroquias");
        setParroquias(response.data.parroquias || []);
      } catch (error) {
        console.log("Error al obtener parroquias:", error);
      }
    };

    fetchParroquias();
  }, []);

  useEffect(() => {
    setIdParroquia("");
    setIdComuna("");
  }, [circuitoComuna]);

  const fetchComunas = async (parroquiaId) => {
    try {
      setIdParroquia(parroquiaId);
      setIdComuna(""); // Resetear comuna cuando cambia la parroquia

      if (!parroquiaId || circuitoComuna === 0) {
        setComunas([]);
        return;
      }

      let response;
      if (circuitoComuna === 1) {
        response = await axios.get(`/api/comunas/comunas-id`, {
          params: { idParroquia: parroquiaId },
        });
      } else if (circuitoComuna === 2) {
        response = await axios.get(`/api/circuitos/circuitos-id`, {
          params: { idParroquia: parroquiaId },
        });
      }

      setComunas(response?.data?.comunas || response?.data?.circuitos);
    } catch (error) {
      console.log("Error al obtener comunas o circuitos:", error);
    }
  };

  // Manejo de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nombreConsejo.trim() && idParroquia.trim() && idComuna.trim()) {
      try {
        let response;
        if (circuitoComuna === 1) {
          response = await axios.post("/api/consejos/crear-consejo-comunal", {
            nombre: nombreConsejo,
            id_parroquia: idParroquia,
            id_comuna: idComuna,
            comunaCircuito: "comuna",
          });
        } else if (circuitoComuna === 2) {
          response = await axios.post("/api/consejos/crear-consejo-comunal", {
            nombre: nombreConsejo,
            id_parroquia: idParroquia,
            id_comuna: idComuna,
            comunaCircuito: "circuito",
          });
        }

        setConsejoPorComuna(response.data.consejo);
        setNombreConsejo("");
      } catch (error) {
        console.log(
          "Error al crear el consejo comunal:",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      console.log("Todos los campos son obligatorios.");
    }
  };

  return (
    <section className="rounded-md p-6 min-h-screen flex flex-col items-center justify-center space-y-4 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
      <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Crear consejo comunal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Selecciona:</span>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="1"
                  checked={circuitoComuna === 1}
                  onChange={() =>
                    setCircuitoComuna(circuitoComuna === 1 ? 0 : 1)
                  }
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                />
                <span>Comuna</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="2"
                  checked={circuitoComuna === 2}
                  onChange={() =>
                    setCircuitoComuna(circuitoComuna === 2 ? 0 : 2)
                  }
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                />
                <span>Circuito comunal</span>
              </label>
            </div>
          </label>

          {/* Selector de Parroquias */}
          {circuitoComuna !== 0 && (
            <>
              <label className="block">
                <span className="text-gray-700 font-medium">Parroquia:</span>
                <select
                  value={idParroquia}
                  onChange={(e) => fetchComunas(e.target.value)}
                  className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
                >
                  <option value="">Selecciona una parroquia</option>
                  {parroquias.map((parroquia) => (
                    <option key={parroquia.id} value={parroquia.id}>
                      {parroquia.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          {/* Selector de Comunas (Solo se muestra si hay parroquia seleccionada) */}
          {idParroquia && (
            <label className="block mt-4">
              <span className="text-gray-700 font-medium">
                {`${
                  circuitoComuna === 1
                    ? "Comuna"
                    : circuitoComuna === 2
                    ? "Circuito comunal"
                    : "Otro"
                }:`}
              </span>
              <select
                value={idComuna}
                onChange={(e) => setIdComuna(e.target.value)}
                className="mt-1 cursor-pointer uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
              >
                <option value="">
                  {circuitoComuna === 1
                    ? "Seleccione una comuna"
                    : "Seleccione un circuito"}
                </option>
                {comunas.map((comuna) => (
                  <option key={comuna.id} value={comuna.id}>
                    {comuna.nombre}
                  </option>
                ))}
              </select>
            </label>
          )}

          {/* Campo para ingresar el nombre del consejo comunal */}
          {idComuna && (
            <>
              <label className="block mt-4">
                <span className="text-gray-700 font-medium">
                  Nombre del consejo comunal:
                </span>
                <input
                  type="text"
                  value={nombreConsejo}
                  onChange={(e) => setNombreConsejo(e.target.value)}
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
            </>
          )}
        </form>
      </div>

      <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl">
        <ConsejoFormMostrar
          idComuna={idComuna}
          idParroquia={idParroquia}
          consejoPorComuna={consejoPorComuna}
          circuitoComuna={circuitoComuna}
        />
      </div>
    </section>
  );
}
