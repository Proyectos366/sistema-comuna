import { useDispatch } from "react-redux";

import Button from "@/components/padres/Button";
import Div from "@/components/padres/Div";

import { abrirModal } from "@/store/features/modal/slicesModal";

export default function ButtonsVerificarCertificar({
  participante,
  setOpcion,
  setVerificarCertificar,
}) {
  const dispatch = useDispatch();

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
        disabled={participante.estaVerificado && !participante.puedeCertificar}
        onClick={() => {
          dispatch(abrirModal("confirmar"));
          setOpcion("verificar");
          setVerificarCertificar(participante);
        }}
        className={`py-2 sm:py-3 w-full rounded-md sm:text-lg ${
          !participante.puedeVerificar
            ? "bg-[#99a1af] text-[#000000] cursor-not-allowed"
            : participante.estaVerificado
              ? "bg-[#2FA807] text-[#ffffff] cursor-not-allowed"
              : "bg-[#082158] text-[#ffffff] hover:bg-[#00184b] cursor-pointer"
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
        disabled={participante.estaCulminado}
        onClick={() => {
          dispatch(abrirModal("confirmar"));
          setOpcion("certificar");
          setVerificarCertificar(participante);
        }}
        className={`py-2 sm:py-3 w-full rounded-md sm:text-lg ${
          participante.puedeCertificar
            ? participante.estaCulminado
              ? "bg-[#2FA807] text-[#ffffff] cursor-not-allowed"
              : "bg-[#082158] text-[#ffffff] hover:bg-[#00184b] cursor-pointer"
            : "cursor-not-allowed bg-[#99a1af] text-[#000000]"
        }`}
      >
        {participante.culminado ? "Certificado" : "Certificar"}
      </Button>
    </Div>
  );
}
