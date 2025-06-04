"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ParroquiasForm() {
  const [nombre, setNombre] = useState("");
  const [nombres, setNombres] = useState([]);

  useEffect(() => {
    const fetchDatosParroquia = async () => {
      try {
        const response = await axios.get("/api/parroquias/todas-parroquias");
        setNombres(response.data.parroquias || []);
      } catch (error) {
        console.log("Error, al obtener las parroquias: " + error);
      }
    };

    fetchDatosParroquia();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nombre.trim()) {
      try {
        const response = await axios.post("/api/parroquias/crear-parroquia", {
          nombre: nombre,
        });
        setNombres([...nombres, response.data.parroquia]); // Suponiendo que la API devuelve el nombre guardado
        setNombre("");
      } catch (error) {
        console.error("Error al crear la parroquia:", error);
      }
    }
  };

  return (
    // <section className="rounded-md p-2 min-h-screen flex flex-col text-white">
    //   <div className="w-full bg-white degradado text-gray-800 rounded-lg shadow-lg p-6">
    //     <h2 className="text-2xl text-white font-bold mb-4 text-center">Crear parroquia</h2>
    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <label className="block">
    //         <span className=" text-white font-medium">Nombre:</span>
    //         <input
    //           type="text"
    //           value={nombre}
    //           onChange={(e) => setNombre(e.target.value)}
    //           className="mt-1 uppercase outline-0 block w-full p-2 border border-purple-400 rounded-md bg-purple-border-purple-400 focus:ring-2 focus:ring-purple-border-purple-400 hover:border-purple-400 focus:outline-none"
    //         />
    //       </label>
    //       <button
    //         type="submit"
    //         className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
    //       >
    //         Guardar
    //       </button>
    //     </form>
    //   </div>

    //   <div className="w-full max-w-md mt-6 bg-white text-gray-800 rounded-lg shadow-lg p-6">
    //     <h3 className="text-lg font-bold mb-3 text-center">Nombres Guardados</h3>
    //     <div className="overflow-x-auto">
    //       <table className="w-full border-collapse">
    //         <thead>
    //           <tr className="bg-gray-200">
    //             <th className="borde-fondo p-2 text-left">Nombre</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {nombres.map((parroquia, index) => (
    //             <tr key={index} className="hover:bg-gray-100 transition-colors">
    //               <td className="borde-fondo p-2">{parroquia.nombre}</td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </section>

    <section className="rounded-md p-6 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
      <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Crear parroquia
        </h2>
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
            disabled={!nombre}
            type="submit"
            className={`${
              !nombre ? "cursor-not-allowed" : "cursor-pointer"
            } w-full color-fondo hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
          >
            Guardar
          </button>
        </form>
      </div>

      <div className="w-full max-w-xl mt-6 bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
        <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">
          Parroquias
        </h3>
        <div className="">
          {nombres.map((parroquia, index) => (
            <div
              key={index}
              className="hover:bg-gray-200 transition-colors flex flex-col"
            >
              <span className=" rounded-md p-3">{parroquia.nombre}</span>
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
