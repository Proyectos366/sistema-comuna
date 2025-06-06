"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function CircuitoFormMostrar({ idParroquia, nuevoCircuito }) {
  const [circuitos, setCircuitos] = useState([]);
  const [circuitosVisibles, setCircuitosVisibles] = useState({});

  useEffect(() => {
    const fetchCircuitos = async () => {
      if (!idParroquia) {
        setCircuitos([]); // Limpiar circuitos si no hay parroquia seleccionada
        return;
      }

      try {
        const response = await axios.get("/api/circuitos/circuitos-id", {
          params: { idParroquia },
        });
        setCircuitos(response.data.circuitos || []);
      } catch (error) {
        console.log("Error, al obtener las circuitos: " + error);
      }
    };

    fetchCircuitos();
  }, [idParroquia]); // Se ejecuta cada vez que `idParroquia` cambia

  useEffect(() => {
    if (nuevoCircuito) {
      setCircuitos((prevCircuitos) => [...prevCircuitos, nuevoCircuito]); // Agregar nueva comuna a la lista
      setCircuitosVisibles((prev) => ({
        ...prev,
        [nuevoCircuito.nombre]: true, // Mostrar nueva comuna automáticamente
      }));
    }
  }, [nuevoCircuito]);

  return (
    <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
      <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">
        Circuitos
      </h3>

      {idParroquia && circuitos.length > 0 ? (
        <div>
          {circuitos.map((circuito, index) => (
            <div key={index} className="mb-2">
              <h4
                className={`text-lg  text-center sm:text-justify font-semibold bg-gray-100 hover:bg-gray-300 p-2
                  rounded-md`}
              >
                {circuito.nombre}
              </h4>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No hay circuitos disponibles para esta parroquia.
        </p>
      )}
    </div>
  );
}
