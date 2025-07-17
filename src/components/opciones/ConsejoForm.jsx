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
import ModalDatosContenedor from "../ModalDatosContenedor";

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
  const [nombreParroquia, setNombreParroquia] = useState("");
  const [nombreComuna, setNombreComuna] = useState("");
  const [nombreCircuito, setNombreCircuito] = useState("");
  const [nombreConsejo, setNombreConsejo] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");
  const [idCircuito, setIdCircuito] = useState("");

  const [todosConsejos, setTodosConsejos] = useState([]);

  const [todasParroquias, setTodasParroquias] = useState([]);
  const [todasComunas, setTodasComunas] = useState([]);
  const [todosCircuitos, setTodosCircuitos] = useState([]);

  const [circuitoComuna, setCircuitoComuna] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [parroquiasRes, comunasRes, circuitosRes] = await Promise.all([
          axios.get("/api/parroquias/todas-parroquias"),
          axios.get("/api/comunas/todas-comunas"),
          axios.get("/api/circuitos/todos-circuitos"),
        ]);

        setTodasParroquias(parroquiasRes.data.parroquias || []);
        setTodasComunas(comunasRes.data.comunas || []);
        setTodosCircuitos(circuitosRes.data.circuitos || []);
      } catch (error) {
        console.log("Error, al obtener datos: " + error);
      }
    };

    fetchDatos();
  }, []);

  useEffect(() => {
    if (!idComuna && !idCircuito) {
      setTodosConsejos([]);
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
              params: { idComuna: idComuna },
            }
          );
        } else if (circuitoComuna === 2) {
          response = await axios.get(
            `/api/consejos/consejos-comunales-id-circuito`,
            {
              params: { idCircuito: idCircuito },
            }
          );
        }
        setTodosConsejos(response?.data?.consejos || []);
      } catch (error) {
        console.log(
          "Error, al obtener los consejos por comunas/circuitos: " + error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsejosPorComunaCircuito();
  }, [idComuna, idCircuito]);

  useEffect(() => {
    setIdParroquia("");
    setTodosConsejos([]);
    setIdComuna("");
    setIdCircuito("");
    setNombreConsejo("");
    setNombreComuna("");
    setNombreCircuito("");
  }, [circuitoComuna]);

  const cambiarDondeGuardar = (e) => {
    const valor = e.target.value;
    setCircuitoComuna(valor);
  };

  const cambiarSeleccionParroquia = (e) => {
    const valor = e.target.value;
    setIdParroquia(valor);
  };

  const cambiarSeleccionComunas = (e) => {
    const valor = e.target.value;
    console.log(valor);

    setIdComuna(valor);
  };

  const cambiarSeleccionCircuitos = (e) => {
    const valor = e.target.value;
    setIdCircuito(valor);
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
            id_comuna: idComuna ? idComuna : null,
            id_circuito: idCircuito ? idCircuito : null,
            comunaCircuito: "comuna",
          });
        } else if (circuitoComuna === 2) {
          response = await axios.post("/api/consejos/crear-consejo-comunal", {
            nombre: nombreConsejo,
            id_parroquia: idParroquia,
            id_comuna: idComuna ? idComuna : null,
            id_circuito: idCircuito ? idCircuito : null,
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
        console.log("Error, al crear el consejo comunal: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
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
        <ModalDatosContenedor>
          <ModalDatos titulo={"Consejo comunal"} descripcion={nombreConsejo} />
          <ModalDatos titulo={"Parroquia"} descripcion={nombreParroquia} />
          {nombreComuna && (
            <ModalDatos titulo={"Comuna"} descripcion={nombreComuna} />
          )}

          {nombreCircuito && (
            <ModalDatos
              titulo={"Circuito comunal"}
              descripcion={nombreCircuito}
            />
          )}
        </ModalDatosContenedor>

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
            idComuna,
          }}
        />
      </Modal>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear consejo comunal"}>
          <FormCrearConsejo
            idParroquia={idParroquia}
            setIdParroquia={setIdParroquia}
            idComuna={idComuna}
            idCircuito={idCircuito}
            cambiarSeleccionComuna={cambiarSeleccionComunas}
            cambiarSeleccionCircuito={cambiarSeleccionCircuitos}
            cambiarDondeGuardar={cambiarDondeGuardar}
            parroquias={todasParroquias}
            comunas={todasComunas}
            circuitos={todosCircuitos}
            dondeGuardar={circuitoComuna}
            nombreComuna={nombreComuna}
            setNombreParroquia={setNombreParroquia}
            setNombreComuna={setNombreComuna}
            nombreCircuito={nombreCircuito}
            setNombreCircuito={setNombreCircuito}
            nombreConsejo={nombreConsejo}
            setNombreConsejo={setNombreConsejo}
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
// import ModalDatosContenedor from "../ModalDatosContenedor";

// export default function ConsejoForm({
//   mostrar,
//   abrirModal,
//   cerrarModal,
//   mensaje,
//   mostrarMensaje,
//   abrirMensaje,
//   limpiarCampos,
//   ejecutarAccionesConRetraso,
// }) {
//   // Estados para los selectores
//   const [nombreConsejo, setNombreConsejo] = useState("");
//   const [idParroquia, setIdParroquia] = useState("");
//   const [idComunaCircuito, setIdComunaCircuito] = useState("");

//   const [todosConsejos, setTodosConsejos] = useState([]);

//   const [parroquias, setParroquias] = useState([]);
//   const [todasComunasCircuitos, setTodasComunasCircuitos] = useState([]);

//   const [circuitoComuna, setCircuitoComuna] = useState(0);
//   const [isLoading, setIsLoading] = useState(false); // Estado de carga

//   // Consultar parroquias al cargar el componente
//   useEffect(() => {
//     const fetchParroquias = async () => {
//       try {
//         const response = await axios.get("/api/parroquias/todas-parroquias");
//         setParroquias(response.data.parroquias || []);
//       } catch (error) {
//         console.log("Error, al obtener las parroquias: " + error);
//       }
//     };

//     fetchParroquias();
//   }, []);

//   useEffect(() => {
//     if (!idParroquia) {
//       setTodasComunasCircuitos([]); // Vacía comunas si no hay parroquia seleccionada
//       setTodosConsejos([]);
//       setIdComunaCircuito("");
//       return;
//     }

//     const fetchComunasCircuitosPorParroquia = async () => {
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
//       setIdComunaCircuito("");
//       return;
//     }

//     const fetchConsejosPorComunaCircuito = async () => {
//       setIsLoading(true); // Activa la carga antes de la consulta

//       try {
//         let response;
//         if (circuitoComuna === 1) {
//           response = await axios.get(
//             `/api/consejos/consejos-comunales-id-comuna`,
//             {
//               params: { idComuna: idComunaCircuito },
//             }
//           );
//         } else if (circuitoComuna === 2) {
//           response = await axios.get(
//             `/api/consejos/consejos-comunales-id-circuito`,
//             {
//               params: { idCircuito: idComunaCircuito },
//             }
//           );
//         }
//         setTodosConsejos(response?.data?.consejos);
//       } catch (error) {
//         console.log(
//           "Error, al obtener las comunas/circuitos por parroquia: " + error
//         );
//       } finally {
//         setIsLoading(false); // Solo desactiva la carga después de obtener los datos
//       }
//     };

//     fetchConsejosPorComunaCircuito();
//   }, [idComunaCircuito]);

//   useEffect(() => {
//     setIdParroquia("");
//     setTodasComunasCircuitos([]); // Vacía comunas si no hay parroquia seleccionada
//     setTodosConsejos([]);
//     setIdComunaCircuito("");
//     setNombreConsejo("");
//   }, [circuitoComuna]);

//   const cambiarDondeGuardar = (e) => {
//     const valor = e.target.value;
//     setCircuitoComuna(valor);
//   };

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
//     if (nombreConsejo.trim()) {
//       try {
//         let response;
//         if (circuitoComuna === 1) {
//           response = await axios.post("/api/consejos/crear-consejo-comunal", {
//             nombre: nombreConsejo,
//             id_parroquia: idParroquia,
//             id_comuna: idComunaCircuito,
//             id_circuito: null,
//             comunaCircuito: "comuna",
//           });
//         } else if (circuitoComuna === 2) {
//           response = await axios.post("/api/consejos/crear-consejo-comunal", {
//             nombre: nombreConsejo,
//             id_parroquia: idParroquia,
//             id_comuna: null,
//             id_circuito: idComunaCircuito,
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
//         console.log("Error, al crear el consejo comunal: " + error);
//         abrirMensaje(error?.response?.data?.message);
//         ejecutarAccionesConRetraso([
//           { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
//         ]);
//       }
//     } else {
//       console.log("Todos los campos son obligatorios.");
//     }
//   };

//   return (
//     <>
//       <Modal
//         isVisible={mostrar}
//         onClose={cerrarModal}
//         titulo={"¿Crear este consejo comunal?"}
//       >
//         <ModalDatosContenedor>
//           <ModalDatos titulo={"Nombre"} descripcion={nombreConsejo} />
//         </ModalDatosContenedor>

//         <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
//         <BotonesModal
//           aceptar={crearConsejoComunal}
//           cancelar={cerrarModal}
//           indiceUno={"crear"}
//           indiceDos={"cancelar"}
//           nombreUno={"Aceptar"}
//           nombreDos={"Cancelar"}
//           campos={{
//             nombreConsejo,
//             idParroquia,
//             idComunaCircuito,
//           }}
//         />
//       </Modal>
//       <SectionRegistroMostrar>
//         <DivUnoDentroSectionRegistroMostrar nombre={"Crear consejo comunal"}>
//           <FormCrearConsejo
//             idParroquia={idParroquia}
//             idComunaCircuito={idComunaCircuito}
//             cambiarSeleccionParroquia={cambiarSeleccionParroquia}
//             cambiarSeleccionComunaCircuito={cambiarSeleccionComunaCircuito}
//             cambiarDondeGuardar={cambiarDondeGuardar}
//             parroquias={parroquias}
//             comunasCircuitos={todasComunasCircuitos}
//             dondeGuardar={circuitoComuna}
//             setDondeGuardar={setCircuitoComuna}
//             nombre={nombreConsejo}
//             setNombre={setNombreConsejo}
//             abrirModal={abrirModal}
//             limpiarCampos={limpiarCampos}
//           />
//         </DivUnoDentroSectionRegistroMostrar>

//         <DivDosDentroSectionRegistroMostrar>
//           <ListadoGenaral
//             isLoading={isLoading}
//             listado={todosConsejos}
//             nombreListado={"Consejos comunales"}
//             mensajeVacio={"No hay consejos comunales disponibles..."}
//           />
//         </DivDosDentroSectionRegistroMostrar>
//       </SectionRegistroMostrar>
//     </>
//   );
// }
