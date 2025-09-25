"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Modal from "../Modal";
import ModalDatos from "../ModalDatos";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import BotonesModal from "../BotonesModal";
import ModalDatosContenedor from "../ModalDatosContenedor";
import SelectOpcion from "../SelectOpcion";
import Input from "../inputs/Input";
import OrdenarListaUsuarios from "../listados/OrdenarListaUsuarios";
import Paginador from "../templates/PlantillaPaginacion";
import FormCrearUsuario from "../formularios/FormCrearUsuario";
import DivTresDentroSectionRegistroMostrar from "../DivTresDentroSectionRegistroMostrar";
import ListadoUsuarios from "../listados/ListadoUsuarios";

export default function UsuariosForm({
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
  const [cedulaUsuario, setCedulaUsuario] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [apellidoUsuario, setApellidoUsuario] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [claveUnoUsuario, setClaveUnoUsuario] = useState("");
  const [claveDosUsuario, setClaveDosUsuario] = useState("");
  const [mensajeValidar, setMensajeValidar] = useState("");

  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [todosRoles, setTodosRoles] = useState([]);
  const [todosDepartamentos, setTodosDepartamentos] = useState([]);
  const [institucionMiembro, setInstitucionMiembro] = useState([]);
  const [todasInstituciones, setTodasInstituciones] = useState([]);

  const [nombreInstitucion, setNombreInstitucion] = useState("");
  const [nombreDepartamento, setNombreDepartamento] = useState("");

  const [idDepartamento, setIdDepartamento] = useState("");
  const [idRol, setIdRol] = useState("");
  const [nombreRol, setNombreRol] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [idInstitucion, setIdInstitucion] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState("");
  const [accion, setAccion] = useState("");

  const [estado, setEstado] = useState(null);
  const [validado, setValidado] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const [open, setOpen] = useState(false);
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const [opcion, setOpcion] = useState("");

  const [validarCedulaUsuario, setValidarCedulaUsuario] = useState(false);
  const [validarCorreoUsuario, setValidarCorreoUsuario] = useState(false);
  const [validarNombreUsuario, setValidarNombreUsuario] = useState(false);
  const [validarApellidoUsuario, setValidarApellidoUsuario] = useState(false);
  const [validarClaveUsuario, setValidarClaveUsuario] = useState(false);

  const [seleccionarDepartamentos, setSeleccionarDepartamentos] = useState([]);
  const [seleccionarInstitucion, setSeleccionarInstitucion] = useState([]);

  const [autorizar, setAutorizar] = useState("");
  const [crearMostrar, setCrearMostrar] = useState(false);

  const usuariosFiltrados = useMemo(() => {
    if (!searchTerm) return todosUsuarios;

    const lower = searchTerm.toLowerCase();

    return todosUsuarios?.filter((usuario) => {
      return (
        // Buscar por nombre
        usuario.nombre?.toLowerCase().includes(lower) ||
        // Buscar por cédula
        String(usuario.cedula).includes(lower) ||
        // Buscar por correo
        usuario.correo?.toLowerCase().includes(lower) ||
        // Buscar por estado (activo/inactivo)
        (typeof usuario.borrado === "boolean" &&
          (usuario.borrado ? "inactivo" : "activo").includes(lower)) ||
        // Buscar por rol textual
        (usuario.id_rol === 2 && "administrador".includes(lower)) ||
        (usuario.id_rol === 3 && "director".includes(lower)) ||
        (usuario.id_rol === 4 && "empleado".includes(lower))
      );
    });
  }, [todosUsuarios, searchTerm]);

  const ordenarUsuarios = (lista, campo, asc) => {
    const listaClonada = [...lista];

    return listaClonada.sort((a, b) => {
      const valorA = a[campo];
      const valorB = b[campo];

      if (valorA == null || valorB == null) return 0;

      if (typeof valorA === "number" && typeof valorB === "number") {
        return asc ? valorA - valorB : valorB - valorA;
      }

      return asc
        ? String(valorA)
            .toLowerCase()
            .localeCompare(String(valorB).toLowerCase())
        : String(valorB)
            .toLowerCase()
            .localeCompare(String(valorA).toLowerCase());
    });
  };

  const usuariosOrdenados = ordenarUsuarios(
    usuariosFiltrados,
    ordenCampo,
    ordenAscendente
  );

  const usuarioPorPagina = usuariosOrdenados.slice(first, first + rows);
  const totalRecords = usuariosFiltrados.length;

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const promesas = [
          axios.get("/api/usuarios/todos-usuarios"),
          axios.get("/api/departamentos/todos-departamentos"),
          axios.get("/api/roles/todos-roles"),
          axios.get("/api/instituciones/institucion-miembro-id"),
        ];

        // Solo agregar la consulta de todas las instituciones si el rol es 1
        if (usuarioActivo.id_rol === 1) {
          promesas.push(axios.get("/api/instituciones/todas-instituciones"));
        }

        const [
          usuariosRes,
          departamentosRes,
          rolesRes,
          institucionRes,
          institucionesRes, // solo estará definido si id_rol === 1
        ] = await Promise.all(promesas);

        setTodosUsuarios(usuariosRes.data.usuarios || []);
        setTodosDepartamentos(departamentosRes.data.departamentos || []);
        setTodosRoles(rolesRes.data.roles || []);
        setInstitucionMiembro(institucionRes.data.instituciones || []);

        if (usuarioActivo.id_rol === 1 && institucionesRes) {
          setTodasInstituciones(institucionesRes.data.instituciones || []);
        }
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

  const toggleUsuarioCrearMostrar = () => {
    setCrearMostrar((prev) => !prev);
    setOpcion((prev) => (prev === "" ? "crear" : ""));
  };

  const toggleAutorizar = (id) => {
    setAutorizar(autorizar === id ? "" : id); // Cambia el estado, permitiendo deselección
  };

  const cambiarSeleccionInstitucion = (e) => {
    const valor = parseInt(e.target.value);

    // Si el valor es vacío o no es un número válido, vaciar selección
    if (isNaN(valor)) {
      setSeleccionarInstitucion([]);
      setIdInstitucion("");
      return;
    }

    const nuevo = { id: valor };

    setSeleccionarInstitucion((prev) => {
      const existe = prev.some((institucion) => institucion.id === valor);
      return existe
        ? prev.filter((institucion) => institucion.id !== valor)
        : [...prev, nuevo];
    });

    setIdInstitucion(valor);
  };

  const cambiarSeleccionDepartamento = (e) => {
    const valor = parseInt(e.target.value);

    // Si el valor es vacío o no es un número válido, vaciar selección
    if (isNaN(valor)) {
      setSeleccionarDepartamentos([]);
      setIdDepartamento("");
      return;
    }

    const nuevo = { id: valor };

    setSeleccionarDepartamentos((prev) => {
      const existe = prev.some((departamento) => departamento.id === valor);
      return existe
        ? prev.filter((departamento) => departamento.id !== valor)
        : [...prev, nuevo];
    });

    setIdDepartamento(valor);
  };

  const cambiarSeleccionRol = (e) => {
    setIdRol(e.target.value);
  };

  const asignarUsuarioDepartamento = async () => {
    try {
      const response = await axios.patch(
        "/api/usuarios/asignar-al-departamento",
        {
          idUsuario,
          idDepartamento,
        }
      );

      const usuarioActualizado = response.data.usuario;

      setTodosUsuarios((usuarios = []) => {
        return usuarios.map((u) =>
          u.id === usuarioActualizado.id ? usuarioActualizado : u
        );
      });

      abrirMensaje(response.data.message);
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
      const response = await axios.patch(
        "/api/usuarios/cambiar-al-departamento",
        {
          idUsuario,
          idDepartamento,
        }
      );

      const usuarioActualizado = response.data.usuario;

      setTodosUsuarios((usuarios = []) => {
        return usuarios.map((u) =>
          u.id === usuarioActualizado.id ? usuarioActualizado : u
        );
      });

      abrirMensaje(response.data.message);
      ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
    } catch (error) {
      abrirMensaje(
        error?.response?.data?.message || "Error al cambiar departamento"
      );
      ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
    }
  };

  const cambiarUsuarioRol = async () => {
    try {
      const response = await axios.patch("/api/usuarios/cambiar-rol", {
        idUsuario,
        idRol,
      });

      const usuarioActualizado = response.data.usuario;

      setTodosUsuarios((usuarios = []) => {
        return usuarios.map((u) =>
          u.id === usuarioActualizado.id ? usuarioActualizado : u
        );
      });

      abrirMensaje(response.data.message);
      ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
    } catch (error) {
      abrirMensaje(error?.response?.data?.message || "Error, al cambiar rol");
      ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
    }
  };

  const eliminarRestaurarUsuario = async () => {
    try {
      const response = await axios.patch(
        `/api/usuarios/${!estado ? "eliminar" : "restaurar"}-usuario`,
        {
          idUsuario,
          estado,
        }
      );

      const usuarioActualizado = response.data.usuario;

      setTodosUsuarios((usuarios = []) => {
        return usuarios.map((u) =>
          u.id === usuarioActualizado.id ? usuarioActualizado : u
        );
      });

      abrirMensaje(response.data.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 },
        { accion: () => setEstado(null), tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      abrirMensaje(
        error?.response?.data?.message || "Error, al cambiar estado"
      );
      ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
    }
  };

  const cambiarUsuarioAcceso = async () => {
    try {
      const response = await axios.patch("/api/usuarios/cambiar-acceso", {
        idUsuario: idUsuario,
        validado: validado,
      });

      const usuarioActualizado = response.data.usuario;

      setTodosUsuarios((usuarios = []) => {
        return usuarios.map((u) =>
          u.id === usuarioActualizado.id ? usuarioActualizado : u
        );
      });

      abrirMensaje(response.data.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 },
        { accion: () => setEstado(null), tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      abrirMensaje(
        error?.response?.data?.message || "Error, al cambiar acceso"
      );
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
      case "cambiarEstado":
        return eliminarRestaurarUsuario;
      case "cambiarAutorizacion":
        return cambiarUsuarioAcceso;
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
      case "cambiarEstado":
        return estado
          ? "¿Habilitar este usuario?"
          : "¿Inhabilitar este usuario?";
      case "cambiarAutorizacion":
        return validado
          ? "¿Restringir este usuario?"
          : "¿Autorizar este usuario?";
      default:
        return () => {}; // función vacía si no hay acción
    }
  };

  const crearUsuario = async () => {
    try {
      setIsLoading(true);

      const payload = {
        cedula: cedulaUsuario,
        nombre: nombreUsuario,
        apellido: apellidoUsuario,
        correo: correoUsuario,
        claveUno: claveUnoUsuario,
        claveDos: claveDosUsuario,
        id_rol: idRol,
        autorizar: autorizar,
        institucion: seleccionarInstitucion.map(({ id }) => ({ id })),
        departamento: seleccionarDepartamentos.map(({ id }) => ({ id })),
      };

      const response = await axios.post("/api/usuarios/crear-usuario", payload);
      const nuevoUsuario = response.data.usuarios; // Asegúrate de que esta sea la estructura correcta

      setTodosUsuarios((prevUsuarios) => [...prevUsuarios, nuevoUsuario]);

      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setCedulaUsuario(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setNombreUsuario(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setApellidoUsuario(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setCorreoUsuario(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setClaveUnoUsuario(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setClaveDosUsuario(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setIdRol(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setIdInstitucion(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setIdDepartamento(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setSeleccionarInstitucion([]), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setSeleccionarDepartamentos([]), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setAutorizar(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => toggleUsuarioCrearMostrar(), tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      console.log("Error, al crear el usuario: " + error);
      abrirMensaje(error?.response?.data?.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {opcion === "crear" ? (
        <Modal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={"¿Crear usuario?"}
        >
          <ModalDatosContenedor>
            <ModalDatos titulo={"Cedula"} descripcion={cedulaUsuario} />
            <ModalDatos titulo={"Nombre"} descripcion={nombreUsuario} />
            <ModalDatos titulo={"Apellido"} descripcion={apellidoUsuario} />
            <ModalDatos titulo={"Correo"} descripcion={correoUsuario} />

            {usuarioActivo.id_rol === 1 && (
              <ModalDatos
                titulo={"Institución"}
                descripcion={nombreInstitucion}
              />
            )}

            <ModalDatos
              titulo={"Departamento"}
              descripcion={nombreDepartamento}
            />
            <ModalDatos
              titulo={"Clave"}
              descripcion={claveUnoUsuario}
              indice={1}
            />
            <ModalDatos
              titulo={"Clave confirmar"}
              descripcion={claveDosUsuario}
              indice={1}
            />
          </ModalDatosContenedor>

          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

          <BotonesModal
            aceptar={crearUsuario}
            cancelar={cerrarModal}
            indiceUno={"crear"}
            indiceDos={"cancelar"}
            nombreUno={"Aceptar"}
            nombreDos={"Cancelar"}
            campos={{
              cedulaUsuario,
              nombreUsuario,
              apellidoUsuario,
              correoUsuario,
              idDepartamento,
              claveUnoUsuario,
              claveDosUsuario,
            }}
          />
        </Modal>
      ) : (
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

            {accion === "cambiarRol" && (
              <SelectOpcion
                idOpcion={idRol}
                nombre={"Cambiar a"}
                handleChange={cambiarSeleccionRol}
                opciones={todosRoles}
                seleccione="Seleccione"
                setNombre={setNombreRol}
                indice={1}
              />
            )}

            {(accion === "cambiarDepartamento" ||
              accion === "asignarDepartamento") && (
              <SelectOpcion
                idOpcion={idDepartamento}
                nombre={
                  accion === "asignarDepartamento"
                    ? "Departamentos"
                    : "Cambiar a"
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
      )}

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Representación usuarios"}>
          <div className="w-full bg-gray-100 backdrop-blur-md rounded-md shadow-xl p-4 space-y-6 border border-gray-300">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#082158]"></div>
                <span className="font-medium">Administradores</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#2FA807]"></div>
                <span className="font-medium">Directores</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#A62A69]"></div>
                <span className="font-medium">Obreros</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#E61C45]"></div>
                <span className="font-medium">Inhabilitados</span>
              </div>
            </div>
          </div>
        </DivUnoDentroSectionRegistroMostrar>

        <DivTresDentroSectionRegistroMostrar
          nombre={opcion === "crear" ? "Crear usuario" : "Todos los usuarios"}
          toggle={toggleUsuarioCrearMostrar}
          opcion={crearMostrar}
        >
          {opcion === "crear" ? (
            <div className="w-full">
              <FormCrearUsuario
                idInstitucion={idInstitucion}
                idDepartamento={idDepartamento}
                idRol={idRol}
                setIdInstitucion={setIdInstitucion}
                setIdDepartamento={setIdDepartamento}
                setIdRol={setIdRol}
                setNombreDepartamento={setNombreDepartamento}
                setNombreInstitucion={setNombreInstitucion}
                setNombreRol={setNombreRol}
                cedula={cedulaUsuario}
                setCedula={setCedulaUsuario}
                correo={correoUsuario}
                setCorreo={setCorreoUsuario}
                nombre={nombreUsuario}
                setNombre={setNombreUsuario}
                apellido={apellidoUsuario}
                setApellido={setApellidoUsuario}
                claveUno={claveUnoUsuario}
                setClaveUno={setClaveUnoUsuario}
                claveDos={claveDosUsuario}
                setClaveDos={setClaveDosUsuario}
                validarCedula={validarCedulaUsuario}
                setValidarCedula={setValidarCedulaUsuario}
                validarCorreo={validarCorreoUsuario}
                setValidarCorreo={setValidarCorreoUsuario}
                validarNombre={validarNombreUsuario}
                setValidarNombre={setValidarNombreUsuario}
                validarApellido={validarApellidoUsuario}
                setValidarApellido={setValidarApellidoUsuario}
                validarClave={validarClaveUsuario}
                setValidarClave={setValidarClaveUsuario}
                limpiarCampos={limpiarCampos}
                mostrarModal={abrirModal}
                mensaje={mensajeValidar}
                setMensaje={setMensajeValidar}
                cambiarSeleccionDepartamento={cambiarSeleccionDepartamento}
                cambiarSeleccionInstitucion={cambiarSeleccionInstitucion}
                cambiarSeleccionRol={cambiarSeleccionRol}
                departamentos={todosDepartamentos}
                instituciones={
                  todasInstituciones?.length > 0
                    ? todasInstituciones
                    : [institucionMiembro]
                }
                roles={todosRoles}
                autorizar={autorizar}
                setAutorizar={setAutorizar}
                toggleAutorizar={toggleAutorizar}
                usuarioActivo={usuarioActivo}
              />
            </div>
          ) : (
            <div className="flex flex-col w-full gap-2">
              {todosUsuarios?.length !== 0 && (
                <>
                  <div className="flex flex-col sm:flex-row gap-4 bg-[#eef1f5] p-1 mb-4 sm:p-4 rounded-md shadow-lg">
                    <Input
                      type="text"
                      placeholder="🔍 Buscar..."
                      value={searchTerm}
                      className={`bg-white ps-4 placeholder:px-5`}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setFirst(0);
                      }}
                    />

                    <OrdenarListaUsuarios
                      ordenCampo={ordenCampo}
                      setOrdenCampo={setOrdenCampo}
                      setOrdenAscendente={setOrdenAscendente}
                      ordenAscendente={ordenAscendente}
                    />
                  </div>

                  {usuarioPorPagina.map((usuario) => {
                    const departamentoActual =
                      usuario?.MiembrosDepartamentos?.[0];

                    return (
                      <div
                        key={usuario.id}
                        className={`bg-[#e2e8f0] rounded-md shadow-md border 
                              ${
                                usuario.borrado
                                  ? "border-[#E61C45] hover:bg-[#E61C45] text-[#E61C45]  hover:text-white"
                                  : usuario.id_rol === 1
                                  ? "bg-[#e2e8f0] hover:bg-gray-100 text-[#082158] border-gray-300"
                                  : usuario.id_rol === 2
                                  ? "border-[#082158] hover:bg-[#082158] text-[#082158] hover:text-white"
                                  : usuario.id_rol === 3
                                  ? "border-[#2FA807] hover:bg-[#2FA807] text-[#2FA807] hover:text-white"
                                  : usuario.id_rol === 4
                                  ? "border-[#A62A69] hover:bg-[#A62A69] text-[#A62A69] hover:text-white"
                                  : "border-gray-300 text-gray-600" // Estilo por defecto si el rol no es reconocido
                              }
                              transition-all`}
                      >
                        <button
                          onClick={() =>
                            setExpanded(
                              expanded === usuario.id ? null : usuario.id
                            )
                          }
                          className={`w-full text-left font-semibold tracking-wide uppercase p-2  sm:p-0 sm:py-2 sm:px-4 transition-colors duration-200 cursor-pointer
                          ${
                            expanded === usuario.id
                              ? "rounded-t-md mb-2 sm:mb-0 hover:text-white"
                              : "rounded-md"
                          }
                          ${
                            usuario.borrado
                              ? "border-[#E61C45] hover:bg-[#E61C45] hover:text-[white] hover:border-[#E61C45]"
                              : usuario.id_rol === 1
                              ? "bg-[#e2e8f0] hover:bg-gray-100 text-[#082158] border-gray-300"
                              : usuario.id_rol === 2
                              ? "border-[#082158] hover:bg-[#082158] hover:text-[white]"
                              : usuario.id_rol === 3
                              ? "border-[#2FA807] hover:bg-[#2FA807] hover:text-[white]"
                              : usuario.id_rol === 4
                              ? "border-[#A62A69] hover:bg-[#A62A69] hover:text-[white]"
                              : "border-gray-300 text-gray-600" // Estilo por defecto si el rol no es reconocido
                          }
                          cursor-pointer transition-colors duration-200`}
                        >
                          👤 {usuario.nombre} {usuario.apellido}
                        </button>

                        {expanded === usuario.id && (
                          <ListadoUsuarios
                            usuario={usuario}
                            departamentoActual={departamentoActual}
                            abrirModal={abrirModal}
                            setAccion={setAccion}
                            setNombreUsuario={setNombreUsuario}
                            setNombreDepartamento={setNombreDepartamento}
                            setIdDepartamento={setIdDepartamento}
                            setIdUsuario={setIdUsuario}
                            setIdRol={setIdRol}
                            setEstado={setEstado}
                            setValidado={setValidado}
                            setNombreRol={setNombreRol}
                          />
                        )}
                      </div>
                    );
                  })}

                  <div className="mt-4">
                    <Paginador
                      first={first}
                      setFirst={setFirst}
                      rows={rows}
                      setRows={setRows}
                      totalRecords={totalRecords}
                      open={open}
                      setOpen={setOpen}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </DivTresDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}
