import Input from "@/components/Input";
import Boton from "@/components/Boton";

export default function ConsultarCedula({
  seleccionarConsulta,
  formatearCedula,
  cedula,
  handleChangeCedula,
  consultarVoceroCedula,
  voceroPorCedula
}) {

  console.log(voceroPorCedula);
  
  return (
    <>
      {seleccionarConsulta === 1 && (
        <div className="w-full max-w-md flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 p-2 bg-white shadow-lg rounded-md border border-gray-200 ">
          <div className="w-full ">
            <Input
              type={"text"}
              value={formatearCedula(cedula)}
              onChange={handleChangeCedula}
              className={""}
              placeholder={"Cedula"}
            />
          </div>
          <div className="w-full sm:w-1/3 mt-2 sm:mt-0">
            <Boton
              disabled={!cedula}
              nombre={"Consultar"}
              onClick={() => {
                consultarVoceroCedula();
              }}
              className={`color-fondo text-white`}
            />
          </div>
        </div>
      )}
    </>
  );
}
