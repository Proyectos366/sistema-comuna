import Button from "@/components/padres/Button";
import InputCedula from "@/components/inputs/InputCedula";
import { cerrarModal } from "@/store/features/modal/slicesModal";
import BotonConsultarCedula from "@/components/botones/BotonConsultarCedula";

export default function ConsultarCedula({
  cedula,
  setCedula,
  validarCedula,
  setValidarCedula,
  consultarVocero,
  seleccionado,
}) {
  return (
    <>
      {seleccionado === 1 && (
        <>
          <div className="w-full max-w-md flex flex-col sm:flex-row items-end justify-center space-x-0 sm:space-x-4 p-2 bg-white shadow-lg rounded-md border border-gray-200 ">
            <InputCedula
              value={cedula}
              setValue={setCedula}
              validarCedula={validarCedula}
              setValidarCedula={setValidarCedula}
            />
            {validarCedula && (
              <div className="w-full sm:w-1/3 mt-2 sm:mt-0">
                <BotonConsultarCedula
                  campos={{ validarCedula }}
                  aceptar={() => consultarVocero()}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
