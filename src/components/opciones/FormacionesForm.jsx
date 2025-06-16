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
import FormCrearFormacion from "../formularios/FormCrearFormacion";
import ListadoGenaral from "../ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";

export default function FormacionesForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  const [nombreFormacion, setNombreFormacion] = useState("");
  const [cantidadModulos, setCantidadModulos] = useState("");
  const [todasFormaciones, setTodasFormaciones] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  const [validarCantidad, setValidarCantidad] = useState(false);

  useEffect(() => {
    const fetchDatosFormaciones = async () => {
      try {
        const response = await axios.get("/api/formaciones/todas-formaciones");
        setTodasFormaciones(response.data.formaciones || []);
      } catch (error) {
        console.log("Error al obtener las formaciones:", error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatosFormaciones();
  }, []);

  const crearFormacion = async () => {
    if (nombreFormacion.trim()) {
      try {
        const response = await axios.post("/api/formaciones/crear-formacion", {
          nombre: nombreFormacion,
          cantidadModulos: cantidadModulos,
        });

        setTodasFormaciones((prev) =>
          prev ? [...prev, response.data.formacion] : [response.data.formacion]
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreFormacion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCantidadModulos(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear formacion: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    }
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear esta formacion?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Nombre"} descripcion={nombreFormacion} />
          <ModalDatos titulo={"Modulos"} descripcion={cantidadModulos} />
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={crearFormacion}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreFormacion,
            cantidadModulos,
          }}
        />
      </Modal>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear formación"}>
          <FormCrearFormacion
            nombre={nombreFormacion}
            setNombre={setNombreFormacion}
            modulo={cantidadModulos}
            setModulo={setCantidadModulos}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
            validar={validarCantidad}
            setValidar={setValidarCantidad}
          />
        </DivUnoDentroSectionRegistroMostrar>
        <DivDosDentroSectionRegistroMostrar>
          <DivDosDentroSectionRegistroMostrar>
            <ListadoGenaral
              isLoading={isLoading}
              listado={todasFormaciones}
              nombreListado="Formaciones"
              mensajeVacio="No hay formaciones disponibles..."
            />
          </DivDosDentroSectionRegistroMostrar>
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
