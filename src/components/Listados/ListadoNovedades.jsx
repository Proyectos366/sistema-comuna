import { formatearFecha } from "@/utils/Fechas";
import BotonEditar from "../botones/BotonEditar";
import BotonEliminar from "../botones/BotonEliminar";
import Titulos from "../Titulos";
import ListaDetallesVocero from "./ListaDetalleVocero";
import BotonAceptarCancelar from "../botones/BotonAceptarCancelar";
import ListadoNovedadDepartamento from "./ListadoNovedadDepartamento";

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
  idNovedad,
}) {
  const toggleDetalle = (index) => {
    setAbiertos((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const agrupadasPorNombre = listado.reduce((acc, novedad) => {
    if (!acc[novedad.nombre]) {
      acc[novedad.nombre] = [];
    }
    acc[novedad.nombre].push(novedad);
    return acc;
  }, {});

  return (
    <section className="flex flex-col gap-2 bg-[#f4f6f9] w-full">
      {usuarioActivo.id_rol !== 1
        ? listado?.map((novedad, index) => (
            <ListadoNovedadDepartamento
              key={index}
              novedad={novedad}
              index={index}
              abiertos={abiertos}
              toggleDetalle={toggleDetalle}
              aceptarNovedad={aceptarNovedad}
              idNovedad={idNovedad}
            />
          ))
        : Object.entries(agrupadasPorNombre).map(([nombre, grupo], index) => {
            return (
              <div
                key={index}
                className="border rounded-md bg-[#eef1f5] hover:text-[white]  hover:border-gray-400 hover:bg-gray-400"
              >
                <div
                  onClick={() => toggleDetalle(index)}
                  className={`w-full flex justify-between items-center sm:text-left font-semibold tracking-wide px-2 sm:px-6 py-1 cursor-pointer transition-colors duration-200
                            ${
                              abiertos === index
                                ? "rounded-t-md mb-2 sm:mb-0"
                                : "rounded-md hover:rounded-b-none"
                            }`}
                >
                  <span className="uppercase">
                    {nombre} (
                    {grupo?.[0].length && grupo?.[0].length > 0
                      ? grupo?.[0].length
                      : grupo?.length}{" "}
                    departamentos)
                  </span>
                  <BotonEditar editar={() => editando(grupo?.[0])} />
                </div>

                {abiertos[index] && (
                  <div className="flex flex-col gap-1 bg-white text-gray-800 text-base sm:text-sm px-6 py-2 rounded-b-md shadow-lg">
                    {grupo?.map((novedad, subIndex) => {
                      return (
                        <div key={subIndex} className="border-b py-2">
                          <ListaDetallesVocero
                            indice={1}
                            nombre="Departamento"
                            valor={novedad.departamentoReceptor.nombre}
                          />
                          <ListaDetallesVocero
                            indice={1}
                            nombre="Descripción"
                            valor={novedad.descripcion}
                          />
                          <ListaDetallesVocero
                            indice={1}
                            nombre="Prioridad"
                            valor={novedad.prioridad}
                          />
                          <ListaDetallesVocero
                            indice={1}
                            nombre="Creada"
                            valor={formatearFecha(novedad.fechaCreacion)}
                          />
                          <ListaDetallesVocero
                            indice={6}
                            nombre="Estatus"
                            valor={novedad.estatus}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
    </section>
  );
}
