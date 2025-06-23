"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "../Modal";
import ModalDatos from "../ModalDatos";
import SectionRegistroMostrar from "../SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "../DivUnoDentroSectionRegistroMostrar";
import DivDosDentroSectionRegistroMostrar from "../DivDosDentroSectionRegistroMostrar";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import BotonesModal from "../BotonesModal";
import FormCrearParroquia from "../formularios/FormCrearParroquia";
import ListadoGenaral from "../ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";
import Input from "../Input";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Boton from "../Boton";
import { formatearFecha } from "@/utils/Fechas";
import InputDate from "../InputDate";

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

  const [fechaAprobacionModulo, setFechaAprobacionModulo] = useState("");
  const [idModulo, setIdModulo] = useState("");

  const [datosActualizar, setDatosActualizar] = useState([]); // Estado solo para fecha
  const [datosVerificar, setDatosVerificar] = useState([]);
  const [datosCertificar, setDatosCertificar] = useState([]);
  const [estadoUsuarios, setEstadoUsuarios] = useState({});

  const inputRefs = useRef({});

  const [opciones, setOpciones] = useState("");

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/cursos/todos-cursos");
        setCursos(response.data.cursos);
      } catch (error) {
        console.log("Error al consultar cursos: " + error);
        setError("Error al obtener los cursos");
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  useEffect(() => {
    const nuevoEstadoUsuarios = {};

    cursos.forEach((curso) => {
      // Contamos cuántos módulos de asistencia tiene cada usuario
      const totalAsistencias = curso.asistencias.length;

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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

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
          indiceUno="crear"
          indiceDos="cancelar"
          nombreUno="Aceptar"
          nombreDos="Cancelar"
          campos={{}}
        />
      </Modal>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Certificar participantes"}>
          {cursos.map((curso, index) => {
            const usuario = estadoUsuarios[curso.id] || {};

            return (
              <div
                key={curso.id}
                className={`border ${
                  !curso.verificado
                    ? !usuario.puedeVerificar
                      ? "border-gray-300"
                      : ""
                    : !curso.certificado
                    ? "border-green-500"
                    : "border-red-500"
                } rounded-md shadow-md p-1 sm:p-4 mb-4`}
              >
                <div className="flex justify-between items-center space-x-5">
                  <div className="w-2/3">
                    <div className="">
                      <b>Cédula: </b>
                      <span>{curso.voceros.cedula}</span>
                    </div>

                    <div className="">
                      <b>Nombre: </b>
                      <span>
                        {curso.voceros.nombre} {curso.voceros.nombre_dos + " "}
                        {curso.voceros.apellido} {curso.voceros.apellido_dos}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(curso.id)}
                    className={`border w-1/3 ${
                      !curso.verificado
                        ? !usuario.puedeVerificar
                          ? "bg-gray-300 text-black border-gray-400"
                          : "color-fondo text-white "
                        : !curso.certificado
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-red-500 bg-red-500 text-white"
                    } cursor-pointer rounded-md shadow-md p-2 hover:font-semibold transition-transform transform hover:scale-105`}
                  >
                    {expanded === curso.id
                      ? "▲ Ocultar detalles"
                      : "▼ Mostrar detalles"}
                  </button>
                </div>

                {expanded === curso.id && (
                  <div className="mt-4 p-2 sm:p-4 bg-gray-100 rounded-md">
                    <p className="">
                      <strong>Comuna: </strong>
                      {curso.voceros.comunas?.nombre || "No asignada"}
                    </p>
                    <p className="">
                      <strong>Correo: </strong>
                      {curso.voceros.correo}
                    </p>
                    <p className="">
                      <strong>Formación: </strong>
                      {curso.formaciones.nombre}
                    </p>

                    <div
                      className={`border ${
                        !curso.verificado
                          ? !usuario.puedeVerificar
                            ? " text-black border-gray-400"
                            : "borde-fondo"
                          : !curso.certificado
                          ? "border-green-500"
                          : "border-red-500"
                      } rounded-md shadow-md p-2 mt-2`}
                    >
                      <p className="font-semibold">Módulos (asistencias):</p>
                      <div className="flex flex-col space-y-2">
                        {curso.asistencias.map((asistencia) => {
                          return (
                            <div
                              key={asistencia.id_modulo}
                              className="flex flex-wrap justify-between items-center gap-3 mt-1"
                            >
                              <div className="flex-1 text-sm sm:text-lg py-[6px]  text-center uppercase border border-gray-300 rounded-md shadow-sm min-w-0">
                                {curso.formaciones.modulos.find(
                                  (m) => m.id === asistencia.id_modulo
                                )?.nombre || "Módulo desconocido"}
                              </div>

                              <div className="flex-1 min-w-0">
                                {asistencia.presente ? (
                                  <div className="w-full text-sm sm:text-lg py-2 text-center uppercase border border-gray-400 rounded-md shadow-sm">
                                    {formatearFecha(asistencia.fecha_registro)}
                                  </div>
                                ) : (
                                  <div
                                    onClick={() =>
                                      handleContainerClick(asistencia.id)
                                    }
                                    className="w-full cursor-pointer"
                                  >
                                    <InputDate
                                      ref={(el) => {
                                        if (el)
                                          inputRefs.current[asistencia.id] = el;
                                      }}
                                      max={
                                        new Date().toISOString().split("T")[0]
                                      }
                                      type="date"
                                      disabled={asistencia.presente}
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
                                  <div className="w-full text-sm sm:text-lg py-2 text-center uppercase border border-red-600 rounded-md shadow-sm">
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
                                      setIdModulo(asistencia.id_modulo);
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

                    <div className="mt-4 flex gap-4">
                      <Boton
                        title={
                          !usuario.puedeVerificar
                            ? "Para verificar primero debe validar todos los modulos"
                            : !usuario.estaVerificado
                            ? "Puede verificar"
                            : "Ya esta verificado"
                        }
                        nombre={
                          usuario.estaVerificado ? "Verificado" : "Verificar"
                        }
                        disabled={
                          !usuario.puedeVerificar || usuario.estaVerificado
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
                            ? "bg-red-600 hover:bg-red-700 text-white"
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
                        nombre={curso.culminado ? "Certificado" : "Certificar"}
                        disabled={
                          curso.culminado ? true : !usuario.puedeCertificar
                        }
                        onClick={() => {
                          setOpciones("certificado");
                          abrirModal();
                          setDatosCertificar(curso);
                        }}
                        className={`py-2 ${
                          usuario.puedeCertificar
                            ? curso.culminado
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
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
        </DivUnoDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}

/**
 {vocero.cursos.map((curso, index) => {
  const usuario = estadoUsuarios[curso.id] || {};

  return (
    <div
      key={curso.id}
      className={`border ${
        !curso.verificado
          ? !usuario.puedeVerificar
            ? "border-gray-300"
            : ""
          : !curso.certificado
          ? "border-green-500"
          : "border-red-500"
      } rounded-md shadow-md p-1 sm:p-4 mb-4`}
    >
      
      <p className="text-lg font-semibold">
        Formación: {curso.formaciones?.nombre || "Sin formación asignada"}
      </p>

      <p className="text-sm text-gray-600">
        Asistencias registradas: {curso.asistencias?.length || 0}
      </p>
    </div>
  );
})}
 */


















/**
 <div className="mt-2 border rounded-md p-2">
            <p className="font-semibold">Módulos:</p>
            <div className="flex flex-col">
              {cursos.formaciones?.modulos?.map((modulo) => {
                // Verificar si el módulo ha sido aprobado en asistencias
                const aprobado = modulo.asistencias?.some(
                  (asistencia) => asistencia.presente
                );

                return (
                  <div
                    key={modulo.id}
                    className="flex items-center justify-between gap-2 mt-1"
                  >
                    <span className="w-full">{modulo.nombre}</span>

                    <div className="w-full flex items-center justify-center">
                      <Input
                        type="date"
                        disabled={aprobado} // Deshabilita si ya ha sido aprobado
                        onChange={(e) =>
                          setFechaAprobacionModulo(e.target.value)
                        }
                      />
                    </div>

                    <div className="w-full flex justify-end">
                      <button
                        className={`px-2 py-1 rounded ${
                          aprobado
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                        disabled={aprobado}
                      >
                        {aprobado ? "✔ Aprobado" : "✅ Aprobar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
 */
