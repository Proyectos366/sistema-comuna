import Div from "@/components/padres/Div";

export default function DivNombreModulo({ asistencia, participante }) {
  return (
    <Div
      className={`flex-1 text-[11px] sm:text-lg py-2 text-center uppercase border ${
        asistencia.presente ? "border-[#2FA807]" : "border-[#d1d5dc]"
      }  rounded-md shadow-sm min-w-0`}
    >
      {participante.formaciones.modulos.find(
        (m) => m.id === asistencia.id_modulo,
      )?.nombre || "Módulo desconocido"}
    </Div>
  );
}
