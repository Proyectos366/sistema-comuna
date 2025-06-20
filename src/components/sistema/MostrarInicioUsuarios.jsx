import Titulos from "../Titulos";
import Boton from "../Boton";
import Input from "../Input";

export default function MostrarAlInicioUsuarios({
  buscador,
  setBuscador,
  validarCedula,
  setValidarCedula,
}) {
  console.log(buscador);

  return (
    <div className="flex flex-col mt-3">
      <div className="flex justify-start">
        <Titulos indice={2} titulo={"Bienvenidos"} />
      </div>

      <div className="flex justify-center items-center min-h-[100px] bg-gray-50 -mt-5">
        <div className="w-full sm:w-2/3 flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 p-2 bg-white shadow-lg rounded-md border border-gray-200 ">
          <div className="w-full sm:w-2/3">
            <Input
              type={"text"}
              indice={'cedula'}
              value={buscador}
              onChange={(e) => setBuscador(e.target.value)}
              className={""}
              placeholder={"Cedula"}
              validarCedula={validarCedula}
              setValidarCedula={setValidarCedula}
            />
          </div>
          <div className="w-full sm:w-1/3 mt-2 sm:mt-0">
            <Boton
              nombre={"Consultar"}
              onClick={() => {
                abrirModal();
              }}
              className={`color-fondo text-white`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
export default function MostrarAlInicioUsuarios() {
  return (
    <div className="h-full flex flex-col">
      <div className="h-10 flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-between items-center">
        <Titulos indice={2} titulo={"Bienvenidos"} />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <img className="opacity-40 max-w-[300px]" src="/img/fondo.png" alt="" />
      </div>
    </div>
  );
}
 */
