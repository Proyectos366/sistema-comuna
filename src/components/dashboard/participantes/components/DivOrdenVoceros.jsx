import Div from "@/components/padres/Div";

export default function DivOrdenVoceros({
  dato,
  expanded,
  children,
  opcionOrden,
}) {
  return (
    <Div
      key={dato[0]?.estaVerificado}
      className={`${opcionOrden ? "border p-3 rounded" : ""} ${
        !dato[0]?.estaVerificado
          ? !dato[0]?.asistenciaAprobada
            ? "border-[#d1d5dc]"
            : "border-[#082158]"
          : !dato[0]?.estaCertificado
          ? expanded === dato[0]?.id
            ? "border-[#E61C45]"
            : "border-[#E61C45]"
          : expanded === dato[0]?.id
          ? "border-[#2FA807]"
          : "border-[#2FA807]"
      } flex flex-col gap-2`}
    >
      {children}
    </Div>
  );
}
