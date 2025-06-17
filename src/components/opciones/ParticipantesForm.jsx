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
import FormCrearParroquia from "../formularios/FormCrearParroquia";
import ListadoGenaral from "../ListadoGeneral";
import ModalDatosContenedor from "../ModalDatosContenedor";
import Input from "../Input";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Boton from "../Boton";
import { formatearFecha } from "@/utils/Fechas";

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

  const aprobarModulo = (cursoId, moduloId) => {
    setCursos((prevCursos) =>
      prevCursos.map((curso) =>
        curso.id === cursoId
          ? {
              ...curso,
              formaciones: {
                ...curso.formaciones,
                modulos: curso.formaciones.modulos.map((m) =>
                  m.id === moduloId ? { ...m, aprobado: true } : m
                ),
              },
            }
          : curso
      )
    );
  };

  const aprobarTodosModulos = (cursoId) => {
    setCursos((prevCursos) =>
      prevCursos.map((curso) =>
        curso.id === cursoId
          ? {
              ...curso,
              formaciones: {
                ...curso.formaciones,
                modulos: curso.formaciones.modulos.map((m) => ({
                  ...m,
                  aprobado: true,
                })),
              },
              verificado: true,
            }
          : curso
      )
    );
  };

  const moduloAprobar = () => {
    console.log("aprobando modulo...");
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
      console.log("Error, al crear parroquia: " + error);
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
        titulo={"¿Aprobar este modulo?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Modulo"} descripcion={idModulo} />
          <ModalDatos
            titulo={"Fecha aprobado"}
            descripcion={formatearFecha(
              fechaAprobacionModulo[idModulo] + "T00:00:00Z"
            )}
          />
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        <BotonesModal
          aceptar={validarModulo}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{}}
        />
      </Modal>
      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Certificar participantes"}>
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="border border-gray-300 rounded-lg shadow-md p-4 mb-4"
            >
              <div className="flex justify-between items-center">
                <div>
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
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  {expanded[curso.id]
                    ? "▲ Ocultar detalles"
                    : "▼ Mostrar detalles"}
                </button>
              </div>

              {expanded === curso.id && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Comuna: </strong>
                    {curso.voceros.comunas?.nombre || "No asignada"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Correo: </strong>
                    {curso.voceros.correo}
                  </p>
                  <p className="text-gray-700">
                    <strong>Formación: </strong>
                    {curso.formaciones.nombre}
                  </p>

                  <div className="mt-2 border border-gray-500 rounded-md p-2">
                    <p className="font-semibold">Módulos (asistencias):</p>
                    <div className="flex flex-col space-y-2">
                      {curso.asistencias.map((asistencia) => {
                        return (
                          <div
                            key={asistencia.id_modulo}
                            className="flex justify-between items-center space-x-3"
                          >
                            <div className="w-full border border-gray-100 rounded-md shadow-sm py-2 text-center">
                              {curso.formaciones.modulos.find(
                                (m) => m.id === asistencia.id_modulo
                              )?.nombre || "Módulo desconocido"}
                            </div>

                            <div className="w-full -mt-1">
                              {asistencia.presente ? (
                                <div className="w-full py-2 text-center border border-gray-300 rounded-md shadow-sm">
                                  {formatearFecha(asistencia.fecha_registro)}
                                </div>
                              ) : (
                                <Input
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
                                />
                              )}
                            </div>

                            <div className={`w-full`}>
                              <Boton
                                nombre={
                                  asistencia.presente ? "✔ Aprobado" : "Aprobar"
                                }
                                disabled={
                                  !fechaAprobacionModulo[
                                    asistencia.id_modulo
                                  ] || asistencia.presente
                                } // Solo se activa el botón con fecha
                                onClick={() => {
                                  abrirModal();
                                  setIdModulo(asistencia.id_modulo);
                                  console.log(
                                    "Fecha seleccionada:",
                                    fechaAprobacionModulo[asistencia.id_modulo]
                                  ); // Captura solo la fecha del módulo correspondiente
                                }}
                                className={`py-2 ${
                                  !fechaAprobacionModulo[asistencia.id_modulo]
                                    ? "cursor-not-allowed bg-gray-400 text-black"
                                    : asistencia.presente
                                    ? "cursor-not-allowed bg-gray-400 text-black"
                                    : "cursor-pointer color-fondo hover:bg-blue-700 text-white"
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                      ✔ Verificado
                    </button>
                    <button className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">
                      🎓 Certificar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* {cursos.map((curso) => (
            <div
              key={curso.id}
              className="border border-gray-300 rounded-lg shadow-md p-4 mb-4"
            >
              <div className="flex justify-between items-center">
                <div>
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
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  {expanded[curso.id]
                    ? "▲ Ocultar detalles"
                    : "▼ Mostrar detalles"}
                </button>
              </div>

              {expanded === curso.id && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Comuna: </strong>
                    {curso.voceros.comunas?.nombre || "No asignada"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Correo: </strong>
                    {curso.voceros.correo}
                  </p>
                  <p className="text-gray-700">
                    <strong>Formación: </strong>
                    {curso.formaciones.nombre}
                  </p>

                  <div className="mt-2 border border-gray-500 rounded-md p-2">
                    <p className="font-semibold">Módulos (asistencias):</p>
                    <div className="flex flex-col space-y-2">
                      {curso.asistencias.map((asistencia) => (
                        <div
                          key={asistencia.id_modulo}
                          className="flex justify-between items-center space-x-3"
                        >
                          <div className="w-full border border-gray-100 rounded-md shadow-sm py-2 text-center">
                            {curso.formaciones.modulos.find(
                              (m) => m.id === asistencia.id_modulo
                            )?.nombre || "Módulo desconocido"}
                          </div>

                          <div className="w-full -mt-1">
                            <Input
                              type="date"
                              disabled={asistencia.presente}
                              onChange={(e) =>
                                setFechaAprobacionModulo(e.target.value)
                              }
                            />
                          </div>

                          <div className={`w-full`}>
                            <Boton
                              nombre={
                                asistencia.presente ? "✔ Aprobado" : "Aprobar"
                              }
                              onClick={() => {
                                abrirModal();
                                setIdModulo(asistencia.id_modulo);
                              }}
                              className={`cursor-pointer color-fondo hover:bg-blue-700 py-2 ${
                                asistencia.presente
                                  ? "bg-amber-400"
                                  : "color-fondo text-white"
                              }`}
                            />
                            
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                      ✔ Verificado
                    </button>
                    <button className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">
                      🎓 Certificar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))} */}

          {/* {cursos.map((curso) => (
            <div
              key={curso.id}
              className="border border-gray-300 rounded-lg shadow-md p-4 mb-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-500">
                    <b>Cédula:</b> <span>{curso.voceros.cedula}</span>
                  </div>
                  <div className="text-gray-500">
                    <b>Nombre:</b>
                    <span>
                      {curso.voceros.nombre} {curso.voceros.nombre_dos + " "}
                      {curso.voceros.apellido} {curso.voceros.apellido_dos}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(curso.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  {expanded[curso.id]
                    ? "▲ Ocultar detalles"
                    : "▼ Mostrar detalles"}
                </button>
              </div>

              {expanded === curso.id && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Comuna: </strong>
                    {curso.voceros.comunas?.nombre || "No asignada"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Correo: </strong>
                    {curso.voceros.correo}
                  </p>
                  <p className="text-gray-700">
                    <strong>Formación: </strong>
                    {curso.formaciones.nombre}
                  </p>

                  <div className="mt-2 border rounded-md p-2">
                    <p className="font-semibold">Módulos:</p>
                    <div className="flex flex-col">
                      {curso.formaciones.modulos.map((modulo) => (
                        <div
                          key={modulo.id}
                          className="flex items-center justify-between gap-2 mt-1"
                        >
                          <span className="w-full">{modulo.nombre}</span>
                          <div className="w-full flex items-center justify-center">
                            <Input
                              type={"date"}
                              onChange={(e) =>
                                setFechaAprobacionModulo(e.target.value)
                              }
                            />
                          </div>
                          <div className="w-full flex justify-end">
                            <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                              Aprobar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                      ✔ Verificado
                    </button>
                    <button className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">
                      🎓 Certificar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))} */}
        </DivUnoDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}

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
