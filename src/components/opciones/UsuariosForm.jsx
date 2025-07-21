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
import SelectOpcion from "../SelectOpcion";

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
  const [nombreRol, setNombreRol] = useState("");
  const [idUsuario, setIdUsuario] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState("");
  const [accion, setAccion] = useState("");

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
        console.log("Error al obtener datos:", error);
      }
    };

    fetchDatos();
  }, []);

  useEffect(() => {
    if (!mostrar) {
      setAccion("");
    }
  }, [mostrar]);

  const cambiarSeleccionDepartamento = (e) => {
    setIdDepartamento(e.target.value);
  };

  const cambiarSeleccionRol = (e) => {
    setIdRol(e.target.value);
  };



  /** 
    const asignarUsuarioDepartamento = async () => {
      try {
        console.log("Asignando departamento");
        console.log(idDepartamento);
        console.log(idUsuario);

        const res = await axios.patch("/api/usuarios/asignar-al-departamento", {
          idUsuario,
          idDepartamento,
        });

        setTodosUsuarios((usuarios = []) => {
          return usuarios.map((u) => {
            if (u.id === usuarioActualizado.id) {
              return usuarioActualizado; // lo reemplaza completamente
            }
            return u; // mantiene el resto igual
          });
        });

        abrirMensaje(res.data.message);
        ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
      } catch (error) {
        abrirMensaje(
          error?.response?.data?.message || "Error al asignar departamento"
        );
        ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
      }
    };
  */

    const asignarUsuarioDepartamento = async () => {
  try {
    console.log("Asignando departamento");
    console.log(idDepartamento);
    console.log(idUsuario);

    const res = await axios.patch("/api/usuarios/asignar-al-departamento", {
      idUsuario,
      idDepartamento,
    });

    const usuarioActualizado = res.data.usuario;

    setTodosUsuarios((usuarios = []) => {
      return usuarios.map((u) =>
        u.id === usuarioActualizado.id ? usuarioActualizado : u
      );
    });

    abrirMensaje(res.data.message);
    ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
  } catch (error) {
    abrirMensaje(
      error?.response?.data?.message || "Error al asignar departamento"
    );
    ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
  }
};



  const cambiarUsuarioDepartamento = async () => {
    try {
      console.log("Cambiando departamento");
      console.log(idDepartamento);
      console.log(idUsuario);

      // const res = await axios.patch("/api/usuarios/asignar-al-departamento", {
      //   idUsuario,
      //   idDepartamento,
      // });

      // abrirMensaje(res.data.message);
      // ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
    } catch (error) {
      abrirMensaje(
        error?.response?.data?.message || "Error al cambiar departamento"
      );
      ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
    }
  };

  const cambiarUsuarioRol = async () => {
    try {
      console.log("Cambiando rol");

      // const res = await axios.patch("/api/usuarios/asignar-al-departamento", {
      //   idUsuario,
      //   idDepartamento,
      // });

      // abrirMensaje(res.data.message);
      // ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
    } catch (error) {
      abrirMensaje(error?.response?.data?.message || "Error al cambiar rol");
      ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
    }
  };

  const obtenerAccion = () => {
    switch (accion) {
      case "cambiarDepartamento":
        return cambiarUsuarioDepartamento;
      case "asignarDepartamento":
        return asignarUsuarioDepartamento;
      case "cambiarRol":
        return cambiarUsuarioRol;
      default:
        return () => {}; // función vacía si no hay acción
    }
  };

  const obtenerTituloAccion = () => {
    switch (accion) {
      case "cambiarDepartamento":
        return "¿Cambiar departamento?";
      case "asignarDepartamento":
        return "¿Asignar al departamento?";
      case "cambiarRol":
        return "¿Cambiar rol?";
      default:
        return () => {}; // función vacía si no hay acción
    }
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={obtenerTituloAccion()}
      >
        <ModalDatosContenedor>
          {accion === "cambiarDepartamento" && (
            <ModalDatos
              titulo="Departamento"
              descripcion={nombreDepartamento}
            />
          )}
          <ModalDatos titulo="Usuario" descripcion={nombreUsuario} />
          {accion === "cambiarRol" && (
            <ModalDatos titulo="Rol" descripcion={nombreRol} />
          )}

          {accion && accion === "cambiarRol" ? (
            <SelectOpcion
              idOpcion={idRol}
              nombre={"Cambiar a"}
              handleChange={cambiarSeleccionRol}
              opciones={todosRoles}
              seleccione="Seleccione"
              setNombre={setNombreRol}
              indice={1}
            />
          ) : (
            <SelectOpcion
              idOpcion={idDepartamento}
              nombre={
                accion === "asignarDepartamento" ? "Departamentos" : "Cambiar a"
              }
              handleChange={cambiarSeleccionDepartamento}
              opciones={todosDepartamentos}
              seleccione="Seleccione"
              setNombre={setNombreDepartamento}
              indice={1}
            />
          )}
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

        <BotonesModal
          aceptar={obtenerAccion()}
          cancelar={cerrarModal}
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{ nombreUsuario, nombreDepartamento }}
        />
      </Modal>

      <SectionRegistroMostrar>
        <main className="p-6 max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl font-bold mb-4 text-center">
            📋 Usuarios Registrados
          </h1>

          {todosUsuarios.map((usuario) => {
            const departamentoActual = usuario?.MiembrosDepartamentos?.[0];

            return (
              <div
                key={usuario.id}
                className="border border-gray-300 rounded-md shadow-sm overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpanded(expanded === usuario.id ? null : usuario.id)
                  }
                  className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-medium text-lg"
                >
                  👤 {usuario.nombre}
                </button>

                {expanded === usuario.id && (
                  <div className="bg-white px-4 py-3 space-y-2 text-sm">
                    <div>
                      <strong>ID:</strong> {usuario.id}
                    </div>
                    <div>
                      <strong>Cédula:</strong> {usuario.cedula}
                    </div>

                    <div className="flex items-center gap-2">
                      <strong>Departamento:</strong>{" "}
                      <div className="flex items-center gap-4">
                        {departamentoActual?.nombre ? (
                          <>
                            <span>{departamentoActual.nombre}</span>
                            <button
                              title="Cambiar departamento"
                              onClick={() => {
                                abrirModal();
                                setAccion("cambiarDepartamento");
                                setNombreUsuario(usuario.nombre);
                                setNombreDepartamento(
                                  departamentoActual.nombre
                                );
                                setIdDepartamento("");
                                setIdUsuario(usuario.id);
                              }}
                              className="px-4 py-1 rounded-md bg-[#2FA807] text-white shadow-md hover:scale-105 transition"
                            >
                              Cambiar
                            </button>
                          </>
                        ) : (
                          <button
                            title="Asignar departamento"
                            onClick={() => {
                              abrirModal();
                              setAccion("asignarDepartamento");
                              setNombreUsuario(usuario.nombre);
                              setNombreDepartamento("");
                              setIdUsuario(usuario.id);
                              setIdDepartamento("");
                            }}
                            className="px-4 py-1 rounded-md bg-[#082158] text-white shadow-md hover:scale-105 transition"
                          >
                            Asignar
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <strong>Correo:</strong> {usuario.correo}
                    </div>
                    <div>
                      <strong>Rol:</strong>{" "}
                      {usuario.id_rol === 2 && "Administrador"}
                      {usuario.id_rol === 3 && "Director"}
                      {usuario.id_rol === 4 && "Empleado"}
                      <button
                        title="Cambiar rol"
                        onClick={() => {
                          abrirModal();
                          setAccion("cambiarRol");
                          setNombreUsuario(usuario.nombre);
                          setIdRol("");
                          setIdUsuario(usuario.id);
                        }}
                        className="px-4 py-1 rounded-md bg-[#2FA807] text-white shadow-md hover:scale-105 transition"
                      >
                        Cambiar
                      </button>
                    </div>
                    <div>
                      <strong>Token:</strong>{" "}
                      <span className="text-xs text-gray-500">
                        {usuario.token}
                      </span>
                    </div>
                    <div>
                      <strong>Estado:</strong>{" "}
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          usuario.borrado
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {usuario.borrado ? "Inactivo" : "Activo"}
                      </span>
                    </div>
                    <div>
                      <strong>Creado:</strong>{" "}
                      {new Date(usuario.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </main>
      </SectionRegistroMostrar>
    </>
  );
}
