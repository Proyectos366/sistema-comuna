import Titulos from "./Titulos";

export default function ListadoParroquias({ nombreListado, listado }) {
  return (
    <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6">
      <Titulos indice={2} titulo={nombreListado} />
      <div className="space-y-3">
        {listado.map((lista, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-md transition-all duration-700 ease-in-out 
                 hover:bg-gray-200 hover:border hover:border-gray-300 
                 hover:shadow-md hover:scale-101 flex flex-col"
          >
            <span className="rounded-md p-3">{lista.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
