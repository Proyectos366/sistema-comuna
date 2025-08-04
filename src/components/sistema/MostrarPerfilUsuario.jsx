"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import ModalEditar from "../modales/ModalEditar";
import FormEditarUsuario from "../formularios/FormEditarUsuario";
import { formatearFecha } from "@/utils/Fechas";

export default function MostrarPerfilUsuario({
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
  const [apellidoUsuario, setApellidoUsuario] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [perfilUsuario, setPerfilUsuario] = useState([]);

  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [validarNombre, setValidarNombre] = useState(false);
  const [validarApellido, setValidarApellido] = useState(false);

  useEffect(() => {
    const fetchDatosUsuario = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/usuarios/usuario-perfil");

        console.log(response.data);

        setPerfilUsuario(response.data.usuarioPerfil || []);
      } catch (error) {
        console.log("Error, al obtener los datos del usuario: " + error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatosUsuario();
  }, []);

  const editandoUsuario = async (datos) => {
    try {
      setNombreUsuario(datos.nombre);
      setApellidoUsuario(datos.apellido ? datos.apellido : "");

      abrirModal();
    } catch (error) {
      console.log("Error, editando usuario: " + error);
    }
  };

  const editarUsuario = async () => {
    if (nombreUsuario.trim()) {
      try {
        const response = await axios.post(
          "/api/usuarios/actualizar-datos-usuario",
          {
            nombre: nombreUsuario,
            apellido: apellidoUsuario,
          }
        );
        setPerfilUsuario(response.data.usuario); // Suponiendo que la API devuelve el nombre guardado
        abrirMensaje(response.data.message);

        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setNombreUsuario(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
          { accion: () => setApellidoUsuario(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      } catch (error) {
        console.log("Error, al obtener los datos del usuario: " + error);
        abrirMensaje(error?.response?.data?.message);
        ejecutarAccionesConRetraso([
          { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        ]);
      }
    }
  };

  function obtenerRol(id_rol) {
    switch (id_rol) {
      case 1:
        return "🛠️ master";
      case 2:
        return "👥 administrador";
      case 3:
        return "📊 director";
      case 4:
        return "📁 empleado";
      default:
        return "❓ desconocido";
    }
  }

  return (
    <>
      <ModalEditar
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Actualizar este cargo?"}
      >
        <div className="w-full">
          <FormEditarUsuario
            nombre={nombreUsuario}
            setNombre={setNombreUsuario}
            apellido={apellidoUsuario}
            setApellido={setApellidoUsuario}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
            validarApellido={validarApellido}
            setValidarApellido={setValidarApellido}
            limpiarCampos={limpiarCampos}
            mostrarMensaje={mostrarMensaje}
            editar={editarUsuario}
            mensaje={mensaje}
          />
        </div>
      </ModalEditar>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Datos de usuario"}>
          <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-semibold">Nombre:</span>
                <span>{perfilUsuario.nombre}</span>
              </li>
              <li>
                <span className="font-semibold">Cédula:</span>
                <span>{perfilUsuario.apellido}</span>
              </li>
              <li>
                <span className="font-semibold">Correo:</span>
                <span>{perfilUsuario.correo}</span>
              </li>
              <li>
                <span className="font-semibold">Rol:</span>
                <span>{obtenerRol(perfilUsuario.id_rol)}</span>
              </li>
              <li>
                <span className="font-semibold">Acceso:</span>{" "}
                <span
                  className={`${perfilUsuario.validado ? "text-[green]" : ""}`}
                >
                  {perfilUsuario.validado ? "autorizado" : "negado"}
                </span>
              </li>
              <li>
                <span className="font-semibold">Fecha de creación:</span>
                <span>{formatearFecha(perfilUsuario.createdAt)}</span>
              </li>
              <li>
                <span className="font-semibold">
                  Miembros de Departamentos:
                </span>{" "}
                <span>
                  {perfilUsuario.MiembrosDepartamentos.nombre
                    ? perfilUsuario.MiembrosDepartamentos.nombre
                    : "sin asignar"}
                </span>
              </li>
            </ul>
          </div>
        </DivUnoDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
