import { formatearFecha } from "@/utils/Fechas";
import ListaDetallesVocero from "./ListaDetalleVocero";

export default function DetallesListadoVoceros({ abierto, index, vocero }) {
  return (
    <>
      {abierto === index && (
        <div className="bg-white text-gray-800 text-base sm:text-sm mt-1 rounded-md p-4 shadow-inner">
          <ListaDetallesVocero nombre={"Cedula"} valor={vocero.cedula} />
          <ListaDetallesVocero nombre={"Edad"} valor={vocero.edad} />
          <ListaDetallesVocero
            nombre={"Genero"}
            valor={vocero.genero ? "Masculino" : "Femenino"}
          />
          <ListaDetallesVocero nombre={"Correo"} valor={vocero.correo} />
          <ListaDetallesVocero nombre={"Telefono"} valor={vocero.telefono} />
          
          <ListaDetallesVocero
            nombre={"Comuna"}
            valor={vocero.comunas?.nombre || "Sin comuna"}
          />
          <ListaDetallesVocero
            nombre={"Consejo comunal"}
            valor={vocero.consejos?.nombre || "No asignado"}
          />

          {vocero.cursos?.length > 0 ? (
            vocero.cursos.map((curso, i) => (
              <div key={i} className="mt-4 border-t border-gray-300 pt-2">
                <ListaDetallesVocero
                  nombre={"Formación"}
                  valor={curso.formaciones?.nombre || "Sin formación"}
                />

                <div className="flex gap-2">
                  <span>Verificado:</span>
                  <span className={`${curso.verificado ? "text-green-700" : "text-red-600"} uppercase`}>
                    {curso.verificado ? "Sí" : "No"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span>Certificado:</span>
                  <span className={`${curso.certificado ? "text-green-700" : "text-red-600"} uppercase`}>
                    {curso.certificado ? "Sí" : "No"}
                  </span>
                </div>
                
                <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                  {curso.asistencias.map((asistencia, j) => {
                    return (
                      <li key={j} className="flex gap-2">
                        <span className="uppercase"> {asistencia.modulos?.nombre || "Desconocido"} — </span>
                        <span
                          className={
                            `uppercase ${asistencia.presente
                              ? "text-green-700"
                              : "text-red-600"}`
                          }
                        >
                          {asistencia.presente
                            ? "Asistió: " +
                              formatearFecha(asistencia.fecha_registro)
                            : "No asistió"}
                        </span>
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
