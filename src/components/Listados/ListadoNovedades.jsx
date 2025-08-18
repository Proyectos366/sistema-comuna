import BotonEditar from "../botones/BotonEditar";
import BotonEliminar from "../botones/BotonEliminar";
import Titulos from "../Titulos";

export default function ListadoNovedades({
  isLoading,
  listado,
  nombreListado,
  mensajeVacio,
  editando,
  eliminando,
  usuarioActivo,
}) {

  console.log(usuarioActivo);
  
  console.log(listado);
  
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
              <div className="flex gap-2 py-1">
                <span className="rounded-md uppercase">{lista.nombre}</span>
              </div>

              <div className="flex gap-2">
                {typeof editando === "function" &&
                  ((!lista.recibido &&
                    usuarioActivo.MiembrosDepartamentos?.[0]?.id ===
                      lista.id_departamento) ||
                    usuarioActivo.id_rol === 1) && (
                    <div>
                      <BotonEditar editar={() => editando(lista)} />
                    </div>
                  )}

                {typeof eliminando === "function" &&
                  ((!lista.recibido &&
                    usuarioActivo.MiembrosDepartamentos?.[0]?.id ===
                      lista.id_departamento) ||
                    usuarioActivo.id_rol === 1) && (
                    <div>
                      <BotonEliminar eliminar={() => eliminando(lista)} />
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
