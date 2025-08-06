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
import FormCrearCircuito from "../formularios/FormCrearCircuito";
import ListadoGenaral from "../listados/ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";

export default function CircuitosForm({
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
  const [nombreCircuito, setNombreCircuito] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idCircuito, setIdCircuito] = useState("");

  const [todosCircuitos, setTodosCircuitos] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const [accion, setAccion] = useState("");

  useEffect(() => {
    const fetchParroquias = async () => {
      try {
        const response = await axios.get("/api/parroquias/todas-parroquias");
        setParroquias(response.data.parroquias || []);
      } catch (error) {
        console.log("Error, al obtener las parroquias: " + error);
      }
    };

    fetchParroquias();
  }, []);

  useEffect(() => {
    if (!idParroquia) {
      setTodosCircuitos([]); // Vacía comunas si no hay parroquia seleccionada
      return;
    }

    const fetchCircuitosPorParroquia = async () => {
      setIsLoading(true); // Activa la carga antes de la consulta

      try {
        const response = await axios.get(`/api/circuitos/circuitos-id`, {
          params: { idParroquia: idParroquia },
        });

        setTodosCircuitos(response.data.circuitos || []); // Guarda la respuesta correctamente
      } catch (error) {
        console.log("Error, al obtener los circuitos por parroquia: " + error);
      } finally {
        setIsLoading(false); // Solo desactiva la carga después de obtener los datos
      }
    };

    fetchCircuitosPorParroquia();
  }, [idParroquia]);

  const cambiarSeleccionParroquia = (e) => {
    const valor = e.target.value;
    setIdParroquia(valor);
  };

  const crearCircuito = async () => {
    if (!nombreCircuito.trim() || !idParroquia) {
      console.log("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post("/api/circuitos/crear-circuito", {
        nombre: nombreCircuito,
        id_parroquia: idParroquia,
      });

      setTodosCircuitos((prevComunas) => [
        ...prevComunas,
        response.data.circuito,
      ]);

      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setNombreCircuito(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      console.log("Error, al crear el circuito comunal: " + error);
      abrirMensaje(error?.response?.data?.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    }
  };

  const editandoCircuito = async (datos) => {
    try {
      setAccion("editar");
      setIdParroquia(datos.id_parroquia);
      setIdCircuito(datos.id);
      setNombreCircuito(datos.nombre);

      abrirModal();
    } catch (error) {
      console.log("Error, editando circuito: " + error);
    }
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear este circuito?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Nombre"} descripcion={nombreCircuito} />
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={crearCircuito}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreCircuito,
            idParroquia,
          }}
        />
      </Modal>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear circuito"}>
          <FormCrearCircuito
            idParroquia={idParroquia}
            cambiarSeleccionParroquia={cambiarSeleccionParroquia}
            parroquias={parroquias}
            nombre={nombreCircuito}
            setNombre={setNombreCircuito}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoGenaral
            isLoading={isLoading}
            listado={todosCircuitos}
            nombreListado={"Circuitos"}
            mensajeVacio={"No hay circuitos disponibles..."}
            editando={editandoCircuito}
            id_usuario={id_usuario}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
