"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function VocerosFormMostrar({
  idParroquia,
  idComuna,
  consejoPorComuna,
}) {
  const [consejosComunales, setConsejosComunales] = useState([]);
  const [consejosComunalesVisibles, setConsejosComunalesVisibles] = useState(
    {}
  );

  useEffect(() => {
    if (!idParroquia) {
      setConsejosComunales([]);
    }
    if (!idComuna && consejosComunales.length !== 0) {
      setConsejosComunales([]);
    }
  }, []);

  // Consultar los consejos comunales cuando se selecciona una comuna
  useEffect(() => {
    const fetchConsejosComunales = async () => {
      if (!idComuna) return; // Evitar consultas innecesarias

      try {
        const response = await axios.get(
          `/api/consejos/consejos-comunales-id`,
          {
            params: {
              idComuna: idComuna,
            },
          }
        );
        setConsejosComunales(response.data.consejos || []);
      } catch (error) {
        console.log("Error al obtener consejos comunales:", error);
      }
    };

    if (idParroquia) {
      fetchConsejosComunales();
    }
  }, [idComuna]); // Se ejecuta cuando cambia la comuna

  useEffect(() => {
    if (consejoPorComuna) {
      setConsejosComunales((prevConsejos) => [
        ...prevConsejos,
        consejoPorComuna,
      ]);
    }
  }, [consejoPorComuna]);

  const toggleComuna = (nombreComuna) => {
    setConsejosComunalesVisibles((prev) => ({
      ...prev,
      [nombreComuna]: !prev[nombreComuna], // Alternar visibilidad
    }));
  };

  return (
    <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
      <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">
        Consejos comunales
      </h3>

      {consejosComunales?.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay consejos comunales disponibles.
        </p>
      ) : (
        <>
          {idComuna ? (
            <div>
              {consejosComunales?.map((consejo, index) => (
                <div key={index} className="mb-2">
                  <h4
                    className={`text-lg font-semibold bg-gray-100 hover:bg-gray-300 p-2 rounded-md cursor-pointer ${
                      consejosComunalesVisibles[consejo.nombre]
                        ? "borde-fondo"
                        : ""
                    }`}
                    onClick={() => toggleComuna(consejo.nombre)}
                  >
                    {consejo.nombre}
                  </h4>
                  {consejosComunalesVisibles[consejo.nombre] && (
                    <div className="mt-2 ps-5 border border-gray-300 rounded-md p-3 bg-gray-100">
                      <p>RIF: {consejo.rif}</p>
                      <p>ID Parroquia: {consejo.id_parroquia}</p>
                      <p>ID Comuna: {consejo.id_comuna}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
