// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Modal from "../Modal";
// import ModalDatos from "../ModalDatos";
// import SectionRegistroMostrar from "../SectionRegistroMostrar";
// import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
// import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
// import MostarMsjEnModal from "../MostrarMsjEnModal";
// import BotonesModal from "../BotonesModal";
// import FormCrearConsejo from "../formularios/FormCrearConsejo";
// import ListadoGenaral from "../ListadoGeneral";

// export default function ConsejoForm({
//   mostrar,
//   abrirModal,
//   cerrarModal,
//   mensaje,
//   mostrarMensaje,
//   abrirMensaje,
//   limpiarCampos,
// }) {
//   // Estados para los selectores
//   const [nombreConsejo, setNombreConsejo] = useState("");
//   const [idParroquia, setIdParroquia] = useState("");
//   const [idComunaCircuito, setIdComunaCircuito] = useState("");

//   const [todosConsejos, setTodosConsejos] = useState([]);

//   const [parroquias, setParroquias] = useState([]);
//   const [todasComunasCircuitos, setTodasComunasCircuitos] = useState([]);

//   const [circuitoComuna, setCircuitoComuna] = useState(0);

//   // Consultar parroquias al cargar el componente
//   useEffect(() => {
//     const fetchParroquias = async () => {
//       try {
//         const response = await axios.get("/api/parroquias/todas-parroquias");
//         setParroquias(response.data.parroquias || []);
//       } catch (error) {
//         console.error("Error al obtener las parroquias:", error);
//       }
//     };

//     fetchParroquias();
//   }, []);

//   useEffect(() => {
//     if (!idParroquia) {
//       setTodasComunasCircuitos([]); // Vacía comunas si no hay parroquia seleccionada
//       return;
//     }

//     const fetchComunasCircuitosPorParroquia = async () => {
//       setIsLoading(true); // Activa la carga antes de la consulta

//       try {
//         let response;
//         if (circuitoComuna === 1) {
//           response = await axios.get(`/api/comunas/comunas-id`, {
//             params: { idParroquia: idParroquia },
//           });
//         } else if (circuitoComuna === 2) {
//           response = await axios.get(`/api/circuitos/circuitos-id`, {
//             params: { idParroquia: idParroquia },
//           });
//         }

//         setTodasComunasCircuitos(
//           response?.data?.comunas || response?.data?.circuitos
//         );
//       } catch (error) {
//         console.log(
//           "Error, al obtener las comunas/circuitos por parroquia: " + error
//         );
//       }
//     };

//     fetchComunasCircuitosPorParroquia();
//   }, [idParroquia]);

//   useEffect(() => {
//     if (!idComunaCircuito) {
//       setTodosConsejos([]); // Vacía comunas si no hay parroquia seleccionada
//       return;
//     }

//     const fetchConsejosPorComunaCircuito = async () => {
//       setIsLoading(true); // Activa la carga antes de la consulta

//       try {
//         let response;
//         if (circuitoComuna === 1) {
//           response = await axios.get(`/api/comunas/comunas-id`, {
//             params: { idComuna: idComunaCircuito },
//           });
//         } else if (circuitoComuna === 2) {
//           response = await axios.get(`/api/circuitos/circuitos-id`, {
//             params: { idCircuito: idComunaCircuito },
//           });
//         }

//         setTodasComunasCircuitos(
//           response?.data?.comunas || response?.data?.circuitos
//         );
//       } catch (error) {
//         console.log(
//           "Error, al obtener las comunas/circuitos por parroquia: " + error
//         );
//       }
//     };

//     fetchConsejosPorComunaCircuito();
//   }, [idComunaCircuito]);

//   const cambiarSeleccionParroquia = (e) => {
//     const valor = e.target.value;
//     setIdParroquia(valor);
//   };

//   const cambiarSeleccionComunaCircuito = (e) => {
//     const valor = e.target.value;
//     setIdComunaCircuito(valor);
//   };

//   // Manejo de envío del formulario
//   const crearConsejoComunal = async () => {
//     if (nombreConsejo.trim() && idParroquia.trim() && idComuna.trim()) {
//       try {
//         let response;
//         if (circuitoComuna === 1) {
//           response = await axios.post("/api/consejos/crear-consejo-comunal", {
//             nombre: nombreConsejo,
//             id_parroquia: idParroquia,
//             id_comuna: idComuna,
//             id_circuito: null,
//             comunaCircuito: "comuna",
//           });
//         } else if (circuitoComuna === 2) {
//           response = await axios.post("/api/consejos/crear-consejo-comunal", {
//             nombre: nombreConsejo,
//             id_parroquia: idParroquia,
//             id_comuna: null,
//             id_circuito: idComuna,
//             comunaCircuito: "circuito",
//           });
//         }

//         setTodosConsejos([...todosConsejos, response.data.consejo]); // Suponiendo que la API devuelve el nombre guardado
//         abrirMensaje(response.data.message);

//         ejecutarAccionesConRetraso([
//           { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
//           { accion: () => setNombreConsejo(""), tiempo: 3000 }, // Se ejecutará en 5 segundos
//         ]);
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

//   return (
//     <section className="rounded-md p-6 min-h-screen flex flex-col items-center justify-center space-y-4 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900">
//       <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
//         <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
//           Crear consejo comunal
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <label className="block">
//             <span className="text-gray-700 font-medium">Selecciona:</span>
//             <div className="flex gap-4 mt-2">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   value="1"
//                   checked={circuitoComuna === 1}
//                   onChange={() =>
//                     setCircuitoComuna(circuitoComuna === 1 ? 0 : 1)
//                   }
//                   className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
//                 />
//                 <span>Comuna</span>
//               </label>

//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   value="2"
//                   checked={circuitoComuna === 2}
//                   onChange={() =>
//                     setCircuitoComuna(circuitoComuna === 2 ? 0 : 2)
//                   }
//                   className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
//                 />
//                 <span>Circuito comunal</span>
//               </label>
//             </div>
//           </label>

//           {/* Selector de Parroquias */}
//           {circuitoComuna !== 0 && (
//             <>
//               <label className="block">
//                 <span className="text-gray-700 font-medium">Parroquia:</span>
//                 <select
//                   value={idParroquia}
//                   onChange={(e) => fetchComunas(e.target.value)}
//                   className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//                 >
//                   <option value="">Selecciona una parroquia</option>
//                   {parroquias.map((parroquia) => (
//                     <option key={parroquia.id} value={parroquia.id}>
//                       {parroquia.nombre}
//                     </option>
//                   ))}
//                 </select>
//               </label>
//             </>
//           )}

//           {/* Selector de Comunas (Solo se muestra si hay parroquia seleccionada) */}
//           {idParroquia && (
//             <label className="block mt-4">
//               <span className="text-gray-700 font-medium">
//                 {`${
//                   circuitoComuna === 1
//                     ? "Comuna"
//                     : circuitoComuna === 2
//                     ? "Circuito comunal"
//                     : "Otro"
//                 }:`}
//               </span>
//               <select
//                 value={idComuna}
//                 onChange={(e) => setIdComuna(e.target.value)}
//                 className="mt-1 cursor-pointer uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//               >
//                 <option value="">
//                   {circuitoComuna === 1
//                     ? "Seleccione una comuna"
//                     : "Seleccione un circuito"}
//                 </option>
//                 {comunas.map((comuna) => (
//                   <option key={comuna.id} value={comuna.id}>
//                     {comuna.nombre}
//                   </option>
//                 ))}
//               </select>
//             </label>
//           )}

//           {/* Campo para ingresar el nombre del consejo comunal */}
//           {idComuna && (
//             <>
//               <label className="block mt-4">
//                 <span className="text-gray-700 font-medium">
//                   Nombre del consejo comunal:
//                 </span>
//                 <input
//                   type="text"
//                   value={nombreConsejo}
//                   onChange={(e) => setNombreConsejo(e.target.value)}
//                   className="mt-1 uppercase block w-full p-3 borde-fondo rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:outline-none transition-all"
//                 />
//               </label>

//               <button
//                 disabled={!nombreConsejo}
//                 type="submit"
//                 className={`${
//                   !nombreConsejo ? "cursor-not-allowed" : "cursor-pointer"
//                 } w-full color-fondo hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
//               >
//                 Guardar
//               </button>
//             </>
//           )}
//         </form>
//       </div>

//       <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl">
//         <ConsejoFormMostrar
//           idComuna={idComuna}
//           idParroquia={idParroquia}
//           consejoPorComuna={consejoPorComuna}
//           circuitoComuna={circuitoComuna}
//         />
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import ModalDatos from "../ModalDatos";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import BotonesModal from "../BotonesModal";
import FormCrearConsejo from "../formularios/FormCrearConsejo";
import ListadoGenaral from "../ListadoGeneral";

export default function ConsejoForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  // Estados para los selectores
  const [nombreConsejo, setNombreConsejo] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComunaCircuito, setIdComunaCircuito] = useState("");

  const [todosConsejos, setTodosConsejos] = useState([]);

  const [parroquias, setParroquias] = useState([]);
  const [todasComunasCircuitos, setTodasComunasCircuitos] = useState([]);

  const [circuitoComuna, setCircuitoComuna] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  // Consultar parroquias al cargar el componente
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

  useEffect(() => {
    if (!idParroquia) {
      setTodasComunasCircuitos([]); // Vacía comunas si no hay parroquia seleccionada
      setTodosConsejos([]);
      setIdComunaCircuito("");
      return;
    }

    const fetchComunasCircuitosPorParroquia = async () => {
      try {
        let response;
        if (circuitoComuna === 1) {
          response = await axios.get(`/api/comunas/comunas-id`, {
            params: { idParroquia: idParroquia },
          });
        } else if (circuitoComuna === 2) {
          response = await axios.get(`/api/circuitos/circuitos-id`, {
            params: { idParroquia: idParroquia },
          });
        }

        setTodasComunasCircuitos(
          response?.data?.comunas || response?.data?.circuitos
        );
      } catch (error) {
        console.log(
          "Error, al obtener las comunas/circuitos por parroquia: " + error
        );
      }
    };

    fetchComunasCircuitosPorParroquia();
  }, [idParroquia]);

  useEffect(() => {
    if (!idComunaCircuito) {
      setTodosConsejos([]); // Vacía comunas si no hay parroquia seleccionada
      setIdComunaCircuito("");
      return;
    }

    const fetchConsejosPorComunaCircuito = async () => {
      setIsLoading(true); // Activa la carga antes de la consulta

      try {
        let response;
        if (circuitoComuna === 1) {
          response = await axios.get(
            `/api/consejos/consejos-comunales-id-comuna`,
            {
              params: { idComuna: idComunaCircuito },
            }
          );
        } else if (circuitoComuna === 2) {
          response = await axios.get(
            `/api/consejos/consejos-comunales-id-circuito`,
            {
              params: { idCircuito: idComunaCircuito },
            }
          );
        }
        setTodosConsejos(response?.data?.consejos);
      } catch (error) {
        console.log(
          "Error, al obtener las comunas/circuitos por parroquia: " + error
        );
      } finally {
        setIsLoading(false); // Solo desactiva la carga después de obtener los datos
      }
    };

    fetchConsejosPorComunaCircuito();
  }, [idComunaCircuito]);

  useEffect(() => {
    setIdParroquia("");
    setTodasComunasCircuitos([]); // Vacía comunas si no hay parroquia seleccionada
    setTodosConsejos([]);
    setIdComunaCircuito("");
    setNombreConsejo("");
  }, [circuitoComuna]);

  const cambiarSeleccionParroquia = (e) => {
    const valor = e.target.value;
    setIdParroquia(valor);
  };

  const cambiarSeleccionComunaCircuito = (e) => {
    const valor = e.target.value;
    console.log("Nuevo valor seleccionado:", valor);
    setIdComunaCircuito(valor);
  };

  // Manejo de envío del formulario
  const crearConsejoComunal = async () => {
    if (nombreConsejo.trim()) {
      try {
        let response;
        if (circuitoComuna === 1) {
          response = await axios.post("/api/consejos/crear-consejo-comunal", {
            nombre: nombreConsejo,
            id_parroquia: idParroquia,
            id_comuna: idComunaCircuito,
            id_circuito: null,
            comunaCircuito: "comuna",
          });
        } else if (circuitoComuna === 2) {
          response = await axios.post("/api/consejos/crear-consejo-comunal", {
            nombre: nombreConsejo,
            id_parroquia: idParroquia,
            id_comuna: null,
            id_circuito: idComunaCircuito,
            comunaCircuito: "circuito",
          });
        }

        setTodosConsejos([...todosConsejos, response.data.consejo]); // Suponiendo que la API devuelve el nombre guardado
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreConsejo(""), tiempo: 3000 }, // Se ejecutará en 5 segundos
        ]);
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
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear este consejo comunal?"}
      >
        <div className="flex flex-col justify-center items-center space-y-1">
          <ModalDatos titulo={"Nombre"} descripcion={nombreConsejo} />
        </div>
        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={crearConsejoComunal}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreConsejo,
            idParroquia,
            idComunaCircuito,
          }}
        />
      </Modal>
      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear comuna"}>
          <FormCrearConsejo
            idParroquia={idParroquia}
            idComunaCircuito={idComunaCircuito}
            cambiarSeleccionParroquia={cambiarSeleccionParroquia}
            cambiarSeleccionComunaCircuito={cambiarSeleccionComunaCircuito}
            parroquias={parroquias}
            comunasCircuitos={todasComunasCircuitos}
            dondeGuardar={circuitoComuna}
            setDondeGuardar={setCircuitoComuna}
            nombre={nombreConsejo}
            setNombre={setNombreConsejo}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoGenaral
            isLoading={isLoading}
            listado={todosConsejos}
            nombreListado={"Consejos comunales"}
            mensajeVacio={"No hay consejos comunales disponibles..."}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
