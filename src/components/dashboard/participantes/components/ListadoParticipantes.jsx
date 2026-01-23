import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

//import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import BloqueInfo from "@/components/BloqueInfo";
import DatosListadoParticipante from "@/components/dashboard/participantes/components/DatosListadoParticipante";
import ButtonsVerificarCertificar from "@/components/dashboard/participantes/components/ButtonsVerificarCertificar";
import DivVerificarCertificar from "@/components/dashboard/participantes/components/DivVerificarCertificar";

import { formatearFecha } from "@/utils/Fechas";
import InputDate from "@/components/dashboard/participantes/components/InputDate";
import Span from "@/components/padres/Span";
import DivNombreModulo from "./DivNombreModulo";
import DivFechaValidarModulo from "./DivFechaValidarModulo";
import { abrirModal } from "@/store/features/modal/slicesModal";

export default function ListadoParticipantes({
  participante,
  datosActualizar,
  setDatosActualizar,
  setOpcion,
  verificarCertificar,
  setVerificarCertificar,
}) {
  const dispatch = useDispatch();
  const inputRefs = useRef({});

  const [fechaAprobacionModulo, setFechaAprobacionModulo] = useState("");

  const [fecha, setFecha] = useState("");
  const [validarFecha, setValidarFecha] = useState(false);

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

  console.log(participante);
  console.log(datosActualizar);

  return (
    <Div className="bg-[#ffffff] py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-[#000000] rounded-b-md">
      <DatosListadoParticipante participante={participante} />

      <DivVerificarCertificar participante={participante}>
        <Span className="font-semibold">Módulos (asistencias):</Span>

        <Div className="flex flex-col gap-2">
          {participante.asistencias.map((asistencia) => {
            return (
              <div
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

                <div className="flex-1 min-w-0">
                  {asistencia.presente ? (
                    <div className="w-full text-[11px] sm:text-lg py-2 text-center uppercase border border-[#2FA807] rounded-md shadow-sm">
                      Validado
                    </div>
                  ) : (
                    <button
                      nombre={"Aprobar"}
                      disabled={
                        !fechaAprobacionModulo[asistencia.id_modulo] ||
                        asistencia.presente
                      }
                      onClick={() => {
                        dispatch(abrirModal("confirmarCambios"));
                      }}
                      className={`py-[6px] sm:py-[9px] w-full rounded-md sm:text-lg ${
                        !fechaAprobacionModulo[asistencia.id_modulo]
                          ? "bg-[#99a1af] text-[#000000]"
                          : "bg-[#082158] text-[#ffffff] hover:bg-[#00184b] cursor-pointer"
                      }`}
                    >
                      Validar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </Div>
      </DivVerificarCertificar>

      <ButtonsVerificarCertificar
        participante={participante}
        setOpcion={setOpcion}
        setVerificarCertificar={setVerificarCertificar}
      />
    </Div>
  );
}
