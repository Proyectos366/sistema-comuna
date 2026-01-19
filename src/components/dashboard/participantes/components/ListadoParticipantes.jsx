import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

//import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import BloqueInfo from "@/components/BloqueInfo";
import DatosListadoParticipante from "@/components/dashboard/participantes/components/DatosListadoParticipante";
import ButtonsVerificarCertificar from "@/components/dashboard/participantes/components/ButtonsVerificarCertificar";

import { formatearFecha } from "@/utils/Fechas";
import InputDate from "@/components/dashboard/participantes/components/InputDate";

export default function ListadoParticipantes({ participante }) {
  const dispatch = useDispatch();
  const inputRefs = useRef({});

  const [datosActualizar, setDatosActualizar] = useState([]); // Estado solo para fecha
  const [fechaAprobacionModulo, setFechaAprobacionModulo] = useState("");

  const [fecha, setFecha] = useState("");
  const [validarFecha, setValidarFecha] = useState(false);

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

  console.log(participante);

  return (
    <Div className="bg-[#ffffff] py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-[#000000] rounded-b-md">
      <DatosListadoParticipante participante={participante} />

      <div
        className={`border ${
          !participante.estaVerificado
            ? !participante.puedeVerificar
              ? " text-[#000000] border-[#99a1af]"
              : "borde-[#082158]"
            : !participante.estaVerificado
            ? "border-[#E61C45]"
            : "border-[#2FA807]"
        } rounded-md shadow-md p-2`}
      >
        <p className="font-semibold">Módulos (asistencias):</p>

        <div className="flex flex-col gap-2">
          {participante.asistencias.map((asistencia) => {
            return (
              <div
                key={asistencia.id_modulo}
                className="flex flex-wrap justify-between items-center gap-2"
              >
                <div
                  className={`flex-1 text-[11px] sm:text-lg py-2 text-center uppercase border ${
                    asistencia.presente
                      ? "border-[#2FA807]"
                      : "border-[#d1d5dc]"
                  }  rounded-md shadow-sm min-w-0`}
                >
                  {participante.formaciones.modulos.find(
                    (m) => m.id === asistencia.id_modulo
                  )?.nombre || "Módulo desconocido"}
                </div>

                <div className="flex-1 min-w-0">
                  {asistencia.presente ? (
                    <div className="w-full text-[11px] sm:text-lg py-2 text-center uppercase border border-[#2FA807] rounded-md shadow-sm">
                      {formatearFecha(asistencia.fecha_registro)}
                    </div>
                  ) : (
                    <div className="w-full cursor-pointer">
                      <InputDate
                        ref={(el) => {
                          if (el) inputRefs.current[asistencia.id] = el;
                        }}
                        participante={participante}
                        id={`fecha-${asistencia.id}`}
                        disabled={asistencia.presente}
                        value={
                          fechaAprobacionModulo[asistencia.id_modulo] || ""
                        }
                        onChange={(e) =>
                          actualizarFechaModulo(
                            asistencia.id_modulo,
                            e.target.value,
                            asistencia.id
                          )
                        }
                      />
                    </div>
                  )}
                </div>

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
                        // setOpciones("modulo");
                        // abrirModal();
                        // setIdModulo(asistencia.id_modulo);
                      }}
                      className={`py-[6px] sm:py-[9px] w-full rounded-md sm:text-lg ${
                        !fechaAprobacionModulo[asistencia.id_modulo]
                          ? "bg-[#99a1af] text-[#000000]"
                          : "bg-[#082158]  cursor-pointer hover:bg-[#1447e6] text-[#ffffff]"
                      }`}
                    >
                      Validar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ButtonsVerificarCertificar participante={participante} />

      <BloqueInfo
              indice={1}
              nombre={"Certificado"}
              valor={participante.fecha_completado ? formatearFecha(participante.fecha_completado) : "Sin certificar"}
            />
    </Div>
  );
}
