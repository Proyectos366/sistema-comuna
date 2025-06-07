"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import VocerosFormMostrar from "./VocerosFormMostrar";

export default function VoceroForm() {
  // Estados para los selectores
  const [nombreVocero, setNombreVocero] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");
  const [idConsejoComunal, setIdConsejoComunal] = useState("");

  // Estados para almacenar datos consultados
  const [parroquias, setParroquias] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [consejoPorComuna, setConsejoPorComuna] = useState([]);
  const [vocerosPorConsejo, setVocerosPorConsejo] = useState([]);

  const [circuitoComuna, setCircuitoComuna] = useState(0);

  const [idCrearEnComunaCircuito, setIdCrearEnComunaCircuito] = useState("");

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

  console.log(comunas);

  const fetchComunas = async (parroquiaId) => {
    try {
      setIdParroquia(parroquiaId);
      setIdComuna(""); // Resetear comuna cuando cambia la parroquia

      if (!parroquiaId) {
        setComunas([]);
        return;
      }

      let response;
      if (circuitoComuna === 1 || idCrearEnComunaCircuito === "Comuna") {
        response = await axios.get(`/api/comunas/comunas-id`, {
          params: { idParroquia: parroquiaId },
        });
      } else if (
        circuitoComuna === 2 ||
        idCrearEnComunaCircuito === "Circuito"
      ) {
        response = await axios.get(`/api/circuitos/circuitos-id`, {
          params: { idParroquia: parroquiaId },
        });
      }

      setComunas(response?.data?.comunas || response?.data?.circuitos);
    } catch (error) {
      console.log("Error al obtener comunas o circuitos:", error);
    }
  };

  const fetchConsejoComunal = async (consejoId) => {
    try {
      setIdComuna(consejoId);

      if (!consejoId) {
        setConsejoPorComuna([]);
        return;
      }

      let response;
      if (idCrearEnComunaCircuito === "Comuna") {
        response = await axios.get(
          `/api/consejos/consejos-comunales-id-comuna`,
          {
            params: { idComuna: consejoId },
          }
        );
      } else if (idCrearEnComunaCircuito === "Circuito") {
        response = await axios.get(
          `/api/consejos/consejos-comunales-id-circuito`,
          {
            params: { idCircuito: consejoId },
          }
        );
      }

      //setComunas(response?.data?.comunas || response?.data?.circuitos);

      setConsejoPorComuna(response?.data?.consejos);
    } catch (error) {
      console.log("Error al obtener consejos por id: " + error);
    }
  };

  const fetchVoceroConsejoComunal = async (consejoId) => {
    try {
      setIdConsejoComunal(consejoId);

      if (!consejoId) {
        setVocerosPorConsejo([]);
        return;
      }

      const response = await axios.get(
        `/api/voceros/vocero-consejo-comunal-id`,
        {
          params: { idConsejo: consejoId },
        }
      );

      setVocerosPorConsejo(response?.data?.voceros);
    } catch (error) {
      console.log("Error al obtener voceros consejo comunal: " + error);
    }
  };

  // Manejo de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nombreVocero.trim() && idParroquia.trim() && idComuna.trim()) {
      try {
        let response;
        if (circuitoComuna === 1) {
          response = await axios.post("/api/voceros/crear-vocero", {
            nombre: nombreVocero,
            id_parroquia: idParroquia,
            id_comuna: idComuna,
            comunaCircuito: "comuna",
          });
        } else if (circuitoComuna === 2) {
          response = await axios.post("/api/voceros/crear-vocero", {
            nombre: nombreVocero,
            id_parroquia: idParroquia,
            id_comuna: idComuna,
            comunaCircuito: "circuito",
          });
        } else if (circuitoComuna === 3) {
          response = await axios.post("/api/voceros/crear-vocero", {
            nombre: nombreVocero,
            id_parroquia: idParroquia,
            id_comuna: idComuna,
            id_consejo: idConsejoComunal,
            comunaCircuito: "consejo",
          });
        }

        setConsejoPorComuna(response?.data?.vocero);
        setNombreVocero("");
      } catch (error) {
        console.log(
          "Error al crear vocero: ",
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
          Crear vocero
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">
              Selecciona donde crearlo
            </span>
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

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="2"
                  checked={circuitoComuna === 3}
                  onChange={() =>
                    setCircuitoComuna(circuitoComuna === 3 ? 0 : 3)
                  }
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                />
                <span>Consejo comunal</span>
              </label>
            </div>
          </label>

          {circuitoComuna === 3 && (
            <>
              <label className="block">
                <span className="text-gray-700 font-medium">
                  ¿Donde crear el vocero?
                </span>
                <select
                  value={idCrearEnComunaCircuito}
                  onChange={(e) => setIdCrearEnComunaCircuito(e.target.value)}
                  className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
                >
                  <option value="">Seleccione</option>

                  <option key={1}>Comuna</option>
                  <option key={2}>Circuito</option>
                </select>
              </label>

              {idCrearEnComunaCircuito && (
                <label className="block">
                  <span className="text-gray-700 font-medium">Parroquias:</span>
                  <select
                    value={idParroquia}
                    onChange={(e) => fetchComunas(e.target.value)}
                    className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
                  >
                    <option value="">Seleccione</option>
                    {parroquias.map((parroquia) => (
                      <option key={parroquia.id} value={parroquia.id}>
                        {parroquia.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </>
          )}

          {(circuitoComuna === 1 || circuitoComuna === 2) && (
            <>
              <label className="block">
                <span className="text-gray-700 font-medium">Parroquias:</span>
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

          {idParroquia && circuitoComuna !== 3 && (
            <>
              <label className="block">
                <span className="text-gray-700 font-medium">
                  {circuitoComuna === 1 ? "Comunas" : "Circuitos comunales"}:
                </span>
                <select
                  value={idComuna}
                  onChange={(e) => setIdComuna(e.target.value)}
                  className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
                >
                  <option value="">
                    {circuitoComuna === 1
                      ? "Selecciona una comuna"
                      : "Selecciona circuito comunal"}
                  </option>
                  {comunas.map((comun) => (
                    <option key={comun.id} value={comun.id}>
                      {comun.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          {idParroquia && circuitoComuna !== 3 && idComuna && (
            <>
              <label className="block mt-4">
                <span className="text-gray-700 font-medium">
                  Nombre vocero:
                </span>
                <input
                  type="text"
                  value={nombreVocero}
                  onChange={(e) => setNombreVocero(e.target.value)}
                  className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
                />
              </label>

              <button
                disabled={!nombreVocero}
                type="submit"
                className={`${
                  !nombreVocero ? "cursor-not-allowed" : "cursor-pointer"
                } w-full color-fondo hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
              >
                Guardar
              </button>
            </>
          )}

          {circuitoComuna == 3 && (
            <Prueba
              idCrearEnComunaCircuito={idCrearEnComunaCircuito}
              idParroquia={idParroquia}
              fetchConsejoComunal={fetchConsejoComunal}
              idComuna={idComuna}
              idConsejoComunal={idConsejoComunal}
              fetchVoceroConsejoComunal={fetchVoceroConsejoComunal}
              consejoPorComuna={consejoPorComuna}
              nombreVocero={nombreVocero}
              setNombreVocero={setNombreVocero}
              comunas={comunas}
            />
          )}
        </form>
      </div>

      <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl">
        {/* <VocerosFormMostrar
        idParroquia={idParroquia}
          idComuna={idComuna}
          idConsejoComunal={idConsejoComunal}          
          vocerosPorConsejo={vocerosPorConsejo}
        /> */}
      </div>
    </section>
  );
}

function Prueba({
  idCrearEnComunaCircuito,
  idParroquia,
  fetchConsejoComunal,
  idComuna,
  idConsejoComunal,
  fetchVoceroConsejoComunal,
  consejoPorComuna,
  nombreVocero,
  setNombreVocero,
  comunas,
}) {
  return (
    <>
      {idCrearEnComunaCircuito === "Comuna" && idParroquia && (
        <>
          <label className="block">
            <span className="text-gray-700 font-medium">Comunas:</span>
            <select
              value={idComuna}
              onChange={(e) => fetchConsejoComunal(e.target.value)}
              className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
            >
              <option value="">Selecciona una comuna</option>
              {comunas.map((comun) => (
                <option key={comun.id} value={comun.id}>
                  {comun.nombre}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      {/* Selector de Comunas (Solo se muestra si hay parroquia seleccionada) */}
      {idComuna && (
        <label className="block mt-4">
          <span className="text-gray-700 font-medium">Consejo comunal</span>
          <select
            value={idConsejoComunal}
            onChange={(e) => fetchVoceroConsejoComunal(e.target.value)}
            className="mt-1 cursor-pointer uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="">Selecciona consejo comunal</option>
            {consejoPorComuna.map((consejo) => (
              <option key={consejo.id} value={consejo.id}>
                {consejo.nombre}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Campo para ingresar el nombre del consejo comunal */}
      {idConsejoComunal && (
        <>
          <label className="block mt-4">
            <span className="text-gray-700 font-medium">
              Nombre vocero consejo comunal:
            </span>
            <input
              type="text"
              value={nombreVocero}
              onChange={(e) => setNombreVocero(e.target.value)}
              className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
            />
          </label>

          <button
            disabled={!nombreVocero}
            type="submit"
            className={`${
              !nombreVocero ? "cursor-not-allowed" : "cursor-pointer"
            } w-full color-fondo hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
          >
            Guardar
          </button>
        </>
      )}
    </>
  );
}
