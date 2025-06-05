"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ConsejoFormMostrar from "./ConsejoFormMostrar";

// export default function ConsejoForm() {
//   const [nombreConsejo, setNombreConsejo] = useState("");
//   const [rifConsejo, setRifConsejo] = useState(`j-${Date.now()}`);

//   const [idComuna, setIdComuna] = useState("");
//   const [idParroquia, setIdParroquia] = useState("");

//   const [nombres, setNombres] = useState([]);
//   const [comunas, setComunas] = useState([]);

//   const [parroquias, setParroquias] = useState([]);

//   console.log(nombres);
  

//   const [
//     nombreConsejoComunalSeleccionado,
//     setNombreConsejoComunalSeleccionado,
//   ] = useState("");

//   useEffect(() => {
//     const fetchDatos = async () => {
//       try {
//         const responseParroquias = await axios.get(
//           "/api/parroquias/todas-parroquias"
//         );

//         const responseConsejos = await axios.get(
//           "/api/consejos/todos-consejos-comunales"
//         );

//         const responseComunas = await axios.get("/api/comunas/todas-comunas");

//         setNombres(responseConsejos.data.consejos || []);
//         setComunas(responseComunas.data.comunas || []);
//         setParroquias(responseParroquias.data.parroquias || []);
//       } catch (error) {
//         console.log("Error, al obtener los datos: " + error);
//       }
//     };

//     fetchDatos();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (nombreConsejo.trim() && idParroquia.trim() && idComuna.trim()) {
//       try {
//         const response = await axios.post(
//           "/api/consejos/crear-consejo-comunal",
//           {
//             nombre: nombreConsejo,
//             rif: rifConsejo,
//             id_parroquia: idParroquia,
//             id_comuna: idComuna
//           }
//         );

//         setNombres([...nombres, response.data.consejo]); // Suponiendo que la API devuelve el nombre guardado
//         setNombreConsejo("");
//         setRifConsejo("");
//         setIdComuna(""); // Cambié 0 por una cadena vacía en caso de que `idComuna` sea un string
//       } catch (error) {
//         console.log(
//           "Error al crear el consejo comunal:",
//           error.response ? error.response.data : error.message
//         );
//       }
//     } else {
//       console.log("Todos los campos son obligatorios.");
//     }
//   };

//   const handleChange = (e) => {
//     const nuevoId = Number(e.target.value);
//     setIdComuna(nuevoId);

//     const parroquiaSeleccionada = comunas.find(
//       (parroquia) => parroquia.id === nuevoId
//     );

//     setNombreConsejoComunalSeleccionado(
//       parroquiaSeleccionada ? parroquiaSeleccionada.nombre : ""
//     );
//   };

//   const consejosComunalesAgrupados = nombres.reduce((acc, comuna) => {
//     const parroquia = comunas.find((p) => p.id === comuna.id_parroquia);

//     console.log(parroquia);
    
//     const nombreParroquia = parroquia
//       ? parroquia.nombre
//       : "Parroquia desconocida";

//     if (!acc[nombreParroquia]) {
//       acc[nombreParroquia] = [];
//     }

//     acc[nombreParroquia].push(comuna);
//     return acc;
//   }, {});


//   console.log(comunas);
  

//   return (
//     <section className="rounded-md p-6 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
//       <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
//         <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
//           Crear consejo comunal
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <MiComponente
//               parroquias={parroquias}
//               comunas={comunas}
//               idParroquia={idParroquia}
//               setIdParroquia={setIdParroquia}
//               idComuna={idComuna}
//               setIdComuna={setIdComuna}
//             />
//           </div>

//           <label className="block">
//             <span className="text-gray-700 font-medium">
//               Nombre consejo comunal:
//             </span>
//             <input
//               type="text"
//               value={nombreConsejo}
//               onChange={(e) => setNombreConsejo(e.target.value)}
//               className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//             />
//           </label>

//           <button
//             disabled={!nombreConsejo}
//             type="submit"
//             className={`${
//               !nombreConsejo ? "cursor-not-allowed" : "cursor-pointer"
//             } w-full color-fondo hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
//           >
//             Guardar
//           </button>
//         </form>
//       </div>

//       <ConsejoFormMostrar
//         consejosComunalesAgrupados={consejosComunalesAgrupados}
//         nombreConsejoComunalSeleccionado={nombreConsejoComunalSeleccionado}
//         setNombreConsejoComunalSeleccionado={
//           setNombreConsejoComunalSeleccionado
//         }
//       />
//     </section>
//   );
// }


export default function ConsejoForm() {
  // Estados para los selectores
  const [nombreConsejo, setNombreConsejo] = useState("");
  const [rifConsejo, setRifConsejo] = useState(`j-${Date.now()}`);
  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");

  // Estados para almacenar datos consultados
  const [parroquias, setParroquias] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [consejoPorComuna, setConsejoPorComuna] = useState([]);
  

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

  // Consultar comunas cuando se selecciona una parroquia
  const fetchComunas = async (parroquiaId) => {
    try {
      setIdParroquia(parroquiaId);
      const response = await axios.get(`/api/comunas/comunas-id`, {
        params: {
          idParroquia: parroquiaId,
        }
      });
      setComunas(response.data.comunas || []);
      setIdComuna(""); // Resetear comuna cuando cambia la parroquia
    } catch (error) {
      console.log("Error al obtener comunas:", error);
    }
  };

  // Manejo de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nombreConsejo.trim() && idParroquia.trim() && idComuna.trim()) {
      try {
        const response = await axios.post("/api/consejos/crear-consejo-comunal", {
          nombre: nombreConsejo,
          rif: rifConsejo,
          id_parroquia: idParroquia,
          id_comuna: idComuna,
        });

        setConsejoPorComuna(response.data.consejo);
        setNombreConsejo("");
        setRifConsejo(`j-${Date.now()}`);


      } catch (error) {
        console.log("Error al crear el consejo comunal:", error.response ? error.response.data : error.message);
      }
    } else {
      console.log("Todos los campos son obligatorios.");
    }
  };

  return (
    <section className="rounded-md p-6 min-h-screen flex flex-col items-center justify-center space-y-4 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
      <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Crear consejo comunal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de Parroquias */}
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

          {/* Selector de Comunas (Solo se muestra si hay parroquia seleccionada) */}
          {idParroquia && (
            <label className="block mt-4">
              <span className="text-gray-700 font-medium">Comuna:</span>
              <select
                value={idComuna}
                onChange={(e) => setIdComuna(e.target.value)}
                className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
              >
                <option value="">Seleccione una comuna</option>
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
            <span className="text-gray-700 font-medium">Nombre del consejo comunal:</span>
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
            className={`${!nombreConsejo ? "cursor-not-allowed" : "cursor-pointer"} w-full color-fondo hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
          >
            Guardar
          </button></>
          )}
        </form>
      </div>

      <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl">
        <ConsejoFormMostrar
        idComuna={idComuna} idParroquia={idParroquia}
        consejoPorComuna={consejoPorComuna}
     />
      </div>
    </section>
  );
}

const MiComponente = ({
  parroquias,
  comunas,
  idParroquia,
  setIdParroquia,
  idComuna,
  setIdComuna,
}) => {
  // Filtrar comunas según la parroquia seleccionada
  const comunasFiltradas = comunas.filter(
    (comuna) => comuna.id_parroquia === Number(idParroquia)
  );

  return (
    <div>
      <label className="block">
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
      </label>

      {idParroquia && (
        <label className="block mt-4">
          <span className="text-gray-700 font-medium">Comuna:</span>
          <select
            value={idComuna}
            onChange={(e) => setIdComuna(e.target.value)}
            className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="">Seleccione una comuna</option>
            {comunasFiltradas.length > 0 ? (
              comunasFiltradas
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((comuna) => (
                  <option key={comuna.id} value={comuna.id}>
                    {comuna.nombre}
                  </option>
                ))
            ) : (
              <option disabled>No hay comunas disponibles</option>
            )}
          </select>
        </label>
      )}
    </div>
  );
};
