import { useRef, useState } from "react";

import Div from "@/components/padres/Div";
import DatosListadoParticipante from "@/components/dashboard/participantes/components/DatosListadoParticipante";
import DivVerificarCertificar from "@/components/dashboard/participantes/components/DivVerificarCertificar";
import Span from "@/components/padres/Span";
import DivNombreModulo from "@/components/dashboard/participantes/components/DivNombreModulo";
import DivFechaValidarModulo from "@/components/dashboard/participantes/components/DivFechaValidarModulo";
import ButtonsVerificarCertificar from "@/components/dashboard/participantes/components/ButtonsVerificarCertificar";
import ButtonValidarModulo from "@/components/dashboard/participantes/components/ButtonValidarModulo";
import BloqueInfoParticipanteAsistencias from "@/components/dashboard/participantes/components/BloqueInfoParticipanteAsistencias";

export default function ListadoParticipantes({
  participante,
  setDatosActualizar,
  setOpcion,
  setVerificarCertificar,
}) {
  const inputRefs = useRef({});

  const [fechaAprobacionModulo, setFechaAprobacionModulo] = useState("");

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

  return (
    <Div className="bg-[#ffffff] py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-[#000000] rounded-b-md">
      <DatosListadoParticipante participante={participante} />

      {!participante.estaCertificado && (
        <>
          <DivVerificarCertificar participante={participante}>
            <Span className="font-semibold">Módulos (asistencias):</Span>

            <Div className="flex flex-col gap-2">
              {participante.asistencias.map((asistencia) => {
                return (
                  <Div
                    key={asistencia.id_modulo}
                    className="flex flex-wrap justify-between items-center gap-2"
                  >
                    <DivNombreModulo
                      asistencia={asistencia}
                      participante={participante}
                    />

                    <DivFechaValidarModulo
                      asistencia={asistencia}
                      inputRefs={inputRefs}
                      participante={participante}
                      fechaAprobacionModulo={fechaAprobacionModulo}
                      actualizarFechaModulo={actualizarFechaModulo}
                    />

                    <ButtonValidarModulo
                      asistencia={asistencia}
                      fechaAprobacionModulo={fechaAprobacionModulo}
                    />
                  </Div>
                );
              })}
            </Div>
          </DivVerificarCertificar>

          <ButtonsVerificarCertificar
            participante={participante}
            setOpcion={setOpcion}
            setVerificarCertificar={setVerificarCertificar}
          />
        </>
      )}

      <Div className="flex flex-col gap-2">
        {participante?.asistencias.map((asis) => {
          return (
            <BloqueInfoParticipanteAsistencias
              key={asis.id_modulo}
              nombre={asis.moduloNombre}
              valor={asis.nombreValidador}
              fecha={asis.fecha_validada}
              formador={asis.nombreFormador}
              descripcion={asis.descripcion}
              estaVerificado={participante.estaVerificado}
              puedeVerificar={participante.puedeVerificar}
            />
          );
        })}
      </Div>
    </Div>
  );
}
