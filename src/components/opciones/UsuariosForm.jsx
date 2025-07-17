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
import FormCrearComuna from "../formularios/FormCrearComuna";
import ListadoGenaral from "../ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";

export default function UsuariosForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  const [nombreUsuario, setNombreUsuario] = useState("");

  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [todosRoles, setTodosRoles] = useState([]);
  const [todosDepartamentos, setTodosDepartamentos] = useState([]);

  const [nombreDepartamento, setNombreDepartamento] = useState("");
  const [idDepartamento, setIdDepartamento] = useState("");
  const [idRol, setIdRol] = useState("");

  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [usuariosRes, departamentosRes, rolesRes] = await Promise.all([
          axios.get("/api/usuarios/todos-usuarios"),
          axios.get("/api/departamentos/todos-departamentos"),
          axios.get("/api/roles/todos-roles"),
        ]);

        setTodosUsuarios(usuariosRes.data.usuarios || []);
        setTodosDepartamentos(departamentosRes.data.departamentos || []);
        setTodosRoles(rolesRes.data.roles || []);
      } catch (error) {
        console.log("Error, al obtener datos: " + error);
      }
    };

    fetchDatos();
  }, []);

  const cambiarSeleccionDepartamento = (e) => {
    const valor = e.target.value;
    setIdDepartamento(valor);
  };

  const cambiarSeleccionRol = (e) => {
    const valor = e.target.value;
    setIdRol(valor);
  };

  const cambiarUsuarioDepartamento = async () => {
    try {
      const response = await axios.patch(
        "/api/usuarios/asignar-al-departamento",
        {
          idDepartamento: idDepartamento,
        }
      );

      setTodosUsuarios((prevUsuarios) => [
        ...prevUsuarios,
        response.data.usuario,
      ]);

      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      console.log("Error, al agregar usuario al departamento: " + error);
      abrirMensaje(error?.response?.data?.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    }
  };

  const cambiarUsuarioRol = async () => {
    try {
      const response = await axios.patch(
        "/api/roles/asignar-rol",
        {
          idRol: idRol,
        }
      );

      setTodosUsuarios((prevUsuarios) => [
        ...prevUsuarios,
        response.data.usuarios,
      ]);

      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      console.log("Error, al asignar rol: " + error);
      abrirMensaje(error?.response?.data?.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    }
  };


  console.log(todosUsuarios);
  

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Asignar al departamento?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Departamento"} descripcion={nombreDepartamento} />
          <ModalDatos titulo={"Usuario"} descripcion={nombreUsuario} />
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={cambiarUsuarioDepartamento}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombreUsuario,
            nombreDepartamento,
          }}
        />
      </Modal>


      <SectionRegistroMostrar>
        <div>Hola a todos los usuarios</div>
      </SectionRegistroMostrar>
    </>
  );
}
