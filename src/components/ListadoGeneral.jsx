import Titulos from "./Titulos";

export default function ListadoGenaral({
  isLoading,
  listado,
  nombreListado,
  mensajeVacio,
}) {
  return (
    <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
      <Titulos indice={2} titulo={nombreListado} />

      {isLoading ? (
        <p className="text-center text-gray-600 animate-pulse">Cargando...</p>
      ) : listado?.length === 0 ? (
        <p className="text-center text-gray-600 uppercase">{mensajeVacio}</p>
      ) : (
        <div>
          {listado?.map((lista, index) => (
            <div
              key={index}
              className="mt-2 bg-gray-100 rounded-md transition-all duration-700 ease-in-out 
                 hover:bg-gray-200 hover:border hover:border-gray-300 
                 hover:shadow-md hover:scale-101 flex flex-col uppercase"
            >
              <span className="rounded-md p-3 uppercase">{lista.nombre}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
