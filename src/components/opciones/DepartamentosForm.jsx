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
import FormCrearDepartamento from "../formularios/FormCrearDepartamento";
import ModalDatosContenedor from "../ModalDatosContenedor";
import FormEditarDepartamento from "../formularios/FormEditarDepartamento";
import ModalEditar from "../modales/ModalEditar";
import ListadoDepartamentos from "../listados/ListadoDepartamentos";

export default function DepartamentosForm({
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
  const [nombreDepartamento, setNombreDepartamento] = useState("");
  const [descripcionDepartamento, setDescripcionDepartamento] = useState("");
  const [todosDepartamentos, setTodosDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [validarNombre, setValidarNombre] = useState(false);

  const [idDepartamento, setIdDepartamento] = useState("");
  const [accion, setAccion] = useState("");

  useEffect(() => {
    const fetchDatosDepartamentos = async () => {
      try {
        const response = await axios.get(
          "/api/departamentos/todos-departamentos"
        );
        setTodosDepartamentos(response.data.departamentos || []);
      } catch (error) {
        console.log("Error, al obtener los departamentos: " + error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatosDepartamentos();
  }, []);

  useEffect(() => {
    if (accion === "editar" && !mostrar) {
      setAccion("");
      setIdDepartamento("");
    }
  }, [accion, mostrar]);

  const crearDepartamento = async () => {
    if (nombreDepartamento.trim()) {
      try {
        const response = await axios.post(
          "/api/departamentos/crear-departamento",
          {
            nombre: nombreDepartamento,
            descripcion: descripcionDepartamento,
          }
        );
        setTodosDepartamentos([
          ...todosDepartamentos,
          response.data.departamento,
        ]);

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreDepartamento(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionDepartamento(""), tiempo: 3000 },
        ]);
      } catch (error) {
        console.log("Error, al crear el departamento: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    }
  };

  const editandoDepartamento = async (datos) => {
    try {
      setAccion("editar");
      setIdDepartamento(datos.id);
      setNombreDepartamento(datos.nombre);
      setDescripcionDepartamento(datos.descripcion);

      abrirModal();
    } catch (error) {
      console.log("Error, editando departamento: " + error);
    }
  };

  const editarDepartamento = async () => {
    if (nombreDepartamento.trim()) {
      try {
        const data = {
          nombre: nombreDepartamento.trim(),
          descripcion: descripcionDepartamento,
          id_departamento: idDepartamento,
        };

        const response = await axios.post(
          "/api/departamentos/actualizar-datos-departamento",
          data
        );

        setTodosDepartamentos((prevDepartamentos) =>
          prevDepartamentos.map((departamento) =>
            departamento.id === response.data.departamento.id
              ? response.data.departamento
              : departamento
          )
        );

        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreDepartamento(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setDescripcionDepartamento(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setIdDepartamento(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setAccion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al actualizar datos del departamento: " + error);
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
          titulo={"¿Actualizar este departamento?"}
        >
          <div className="w-full">
            <FormEditarDepartamento
              nombre={nombreDepartamento}
              setNombre={setNombreDepartamento}
              descripcion={descripcionDepartamento}
              setDescripcion={setDescripcionDepartamento}
              limpiarCampos={limpiarCampos}
              mostrarMensaje={mostrarMensaje}
              editar={editarDepartamento}
              mensaje={mensaje}
            />
          </div>
        </ModalEditar>
      ) : (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear este departamento?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Nombre"} descripcion={nombreDepartamento} />
            <ModalDatos
              titulo={"Descripción"}
              descripcion={descripcionDepartamento}
            />
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crearDepartamento}
            cancelar={cerrarModal}
            indiceUno={"crear"}
            indiceDos={"cancelar"}
            nombreUno={"Aceptar"}
            nombreDos={"Cancelar"}
            campos={{
              nombreDepartamento,
            }}
          />
        </Modal>
      )}

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Crear departamento"}>
          <FormCrearDepartamento
            nombre={nombreDepartamento}
            setNombre={setNombreDepartamento}
            descripcion={descripcionDepartamento}
            setDescripcion={setDescripcionDepartamento}
            abrirModal={abrirModal}
            limpiarCampos={limpiarCampos}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
          />
        </DivUnoDentroSectionRegistroMostrar>

        <DivDosDentroSectionRegistroMostrar>
          <ListadoDepartamentos
            isLoading={isLoading}
            listado={todosDepartamentos}
            nombreListado="Departamentos"
            mensajeVacio="No hay departamentos disponibles..."
            editando={editandoDepartamento}
            usuarioActivo={usuarioActivo}
          />
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
