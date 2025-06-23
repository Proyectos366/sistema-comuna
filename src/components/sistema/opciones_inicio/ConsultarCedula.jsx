"use client";
import { useEffect, useState } from "react";
import Input from "@/components/Input";
import Boton from "@/components/Boton";

export default function ConsultarCedula({
  seleccionarConsulta,
  formatearCedula,
  cedula,
  handleChangeCedula,
  consultarVoceroCedula,
  voceroPorCedula,
  abrirModal,
}) {
  const [estadoUsuarios, setEstadoUsuarios] = useState({});

  useEffect(() => {
    const nuevoEstadoUsuarios = {};

    voceroPorCedula?.cursos?.forEach((curso) => {
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
  }, [voceroPorCedula]); // Se ejecuta cada vez que `cursos` cambia

  
  

  return (
    <>
      {seleccionarConsulta === 1 && (
        <>
          <div className="w-full max-w-md flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 p-2 bg-white shadow-lg rounded-md border border-gray-200 ">
            <div className="w-full ">
              <Input
                type={"text"}
                value={formatearCedula(cedula)}
                onChange={handleChangeCedula}
                className={""}
                placeholder={"Cedula"}
              />
            </div>
            <div className="w-full sm:w-1/3 mt-2 sm:mt-0">
              <Boton
                disabled={!cedula}
                nombre={"Consultar"}
                onClick={() => {
                  abrirModal();
                  consultarVoceroCedula();
                }}
                className={`color-fondo text-white`}
              />
            </div>
          </div>

          {voceroPorCedula?.length === 0 ? (
            <div className="bg-white p-4 rounded-md shadow-lg mt-4 text-center">
              <p className="text-red-600 font-semibold">
                No hay vocero...
              </p>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-md shadow-lg mt-4 uppercase">
              <h2 className="text-xl font-bold mb-2">
                {voceroPorCedula.nombre} {voceroPorCedula.nombre_dos}{" "}
                {voceroPorCedula.apellido} {voceroPorCedula.apellido_dos}
              </h2>
              <p>Cédula: {voceroPorCedula.cedula}</p>
              <p>Edad: {voceroPorCedula.edad}</p>
              <p>Género: {voceroPorCedula.genero ? "Masculino" : "Femenino"}</p>
              <p>Correo: {voceroPorCedula.correo}</p>
              <p>
                Parroquia:{" "}
                {voceroPorCedula.parroquias?.nombre || "Sin parroquia"}
              </p>
              <p>Comuna: {voceroPorCedula.comunas?.nombre || "Sin comuna"}</p>
              <p>
                Consejo Comunal:{" "}
                {voceroPorCedula?.consejos?.nombre || "No asignado"}
              </p>

              {voceroPorCedula?.cursos?.length > 0 ? (
                voceroPorCedula.cursos.map((curso, index) => (
                  <div key={index} className="mt-4 border-t pt-2">
                    <h3 className="font-semibold text-sm">
                      Formación: {curso.formaciones?.nombre || "Sin formación"}
                    </h3>
                    <p>Verificado: {curso.verificado ? "Sí" : "No"}</p>
                    <p>Certificado: {curso.certificado ? "Sí" : "No"}</p>

                    <ul className="mt-2 list-disc list-inside text-sm">
                      {curso.asistencias.map((asistencia, i) => (
                        <li key={i}>
                          Módulo: {asistencia.modulos?.nombre || "Desconocido"}{" "}
                          — {asistencia.presente ? "Asistió" : "No asistió"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="mt-4 text-sm italic text-gray-600">
                  Este vocero no ha participado en cursos.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
