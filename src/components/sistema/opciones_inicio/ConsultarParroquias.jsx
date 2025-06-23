import SelectOpcion from "@/components/SelectOpcion";

export default function ConsultarTodasParroquias({
  seleccionarConsulta,
  idParroquia,
  cambiarSeleccionParroquia,
  parroquias,
  voceroPorParroquia,
  expandido,
  setExpandido,
}) {

  const toggleExpand = (cursoId) => {
    setExpandido((prev) => (prev === cursoId ? {} : cursoId));
  };

  return (
    <>
      {seleccionarConsulta === 2 && (
        <>
          <SelectOpcion
            idOpcion={idParroquia}
            nombre={"Parroquias"}
            handleChange={cambiarSeleccionParroquia}
            opciones={parroquias}
            seleccione={"Seleccione"}
          />

          {voceroPorParroquia.length === 0 ? (
            <div className="bg-white p-4 rounded-md shadow-lg mt-4 text-center">
              <p className="text-red-600 font-semibold">
                No hay voceros registrados...
              </p>
            </div>
          ) : (
            voceroPorParroquia.map((vocero, index) => {
              return (
                <div
                  key={index}
                  className="bg-white p-4 rounded-md shadow-lg mt-4 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      {vocero.nombre} {vocero.nombre_dos} {vocero.apellido}{" "}
                      {vocero.apellido_dos}
                    </h2>
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => toggleExpand(vocero.id)}
                    >
                      {expandido ? "Ocultar detalles" : "Ver detalles"}
                    </button>
                  </div>

                  {expandido === vocero.id && (
                    <div className="mt-3 uppercase text-sm space-y-1">
                      <p>Cédula: {vocero.cedula}</p>
                      <p>Edad: {vocero.edad}</p>
                      <p>Género: {vocero.genero ? "Masculino" : "Femenino"}</p>
                      <p>Correo: {vocero.correo}</p>
                      <p>
                        Parroquia:{" "}
                        {vocero.parroquias?.nombre || "Sin parroquia"}
                      </p>
                      <p>Comuna: {vocero.comunas?.nombre || "Sin comuna"}</p>
                      <p>
                        Consejo Comunal:{" "}
                        {vocero?.consejos?.nombre || "No asignado"}
                      </p>

                      {vocero.cursos?.length > 0 ? (
                        vocero.cursos.map((curso, i) => (
                          <div key={i} className="mt-4 border-t pt-2">
                            <h3 className="font-semibold text-sm">
                              Formación:{" "}
                              {curso.formaciones?.nombre || "Sin formación"}
                            </h3>
                            <p>Verificado: {curso.verificado ? "Sí" : "No"}</p>
                            <p>
                              Certificado: {curso.certificado ? "Sí" : "No"}
                            </p>

                            <ul className="mt-2 list-disc list-inside text-sm">
                              {curso.asistencias.map((asistencia, j) => (
                                <li key={j}>
                                  Módulo:{" "}
                                  {asistencia.modulos?.nombre || "Desconocido"}{" "}
                                  —{" "}
                                  {asistencia.presente
                                    ? "Asistió"
                                    : "No asistió"}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <p className="mt-4 text-sm italic text-gray-600">
                          Este vocero no ha participado en cursos.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </>
      )}
    </>
  );
}
