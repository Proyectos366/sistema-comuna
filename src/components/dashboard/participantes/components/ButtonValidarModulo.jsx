import { useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import Button from "@/components/padres/Button";

import { abrirModal } from "@/store/features/modal/slicesModal";

export default function ButtonValidarModulo({
  asistencia,
  fechaAprobacionModulo,
}) {
  const dispatch = useDispatch();
  return (
    <Div className="flex-1 min-w-0">
      {asistencia.presente ? (
        <Div className="w-full text-[11px] sm:text-lg py-2 text-center uppercase border border-[#2FA807] rounded-md shadow-sm">
          Validado
        </Div>
      ) : (
        <Button
          disabled={
            !fechaAprobacionModulo[asistencia.id_modulo] || asistencia.presente
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
        </Button>
      )}
    </Div>
  );
}
