"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../Modal";
import ModalDatos from "../modales/ModalDatos";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import BotonesModal from "../botones/BotonesModal";
import FormCrearCargo from "../formularios/FormCrearCargo";
import ModalDatosContenedor from "../modales/ModalDatosContenedor";
import ModalEditar from "../modales/ModalEditar";
import FormEditarCargo from "../formularios/FormEditarCargo";
import ListadoGeneral from "../listados/ListadoGeneral";

export default function CargosForm({
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
  const [nombreCargo, setNombreCargo] = useState("");
  const [descripcionCargo, setDescripcionCargo] = useState("");
  const [todosCargos, setTodosCargos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [validarNombre, setValidarNombre] = useState(false);

  const [idCargo, setIdCargo] = useState("");
  const [accion, setAccion] = useState("");

  useEffect(() => {
    const fetchDatosCargos = async () => {
      try {
        const response = await axios.get("/api/cargos/todos-cargos");
        setTodosCargos(response.data.cargos || []);
      } catch (error) {
        console.log("Error, al obtener las cargos: " + error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatosCargos();
  }, []);

  useEffect(() => {
    if (accion === "editar" && !mostrar) {
      setAccion("");
      setNombreCargo("");
      setDescripcionCargo("");
      setIdCargo("");
    }
  }, [accion, mostrar]);

  const crearCargo = async () => {
    if (nombreCargo.trim()) {
      try {
        const response = await axios.post("/api/cargos/crear-cargo", {
          nombre: nombreCargo,
          descripcion: descripcionCargo,
        });
        setTodosCargos([...todosCargos, response.data.cargo]); // Suponiendo que la API devuelve el nombre guardado
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreCargo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionCargo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al crear el cargo: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    }
  };

  const editandoCargo = async (datos) => {
    try {
      setAccion("editar");
      setIdCargo(datos.id);
      setNombreCargo(datos.nombre);
      setDescripcionCargo(datos.descripcion);

      abrirModal();
    } catch (error) {
      console.log("Error, editando cargo: " + error);
    }
  };

  const editarCargo = async () => {
    if (nombreCargo.trim()) {
      try {
        const data = {
          nombre: nombreCargo.trim(),
          descripcion: descripcionCargo,
          id_cargo: idCargo,
        };

        const response = await axios.post(
          "/api/cargos/actualizar-datos-cargo",
          data
        );

        setTodosCargos((prevCargos) =>
          prevCargos.map((cargo) =>
            cargo.id === response.data.cargo.id ? response.data.cargo : cargo
          )
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreCargo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionCargo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdCargo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al actualizar datos del cargo: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreCargo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionCargo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdCargo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
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
          titulo={"¿Actualizar este cargo?"}
        >
          <div className="w-full">
            <FormEditarCargo
              nombre={nombreCargo}
              setNombre={setNombreCargo}
              descripcion={descripcionCargo}
              setDescripcion={setDescripcionCargo}
              limpiarCampos={limpiarCampos}
              mostrarMensaje={mostrarMensaje}
              editar={editarCargo}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear este cargo?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Nombre"} descripcion={nombreCargo} />
            <ModalDatos titulo={"Descripción"} descripcion={descripcionCargo} />
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crearCargo}
            cancelar={cerrarModal}
            indiceUno={"crear"}
            indiceDos={"cancelar"}
            nombreUno={"Aceptar"}
            nombreDos={"Cancelar"}
            campos={{
              nombreCargo,
              descripcionCargo,
            }}
          />
        </Modal>
      )}

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear cargo"}>
          <FormCrearCargo
            nombre={nombreCargo}
            setNombre={setNombreCargo}
            descripcion={descripcionCargo}
            setDescripcion={setDescripcionCargo}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <DivDosDentroSectionRegistroMostrar>
            <ListadoGeneral
              isLoading={isLoading}
              listado={todosCargos}
              nombreListado="Cargos"
              mensajeVacio="No hay cargos disponibles..."
              editando={editandoCargo}
              usuarioActivo={usuarioActivo}
            />
          </DivDosDentroSectionRegistroMostrar>
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
