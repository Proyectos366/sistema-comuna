"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import Modal from "../Modal";
import ModalDatos from "../ModalDatos";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import BotonesModal from "../BotonesModal";
import ModalDatosContenedor from "../ModalDatosContenedor";
import Boton from "../Boton";
import { calcularEdadPorFechaNacimiento, formatearFecha } from "@/utils/Fechas";
import InputDate from "../InputDate";
import SelectOpcion from "../SelectOpcion";
import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
import Paginador from "../templates/PlantillaPaginacion";
import Input from "../inputs/Input";
import OrdenarLista from "../listados/Ordenar";
import EstadisticasParticipantes from "../EstadisticasParticipantes";
import { formatearCedula } from "@/utils/formatearCedula";
import ListaDetallesVocero from "../listados/ListaDetalleVocero";
import { formatearTelefono } from "@/utils/formatearTelefono";
import Titulos from "../Titulos";

export default function ParticipantesForm({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [abierto, setAbierto] = useState("");
  const [abiertoEntidad, setAbiertoEntidad] = useState({});

  const [abiertoLista, setAbiertoLista] = useState(false);

  const [fechaAprobacionModulo, setFechaAprobacionModulo] = useState("");
  const [idModulo, setIdModulo] = useState("");

  const [datosActualizar, setDatosActualizar] = useState([]); // Estado solo para fecha
  const [datosVerificar, setDatosVerificar] = useState([]);
  const [datosCertificar, setDatosCertificar] = useState([]);
  const [estadoUsuarios, setEstadoUsuarios] = useState({});

  const [idFormador, setIdFormador] = useState("");
  const [formadores, setFormadores] = useState([]);
  const [nombreFormador, setNombreFormador] = useState("");

  const [datos, setDatos] = useState([]);

  const inputRefs = useRef({});

  const [opciones, setOpciones] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);

  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const [cantidadModulos, setCantidadModulos] = useState(0);

  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    setIsLoading(true);
    const fetchDatos = async () => {
      try {
        const [cursosRes, formadoresRes] = await Promise.all([
          axios.get("/api/cursos/todos-cursos"),
          axios.get("/api/usuarios/todos-usuarios-nombres"),
        ]);

        setCursos(cursosRes.data.cursos || []);
        setFormadores(formadoresRes.data.usuarios || []);
      } catch (error) {
        console.log("Error, al obtener datos: " + error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatos();
  }, []);

  useEffect(() => {
    const nuevoEstadoUsuarios = {};

    cursos.forEach((curso) => {
      // Contamos cuántos módulos de asistencia tiene cada usuario
      const totalAsistencias = curso.asistencias.length;

      setCantidadModulos(totalAsistencias);

      // Verificamos si al menos una asistencia tiene `presente === false`
      const tieneAsistenciasPendientes = curso.asistencias.some(
        (asistencia) => !asistencia.presente
      );

      const estaVerificado = curso.verificado; //curso.some((item) => item.verificado);

      // Guardamos `false` en `puedeCertificar` si hay asistencias sin aprobar
      nuevoEstadoUsuarios[curso.id] = {
        totalAsistencias,
        puedeVerificar: !tieneAsistenciasPendientes,
        puedeCertificar: !tieneAsistenciasPendientes && curso.verificado,
        estaVerificado: estaVerificado,
      };
    });

    setEstadoUsuarios(nuevoEstadoUsuarios);
  }, [cursos]); // Se ejecuta cada vez que `cursos` cambia

  const registrosFiltrados = useMemo(() => {
    if (!searchTerm) return cursos;

    const lower = searchTerm.toLowerCase();
    return cursos?.filter((registro) =>
      Object.values(registro).some((valorPrincipal) => {
        if (
          typeof valorPrincipal === "string" ||
          typeof valorPrincipal === "number"
        ) {
          return String(valorPrincipal).toLowerCase().includes(lower);
        }

        if (typeof valorPrincipal === "boolean") {
          return (valorPrincipal ? "sí" : "no").includes(lower);
        }

        if (typeof valorPrincipal === "object" && valorPrincipal !== null) {
          if (
            valorPrincipal.nombre &&
            String(valorPrincipal.nombre).toLowerCase().includes(lower)
          )
            return true;

          if (Array.isArray(valorPrincipal)) {
            return valorPrincipal.some((item) =>
              Object.values(item).some((subValor) => {
                if (
                  typeof subValor === "string" ||
                  typeof subValor === "number"
                ) {
                  return String(subValor).toLowerCase().includes(lower);
                }
                if (typeof subValor === "boolean") {
                  return (subValor ? "sí" : "no").includes(lower);
                }
                if (
                  typeof subValor === "object" &&
                  subValor !== null &&
                  subValor.nombre
                ) {
                  return String(subValor.nombre).toLowerCase().includes(lower);
                }
                return false;
              })
            );
          } else {
            // Para objetos no arreglos
            return Object.values(valorPrincipal).some((subValor) => {
              if (
                typeof subValor === "string" ||
                typeof subValor === "number"
              ) {
                return String(subValor).toLowerCase().includes(lower);
              }
              if (typeof subValor === "boolean") {
                return (subValor ? "sí" : "no").includes(lower);
              }
              if (
                typeof subValor === "object" &&
                subValor !== null &&
                subValor.nombre
              ) {
                return String(subValor.nombre).toLowerCase().includes(lower);
              }
              return false;
            });
          }
        }

        return false;
      })
    );
  }, [cursos, searchTerm]);

  const ordenarRegistros = (lista, campo, asc) => {
    const listaClonada = [...lista];

    listaClonada.sort((a, b) => {
      const voceroA = a.voceros;
      const voceroB = b.voceros;

      if (!voceroA || !voceroB) return 0;

      const valorA = obtenerCampoAnidado(voceroA, campo);
      const valorB = obtenerCampoAnidado(voceroB, campo);

      if (typeof valorA === "string") {
        return asc
          ? valorA?.localeCompare(valorB)
          : valorB?.localeCompare(valorA);
      } else {
        return asc ? valorA - valorB : valorB - valorA;
      }
    });

    return listaClonada;
  };

  const aliasCampo = {
    comuna: "comunas",
    consejo: "consejos",
    parroquia: "parroquias",
    verificado: "verificado",
    certificado: "certificado",
  };

  const obtenerCampoAnidado = (vocero, campo) => {
    const clave = aliasCampo[campo] || campo;

    const objeto = vocero[clave];

    if (!objeto) return undefined;

    if (typeof objeto === "object" && objeto !== null && "nombre" in objeto) {
      return objeto.nombre;
    }

    return objeto;
  };

  const registrosOrdenados = ordenarRegistros(
    registrosFiltrados,
    ordenCampo,
    ordenAscendente
  );

  const vocerosPagina = registrosOrdenados?.slice(first, first + rows);
  const totalRecords = registrosFiltrados?.length;

  const handleContainerClick = (idAsistencia) => {
    const targetInput = inputRefs.current[idAsistencia];
    if (targetInput && !targetInput.disabled) {
      targetInput.showPicker?.();
      targetInput.focus();
    }
  };

  const actualizarFechaModulo = (moduloId, fecha, asistenciaId) => {
    setDatosActualizar({
      modulo: moduloId,
      fecha: fecha,
      id_asistencia: asistenciaId,
    });

    setFechaAprobacionModulo((prev) => ({
      ...prev,
      [moduloId]: fecha, // Guarda solo la fecha del módulo seleccionado
    }));
  };

  const toggleExpand = (cursoId) => {
    setExpanded((prev) => (prev === cursoId ? {} : cursoId));
  };

  const validarModulo = async () => {
    try {
      // Enviar actualización a la API
      const response = await axios.patch(
        `/api/asistencias/actualizar-asistencia`,
        {
          modulo: datosActualizar.modulo,
          fecha: `${datosActualizar.fecha}T00:00:00Z`, // Asegurar formato ISO
          id_asistencia: datosActualizar.id_asistencia,
          nombreFormador: nombreFormador,
        }
      );
      setCursos((prevCursos) =>
        prevCursos.map((curso) =>
          curso.id === response.data.curso.id // Encuentra el curso afectado
            ? {
                ...curso,
                asistencias: response.data.curso.asistencias, // Solo actualiza asistencias
                formaciones: response.data.curso.formaciones, // También actualiza los módulos y formación
              }
            : curso
        )
      );
      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setIdModulo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setFechaAprobacionModulo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setDatosActualizar([]), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setDatos([]), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setIdFormador(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setNombreFormador(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      console.log("Error, al validar modulo: " + error);
      abrirMensaje(error?.response?.data?.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    }
  };

  const verificarParticipante = async () => {
    try {
      const response = await axios.patch(`/api/cursos/verificar-curso`, {
        id_curso: datosVerificar.id,
        id_vocero: datosVerificar.id_vocero,
      });

      setCursos((prevCursos) =>
        prevCursos.map((curso) =>
          curso.id === response.data.curso.id
            ? {
                ...curso,
                asistencias: response.data.curso.asistencias,
                formaciones: response.data.curso.formaciones,
                verificado: true, // Aquí se marca como verificado
              }
            : curso
        )
      );
      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      console.log("Error, verificar participante: " + error);
      abrirMensaje(error?.response?.data?.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    }
  };

  const certificarParticipante = async (id_curso, id_vocero) => {
    try {
      // Enviar actualización a la API
      const response = await axios.patch(`/api/cursos/certificar-curso`, {
        id_curso: datosCertificar.id,
        id_vocero: datosCertificar.id_vocero,
      });
      setCursos((prevCursos) =>
        prevCursos.map((curso) =>
          curso.id === response.data.curso.id
            ? {
                ...curso,
                asistencias: response.data.curso.asistencias,
                formaciones: response.data.curso.formaciones,
                verificado: true, // Aquí se marca como verificado
                certificado: true,
                culminado: true,
                fecha_completado: true,
              }
            : curso
        )
      );
      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      console.log("Error, verificar participante: " + error);
      abrirMensaje(error?.response?.data?.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    }
  };

  const cambiarSeleccionFormador = (e) => {
    const valor = e.target.value;
    setIdFormador(valor);
  };

  if (!Array.isArray(cursos) || cursos.length === 0) {
    return (
      <>
        {isLoading ? (
          <div className="w-full p-4 rounded-md shadow-lg text-center h-full flex items-center justify-center">
            <p className="text-center text-gray-600 border px-20 py-10 rounded-md font-semibold text-2xl">
              Cargando participantes...
            </p>
          </div>
        ) : (
          <div className="w-full p-4 rounded-md shadow-lg text-center h-full flex items-center justify-center">
            <p className="text-red-600 font-semibold bg-white border px-20 py-10 rounded-md text-2xl ">
              No hay participantes disponibles.
            </p>
          </div>
        )}
      </>
    );
  }

  const camposSiExisten =
    opciones === "modulo" ? { idFormador, nombreFormador } : {};

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  function agruparPorCampo(registros, campo) {
    let registrosFiltrados = registros;

    if (campo === "comuna") {
      registrosFiltrados = registros.filter((item) => {
        const vocero = item?.voceros;
        const tieneComuna = vocero?.comunas?.nombre;
        const consejo = vocero?.consejos;
        return (
          tieneComuna &&
          (consejo === undefined || consejo === null || consejo === "")
        );
      });
    }

    if (campo === "consejo") {
      registrosFiltrados = registros.filter((item) => {
        const consejoNombre = item?.voceros?.consejos?.nombre;
        return typeof consejoNombre === "string" && consejoNombre.trim() !== "";
      });
    }

    return registrosFiltrados.reduce((acc, item) => {
      let clave;

      switch (campo) {
        case "comuna":
          clave = item?.voceros?.comunas?.nombre || "Sin comuna";
          break;

        case "consejo":
          clave = item?.voceros?.consejos?.nombre || "Sin consejo";
          break;

        case "parroquia":
          clave = item?.voceros?.parroquias?.nombre || "Sin parroquia";
          break;

        case "verificado":
          clave = !item.verificado ? "No Verificado" : "Verificado";
          break;

        case "certificado":
          clave = !item.certificado ? "No Certificado" : "Certificado";
          break;

        default:
          const matchModulo = campo.match(/^modulo(\d+)$/);
          if (matchModulo) {
            const index = parseInt(matchModulo[1], 10);
            clave = item.asistencias?.[index - 1]?.presente
              ? `Módulo ${index} aprobado`
              : `Falta Módulo ${index}`;
          } else {
            clave = item[campo] || "Sin información";
          }
          break;
      }

      if (!acc[clave]) acc[clave] = [];
      acc[clave].push(item);
      return acc;
    }, {});
  }

  const grupos = agruparPorCampo(vocerosPagina, ordenCampo);

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={
          opciones === "modulo"
            ? "¿Aprobar este módulo?"
            : opciones === "verificado"
            ? "¿Verificar este participante?"
            : opciones === "certificado"
            ? "¿Certificar este participante?"
            : "Acción no definida"
        }
      >
        <ModalDatosContenedor>
          {opciones === "modulo" && (
            <>
              <ModalDatos titulo="Modulo" descripcion={idModulo} />
              <ModalDatos
                titulo="Fecha aprobado"
                descripcion={formatearFecha(
                  fechaAprobacionModulo[idModulo] + "T00:00:00Z"
                )}
              />
              <SelectOpcion
                idOpcion={idFormador}
                nombre="Formador"
                handleChange={cambiarSeleccionFormador}
                opciones={formadores}
                seleccione="Seleccione"
                setNombre={setNombreFormador}
                setDatos={setDatos}
                indice={1}
              />
            </>
          )}

          {opciones === "verificado" && (
            <>
              <div className="-mt-5 border-l-4 border-red-500 bg-green-100 p-2 shadow-sm rounded-md mb-2">
                <h2 className="text-red-700 font-bold text-md sm:text-lg mb-1">
                  ⚠️ Aviso importante
                </h2>
                <p className="text-red-600 text-xs sm:text-sm text-justify">
                  Revise cuidadosamente todos los datos.{" "}
                  <strong>Una vez verificados, no se podrán modificar.</strong>
                </p>
              </div>
              <ModalDatos
                titulo={"Cédula"}
                descripcion={datosVerificar.voceros.cedula}
              />
              <ModalDatos
                titulo={"Edad"}
                descripcion={datosVerificar.voceros.edad}
              />
              <ModalDatos
                titulo={"Primer nombre"}
                descripcion={datosVerificar.voceros.nombre}
              />
              <ModalDatos
                titulo={"Segundo nombre"}
                descripcion={datosVerificar.voceros.nombre_dos}
              />

              <ModalDatos
                titulo={"Primer apellido"}
                descripcion={datosVerificar.voceros.apellido}
              />
              <ModalDatos
                titulo={"Segundo apellido"}
                descripcion={datosVerificar.voceros.apellido_dos}
              />

              <ModalDatos
                titulo={"Género"}
                descripcion={
                  datosVerificar.voceros.genero ? "Masculino" : "Femenino"
                }
              />
              <ModalDatos
                titulo={"Correo"}
                descripcion={datosVerificar.voceros.correo}
              />

              <ModalDatos
                titulo={"Teléfono"}
                descripcion={datosVerificar.voceros.telefono}
              />

              <ModalDatos
                titulo={"Comuna"}
                descripcion={datosVerificar.voceros.comunas.nombre}
              />

              <ModalDatos
                titulo={"Formación"}
                descripcion={datosVerificar.formaciones.nombre}
              />
            </>
          )}

          {opciones === "certificado" && (
            <>
              {" "}
              <div className="-mt-4 border-l-4 border-red-500 bg-green-100 p-2 shadow-sm rounded-md">
                <h2 className="text-red-700 font-bold text-lg mb-1">
                  ⚠️ Aviso importante
                </h2>
                <p className="text-red-600 text-sm text-justify">
                  Revise cuidadosamente todos los datos.{" "}
                  <strong>Solo se podra certificar 1 vez por formación.</strong>
                </p>
              </div>
              <ModalDatos
                titulo={"Cédula"}
                descripcion={datosCertificar.voceros.cedula}
              />
              <ModalDatos
                titulo={"Nombres"}
                descripcion={`${datosCertificar.voceros.nombre} ${datosCertificar.voceros.nombre_dos}`}
              />
              <ModalDatos
                titulo={"Apellidos"}
                descripcion={`${datosCertificar.voceros.apellido} ${datosCertificar.voceros.apellido_dos}`}
              />
              <ModalDatos
                titulo={"Comuna"}
                descripcion={datosCertificar.voceros.comunas.nombre}
              />
              <ModalDatos
                titulo={"Formación"}
                descripcion={datosCertificar.formaciones.nombre}
              />
            </>
          )}
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

        <BotonesModal
          aceptar={() => {
            switch (opciones) {
              case "modulo":
                return validarModulo();
              case "verificado":
                return verificarParticipante();
              case "certificado":
                return certificarParticipante();
              default:
                return null;
            }
          }}
          cancelar={cerrarModal}
          indiceUno="aceptar"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={camposSiExisten}
        />
      </Modal>

      <SectionRegistroMostrar>
        {cursos?.length > 0 ? (
          <>
            <DivUnoDentroSectionRegistroMostrar
              nombre={"Certificar participantes"}
            >
              <div className="w-full flex flex-col sm:flex-row gap-4 bg-[#eef1f5] p-1 sm:p-4 mb-4 rounded-md shadow-md">
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

                <OrdenarLista
                  ordenCampo={ordenCampo}
                  setOrdenCampo={setOrdenCampo}
                  setOrdenAscendente={setOrdenAscendente}
                  ordenAscendente={ordenAscendente}
                  cantidadModulos={cantidadModulos}
                />
              </div>

              {vocerosPagina?.length === 0 && searchTerm !== "" ? (
                <div className="w-full p-4 bg-white rounded-md text-center text-[#E61C45] font-semibold shadow-md border border-[#E61C45]">
                  No se encontraron voceros que coincidan con la búsqueda.
                </div>
              ) : (
                <div className={`w-full flex flex-col gap-4`}>
                  {Object.entries(grupos).map(([titulo, lista]) => (
                    <div
                      key={titulo}
                      className="w-full flex flex-col gap-4 border border-gray-300 hover:border-[#082158] p-1 sm:p-4 rounded-md bg-[#f4f6f9] shadow-md"
                    >
                      {titulo !== "Sin información" && (
                        <Titulos
                          indice={2}
                          titulo={titulo}
                          className={`uppercase text-xl`}
                        />
                      )}

                      <div
                        className={`overflow-y-auto max-h-[1000px] no-scrollbar flex flex-col gap-4 ${
                          titulo !== "Sin información" ? "-mt-5" : ""
                        }`}
                      >
                        {lista.map((curso, index) => {
                          const usuario = estadoUsuarios[curso.id] || {};

                          return (
                            <div
                              key={curso.id}
                              className={`bg-[#eef1f5] rounded-md shadow-md border 
                              ${
                                !curso.verificado
                                  ? !usuario.puedeVerificar
                                    ? "bg-[#e2e8f0] hover:bg-gray-100 text-[#082158] border-gray-300"
                                    : "border-[#082158] text-[#082158] " // "color-fondo text-white"
                                  : !curso.certificado
                                  ? "border-[#E61C45] hover:bg-[#E61C45] text-[black] hover:border-[#E61C45]" //"bg-[#E61C45] text-white"
                                  : "border-[#2FA807] hover:bg-[#2FA807] text-[black] hover:border-[#2FA807] " //: "bg-[#2FA807] hover:bg-[#15EA0E] text-white"
                              }
                              transition-all`}
                            >
                              <button
                                onClick={() => toggleExpand(curso.id)}
                                className={`w-full text-left font-semibold tracking-wide uppercase p-2  sm:p-0 sm:py-2 sm:px-4 ${
                                  expanded === curso.id
                                    ? "rounded-t-md mb-2 sm:mb-0"
                                    : "rounded-md"
                                }
                                cursor-pointer transition-colors duration-200
                                ${
                                  !curso.verificado
                                    ? !usuario.puedeVerificar
                                      ? "bg-[#e2e8f0] hover:bg-[#d3dce6] text-[#082158]"
                                      : "border-[#082158] text-[#082158] hover:bg-[#082158] hover:text-white"
                                    : !curso.certificado
                                    ? expanded === curso.id
                                      ? "border-[#E61C45] text-[black] hover:bg-[#E61C45] hover:text-white"
                                      : "text-[#E61C45] hover:text-white"
                                    : expanded === curso.id
                                    ? "border-[#2FA807] text-[black] hover:bg-[#2FA807] hover:text-white"
                                    : "text-[#2FA807] hover:text-white"
                                }`}
                              >
                                {curso.voceros.nombre}{" "}
                                {curso.voceros.nombre_dos
                                  ? curso.voceros.nombre_dos
                                  : ""}{" "}
                                {curso.voceros.apellido}{" "}
                                {curso.voceros.apellido_dos
                                  ? curso.voceros.apellido_dos
                                  : ""}
                              </button>

                              {expanded === curso.id && (
                                <div className=" p-2 sm:p-0 sm:px-4 -mt-4 sm:mt-0 bg-gray-100 rounded-md w-full">
                                  <ListaDetallesVocero
                                    nombre={"Cedula"}
                                    valor={formatearCedula(
                                      curso.voceros.cedula
                                    )}
                                    indice={1}
                                  />

                                  <ListaDetallesVocero
                                    nombre={"Edad"}
                                    valor={calcularEdadPorFechaNacimiento(
                                      curso.voceros.f_n
                                    )}
                                    indice={1}
                                  />

                                  <ListaDetallesVocero
                                    nombre={"Genero"}
                                    valor={
                                      curso.voceros.genero
                                        ? "MASCULINO"
                                        : "FEMENINO"
                                    }
                                    indice={1}
                                  />

                                  <ListaDetallesVocero
                                    nombre={"Correo"}
                                    valor={curso.voceros.correo}
                                    indice={1}
                                  />

                                  <ListaDetallesVocero
                                    nombre={"Telefono"}
                                    valor={formatearTelefono(
                                      curso.voceros.telefono
                                    )}
                                    indice={1}
                                  />

                                  <ListaDetallesVocero
                                    nombre={"Comuna"}
                                    valor={
                                      curso.voceros.comunas?.nombre ||
                                      "No asignada"
                                    }
                                    indice={1}
                                  />

                                  <ListaDetallesVocero
                                    nombre={"Consejo comunal"}
                                    valor={
                                      curso.voceros.consejos?.nombre ||
                                      "No asignado"
                                    }
                                    indice={1}
                                  />

                                  <ListaDetallesVocero
                                    nombre={"Formación"}
                                    valor={curso.formaciones.nombre}
                                    indice={1}
                                  />

                                  <div
                                    className={`border ${
                                      !curso.verificado
                                        ? !usuario.puedeVerificar
                                          ? " text-black border-gray-400"
                                          : "borde-fondo"
                                        : !curso.certificado
                                        ? "border-[#E61C45]"
                                        : "border-[#2FA807]"
                                    } rounded-md shadow-md p-2 mt-2`}
                                  >
                                    <p className="font-semibold">
                                      Módulos (asistencias):
                                    </p>

                                    <div className="flex flex-col space-y-2">
                                      {curso.asistencias.map((asistencia) => {
                                        return (
                                          <div
                                            key={asistencia.id_modulo}
                                            className="flex flex-wrap justify-between items-center gap-3 mt-1"
                                          >
                                            <div
                                              className={`flex-1 text-sm sm:text-lg py-2  text-center uppercase border ${
                                                asistencia.presente
                                                  ? "border-[#2FA807]"
                                                  : "border-gray-300"
                                              }  rounded-md shadow-sm min-w-0`}
                                            >
                                              {curso.formaciones.modulos.find(
                                                (m) =>
                                                  m.id === asistencia.id_modulo
                                              )?.nombre || "Módulo desconocido"}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                              {asistencia.presente ? (
                                                <div className="w-full text-sm sm:text-lg py-2 text-center uppercase border border-[#2FA807] rounded-md shadow-sm">
                                                  {formatearFecha(
                                                    asistencia.fecha_registro
                                                  )}
                                                </div>
                                              ) : (
                                                <div
                                                  onClick={() =>
                                                    handleContainerClick(
                                                      asistencia.id
                                                    )
                                                  }
                                                  className="w-full cursor-pointer"
                                                >
                                                  <InputDate
                                                    ref={(el) => {
                                                      if (el)
                                                        inputRefs.current[
                                                          asistencia.id
                                                        ] = el;
                                                    }}
                                                    max={
                                                      new Date()
                                                        .toISOString()
                                                        .split("T")[0]
                                                    }
                                                    type="date"
                                                    disabled={
                                                      asistencia.presente
                                                    }
                                                    value={
                                                      fechaAprobacionModulo[
                                                        asistencia.id_modulo
                                                      ] || ""
                                                    }
                                                    onChange={(e) =>
                                                      actualizarFechaModulo(
                                                        asistencia.id_modulo,
                                                        e.target.value,
                                                        asistencia.id
                                                      )
                                                    }
                                                    className="w-full cursor-pointer"
                                                  />
                                                </div>
                                              )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                              {asistencia.presente ? (
                                                <div className="w-full text-sm sm:text-lg py-2 text-center uppercase border border-[#2FA807] rounded-md shadow-sm">
                                                  Aprobado
                                                </div>
                                              ) : (
                                                <Boton
                                                  nombre={"Aprobar"}
                                                  disabled={
                                                    !fechaAprobacionModulo[
                                                      asistencia.id_modulo
                                                    ] || asistencia.presente
                                                  }
                                                  onClick={() => {
                                                    setOpciones("modulo");
                                                    abrirModal();
                                                    setIdModulo(
                                                      asistencia.id_modulo
                                                    );
                                                  }}
                                                  className={`w-full py-2 ${
                                                    !fechaAprobacionModulo[
                                                      asistencia.id_modulo
                                                    ]
                                                      ? "bg-gray-400 text-black"
                                                      : "cursor-pointer color-fondo hover:bg-blue-700 text-white py-[9px]"
                                                  }`}
                                                />
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="mt-4 flex gap-4 pb-4">
                                    <Boton
                                      title={
                                        !usuario.puedeVerificar
                                          ? "Para verificar primero debe validar todos los modulos"
                                          : !usuario.estaVerificado
                                          ? "Puede verificar"
                                          : "Ya esta verificado"
                                      }
                                      nombre={
                                        usuario.estaVerificado
                                          ? "Verificado"
                                          : "Verificar"
                                      }
                                      disabled={
                                        !usuario.puedeVerificar ||
                                        usuario.estaVerificado
                                      }
                                      onClick={() => {
                                        setOpciones("verificado");
                                        abrirModal();
                                        setDatosVerificar(curso);
                                      }}
                                      className={`py-2 ${
                                        !usuario.puedeVerificar
                                          ? "bg-gray-400 hover:bg-GRAY-300 text-black"
                                          : usuario.estaVerificado
                                          ? "bg-[#2FA807] text-white"
                                          : "color-fondo hover:bg-blue-700 text-white"
                                      }`}
                                    />

                                    <Boton
                                      title={
                                        !usuario.puedeCertificar
                                          ? "Para certificar primero debe estar verificado"
                                          : usuario.estaVerificado
                                          ? "Puede certificar"
                                          : "Ya esta certificado"
                                      }
                                      nombre={
                                        curso.culminado
                                          ? "Certificado"
                                          : "Certificar"
                                      }
                                      disabled={
                                        curso.culminado
                                          ? true
                                          : !usuario.puedeCertificar
                                      }
                                      onClick={() => {
                                        setOpciones("certificado");
                                        abrirModal();
                                        setDatosCertificar(curso);
                                      }}
                                      className={`py-2 ${
                                        usuario.puedeCertificar
                                          ? curso.culminado
                                            ? "bg-[#2FA807] text-white"
                                            : "color-fondo hover:bg-blue-700 text-white"
                                          : !usuario.puedeCertificar
                                          ? "cursor-not-allowed bg-gray-400 text-black"
                                          : "cursor-pointer color-fondo hover:bg-blue-700 text-white"
                                      }`}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={`${abiertoLista ? "mb-40" : "mb-0"} w-full mt-4`}>
                <Paginador
                  first={first}
                  setFirst={setFirst}
                  rows={rows}
                  setRows={setRows}
                  totalRecords={totalRecords}
                  setOpen={setAbiertoLista}
                />
              </div>
            </DivUnoDentroSectionRegistroMostrar>

            <DivDosDentroSectionRegistroMostrar>
              <div className="">
                <EstadisticasParticipantes
                  registrosFiltrados={registrosFiltrados}
                  abierto={abierto}
                  setAbierto={setAbierto}
                  abiertoEntidad={abiertoEntidad}
                  setAbiertoEntidad={setAbiertoEntidad}
                />
              </div>
            </DivDosDentroSectionRegistroMostrar>
          </>
        ) : (
          <DivUnoDentroSectionRegistroMostrar
            nombre={"No hay formaciones activas..."}
          ></DivUnoDentroSectionRegistroMostrar>
        )}
      </SectionRegistroMostrar>
    </>
  );
}

// "use client";

// import { useState, useEffect, useRef, useMemo } from "react";
// import axios from "axios";
// import Modal from "../Modal";
// import ModalDatos from "../ModalDatos";
// import SectionRegistroMostrar from "../SectionRegistroMostrar";
// import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
// import MostarMsjEnModal from "../MostrarMsjEnModal";
// import BotonesModal from "../BotonesModal";
// import ModalDatosContenedor from "../ModalDatosContenedor";
// import Boton from "../Boton";
// import { formatearFecha } from "@/utils/Fechas";
// import InputDate from "../InputDate";
// import SelectOpcion from "../SelectOpcion";
// import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
// import Paginador from "../templates/PlantillaPaginacion";
// import Input from "../inputs/Input";
// import OrdenarLista from "../listados/Ordenar";
// import EstadisticasParticipantes from "../EstadisticasParticipantes";
// import { formatearCedula } from "@/utils/formatearCedula";

// export default function ParticipantesForm({
//   mostrar,
//   abrirModal,
//   cerrarModal,
//   mensaje,
//   mostrarMensaje,
//   abrirMensaje,
//   limpiarCampos,
//   ejecutarAccionesConRetraso,
// }) {
//   const [cursos, setCursos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [expanded, setExpanded] = useState({});
//   const [abierto, setAbierto] = useState("");
//   const [abiertoEntidad, setAbiertoEntidad] = useState({});

//   const [abiertoLista, setAbiertoLista] = useState(false);

//   const [fechaAprobacionModulo, setFechaAprobacionModulo] = useState("");
//   const [idModulo, setIdModulo] = useState("");

//   const [datosActualizar, setDatosActualizar] = useState([]); // Estado solo para fecha
//   const [datosVerificar, setDatosVerificar] = useState([]);
//   const [datosCertificar, setDatosCertificar] = useState([]);
//   const [estadoUsuarios, setEstadoUsuarios] = useState({});

//   const [idFormador, setIdFormador] = useState("");
//   const [formadores, setFormadores] = useState([]);
//   const [nombreFormador, setNombreFormador] = useState("");

//   const [datos, setDatos] = useState([]);

//   const inputRefs = useRef({});

//   const [opciones, setOpciones] = useState("");

//   const [searchTerm, setSearchTerm] = useState("");
//   const [first, setFirst] = useState(0);
//   const [rows, setRows] = useState(5);

//   const [ordenCampo, setOrdenCampo] = useState("nombre");
//   const [ordenAscendente, setOrdenAscendente] = useState(true);

//   useEffect(() => {
//     const fetchDatos = async () => {
//       try {
//         const [cursosRes, formadoresRes] = await Promise.all([
//           axios.get("/api/cursos/todos-cursos"),
//           axios.get("/api/usuarios/todos-usuarios"),
//         ]);

//         //console.log(formadoresRes.data.todosUsuarios);

//         setCursos(cursosRes.data.cursos || []);
//         setFormadores(formadoresRes.data.todosUsuarios || []);
//       } catch (error) {
//         console.log("Error, al obtener datos: " + error);
//       }
//     };

//     fetchDatos();
//   }, []);

//   useEffect(() => {
//     const nuevoEstadoUsuarios = {};

//     cursos.forEach((curso) => {
//       // Contamos cuántos módulos de asistencia tiene cada usuario
//       const totalAsistencias = curso.asistencias.length;

//       // Verificamos si al menos una asistencia tiene `presente === false`
//       const tieneAsistenciasPendientes = curso.asistencias.some(
//         (asistencia) => !asistencia.presente
//       );

//       const estaVerificado = curso.verificado; //curso.some((item) => item.verificado);

//       // Guardamos `false` en `puedeCertificar` si hay asistencias sin aprobar
//       nuevoEstadoUsuarios[curso.id] = {
//         totalAsistencias,
//         puedeVerificar: !tieneAsistenciasPendientes,
//         puedeCertificar: !tieneAsistenciasPendientes && curso.verificado,
//         estaVerificado: estaVerificado,
//       };
//     });

//     setEstadoUsuarios(nuevoEstadoUsuarios);
//   }, [cursos]); // Se ejecuta cada vez que `cursos` cambia

//   const registrosFiltrados = useMemo(() => {
//     if (!searchTerm) return cursos;

//     const lower = searchTerm.toLowerCase();
//     return cursos?.filter((registro) =>
//       Object.values(registro).some((valorPrincipal) => {
//         if (
//           typeof valorPrincipal === "string" ||
//           typeof valorPrincipal === "number"
//         ) {
//           return String(valorPrincipal).toLowerCase().includes(lower);
//         }

//         if (typeof valorPrincipal === "boolean") {
//           return (valorPrincipal ? "sí" : "no").includes(lower);
//         }

//         if (typeof valorPrincipal === "object" && valorPrincipal !== null) {
//           if (
//             valorPrincipal.nombre &&
//             String(valorPrincipal.nombre).toLowerCase().includes(lower)
//           )
//             return true;

//           if (Array.isArray(valorPrincipal)) {
//             return valorPrincipal.some((item) =>
//               Object.values(item).some((subValor) => {
//                 if (
//                   typeof subValor === "string" ||
//                   typeof subValor === "number"
//                 ) {
//                   return String(subValor).toLowerCase().includes(lower);
//                 }
//                 if (typeof subValor === "boolean") {
//                   return (subValor ? "sí" : "no").includes(lower);
//                 }
//                 if (
//                   typeof subValor === "object" &&
//                   subValor !== null &&
//                   subValor.nombre
//                 ) {
//                   return String(subValor.nombre).toLowerCase().includes(lower);
//                 }
//                 return false;
//               })
//             );
//           } else {
//             // Para objetos no arreglos
//             return Object.values(valorPrincipal).some((subValor) => {
//               if (
//                 typeof subValor === "string" ||
//                 typeof subValor === "number"
//               ) {
//                 return String(subValor).toLowerCase().includes(lower);
//               }
//               if (typeof subValor === "boolean") {
//                 return (subValor ? "sí" : "no").includes(lower);
//               }
//               if (
//                 typeof subValor === "object" &&
//                 subValor !== null &&
//                 subValor.nombre
//               ) {
//                 return String(subValor.nombre).toLowerCase().includes(lower);
//               }
//               return false;
//             });
//           }
//         }

//         return false;
//       })
//     );
//   }, [cursos, searchTerm]);

//   const ordenarRegistros = (lista, campo, asc) => {
//     const listaClonada = [...lista];

//     listaClonada.sort((a, b) => {
//       const voceroA = a.voceros;
//       const voceroB = b.voceros;

//       if (!voceroA || !voceroB) return 0;

//       const valorA = obtenerCampoAnidado(voceroA, campo);
//       const valorB = obtenerCampoAnidado(voceroB, campo);

//       if (typeof valorA === "string") {
//         return asc
//           ? valorA?.localeCompare(valorB)
//           : valorB?.localeCompare(valorA);
//       } else {
//         return asc ? valorA - valorB : valorB - valorA;
//       }
//     });

//     return listaClonada;
//   };

//   const aliasCampo = {
//     comuna: "comunas",
//     consejo: "consejos",
//     parroquia: "parroquias",
//   };

//   const obtenerCampoAnidado = (vocero, campo) => {
//     const clave = aliasCampo[campo] || campo;
//     const objeto = vocero[clave];

//     if (!objeto) return undefined;

//     if (typeof objeto === "object" && objeto !== null && "nombre" in objeto) {
//       return objeto.nombre;
//     }

//     return objeto;
//   };

//   const registrosOrdenados = ordenarRegistros(
//     registrosFiltrados,
//     ordenCampo,
//     ordenAscendente
//   );

//   const vocerosPagina = registrosOrdenados?.slice(first, first + rows);
//   const totalRecords = registrosFiltrados?.length;

//   const handleContainerClick = (idAsistencia) => {
//     const targetInput = inputRefs.current[idAsistencia];
//     if (targetInput && !targetInput.disabled) {
//       targetInput.showPicker?.();
//       targetInput.focus();
//     }
//   };

//   const actualizarFechaModulo = (moduloId, fecha, asistenciaId) => {
//     setDatosActualizar({
//       modulo: moduloId,
//       fecha: fecha,
//       id_asistencia: asistenciaId,
//     });

//     setFechaAprobacionModulo((prev) => ({
//       ...prev,
//       [moduloId]: fecha, // Guarda solo la fecha del módulo seleccionado
//     }));
//   };

//   const toggleExpand = (cursoId) => {
//     setExpanded((prev) => (prev === cursoId ? {} : cursoId));
//   };

//   const validarModulo = async () => {
//     try {
//       // Enviar actualización a la API
//       const response = await axios.patch(
//         `/api/asistencias/actualizar-asistencia`,
//         {
//           modulo: datosActualizar.modulo,
//           fecha: `${datosActualizar.fecha}T00:00:00Z`, // Asegurar formato ISO
//           id_asistencia: datosActualizar.id_asistencia,
//           nombreFormador: nombreFormador,
//         }
//       );
//       setCursos((prevCursos) =>
//         prevCursos.map((curso) =>
//           curso.id === response.data.curso.id // Encuentra el curso afectado
//             ? {
//                 ...curso,
//                 asistencias: response.data.curso.asistencias, // Solo actualiza asistencias
//                 formaciones: response.data.curso.formaciones, // También actualiza los módulos y formación
//               }
//             : curso
//         )
//       );
//       abrirMensaje(response.data.message);

//       ejecutarAccionesConRetraso([
//         { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
//         { accion: () => setIdModulo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//         { accion: () => setFechaAprobacionModulo(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//         { accion: () => setDatosActualizar([]), tiempo: 3000 }, // Se ejecutará en 3 segundos
//         { accion: () => setDatos([]), tiempo: 3000 }, // Se ejecutará en 3 segundos
//         { accion: () => setIdFormador(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//         { accion: () => setNombreFormador(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
//       ]);
//     } catch (error) {
//       console.log("Error, al validar modulo: " + error);
//       abrirMensaje(error?.response?.data?.message);
//       ejecutarAccionesConRetraso([
//         { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
//       ]);
//     }
//   };

//   const verificarParticipante = async () => {
//     try {
//       const response = await axios.patch(`/api/cursos/verificar-curso`, {
//         id_curso: datosVerificar.id,
//         id_vocero: datosVerificar.id_vocero,
//       });

//       setCursos((prevCursos) =>
//         prevCursos.map((curso) =>
//           curso.id === response.data.curso.id
//             ? {
//                 ...curso,
//                 asistencias: response.data.curso.asistencias,
//                 formaciones: response.data.curso.formaciones,
//                 verificado: true, // Aquí se marca como verificado
//               }
//             : curso
//         )
//       );
//       abrirMensaje(response.data.message);

//       ejecutarAccionesConRetraso([
//         { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
//       ]);
//     } catch (error) {
//       console.log("Error, verificar participante: " + error);
//       abrirMensaje(error?.response?.data?.message);
//       ejecutarAccionesConRetraso([
//         { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
//       ]);
//     }
//   };

//   const certificarParticipante = async (id_curso, id_vocero) => {
//     try {
//       // Enviar actualización a la API
//       const response = await axios.patch(`/api/cursos/certificar-curso`, {
//         id_curso: datosCertificar.id,
//         id_vocero: datosCertificar.id_vocero,
//       });
//       setCursos((prevCursos) =>
//         prevCursos.map((curso) =>
//           curso.id === response.data.curso.id
//             ? {
//                 ...curso,
//                 asistencias: response.data.curso.asistencias,
//                 formaciones: response.data.curso.formaciones,
//                 verificado: true, // Aquí se marca como verificado
//                 certificado: true,
//                 culminado: true,
//                 fecha_completado: true,
//               }
//             : curso
//         )
//       );
//       abrirMensaje(response.data.message);

//       ejecutarAccionesConRetraso([
//         { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
//       ]);
//     } catch (error) {
//       console.log("Error, verificar participante: " + error);
//       abrirMensaje(error?.response?.data?.message);
//       ejecutarAccionesConRetraso([
//         { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
//       ]);
//     }
//   };

//   const cambiarSeleccionFormador = (e) => {
//     const valor = e.target.value;
//     setIdFormador(valor);
//   };

//   if (!Array.isArray(cursos) || cursos.length === 0) {
//     return (
//       <div className="w-full bg-white p-4 rounded-md shadow-lg text-center">
//         <p className="text-red-600 font-semibold">
//           No hay voceros disponibles.
//         </p>
//       </div>
//     );
//   }

//   const camposSiExisten =
//     opciones === "modulo" ? { idFormador, nombreFormador } : {};

//   if (loading) return <p>Cargando...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <>
//       <Modal
//         isVisible={mostrar}
//         onClose={cerrarModal}
//         titulo={
//           opciones === "modulo"
//             ? "¿Aprobar este módulo?"
//             : opciones === "verificado"
//             ? "¿Verificar este participante?"
//             : opciones === "certificado"
//             ? "¿Certificar este participante?"
//             : "Acción no definida"
//         }
//       >
//         <ModalDatosContenedor>
//           {opciones === "modulo" && (
//             <>
//               <ModalDatos titulo="Modulo" descripcion={idModulo} />
//               <ModalDatos
//                 titulo="Fecha aprobado"
//                 descripcion={formatearFecha(
//                   fechaAprobacionModulo[idModulo] + "T00:00:00Z"
//                 )}
//               />
//               <SelectOpcion
//                 idOpcion={idFormador}
//                 nombre="Formador"
//                 handleChange={cambiarSeleccionFormador}
//                 opciones={formadores}
//                 seleccione="Seleccione"
//                 setNombre={setNombreFormador}
//                 setDatos={setDatos}
//                 indice={1}
//               />
//             </>
//           )}

//           {opciones === "verificado" && (
//             <>
//               <div className="-mt-5 border-l-4 border-red-500 bg-green-100 p-2 shadow-sm rounded-md mb-2">
//                 <h2 className="text-red-700 font-bold text-md sm:text-lg mb-1">
//                   ⚠️ Aviso importante
//                 </h2>
//                 <p className="text-red-600 text-xs sm:text-sm text-justify">
//                   Revise cuidadosamente todos los datos.{" "}
//                   <strong>Una vez verificados, no se podrán modificar.</strong>
//                 </p>
//               </div>
//               <ModalDatos
//                 titulo={"Cédula"}
//                 descripcion={datosVerificar.voceros.cedula}
//               />
//               <ModalDatos
//                 titulo={"Edad"}
//                 descripcion={datosVerificar.voceros.edad}
//               />
//               <ModalDatos
//                 titulo={"Primer nombre"}
//                 descripcion={datosVerificar.voceros.nombre}
//               />
//               <ModalDatos
//                 titulo={"Segundo nombre"}
//                 descripcion={datosVerificar.voceros.nombre_dos}
//               />

//               <ModalDatos
//                 titulo={"Primer apellido"}
//                 descripcion={datosVerificar.voceros.apellido}
//               />
//               <ModalDatos
//                 titulo={"Segundo apellido"}
//                 descripcion={datosVerificar.voceros.apellido_dos}
//               />

//               <ModalDatos
//                 titulo={"Género"}
//                 descripcion={
//                   datosVerificar.voceros.genero ? "Masculino" : "Femenino"
//                 }
//               />
//               <ModalDatos
//                 titulo={"Correo"}
//                 descripcion={datosVerificar.voceros.correo}
//               />

//               <ModalDatos
//                 titulo={"Teléfono"}
//                 descripcion={datosVerificar.voceros.telefono}
//               />

//               <ModalDatos
//                 titulo={"Comuna"}
//                 descripcion={datosVerificar.voceros.comunas.nombre}
//               />

//               <ModalDatos
//                 titulo={"Formación"}
//                 descripcion={datosVerificar.formaciones.nombre}
//               />
//             </>
//           )}

//           {opciones === "certificado" && (
//             <>
//               {" "}
//               <div className="-mt-4 border-l-4 border-red-500 bg-green-100 p-2 shadow-sm rounded-md">
//                 <h2 className="text-red-700 font-bold text-lg mb-1">
//                   ⚠️ Aviso importante
//                 </h2>
//                 <p className="text-red-600 text-sm text-justify">
//                   Revise cuidadosamente todos los datos.{" "}
//                   <strong>Solo se podra certificar 1 vez por formación.</strong>
//                 </p>
//               </div>
//               <ModalDatos
//                 titulo={"Cédula"}
//                 descripcion={datosCertificar.voceros.cedula}
//               />
//               <ModalDatos
//                 titulo={"Nombres"}
//                 descripcion={`${datosCertificar.voceros.nombre} ${datosCertificar.voceros.nombre_dos}`}
//               />
//               <ModalDatos
//                 titulo={"Apellidos"}
//                 descripcion={`${datosCertificar.voceros.apellido} ${datosCertificar.voceros.apellido_dos}`}
//               />
//               <ModalDatos
//                 titulo={"Comuna"}
//                 descripcion={datosCertificar.voceros.comunas.nombre}
//               />
//               <ModalDatos
//                 titulo={"Formación"}
//                 descripcion={datosCertificar.formaciones.nombre}
//               />
//             </>
//           )}
//         </ModalDatosContenedor>

//         <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

//         <BotonesModal
//           aceptar={() => {
//             switch (opciones) {
//               case "modulo":
//                 return validarModulo();
//               case "verificado":
//                 return verificarParticipante();
//               case "certificado":
//                 return certificarParticipante();
//               default:
//                 return null;
//             }
//           }}
//           cancelar={cerrarModal}
//           indiceUno="aceptar"
//           indiceDos="cancelar"
//           nombreUno="Aceptar"
//           nombreDos="Cancelar"
//           campos={camposSiExisten}
//         />
//       </Modal>

//       <SectionRegistroMostrar>
//         {cursos?.length > 0 ? (
//           <>
//             <DivUnoDentroSectionRegistroMostrar
//               nombre={"Certificar participantes"}
//             >
//               <div className="w-full flex flex-col sm:flex-row gap-4 bg-[#eef1f5] p-1 sm:p-4 mb-4 rounded-md shadow-md">
//                 <Input
//                   type="text"
//                   placeholder="🔍 Buscar..."
//                   value={searchTerm}
//                   className={`bg-white ps-4 placeholder:px-5`}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setFirst(0);
//                   }}
//                 />

//                 <OrdenarLista
//                   ordenCampo={ordenCampo}
//                   setOrdenCampo={setOrdenCampo}
//                   setOrdenAscendente={setOrdenAscendente}
//                   ordenAscendente={ordenAscendente}
//                 />
//               </div>

//               {vocerosPagina?.length === 0 && searchTerm !== "" ? (
//                 <div className="p-4 bg-white rounded-lg text-center text-red-600 font-semibold shadow-md">
//                   No se encontraron voceros que coincidan con la búsqueda.
//                 </div>
//               ) : (
//                 <>
//                   <div className="w-full flex flex-col gap-4 border border-gray-300 hover:border-[#082158] p-1 sm:p-4 rounded-md bg-[#f4f6f9] shadow-md">
//                     <div className="flex flex-col gap-3">
//                       {vocerosPagina?.map((curso, index) => {
//                         const usuario = estadoUsuarios[curso.id] || {};

//                         return (
//                           <div
//                             key={curso.id}
//                             className="bg-[#eef1f5] rounded-md shadow-md border border-gray-300 transition-all"
//                           >
//                             <button
//                               onClick={() => toggleExpand(curso.id)}
//                               className={`${
//                                 !curso.verificado
//                                   ? !usuario.puedeVerificar
//                                     ? "bg-[#e2e8f0] hover:bg-[#d3dce6] text-[#082158]"
//                                     : "color-fondo text-white"
//                                   : !curso.certificado
//                                   ? "border-red-600 bg-red-600 text-white"
//                                   : "bg-green-500 hover:bg-green-600 text-white"
//                               } w-full text-left font-semibold tracking-wide uppercase px-6 py-2 rounded-md cursor-pointer transition-colors duration-200`}
//                             >
//                               {curso.voceros.nombre}{" "}
//                               {curso.voceros.nombre_dos
//                                 ? curso.voceros.nombre_dos
//                                 : ""}
//                               {curso.voceros.apellido}{" "}
//                               {curso.voceros.apellido_dos
//                                 ? curso.voceros.apellido_dos
//                                 : ""}
//                             </button>

//                             {expanded === curso.id && (
//                               <div className="mt-4 p-2 sm:p-4 bg-gray-100 rounded-md w-full">
//                                 <div className="">
//                                   <b>Cédula: </b>
//                                   <span>
//                                     {formatearCedula(curso.voceros.cedula)}
//                                   </span>
//                                 </div>
//                                 <p className="">
//                                   <strong>Comuna: </strong>
//                                   {curso.voceros.comunas?.nombre ||
//                                     "No asignada"}
//                                 </p>
//                                 <p className="">
//                                   <strong>Correo: </strong>
//                                   {curso.voceros.correo}
//                                 </p>
//                                 <p className="">
//                                   <strong>Formación: </strong>
//                                   {curso.formaciones.nombre}
//                                 </p>

//                                 <div
//                                   className={`border ${
//                                     !curso.verificado
//                                       ? !usuario.puedeVerificar
//                                         ? " text-black border-gray-400"
//                                         : "borde-fondo"
//                                       : !curso.certificado
//                                       ? "border-red-600"
//                                       : "border-green-600"
//                                   } rounded-md shadow-md p-2 mt-2`}
//                                 >
//                                   <p className="font-semibold">
//                                     Módulos (asistencias):
//                                   </p>
//                                   <div className="flex flex-col space-y-2">
//                                     {curso.asistencias.map((asistencia) => {
//                                       return (
//                                         <div
//                                           key={asistencia.id_modulo}
//                                           className="flex flex-wrap justify-between items-center gap-3 mt-1"
//                                         >
//                                           <div
//                                             className={`flex-1 text-sm sm:text-lg py-[6px]  text-center uppercase border ${
//                                               asistencia.presente
//                                                 ? "border-green-600"
//                                                 : "border-gray-300"
//                                             }  rounded-md shadow-sm min-w-0`}
//                                           >
//                                             {curso.formaciones.modulos.find(
//                                               (m) =>
//                                                 m.id === asistencia.id_modulo
//                                             )?.nombre || "Módulo desconocido"}
//                                           </div>

//                                           <div className="flex-1 min-w-0">
//                                             {asistencia.presente ? (
//                                               <div className="w-full text-sm sm:text-lg py-2 text-center uppercase border border-green-600 rounded-md shadow-sm">
//                                                 {formatearFecha(
//                                                   asistencia.fecha_registro
//                                                 )}
//                                               </div>
//                                             ) : (
//                                               <div
//                                                 onClick={() =>
//                                                   handleContainerClick(
//                                                     asistencia.id
//                                                   )
//                                                 }
//                                                 className="w-full cursor-pointer"
//                                               >
//                                                 <InputDate
//                                                   ref={(el) => {
//                                                     if (el)
//                                                       inputRefs.current[
//                                                         asistencia.id
//                                                       ] = el;
//                                                   }}
//                                                   max={
//                                                     new Date()
//                                                       .toISOString()
//                                                       .split("T")[0]
//                                                   }
//                                                   type="date"
//                                                   disabled={asistencia.presente}
//                                                   value={
//                                                     fechaAprobacionModulo[
//                                                       asistencia.id_modulo
//                                                     ] || ""
//                                                   }
//                                                   onChange={(e) =>
//                                                     actualizarFechaModulo(
//                                                       asistencia.id_modulo,
//                                                       e.target.value,
//                                                       asistencia.id
//                                                     )
//                                                   }
//                                                   className="w-full cursor-pointer"
//                                                 />
//                                               </div>
//                                             )}
//                                           </div>

//                                           <div className="flex-1 min-w-0">
//                                             {asistencia.presente ? (
//                                               <div className="w-full text-sm sm:text-lg py-2 text-center uppercase border border-green-600 rounded-md shadow-sm">
//                                                 Aprobado
//                                               </div>
//                                             ) : (
//                                               <Boton
//                                                 nombre={"Aprobar"}
//                                                 disabled={
//                                                   !fechaAprobacionModulo[
//                                                     asistencia.id_modulo
//                                                   ] || asistencia.presente
//                                                 }
//                                                 onClick={() => {
//                                                   setOpciones("modulo");
//                                                   abrirModal();
//                                                   setIdModulo(
//                                                     asistencia.id_modulo
//                                                   );
//                                                 }}
//                                                 className={`w-full py-2 ${
//                                                   !fechaAprobacionModulo[
//                                                     asistencia.id_modulo
//                                                   ]
//                                                     ? "bg-gray-400 text-black"
//                                                     : "cursor-pointer color-fondo hover:bg-blue-700 text-white py-[9px]"
//                                                 }`}
//                                               />
//                                             )}
//                                           </div>
//                                         </div>
//                                       );
//                                     })}
//                                   </div>
//                                 </div>

//                                 <div className="mt-4 flex gap-4">
//                                   <Boton
//                                     title={
//                                       !usuario.puedeVerificar
//                                         ? "Para verificar primero debe validar todos los modulos"
//                                         : !usuario.estaVerificado
//                                         ? "Puede verificar"
//                                         : "Ya esta verificado"
//                                     }
//                                     nombre={
//                                       usuario.estaVerificado
//                                         ? "Verificado"
//                                         : "Verificar"
//                                     }
//                                     disabled={
//                                       !usuario.puedeVerificar ||
//                                       usuario.estaVerificado
//                                     }
//                                     onClick={() => {
//                                       setOpciones("verificado");
//                                       abrirModal();
//                                       setDatosVerificar(curso);
//                                     }}
//                                     className={`py-2 ${
//                                       !usuario.puedeVerificar
//                                         ? "bg-gray-400 hover:bg-GRAY-300 text-black"
//                                         : usuario.estaVerificado
//                                         ? "bg-green-600 text-white"
//                                         : "color-fondo hover:bg-blue-700 text-white"
//                                     }`}
//                                   />

//                                   <Boton
//                                     title={
//                                       !usuario.puedeCertificar
//                                         ? "Para certificar primero debe estar verificado"
//                                         : usuario.estaVerificado
//                                         ? "Puede certificar"
//                                         : "Ya esta certificado"
//                                     }
//                                     nombre={
//                                       curso.culminado
//                                         ? "Certificado"
//                                         : "Certificar"
//                                     }
//                                     disabled={
//                                       curso.culminado
//                                         ? true
//                                         : !usuario.puedeCertificar
//                                     }
//                                     onClick={() => {
//                                       setOpciones("certificado");
//                                       abrirModal();
//                                       setDatosCertificar(curso);
//                                     }}
//                                     className={`py-2 ${
//                                       usuario.puedeCertificar
//                                         ? curso.culminado
//                                           ? "bg-green-600 text-white"
//                                           : "color-fondo hover:bg-blue-700 text-white"
//                                         : !usuario.puedeCertificar
//                                         ? "cursor-not-allowed bg-gray-400 text-black"
//                                         : "cursor-pointer color-fondo hover:bg-blue-700 text-white"
//                                     }`}
//                                   />
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </>
//               )}

//               <div className={`${abiertoLista ? "mb-40" : "mb-0"} w-full mt-4`}>
//                 <Paginador
//                   first={first}
//                   setFirst={setFirst}
//                   rows={rows}
//                   setRows={setRows}
//                   totalRecords={totalRecords}
//                   abierto={abiertoLista}
//                   setAbierto={setAbiertoLista}
//                 />
//               </div>
//             </DivUnoDentroSectionRegistroMostrar>

//             <DivDosDentroSectionRegistroMostrar>
//               <div className="">
//                 <EstadisticasParticipantes
//                   registrosFiltrados={registrosFiltrados}
//                   abierto={abierto}
//                   setAbierto={setAbierto}
//                   abiertoEntidad={abiertoEntidad}
//                   setAbiertoEntidad={setAbiertoEntidad}
//                 />
//               </div>
//             </DivDosDentroSectionRegistroMostrar>
//           </>
//         ) : (
//           <DivUnoDentroSectionRegistroMostrar
//             nombre={"No hay formaciones activas..."}
//           ></DivUnoDentroSectionRegistroMostrar>
//         )}
//       </SectionRegistroMostrar>
//     </>
//   );
// }

/**
 const totalParticipantes = registrosFiltrados.length;

  const totalHombres = registrosFiltrados.filter((registro) => {
    const vocero = registro.voceros;
    return vocero?.genero === true;
  }).length;

  const totalMujeres = registrosFiltrados.filter((registro) => {
    const vocero = registro.voceros;
    return vocero?.genero === false;
  }).length;

  const totalAdultosMayoresHombres = registrosFiltrados.filter((registro) => {
    const vocero = registro.voceros;
    return vocero?.genero === true && vocero?.edad >= 60;
  }).length;

  const totalAdultosMayoresMujeres = registrosFiltrados.filter((registro) => {
    const vocero = registro.voceros;
    return vocero?.genero === false && vocero?.edad >= 55;
  }).length;

  const totalCertificados = registrosFiltrados.filter(
    (registro) => registro.certificado === true
  ).length;

  const totalVerificados = registrosFiltrados.filter(
    (registro) => registro.verificado === true
  ).length;

  const participantesPorParroquia = registrosFiltrados.reduce(
    (acc, registro) => {
      const parroquia = registro.voceros?.parroquias?.nombre || "Sin parroquia";
      acc[parroquia] = (acc[parroquia] || 0) + 1;
      return acc;
    },
    {}
  );

  const participantesPorComuna = registrosFiltrados.reduce((acc, registro) => {
    const comuna = registro.voceros?.comunas?.nombre || "Sin comuna";
    acc[comuna] = (acc[comuna] || 0) + 1;
    return acc;
  }, {});

  const participantesPorConsejo = registrosFiltrados.reduce((acc, registro) => {
    const consejo = registro.voceros?.consejos?.nombre || "Sin consejo";
    acc[consejo] = (acc[consejo] || 0) + 1;
    return acc;
  }, {});

  const participantesPorGenero = registrosFiltrados.reduce((acc, registro) => {
    const genero =
      registro.voceros?.genero === true
        ? "Hombre"
        : registro.voceros?.genero === false
        ? "Mujer"
        : "Sin especificar";
    acc[genero] = (acc[genero] || 0) + 1;
    return acc;
  }, {});

  const participantesPorEdad = registrosFiltrados.reduce((acc, registro) => {
    const edad = registro.voceros?.edad;

    let grupo = "Sin edad";
    if (edad >= 60) grupo = "Adulto mayor";
    else if (edad >= 30) grupo = "Adulto";
    else if (edad >= 18) grupo = "Joven";

    acc[grupo] = (acc[grupo] || 0) + 1;
    return acc;
  }, {});

  const estadisticaPorFormador = registrosFiltrados.reduce((acc, registro) => {
    registro.asistencias?.forEach((asistencia) => {
      const nombre = asistencia.formador || "Sin formador";
      const modulo = asistencia.id_modulo || "Sin módulo";
      const fecha = asistencia.fecha_registro || "Sin fecha";
      const presente = asistencia.presente || false;

      if (!acc[nombre]) {
        acc[nombre] = {
          totalAsistencias: 0,
          modulos: new Set(),
          fechasPorModulo: {},
          presentes: 0,
        };
      }

      acc[nombre].totalAsistencias += 1;
      acc[nombre].modulos.add(modulo);

      if (!acc[nombre].fechasPorModulo[modulo]) {
        acc[nombre].fechasPorModulo[modulo] = new Set();
      }
      acc[nombre].fechasPorModulo[modulo].add(fecha);

      if (presente) acc[nombre].presentes += 1;
    });
    return acc;
  }, {});
 */
