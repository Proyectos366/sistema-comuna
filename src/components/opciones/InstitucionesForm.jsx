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
import ModalDatosContenedor from "../ModalDatosContenedor";
import ModalEditar from "../modales/ModalEditar";
import FormEditarInstitucion from "../formularios/FormEditarInstitucion";
import FormCrearInstitucion from "../formularios/FormCrearInstitucion";
import ListadoInstituciones from "../listados/ListadoInstituciones";

export default function InstitucionesForm({
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
  const [nombreInstitucion, setNombreInstitucion] = useState("");
  const [descripcionInstitucion, setDescripcionInstitucion] = useState("");
  const [rifInstitucion, setRifInstitucion] = useState("");
  const [sectorInstitucion, setSectorInstitucion] = useState("");
  const [direccionInstitucion, setDireccionInstitucion] = useState("");

  const [todosPaises, setTodosPaises] = useState([]);
  const [todosEstados, setTodosEstados] = useState([]);
  const [todosMunicipios, setTodosMunicipios] = useState([]);
  const [todasInstituciones, setTodasInstituciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  const [validarNombreInstitucion, setValidarNombreInstitucion] =
    useState(false);
  const [validarRifInstitucion, setValidarRifInstitucion] = useState(false);

  const [idPais, setIdPais] = useState("");
  const [idEstado, setIdEstado] = useState("");
  const [idMunicipio, setIdMunicipio] = useState("");
  const [idInstitucion, setIdInstitucion] = useState("");

  const [nombrePais, setNombrePais] = useState("");
  const [nombreEstado, setNombreEstado] = useState("");
  const [nombreMunicipio, setNombreMunicipio] = useState("");

  const [accion, setAccion] = useState("");

  useEffect(() => {
    const fetchDatosPaises = async () => {
      try {
        const response = await axios.get("/api/paises/todos-paises");
        setTodosPaises(response.data.paises || []);
      } catch (error) {
        console.log("Error al obtener los paises:", error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatosPaises();
  }, []);

  useEffect(() => {
    if (!idPais) {
      setTodosEstados([]);
      return;
    }

    const paisSeleccionado = todosPaises.find((p) => p.id === parseInt(idPais));
    setTodosEstados(paisSeleccionado?.estados || []);
    setIdEstado(""); // Reiniciar selección
    setTodosMunicipios([]);
    setIdMunicipio("");
  }, [idPais]);

  useEffect(() => {
    if (!idEstado) {
      setTodosMunicipios([]);
      return;
    }

    const estadoSeleccionado = todosEstados.find(
      (p) => p.id === parseInt(idEstado)
    );
    setTodosMunicipios(estadoSeleccionado?.municipios || []);
    setIdMunicipio(""); // Reiniciar selección
  }, [idEstado]);

  useEffect(() => {
    if (!idMunicipio) {
      setTodasInstituciones([]);
      return;
    }

    const municipioSeleccionado = todosMunicipios.find(
      (p) => p.id === parseInt(idMunicipio)
    );

    setTodasInstituciones(municipioSeleccionado?.instituciones || []);
  }, [idMunicipio]);

  const crearInstitucion = async () => {
    if (nombreInstitucion.trim()) {
      try {
        const response = await axios.post(
          "/api/instituciones/crear-institucion",
          {
            nombre: nombreInstitucion,
            descripcion: descripcionInstitucion,
            rif: rifInstitucion,
            sector: sectorInstitucion,
            direccion: direccionInstitucion,
            id_pais: idPais,
            id_estado: idEstado,
            id_municipio: idMunicipio,
          }
        );

        setTodosPaises((prev) =>
          prev ? [...prev, response.data.paises] : [response.data.paises]
        );

        setTodasInstituciones((prev) =>
          prev
            ? [...prev, response.data.instituciones]
            : [response.data.instituciones]
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setRifInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setSectorInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDireccionInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear institución: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    }
  };

  const cambiarSeleccionPais = (e) => {
    setIdPais(e.target.value);
  };

  const cambiarSeleccionEstado = (e) => {
    setIdEstado(e.target.value);
  };

  const cambiarSeleccionMunicipio = (e) => {
    setIdMunicipio(e.target.value);
  };

  const editandoInstitucion = async (datos) => {
    try {
      setAccion("editar");
      setIdPais(datos.id_pais);
      setIdEstado(datos.id_estado);
      setIdMunicipio(datos.id_municipio);
      setIdInstitucion(datos.id);
      setNombreInstitucion(datos.nombre);
      setDescripcionInstitucion(datos.descripcion);
      setRifInstitucion(datos.rif);
      setSectorInstitucion(datos.sector);
      setDireccionInstitucion(datos.direccion);

      abrirModal();
    } catch (error) {
      console.log("Error, editando institución: " + error);
    }
  };

  const editarInstitucion = async () => {
    if (nombreInstitucion.trim()) {
      try {
        const data = {
          nombre: nombreInstitucion.trim(),
          descripcion: descripcionInstitucion,
          rif: rifInstitucion,
          sector: sectorInstitucion,
          direccion: direccionInstitucion,
          id_pais: idPais,
          id_estado: idEstado,
          id_municipio: idMunicipio,
          id_institucion: idInstitucion,
        };

        const response = await axios.post(
          "/api/instituciones/actualizar-datos-institucion",
          data
        );

        setTodosPaises(response.data.paises);

        setTodasInstituciones((prevInstituciones) =>
          prevInstituciones.map((instituciones) =>
            instituciones.id === response.data.instituciones.id
              ? response.data.instituciones
              : instituciones
          )
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setRifInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setSectorInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDireccionInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al actualizar datos de la institución: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setRifInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setSectorInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDireccionInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
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
          titulo={"¿Actualizar esta institución?"}
        >
          <div className="w-full">
            <FormEditarInstitucion
              nombre={nombreInstitucion}
              setNombre={setNombreInstitucion}
              descripcion={descripcionInstitucion}
              setDescripcion={setDescripcionInstitucion}
              rif={rifInstitucion}
              setRif={setRifInstitucion}
              sector={sectorInstitucion}
              setSector={setSectorInstitucion}
              direccion={direccionInstitucion}
              setDireccion={setDireccionInstitucion}
              validarNombre={validarNombreInstitucion}
              setValidarNombre={setValidarNombreInstitucion}
              validarRif={validarRifInstitucion}
              setValidarRif={setValidarRifInstitucion}
              limpiarCampos={limpiarCampos}
              mostrarMensaje={mostrarMensaje}
              editar={editarInstitucion}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear esta institución?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Nombre"} descripcion={nombreInstitucion} />
            <ModalDatos
              titulo={"Descripción"}
              descripcion={descripcionInstitucion}
            />
            <ModalDatos titulo={"Rif"} descripcion={rifInstitucion} />

            <ModalDatos titulo={"Pais"} descripcion={nombrePais} />
            <ModalDatos titulo={"Estado"} descripcion={nombreEstado} />
            <ModalDatos titulo={"Municipio"} descripcion={nombreMunicipio} />
            <ModalDatos titulo={"Sector"} descripcion={sectorInstitucion} />
            <ModalDatos
              titulo={"Dirección"}
              descripcion={direccionInstitucion}
            />
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crearInstitucion}
            cancelar={cerrarModal}
            indiceUno={"crear"}
            indiceDos={"cancelar"}
            nombreUno={"Aceptar"}
            nombreDos={"Cancelar"}
            campos={{
              nombreInstitucion,
              descripcionInstitucion,
              rifInstitucion,
              sectorInstitucion,
              direccionInstitucion,
              idPais,
              idEstado,
              idMunicipio,
            }}
          />
        </Modal>
      )}

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear institución"}>
          <FormCrearInstitucion
            nombre={nombreInstitucion}
            setNombre={setNombreInstitucion}
            descripcion={descripcionInstitucion}
            setDescripcion={setDescripcionInstitucion}
            rif={rifInstitucion}
            setRif={setRifInstitucion}
            sector={sectorInstitucion}
            setSector={setSectorInstitucion}
            direccion={direccionInstitucion}
            setDireccion={setDireccionInstitucion}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
            validarNombre={validarNombreInstitucion}
            setValidarNombre={setValidarNombreInstitucion}
            validarRif={validarRifInstitucion}
            setValidarRif={setValidarRifInstitucion}
            paises={todosPaises}
            estados={todosEstados}
            municipios={todosMunicipios}
            idPais={idPais}
            idEstado={idEstado}
            idMunicipio={idMunicipio}
            setNombrePais={setNombrePais}
            setNombreEstado={setNombreEstado}
            setNombreMunicipio={setNombreMunicipio}
            cambiarSeleccionPais={cambiarSeleccionPais}
            cambiarSeleccionEstado={cambiarSeleccionEstado}
            cambiarSeleccionMunicipio={cambiarSeleccionMunicipio}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoInstituciones
            isLoading={isLoading}
            listado={todasInstituciones}
            nombreListado="Instituciones"
            mensajeVacio="No hay instituciones disponibles..."
            editando={editandoInstitucion}
            usuarioActivo={usuarioActivo}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
