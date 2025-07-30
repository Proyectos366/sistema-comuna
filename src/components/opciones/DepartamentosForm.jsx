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
import ListadoGenaral from "../listados/ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";

export default function DepartamentosForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  const [nombreDepartamento, setNombreDepartamento] = useState("");
  const [descripcionDepartamento, setDescripcionDepartamento] = useState("");
  const [todosDepartamentos, setTodosDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [validarNombre, setValidarNombre] = useState(false);

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
        ]); // Suponiendo que la API devuelve el nombre guardado
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

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear este departamento?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Nombre"} descripcion={nombreDepartamento} />
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
          <DivDosDentroSectionRegistroMostrar>
            <ListadoGenaral
              isLoading={isLoading}
              listado={todosDepartamentos}
              nombreListado="Departamentos"
              mensajeVacio="No hay departamentos disponibles..."
            />
          </DivDosDentroSectionRegistroMostrar>
        </DivDosDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
