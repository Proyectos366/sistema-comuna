"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function VocerosFormMostrar({
  idParroquia,
  idComuna,
  idConsejo,
  nuevoVocero,
  pertenece,
}) {
  const [voceros, setVoceros] = useState([]);
  const [vocerosVisibles, setVocerosVisibles] = useState({});

  useEffect(() => {
    if (!idParroquia) {
      setVoceros([]);
    }
    if (!idComuna && voceros.length !== 0) {
      setVoceros([]);
    }
  }, []);

  useEffect(() => {
    const fetchVoceros = async () => {
      const idConsulta = pertenece === 3 ? idConsejo : idComuna; // Decidir qué ID usar
      if (!idConsulta) return; // Evitar consultas innecesarias

      try {
        // Construcción dinámica de la URL con template literals
        const tipoVocero =
          pertenece === 3
            ? "consejo-comunal"
            : pertenece === 2
            ? "circuito"
            : pertenece === 1
            ? "comuna"
            : null;

        if (!tipoVocero) {
          console.error(`El valor de 'pertenece' (${pertenece}) no es válido.`);
          return;
        }

        const response = await axios.get(
          `/api/voceros/vocero-${tipoVocero}-id`,
          {
            params: {
              idConsejo: pertenece === 3 ? idConsejo : undefined,
              idComuna: pertenece === 1 ? idComuna : undefined,
              idCircuito: pertenece === 2 ? idComuna : undefined,
            },
          }
        );

        setVoceros(response.data.voceros || []);
      } catch (error) {
        console.error("Error al obtener voceros:", error);
      }
    };

    // Dependencia dinámica: si pertenece es 3, depende de idConsejo, sino de idComuna
    if (idParroquia) {
      fetchVoceros();
    }
  }, [pertenece === 3 ? idConsejo : idComuna]);

  useEffect(() => {
    if (nuevoVocero) {
      setVoceros((prevConsejos) => [...prevConsejos, nuevoVocero]);
    }
  }, [nuevoVocero]);

  const toggleVocero = (nombreVocero) => {
    setVocerosVisibles((prev) => ({
      ...prev,
      [nombreVocero]: !prev[nombreVocero], // Alternar visibilidad
    }));
  };

  return (
    <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
      <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">
        Voceros
      </h3>

      {voceros?.length === 0 ? (
        <p className="text-center text-gray-600">No hay voceros disponibles.</p>
      ) : (
        <>
          {idComuna ? (
            <div>
              {voceros?.map((vocero, index) => (
                <div key={index} className="mb-2">
                  <h4
                    className={`text-lg font-semibold bg-gray-100 hover:bg-gray-300 p-2 rounded-md cursor-pointer ${
                      vocerosVisibles[vocero.nombre] ? "borde-fondo" : ""
                    }`}
                    onClick={() => toggleVocero(vocero.nombre)}
                  >
                    {vocero.nombre}
                  </h4>
                  {vocerosVisibles[vocero.nombre] && (
                    <div className="mt-2 ps-5 border border-gray-300 rounded-md p-3 bg-gray-100">
                      <p>Cedula: {vocero.cedula}</p>
                      <p>ID Parroquia: {vocero.id_parroquia}</p>
                      <p>ID Comuna: {vocero.id_comuna}</p>
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
