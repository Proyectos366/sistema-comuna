import Boton from "@/components/botones/Boton";
import InputCedula from "@/components/inputs/InputCedula";

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
          <div className="w-full max-w-md flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 p-2 bg-white shadow-lg rounded-md border border-gray-200 ">
            <div className="w-full ">
              <InputCedula
                value={cedula}
                setValue={setCedula}
                validarCedula={validarCedula}
                setValidarCedula={setValidarCedula}
              />
            </div>
            <div className="w-full sm:w-1/3 mt-2 sm:mt-0">
              <Boton
                disabled={!cedula}
                nombre={"Consultar"}
                onClick={() => {
                  abrirModal();
                  consultarVocero();
                }}
                className={`color-fondo text-white`}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
