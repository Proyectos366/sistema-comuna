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
import ListadoGenaral from "../listados/ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";
import FormEditarConsejo from "../formularios/FormEditarConsejo";
import ModalEditar from "../modales/ModalEditar";

export default function ConsejoForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
  id_usuario,
}) {
  // Estados para los selectores
  const [nombreParroquia, setNombreParroquia] = useState("");
  const [nombreComuna, setNombreComuna] = useState("");
  const [nombreCircuito, setNombreCircuito] = useState("");
  const [nombreConsejo, setNombreConsejo] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");
  const [idCircuito, setIdCircuito] = useState("");
  const [idConsejo, setIdConsejo] = useState("");

  const [todosConsejos, setTodosConsejos] = useState([]);

  const [todasParroquias, setTodasParroquias] = useState([]);
  const [todasComunas, setTodasComunas] = useState([]);
  const [todosCircuitos, setTodosCircuitos] = useState([]);

  const [circuitoComuna, setCircuitoComuna] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const [accion, setAccion] = useState("");

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

    if (accion !== "editar") {
      fetchConsejosPorComunaCircuito();
    }
  }, [idComuna, idCircuito, accion]);

  useEffect(() => {
    if (accion === "editar" && !mostrar) {
      setAccion("");
      setIdConsejo("");
    }
  }, [accion, mostrar]);

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

  const editandoConsejoComunal = async (datos) => {
    try {
      setAccion("editar");
      setIdComuna(datos.id_comuna);
      setIdConsejo(datos.id);
      setNombreConsejo(datos.nombre);

      abrirModal();
    } catch (error) {
      console.log("Error, editando consejo comunal: " + error);
    }
  };

  const editarConsejoComunal = async () => {
    if (nombreConsejo.trim()) {
      try {
        const data = {
          nombre: nombreConsejo.trim(),
          id_comuna: idComuna,
          id_consejo: idConsejo,
        };

        const response = await axios.post(
          "/api/consejos/actualizar-datos-consejo-comunal",
          data
        );

        setTodosConsejos((prevConsejos) =>
          prevConsejos.map((consejo) =>
            consejo.id === response.data.consejo.id
              ? response.data.consejo
              : consejo
          )
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreConsejo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdConsejo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al actualizar datos del consejo comunal: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    } else {
      console.log("Todos los campos son obligatorios.");
    }
  };

  return (
    <>
      {accion === "editar" ? (
        <ModalEditar
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Actualizar este consejo comunal?"}
        >
          <div className="w-full">
            <FormEditarConsejo
              idComuna={idComuna}
              cambiarSeleccionComuna={cambiarSeleccionComunas}
              nombre={nombreConsejo}
              setNombre={setNombreConsejo}
              comunas={todasComunas}
              limpiarCampos={limpiarCampos}
              setNombreComuna={setNombreComuna}
              mostrarMensaje={mostrarMensaje}
              editar={editarConsejoComunal}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear este consejo comunal?"}
        >
          <ModalDatosContenedor>
            <ModalDatos
              titulo={"Consejo comunal"}
              descripcion={nombreConsejo}
            />
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
      )}

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
            editando={editandoConsejoComunal}
            id_usuario={id_usuario}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
