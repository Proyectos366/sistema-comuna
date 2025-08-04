import BotonEditar from "../botones/BotonEditar";
import Titulos from "../Titulos";

export default function ListadoGenaral({
  isLoading,
  listado,
  nombreListado,
  mensajeVacio,
  editando,
}) {
  return (
    <div className="w-full bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-xl p-2">
      <Titulos indice={2} titulo={nombreListado} />

      {isLoading ? (
        <p className="text-center text-gray-600 animate-pulse">Cargando...</p>
      ) : listado?.length === 0 ? (
        <p className="text-center text-gray-600 uppercase">{mensajeVacio}</p>
      ) : (
        <div className=" flex flex-col gap-2">
          {listado?.map((lista, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-md transition-all duration-700 ease-in-out 
                 hover:bg-gray-300 hover:border hover:border-gray-300 
                 hover:shadow-md hover:scale-101 flex gap-4 sm:gap-1 items-center justify-between uppercase py-1 px-4"
            >
              <div className="flex gap-2">
                {!lista.cedula ? null : (
                  <span className="rounded-md p-3 uppercase">
                    {lista.cedula}
                  </span>
                )}
                <span className="rounded-md uppercase">{lista.nombre}</span>

                {!lista.apellido ? null : (
                  <span className="rounded-md p-3 uppercase">
                    {lista.apellido}
                  </span>
                )}
              </div>

              {typeof editando === "function" && (
                <div>
                  <BotonEditar editar={() => editando(lista)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
