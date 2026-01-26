import InputDate from "@/components/dashboard/participantes/components/InputDate";
import Div from "@/components/padres/Div";

import { formatearFecha } from "@/utils/Fechas";

export default function DivFechaValidarModulo({
  asistencia,
  inputRefs,
  participante,
  fechaAprobacionModulo,
  actualizarFechaModulo,
}) {
  return (
    <Div className="flex-1 min-w-0">
      {asistencia.presente ? (
        <Div className="w-full text-[11px] sm:text-lg py-2 text-center uppercase border border-[#2FA807] rounded-md shadow-sm">
          {formatearFecha(asistencia.fecha_validada)}
        </Div>
      ) : (
        <Div className="w-full cursor-pointer">
          <InputDate
            ref={(el) => {
              if (el) inputRefs.current[asistencia.id] = el;
            }}
            participante={participante}
            id={`fecha-${asistencia.id}`}
            disabled={asistencia.presente}
            value={fechaAprobacionModulo[asistencia.id_modulo] || ""}
            onChange={(e) =>
              actualizarFechaModulo(
                asistencia.id_modulo,
                e.target.value,
                asistencia.id,
              )
            }
          />
        </Div>
      )}
    </Div>
  );
}
