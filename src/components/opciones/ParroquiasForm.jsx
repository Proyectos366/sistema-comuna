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
import FormCrearParroquia from "../formularios/FormCrearParroquia";
import ListadoGenaral from "../listados/ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";

export default function ParroquiasForm({
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
  const [nombreParroquia, setNombreParroquia] = useState("");
  const [descripcionParroquia, setDescripcionParroquia] = useState("");
  const [todasParroquias, setTodasParroquias] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  const [validarNombre, setValidarNombre] = useState(false);

  const [idParroquia, setIdParroquia] = useState("");
  const [accion, setAccion] = useState("");

  useEffect(() => {
    const fetchDatosParroquia = async () => {
      try {
        const response = await axios.get("/api/parroquias/todas-parroquias");
        setTodasParroquias(response.data.parroquias || []);
      } catch (error) {
        console.log("Error al obtener las parroquias:", error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatosParroquia();
  }, []);

  const crearParroquia = async () => {
    if (nombreParroquia.trim()) {
      try {
        const response = await axios.post("/api/parroquias/crear-parroquia", {
          nombre: nombreParroquia,
        });

        setTodasParroquias((prev) =>
          prev ? [...prev, response.data.parroquia] : [response.data.parroquia]
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreParroquia(""), tiempo: 3000 }, // Se ejecutará en 5 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear parroquia: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    }
  };

  const editandoParroquia = async (datos) => {
    try {
      setAccion("editar");
      setIdParroquia(datos.id);
      setNombreParroquia(datos.nombre);
      setDescripcionParroquia(datos.descripcion);

      abrirModal();
    } catch (error) {
      console.log("Error, editando parroquia: " + error);
    }
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear esta parroquia?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Nombre"} descripcion={nombreParroquia} />
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={crearParroquia}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreParroquia,
          }}
        />
      </Modal>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear parroquia"}>
          <FormCrearParroquia
            nombre={nombreParroquia}
            setNombre={setNombreParroquia}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoGenaral
            isLoading={isLoading}
            listado={todasParroquias}
            nombreListado="Parroquias"
            mensajeVacio="No hay parroquias disponibles..."
            editando={editandoParroquia}
            id_usuario={id_usuario}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
