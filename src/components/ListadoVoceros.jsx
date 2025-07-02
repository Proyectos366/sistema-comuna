import { useState } from "react";

export default function ListadoVoceros({ voceros }) {
  const [abierto, setAbierto] = useState(null);

  const toggleVocero = (index) => {
    setAbierto(abierto === index ? null : index);
  };

  if (!Array.isArray(voceros) || voceros.length === 0) {
    return (
      <div className="w-full bg-white p-4 rounded-md shadow-lg text-center">
        <p className="text-red-600 font-semibold">
          No hay voceros disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 w-full flex flex-col gap-4 bg-white rounded-md shadow-lg">
      {voceros.map((vocero, index) => (
        <div key={index} className="bg-gray-200 px-4 py-2 rounded-md shadow-md">
          <button
            onClick={() => toggleVocero(index)}
            className="w-full text-left text-white font-bold text-lg sm:text-xl tracking-wide bg-[#082158] py-2 px-4 rounded-md transition-all duration-300 hover:bg-blue-900 focus:outline-none cursor-pointer"
          >
            {vocero.nombre} {vocero.nombre_dos} {vocero.apellido}{" "}
            {vocero.apellido_dos}
          </button>

          {abierto === index && (
            <div className="bg-white text-gray-800 text-base sm:text-sm mt-3 rounded-md p-4 shadow-inner">
              <p>
                <span className="font-semibold">Cédula:</span> {vocero.cedula}
              </p>
              <p>
                <span className="font-semibold">Edad:</span> {vocero.edad}
              </p>
              <p>
                <span className="font-semibold">Género:</span>{" "}
                {vocero.genero ? "Masculino" : "Femenino"}
              </p>
              <p>
                <span className="font-semibold">Correo:</span> {vocero.correo}
              </p>
              <p>
                <span className="font-semibold">Parroquia:</span>{" "}
                {vocero.parroquias?.nombre || "Sin parroquia"}
              </p>
              <p>
                <span className="font-semibold">Comuna:</span>{" "}
                {vocero.comunas?.nombre || "Sin comuna"}
              </p>
              <p>
                <span className="font-semibold">Consejo Comunal:</span>{" "}
                {vocero.consejos?.nombre || "No asignado"}
              </p>

              {vocero.cursos?.length > 0 ? (
                vocero.cursos.map((curso, i) => (
                  <div key={i} className="mt-4 border-t border-gray-300 pt-2">
                    <h3 className="font-semibold text-sm text-blue-900">
                      Formación: {curso.formaciones?.nombre || "Sin formación"}
                    </h3>
                    <p>
                      Verificado:{" "}
                      <span
                        className={
                          curso.verificado ? "text-green-700" : "text-red-600"
                        }
                      >
                        {curso.verificado ? "Sí" : "No"}
                      </span>
                    </p>
                    <p>
                      Certificado:{" "}
                      <span
                        className={
                          curso.certificado ? "text-green-700" : "text-red-600"
                        }
                      >
                        {curso.certificado ? "Sí" : "No"}
                      </span>
                    </p>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                      {curso.asistencias.map((asistencia, j) => (
                        <li key={j}>
                          Módulo: {asistencia.modulos?.nombre || "Desconocido"}{" "}
                          —{" "}
                          <span
                            className={
                              asistencia.presente
                                ? "text-green-700"
                                : "text-red-600"
                            }
                          >
                            {asistencia.presente ? "Asistió" : "No asistió"}
                          </span>
                        </li>
                      ))}
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
        </div>
      ))}
    </div>
  );
}
