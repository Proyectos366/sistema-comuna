import Titulos from "../Titulos";

export default function ListadoOac({
  isLoading,
  listado,
  nombreListado,
  mensajeVacio,
  conteo,
}) {
  return (
    <div className="w-full bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-xl p-6">
      <Titulos indice={2} titulo={nombreListado} />

      <div
        className="mt-2 bg-gray-100 rounded-md transition-all duration-700 ease-in-out 
                 hover:bg-gray-200 hover:border hover:border-gray-300 
                 hover:shadow-md hover:scale-101 flex justify-between uppercase"
      >
        <div className="w-full flex flex-col items-center border rounded-md">
          <Titulos indice={3} titulo={"Total personas"} />

          <div className="w-full flex justify-around mt-2">
            <div className="w-full flex flex-col items-center">
              <span className="font-semibold">Hombres</span>
              <span>{conteo?.hombres}</span>
            </div>

            <div className="w-full flex flex-col items-center">
              <span className="font-semibold">Mujeres</span>
              <span>{conteo?.mujeres}</span>
            </div>
          </div>

          <div className="w-full flex justify-around mt-2">
            <div className="w-full flex flex-col items-center">
              <span className="text-sm text-gray-600">Adultos Mayores</span>
              <span>{conteo?.adultosMayores}</span>
            </div>
            <div className="w-full flex flex-col items-center">
              <span className="text-sm text-gray-600">Adultas Mayores</span>
              <span>{conteo?.adultasMayores}</span>
            </div>
          </div>
        </div>
      </div>

      {/* {isLoading ? (
        <p className="text-center text-gray-600 animate-pulse">Cargando...</p>
      ) : listado?.length === 0 ? (
        <p className="text-center text-gray-600 uppercase">{mensajeVacio}</p>
      ) : ( */}
      <div>
        {listado?.map((lista, index) => (
          <div
            key={index}
            className="mt-2 bg-gray-100 rounded-md transition-all duration-700 ease-in-out 
                 hover:bg-gray-200 hover:border hover:border-gray-300 
                 hover:shadow-md hover:scale-101 flex flex-col uppercase"
          >
            <div className="rounded-md p-3 uppercase flex space-x-4">
              <span>{lista.cedula}</span>
              <span>{lista.edad}</span>
              <span>{lista.genero ? "Hombre" : "Mujer"}</span>
            </div>
          </div>
        ))}
      </div>
      {/* )} */}
    </div>
  );
}
