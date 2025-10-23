"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import ModalDatos from "../modales/ModalDatos";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import BotonesModal from "../BotonesModal";
import FormCrearFormacion from "../formularios/FormCrearFormacion";
import ModalDatosContenedor from "../modales/ModalDatosContenedor";
import FormEditarFormacion from "../formularios/FormEditarFormacion";
import ModalEditar from "../modales/ModalEditar";
import ListadoFormaciones from "../listados/ListadoFormaciones";

export default function FormacionesForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
  usuarioActivo,
}) {
  const [nombreFormacion, setNombreFormacion] = useState("");
  const [descripcionFormacion, setDescripcionFormacion] = useState("");
  const [cantidadModulos, setCantidadModulos] = useState("");
  const [todasFormaciones, setTodasFormaciones] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  const [validarNombre, setValidarNombre] = useState(false);
  const [validarModulo, setValidarModulo] = useState(false);

  const [idFormacion, setIdFormacion] = useState("");
  const [accion, setAccion] = useState("");

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

  useEffect(() => {
    if (accion === "editar" && !mostrar) {
      setAccion("");
      setNombreFormacion("");
      setCantidadModulos("");
      setDescripcionFormacion("");
      setIdFormacion("");
    }
  }, [accion, mostrar]);

  const crearFormacion = async () => {
    if (nombreFormacion.trim()) {
      try {
        const response = await axios.post("/api/formaciones/crear-formacion", {
          nombre: nombreFormacion,
          cantidadModulos: cantidadModulos,
          descripcion: descripcionFormacion,
        });

        setTodasFormaciones((prev) =>
          prev ? [...prev, response.data.formacion] : [response.data.formacion]
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreFormacion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCantidadModulos(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionFormacion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
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

  const editandoFormacion = async (datos) => {
    try {
      setAccion("editar");
      setIdFormacion(datos.id);
      setNombreFormacion(datos.nombre);
      setDescripcionFormacion(datos.descripcion);
      setCantidadModulos(datos?.modulos?.length);

      abrirModal();
    } catch (error) {
      console.log("Error, editando formación: " + error);
    }
  };

  const editarFormacion = async () => {
    if (nombreFormacion.trim()) {
      try {
        const data = {
          nombre: nombreFormacion.trim(),
          descripcion: descripcionFormacion,
          cantidadModulos: cantidadModulos,
          id_formacion: idFormacion,
        };

        const response = await axios.post(
          "/api/formaciones/actualizar-datos-formacion",
          data
        );

        setTodasFormaciones((prevFormaciones) =>
          prevFormaciones.map((formacion) =>
            formacion.id === response.data.formacion.id
              ? response.data.formacion
              : formacion
          )
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreFormacion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCantidadModulos(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionFormacion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdFormacion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log(error.response.data);

        //console.log("Error, al actualizar datos de la formación: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setCantidadModulos(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreFormacion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionFormacion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdFormacion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
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
          titulo={"¿Actualizar esta formación?"}
        >
          <div className="w-full">
            <FormEditarFormacion
              nombre={nombreFormacion}
              setNombre={setNombreFormacion}
              descripcion={descripcionFormacion}
              setDescripcion={setDescripcionFormacion}
              modulo={cantidadModulos}
              setModulo={setCantidadModulos}
              validarModulo={validarModulo}
              setValidarModulo={setValidarModulo}
              limpiarCampos={limpiarCampos}
              mostrarMensaje={mostrarMensaje}
              editar={editarFormacion}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear esta formación?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Nombre"} descripcion={nombreFormacion} />
            <ModalDatos
              titulo={"Cantidad de modulos"}
              descripcion={cantidadModulos}
            />
            <ModalDatos
              titulo={"Descripción"}
              descripcion={descripcionFormacion}
            />
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
              descripcionFormacion,
            }}
          />
        </Modal>
      )}

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear formación"}>
          <FormCrearFormacion
            nombre={nombreFormacion}
            setNombre={setNombreFormacion}
            descripcion={descripcionFormacion}
            setDescripcion={setDescripcionFormacion}
            modulo={cantidadModulos}
            setModulo={setCantidadModulos}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            validarModulo={validarModulo}
            setValidarModulo={setValidarModulo}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <DivDosDentroSectionRegistroMostrar>
            <ListadoFormaciones
              isLoading={isLoading}
              listado={todasFormaciones}
              nombreListado="Formaciones"
              mensajeVacio="No hay formaciones disponibles..."
              editando={editandoFormacion}
              usuarioActivo={usuarioActivo}
            />
          </DivDosDentroSectionRegistroMostrar>
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
