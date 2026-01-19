import Button from "@/components/padres/Button";
import Div from "@/components/padres/Div";

export default function ButtonsVerificarCertificar({ participante }) {
  return (
    <Div className="mt-1 flex gap-4">
      <Button
        title={
          !participante.puedeVerificar
            ? "Para verificar primero debe validar todos los modulos"
            : !participante.estaVerificado
            ? "Puede verificar"
            : "Ya está verificado"
        }
        disabled={!participante.puedeVerificar || participante.estaVerificado}
        onClick={() => {
          // setOpciones("verificado");
          // abrirModal();
          // setDatosVerificar(curso);
        }}
        className={`py-2 sm:py-3 w-full rounded-md sm:text-lg ${
          !participante.puedeVerificar
            ? "bg-[#99a1af] text-[#000000] cursor-not-allowed"
            : participante.estaVerificado
            ? "bg-[#2FA807] text-[#ffffff]"
            : "color-fondo hover:text-[#1447e6] text-[#ffffff]"
        }`}
      >
        {participante.estaVerificado ? "Verificado" : "Verificar"}
      </Button>

      <Button
        title={
          !participante.puedeCertificar
            ? "Para certificar primero debe estar verificado"
            : participante.estaVerificado
            ? "Puede certificar"
            : "Ya está certificado"
        }
        disabled={participante.culminado ? true : !participante.puedeCertificar}
        onClick={() => {
          // setOpciones("certificado");
          // abrirModal();
          // setDatosCertificar(participante);
        }}
        className={`py-2 sm:py-3 w-full rounded-md sm:text-lg ${
          participante.puedeCertificar
            ? participante.culminado
              ? "bg-[#2FA807] text-[#ffffff]"
              : "bg-[#082158] hover:bg-[#1447e6] text-[#ffffff]"
            : "cursor-not-allowed bg-[#99a1af] text-[#000000]"
        }`}
      >
        {participante.culminado ? "Certificado" : "Certificar"}
      </Button>
    </Div>
  );
}
