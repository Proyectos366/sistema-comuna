import { formatearFecha } from "@/utils/Fechas";
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
  aceptarNovedad,
  abiertos,
  setAbiertos,
}) {
  const toggleDetalle = (index) => {
    setAbiertos((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    // <section className="w-full bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-xl">
    //   {listado?.map((novedad, index) => {
    //     console.log(novedad);

    //     return (
    //       <div key={index} className="border p-4 rounded-md mb-4">
    //         <h3>Asunto: {novedad.nombre}</h3>
    //         <p>Descripcion: {novedad.descripcion}</p>
    //         <p>Prioridad: {novedad.prioridad}</p>
    //         <p>Estatus: {novedad.estatus}</p>
    //         <p>Creada: {formatearFecha(novedad.fechaCreacion)}</p>

    //         {novedad.vista === "creador" ? (
    //           <span className="font-semibold">
    //             Estado:{" "}
    //             {novedad.estatus === "pendiente"
    //               ? "⏳ Pendiente"
    //               : "✅ Recibida"}
    //           </span>
    //         ) : (
    //           <>
    //             {novedad.estatus === "pendiente" ? (
    //               <button
    //                 onClick={() => aceptarNovedad(novedad.id)}
    //                 className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
    //               >
    //                 Aceptar
    //               </button>
    //             ) : (
    //               <span className="text-green-700 font-semibold">
    //                 ✅ Ya aceptada
    //               </span>
    //             )}
    //           </>
    //         )}
    //       </div>
    //     );
    //   })}
    // </section>

    <section className="w-full bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-xl">
      {listado?.map((novedad, index) => (
        <div
        onClick={() => toggleDetalle(index)}
          key={index}
          className={`border bg-gray-100 ${
            novedad.estatus === "pendiente"
              ? "border-[#E61C45] hover:bg-[#E61C45] text-[#E61C45] hover:text-white"
              : "border-[#2FA807] hover:bg-[#15EA0E] text-[#2FA807] hover:text-white"
          }  px-6 py-2 rounded-md mb-4  cursor-pointer`}
        >
          <span
            className={` font-semibold text-lg`}
            
          >
            Asunto: {novedad.nombre}
          </span>

          {abiertos[index] && (
            <div className="mt-2">
              <p>Descripción: {novedad.descripcion}</p>
              <p>Prioridad: {novedad.prioridad}</p>
              <p>Estatus: {novedad.estatus}</p>
              <p>Creada: {formatearFecha(novedad.fechaCreacion)}</p>

              {novedad.vista === "creador" ? (
                <span className="font-semibold">
                  Estado:{" "}
                  {novedad.estatus === "pendiente"
                    ? "⏳ Pendiente"
                    : "✅ Recibida"}
                </span>
              ) : (
                <>
                  {novedad.estatus === "pendiente" ? (
                    <button
                      onClick={() => aceptarNovedad(novedad.id)}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Aceptar
                    </button>
                  ) : (
                    <span className="text-green-700 font-semibold">
                      ✅ Ya aceptada
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

/**
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
 */
