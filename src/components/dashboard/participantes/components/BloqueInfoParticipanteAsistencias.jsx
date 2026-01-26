import Div from "@/components/padres/Div";
import P from "@/components/padres/P";
import Span from "@/components/padres/Span";

import { formatearFecha } from "@/utils/Fechas";
import { formatoTituloSimple } from "@/utils/formatearTextCapitalice";

export default function BloqueInfoParticipanteAsistencias({
  nombre,
  valor,
  indice,
  fecha,
  formador,
  descripcion,
  estaVerificado,
  puedeVerificar,
}) {
  let colorClase = "text-black";

  if (indice === 2) {
    colorClase = "text-[#E61C45]";
  } else if (indice >= 3) {
    colorClase = "text-[#2FA807]";
  }

  return (
    <Div
      className={`border ${
        !estaVerificado
          ? !puedeVerificar
            ? " text-[#000000] border-[#99a1af]"
            : "border-[#082158]"
          : !estaVerificado
            ? "border-[#E61C45]"
            : "border-[#2FA807]"
      } rounded-md shadow-md p-2`}
    >
      <Span className="font-semibold text-sm sm:text-md">
        {formatoTituloSimple(nombre)}
      </Span>

      <Div className={`flex gap-2 ${colorClase}`}>
        <Span className="font-semibold text-sm sm:text-md">
          {formatoTituloSimple("validado por")}:
        </Span>
        <Span className="text-sm sm:text-md uppercase">
          {valor ? valor : "sin validar"}
        </Span>
      </Div>

      {fecha && (
        <Div className={`flex gap-2 ${colorClase}`}>
          <Span className="font-semibold text-sm sm:text-md">
            {formatoTituloSimple("fecha")}:
          </Span>
          <Span className="text-sm sm:text-md uppercase">
            {formatearFecha(fecha)}
          </Span>
        </Div>
      )}

      {formador && (
        <Div className={`flex gap-2 ${colorClase}`}>
          <Span className="font-semibold text-sm sm:text-md">
            {formatoTituloSimple("formador")}:
          </Span>
          <Span className="text-sm sm:text-md uppercase">
            {formador ? formador : "sin formador"}
          </Span>
        </Div>
      )}

      <Div className={`flex gap-2 ${colorClase}`}>
        <Span className="font-semibold text-sm sm:text-md">
          {formatoTituloSimple("observaciones")}:
        </Span>
        <P className="text-sm sm:text-md uppercase"> {descripcion}</P>
      </Div>
    </Div>
  );
}
