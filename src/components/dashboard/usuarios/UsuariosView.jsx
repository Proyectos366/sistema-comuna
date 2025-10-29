"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SelectOpcion from "@/components/SelectOpcion";
import Paginador from "@/components/templates/PlantillaPaginacion";
import FormCrearUsuario from "@/components/formularios/FormCrearUsuario";
import ListadoUsuarios from "@/components/dashboard/usuarios/components/ListadoUsuarios";
import { BounceLoader } from "react-spinners";
import SectionMain from "@/components/SectionMain";
import SectionPrimary from "@/components/SectionPrimary";
import Div from "@/components/padres/Div";
import SectionTertiary from "@/components/SectionTertiary";
import ModalPrincipal from "@/components/modales/ModalPrincipal";
import ButtonToggleDetallesUsuario from "./components/ButtonToggleDetallesUsuario";
import LeyendaUsuarios from "@/components/dashboard/usuarios/components/LeyendaUsuarios";
import BuscarOrdenar from "@/components/dashboard/usuarios/components/BuscarOrdenar";
import FichaUsuario from "./components/FichaUsuario";
import { useSelector, useDispatch } from "react-redux";

import { nuevoUsuarioAbrirModal } from "@/components/dashboard/usuarios/funciones/nuevoUsuarioAbrirModal";
import { obtenerTituloAccion } from "@/components/dashboard/usuarios/funciones/obtenerTituloAccion";
import ModalUsuarios from "@/components/dashboard/usuarios/components/ModalUsuarios";
import { fetchUsuarios } from "@/store/features/usuarios/thunks/todosUsuarios";

import { abrirModal } from "@/store/features/modal/slicesModal";

export default function UsuariosView({ limpiarCampos }) {
  const dispatch = useDispatch();

  const { usuarios } = useSelector((state) => state.usuarios);

  useEffect(() => {
    dispatch(fetchUsuarios());
  }, [dispatch]);

  const [cedulaUsuario, setCedulaUsuario] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [apellidoUsuario, setApellidoUsuario] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [claveUnoUsuario, setClaveUnoUsuario] = useState("");
  const [claveDosUsuario, setClaveDosUsuario] = useState("");
  const [mensajeValidar, setMensajeValidar] = useState("");

  const [nombreInstitucion, setNombreInstitucion] = useState("");
  const [nombreDepartamento, setNombreDepartamento] = useState("");

  const [idDepartamento, setIdDepartamento] = useState("");
  const [idRol, setIdRol] = useState("");
  const [nombreRol, setNombreRol] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [idInstitucion, setIdInstitucion] = useState("");

  const [expanded, setExpanded] = useState("");
  const [accion, setAccion] = useState("");

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

  const [autorizar, setAutorizar] = useState("");

  const acciones = {
    accion,
    limpiarCampos,
    setNombreRol,
    setNombreDepartamento,
    setIdInstitucion,
    setIdDepartamento,
    setIdRol,
    setNombreInstitucion,
    setCedula: setCedulaUsuario,
    setNombre: setNombreUsuario,
    setApellido: setApellidoUsuario,
    setCorreo: setCorreoUsuario,
    setClaveUno: setClaveUnoUsuario,
    setClaveDos: setClaveDosUsuario,
    setMensaje: setMensajeValidar,
    setAutorizar,
  };

  const datosUsuario = {
    cedula: cedulaUsuario,
    nombre: nombreUsuario,
    apellido: apellidoUsuario,
    correo: correoUsuario,
    nombreInstitucion: nombreInstitucion,
    nombreDepartamento: nombreDepartamento,
    claveUno: claveUnoUsuario,
    claveDos: claveDosUsuario,
    mensaje: mensajeValidar,
    nombreRol: nombreRol,
    idUsuario: idUsuario,
    idRol: idRol,
    idDepartamento: idDepartamento,
    idInstitucion: idInstitucion,
    autorizar: autorizar,
  };

  const validaciones = {
    validarCedula: validarCedulaUsuario,
    setValidarCedula: setValidarCedulaUsuario,
    validarNombre: validarNombreUsuario,
    setValidarNombre: setValidarNombreUsuario,
    validarApellido: validarApellidoUsuario,
    setValidarApellido: setValidarApellidoUsuario,
    validarCorreo: validarCorreoUsuario,
    setValidarCorreo: setValidarCorreoUsuario,
    validarClave: validarClaveUsuario,
    setValidarClave: setValidarClaveUsuario,
  };

  return (
    <>
      <ModalUsuarios
        acciones={acciones}
        datosUsuario={datosUsuario}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionPrimary nombre={"Representación usuarios"}>
          <LeyendaUsuarios />
        </SectionPrimary>

        <SectionTertiary
          nombre={"Gestión usuarios"}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          {/* <BuscarOrdenar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setFirst={setFirst}
            ordenCampo={ordenCampo}
            setOrdenCampo={setOrdenCampo}
            ordenAscendente={ordenAscendente}
            setOrdenAscendente={setOrdenAscendente}
          /> */}

          <Div className={`flex flex-col gap-2`}>
            {usuarios?.length === 0 ? (
              <Div className="flex items-center gap-4">
                <BounceLoader color="#082158" size={50} /> Cargando usuarios...
              </Div>
            ) : (
              <>
                {usuarios.map((usuario, index) => {
                  const departamentoActual =
                    usuario?.MiembrosDepartamentos?.[0];

                  return (
                    <FichaUsuario
                      key={usuario.id}
                      usuario={usuario}
                      index={index}
                    >
                      <ButtonToggleDetallesUsuario
                        expanded={expanded}
                        usuario={usuario}
                        setExpanded={setExpanded}
                      />

                      {expanded === usuario.id && (
                        <ListadoUsuarios
                          usuario={usuario}
                          departamentoActual={departamentoActual}
                          abrirModal={abrirModal}
                          setAccion={setAccion}
                          setOpcion={setOpcion}
                          setNombreUsuario={setNombreUsuario}
                          setNombreDepartamento={setNombreDepartamento}
                          setIdDepartamento={setIdDepartamento}
                          setIdUsuario={setIdUsuario}
                          setIdRol={setIdRol}
                          setNombreRol={setNombreRol}
                        />
                      )}
                    </FichaUsuario>
                  );
                })}
              </>
            )}
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}

/** 
export default function UsuariosView({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  const dispatch = useDispatch();
  const { usuarioActivo } = useSelector((state) => state.auth);

  const { setUsuarios, isCargando, error } = useSelector(
    (state) => state.usuarios
  );

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

  const [estado, setEstado] = useState("");
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
    dispatch(fetchUsuarios());
  }, []);

  useEffect(() => {
    const fetchDatos = async () => {
      if (isLoading) return; // Evita múltiples envíos rápidos
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatos();
  }, []);

  useEffect(() => {
    if (!mostrar) {
      setAccion("");
      setOpcion("");
      setCedulaUsuario("");
      setNombreUsuario("");
      setApellidoUsuario("");
      setCorreoUsuario("");
      setClaveUnoUsuario("");
      setClaveDosUsuario("");
      setIdRol("");
      setIdInstitucion("");
      setIdDepartamento("");
      setAutorizar("");
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

  const eliminarRestaurarUsuario = async (estatus, usuarioId) => {
    try {
      const response = await axios.patch(
        `/api/usuarios/${!estatus ? "eliminar" : "restaurar"}-usuario`,
        {
          id_usuario: usuarioId,
          estado: estatus,
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
        { accion: () => setEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      abrirMensaje(
        error?.response?.data?.message || "Error, al cambiar estado"
      );
      ejecutarAccionesConRetraso([{ accion: cerrarModal, tiempo: 3000 }]);
    }
  };

  const cambiarUsuarioAcceso = async (valido, usuarioId) => {
    try {
      const response = await axios.patch("/api/usuarios/cambiar-acceso", {
        idUsuario: usuarioId,
        validado: valido,
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
        { accion: () => setEstado(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
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
      case "nuevoUsuario":
        return "¿Crear usuario?";
      default:
        return () => {}; // función vacía si no hay acción
    }
  };

  useEffect(() => {
    dispatch(fetchUsuarios());
  }, []);

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

  const nuevoUsuario = () => {
    setAccion("nuevoUsuario");
    setOpcion("nuevoUsuario");
    abrirModal();
  };

  const aceptarCrearUsuario = () => {
    setAccion("crear");
    setOpcion("crear");
    abrirModal();
  };

  const cancelarCrearUsuario = () => {
    setAccion("nuevoUsuario");
    setOpcion("nuevoUsuario");
  };

  return (
    <>
      {opcion === "crear" && (
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
            cancelar={cancelarCrearUsuario}
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
      )}

      {opcion === "editar" && (
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

      {opcion === "nuevoUsuario" && (
        <ModalPrincipal
          isVisible={mostrar}
          onClose={cerrarModal}
          titulo={obtenerTituloAccion()}
        >
          <ModalDatosContenedor>
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
              mostrarModal={aceptarCrearUsuario}
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
          </ModalDatosContenedor>
        </ModalPrincipal>
      )}

      <SectionMain>
        <SectionPrimary nombre={"Representación usuarios"}>
          <LeyendaUsuarios />
        </SectionPrimary>

        <SectionTertiary nombre={"Gestión usuarios"} funcion={nuevoUsuario}>
          <BuscarOrdenar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setFirst={setFirst}
            ordenCampo={ordenCampo}
            setOrdenCampo={setOrdenCampo}
            ordenAscendente={ordenAscendente}
            setOrdenAscendente={setOrdenAscendente}
          />

          <Div className={`flex flex-col gap-2`}>
            {todosUsuarios?.length === 0 ? (
              <Div className="flex items-center gap-4">
                <BounceLoader color="#082158" size={50} /> Cargando usuarios...
              </Div>
            ) : (
              <>
                {usuarioPorPagina.map((usuario, index) => {
                  const departamentoActual =
                    usuario?.MiembrosDepartamentos?.[0];

                  return (
                    <FichaUsuario
                      key={usuario.id}
                      usuario={usuario}
                      index={index}
                    >
                      <ButtonToggleDetallesUsuario
                        expanded={expanded}
                        usuario={usuario}
                        setExpanded={setExpanded}
                      />

                      {expanded === usuario.id && (
                        <ListadoUsuarios
                          usuario={usuario}
                          departamentoActual={departamentoActual}
                          abrirModal={abrirModal}
                          setAccion={setAccion}
                          setOpcion={setOpcion}
                          setNombreUsuario={setNombreUsuario}
                          setNombreDepartamento={setNombreDepartamento}
                          setIdDepartamento={setIdDepartamento}
                          setIdUsuario={setIdUsuario}
                          setIdRol={setIdRol}
                          setNombreRol={setNombreRol}
                          cambiarUsuarioAcceso={cambiarUsuarioAcceso}
                          eliminarRestaurarUsuario={eliminarRestaurarUsuario}
                        />
                      )}
                    </FichaUsuario>
                  );
                })}
              </>
            )}
          </Div>

          <Div>
            <Paginador
              first={first}
              setFirst={setFirst}
              rows={rows}
              setRows={setRows}
              totalRecords={totalRecords}
              open={open}
              setOpen={setOpen}
            />
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
*/
