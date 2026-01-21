import Div from "@/components/padres/Div";

export default function DivVerificarCertificar({ children, participante }) {
  return (
    <Div
      className={`border ${
        !participante.estaVerificado
          ? !participante.puedeVerificar
            ? " text-[#000000] border-[#99a1af]"
            : "border-[#082158]"
          : !participante.estaVerificado
            ? "border-[#E61C45]"
            : "border-[#2FA807]"
      } rounded-md shadow-md p-2`}
    >
      {children}
    </Div>
  );
}
