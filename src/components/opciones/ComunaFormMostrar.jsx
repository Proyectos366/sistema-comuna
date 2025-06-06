"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ComunaFormMostrar({ idParroquia, nuevaComuna }) {
  const [comunas, setComunas] = useState([]);
  const [comunalesVisibles, setComunasVisibles] = useState({});

  useEffect(() => {
    const fetchComunas = async () => {
      if (!idParroquia) {
        setComunas([]); // Limpiar comunas si no hay parroquia seleccionada
        return;
      }

      try {
        const response = await axios.get("/api/comunas/comunas-id", {
          params: { idParroquia },
        });
        setComunas(response.data.comunas || []);
      } catch (error) {
        console.error("Error al obtener las comunas:", error);
      }
    };

    fetchComunas();
  }, [idParroquia]); // Se ejecuta cada vez que `idParroquia` cambia

  useEffect(() => {
    if (nuevaComuna) {
      setComunas((prevComunas) => [...prevComunas, nuevaComuna]); // Agregar nueva comuna a la lista
      setComunasVisibles((prev) => ({
        ...prev,
        [nuevaComuna.nombre]: true, // Mostrar nueva comuna automáticamente
      }));
    }
  }, [nuevaComuna]);

  return (
    <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
      <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">
        Comunas
      </h3>

      {idParroquia && comunas.length > 0 ? (
        <div>
          {comunas.map((consejo, index) => (
            <div key={index} className="mb-2">
              <h4
                className={`text-lg  text-center sm:text-justify font-semibold bg-gray-100 hover:bg-gray-300 p-2
                  rounded-md`}
              >
                {consejo.nombre}
              </h4>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No hay comunas disponibles para esta parroquia.
        </p>
      )}
    </div>
  );
}
