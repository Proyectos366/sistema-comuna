import { formatearFecha } from "@/utils/Fechas";
import ListaDetallesVocero from "./ListaDetalleVocero";
import BotonEditar from "../botones/BotonEditar";

export default function DetallesListadoVoceros({
  abierto,
  index,
  vocero,
  editar,
}) {
  return (
    <>
      {abierto === index && (
        <div className="bg-white text-gray-800 text-base sm:text-sm mt-1 rounded-md p-4 shadow-inner">
          <div className="relative w-full flex items-center">
            <ListaDetallesVocero
              indice={1}
              nombre={"Cedula"}
              valor={vocero.cedula}
            />

            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <BotonEditar editar={() => editar(vocero)} />
            </div>
          </div>

          <ListaDetallesVocero indice={1} nombre={"Edad"} valor={vocero.edad} />
          <ListaDetallesVocero
            indice={1}
            nombre={"Genero"}
            valor={vocero.genero ? "Masculino" : "Femenino"}
          />
          <ListaDetallesVocero
            indice={1}
            nombre={"Correo"}
            valor={vocero.correo}
          />
          <ListaDetallesVocero
            indice={1}
            nombre={"Telefono"}
            valor={vocero.telefono}
          />

          <ListaDetallesVocero
            indice={1}
            nombre={"Comuna"}
            valor={vocero.comunas?.nombre || "Sin comuna"}
          />
          <ListaDetallesVocero
            indice={1}
            nombre={"Consejo comunal"}
            valor={vocero.consejos?.nombre || "No asignado"}
          />

          {vocero.cursos?.length > 0 ? (
            vocero.cursos.map((curso, i) => (
              <div key={i} className="mt-4 border-t border-gray-300 pt-2">
                <ListaDetallesVocero
                  indice={1}
                  nombre={"Formación"}
                  valor={curso.formaciones?.nombre || "Sin formación"}
                />

                <ListaDetallesVocero
                  indice={2}
                  nombre={"Verificado"}
                  valor={curso.verificado}
                />

                <ListaDetallesVocero
                  indice={2}
                  nombre={"Certificado"}
                  valor={curso.certificado}
                />

                <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                  {curso.asistencias.map((asistencia, j) => {
                    return (
                      <li key={j} className="flex gap-2">
                        <ListaDetallesVocero
                          indice={3}
                          nombre={asistencia.modulos?.nombre}
                          valor={asistencia.presente}
                          fecha={formatearFecha(asistencia.fecha_registro)}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <p className="mt-4 italic text-gray-500">
              Este vocero no ha participado en cursos.
            </p>
          )}
        </div>
      )}
    </>
  );
}
