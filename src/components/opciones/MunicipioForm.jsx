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
import ModalDatosContenedor from "../modales/ModalDatosContenedor";
import ModalEditar from "../modales/ModalEditar";
import ListadoPaises from "../listados/ListadoPaises";
import FormEditarMunicipio from "../formularios/FormEditarMunicipio";
import FormCrearMunicipio from "../formularios/FormCrearMunicipio";

export default function MunicipiosForm({
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
  const [nombreMunicipio, setNombreMunicipio] = useState("");
  const [descripcionMunicipio, setDescripcionMunicipio] = useState("");

  const [todosPaises, setTodosPaises] = useState([]);
  const [todosEstados, setTodosEstados] = useState([]);
  const [todosMunicipios, setTodosMunicipios] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  const [idPais, setIdPais] = useState("");
  const [idEstado, setIdEstado] = useState("");
  const [idMunicipio, setIdMunicipio] = useState("");
  const [accion, setAccion] = useState("");

  const [validarNombreMunicipio, setValidarNombreMunicipio] = useState("");

  const [nombrePais, setNombrePais] = useState("");
  const [nombreEstado, setNombreEstado] = useState("");

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
    if (accion === "editar" && !mostrar) {
      setAccion("");
      setIdMunicipio("");
      setNombreMunicipio("");
      setDescripcionMunicipio("");
    }
  }, [accion, mostrar]);

  useEffect(() => {
    if (!idMunicipio) {
      setNombreMunicipio("");
      setDescripcionMunicipio("");
      return;
    }
  }, [idMunicipio]);

  const cambiarSeleccionPais = (e) => {
    setIdPais(e.target.value);
  };

  const cambiarSeleccionEstado = (e) => {
    setIdEstado(e.target.value);
  };

  const crearMunicipio = async () => {
    if (nombreMunicipio.trim()) {
      try {
        const response = await axios.post("/api/municipios/crear-municipio", {
          nombre: nombreMunicipio,
          descripcion: descripcionMunicipio,
          id_pais: idPais,
          id_estado: idEstado,
        });

        setTodosPaises((prev) =>
          prev ? [...prev, response.data.paises] : [response.data.paises]
        );

        setTodosEstados((prev) =>
          prev ? [...prev, response.data.estados] : [response.data.estados]
        );

        setTodosMunicipios((prev) =>
          prev
            ? [...prev, response.data.municipios]
            : [response.data.municipios]
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreMunicipio(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionMunicipio(""), tiempo: 3000 }, // Se ejecutará en 3 segundos.0
        ]);
      } catch (error) {
        console.log("Error, al crear municipio: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    }
  };

  const editandoMunicipio = async (datos) => {
    try {
      setAccion("editar");
      setIdMunicipio(datos.id);
      setNombreMunicipio(datos.nombre);
      setDescripcionMunicipio(datos.descripcion);

      abrirModal();
    } catch (error) {
      console.log("Error, editando municipio: " + error);
    }
  };

  const editarMunicipio = async () => {
    if (nombreMunicipio.trim()) {
      try {
        const data = {
          nombre: nombreMunicipio.trim(),
          descripcion: descripcionMunicipio,
          id_pais: idPais,
          id_estado: idEstado,
          id_municipio: idMunicipio,
        };

        const response = await axios.post(
          "/api/municipios/actualizar-datos-municipio",
          data
        );

        setTodosPaises(response.data.paises);

        setTodosMunicipios((prevMunicipios) =>
          prevMunicipios.map((municipios) =>
            municipios.id === response.data.municipios.id
              ? response.data.municipios
              : municipios
          )
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreMunicipio(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionMunicipio(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al actualizar datos del municipio: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreMunicipio(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionMunicipio(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
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
          titulo={"¿Actualizar este municipio?"}
        >
          <div className="w-full">
            <FormEditarMunicipio
              nombre={nombreMunicipio}
              setNombre={setNombreMunicipio}
              descripcion={descripcionMunicipio}
              setDescripcion={setDescripcionMunicipio}
              validarNombre={validarNombreMunicipio}
              setValidarNombre={setValidarNombreMunicipio}
              limpiarCampos={limpiarCampos}
              mostrarMensaje={mostrarMensaje}
              editar={editarMunicipio}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear este municipio?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Nombre"} descripcion={nombreEstado} />
            <ModalDatos
              titulo={"Descripción"}
              descripcion={descripcionMunicipio}
            />

            <ModalDatos titulo={"Pais"} descripcion={nombrePais} />
            <ModalDatos titulo={"Estado"} descripcion={nombreEstado} />
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crearMunicipio}
            cancelar={cerrarModal}
            indiceUno={"crear"}
            indiceDos={"cancelar"}
            nombreUno={"Aceptar"}
            nombreDos={"Cancelar"}
            campos={{
              nombreEstado,
              descripcionMunicipio,
              idPais,
              idEstado,
            }}
          />
        </Modal>
      )}

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear municipio"}>
          <FormCrearMunicipio
            idPais={idPais}
            idEstado={idEstado}
            nombre={nombreMunicipio}
            setNombre={setNombreMunicipio}
            descripcion={descripcionMunicipio}
            setDescripcion={setDescripcionMunicipio}
            validarNombre={validarNombreMunicipio}
            setValidarNombre={setValidarNombreMunicipio}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
            paises={todosPaises}
            estados={todosEstados}
            cambiarSeleccionPais={cambiarSeleccionPais}
            cambiarSeleccionEstado={cambiarSeleccionEstado}
            setNombrePais={setNombrePais}
            setNombreEstado={setNombreEstado}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoPaises
            isLoading={isLoading}
            listado={todosMunicipios}
            nombreListado="Municipios"
            mensajeVacio="No hay municipios disponibles..."
            editando={editandoMunicipio}
            usuarioActivo={usuarioActivo}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
