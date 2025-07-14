import BotonMostrarDetalles from "./botones/BotonMostrarDetalles";
import Titulos from "./Titulos";

export default function EstadisticasVoceros({
  registrosFiltrados,
  abierto,
  setAbierto,
  abiertoEntidad,
  setAbiertoEntidad,
}) {
  const totalParticipantes = registrosFiltrados.length;

  const totalHombres = registrosFiltrados.filter(
    (r) => r.voceros?.genero === true
  ).length;

  const totalMujeres = registrosFiltrados.filter(
    (r) => r.voceros?.genero === false
  ).length;

  const totalCertificados = registrosFiltrados.filter(
    (r) => r.certificado === true
  ).length;

  const totalVerificados = registrosFiltrados.filter(
    (r) => r.verificado === true
  ).length;

  const toggleVocero = (index) => {
    setAbierto(abierto === index ? null : index);
  };

  const toggleEntidad = (index) => {
    setAbiertoEntidad((prev) => {
      if (prev[index]) {
        return { [index]: false };
      }
      return { [index]: true };
    });
  };

  const generarEstadisticasPorEntidad = (claveEntidad) => {
    return registrosFiltrados.reduce((acc, r) => {
      const vocero = r.voceros;
      const entidadObj = vocero?.[claveEntidad];

      if (claveEntidad === "consejos" && !entidadObj?.nombre) return acc;

      const entidad = entidadObj?.nombre || `Sin ${claveEntidad}`;

      if (!acc[entidad]) {
        acc[entidad] = {
          Total: 0,
          Hombres: 0,
          Mujeres: 0,
          "Mayores Hombres": 0,
          "Mayores Mujeres": 0,
          "Faltan Módulo 1": 0,
          "Faltan Módulo 2": 0,
          "Faltan Módulo 3": 0,
          Certificados: 0,
          Verificados: 0,
        };
      }

      acc[entidad].Total += 1;

      if (vocero?.genero === true) {
        acc[entidad].Hombres += 1;
        if (vocero?.edad >= 60) acc[entidad]["Mayores Hombres"] += 1;
      }

      if (vocero?.genero === false) {
        acc[entidad].Mujeres += 1;
        if (vocero?.edad >= 55) acc[entidad]["Mayores Mujeres"] += 1;
      }

      if (r.asistencias[0].presente !== true)
        acc[entidad]["Faltan Módulo 1"] += 1;
      if (r.asistencias[1].presente !== true)
        acc[entidad]["Faltan Módulo 2"] += 1;
      if (r.asistencias[2].presente !== true)
        acc[entidad]["Faltan Módulo 3"] += 1;

      if (r.certificado === true) acc[entidad].Certificados += 1;
      if (r.verificado === true) acc[entidad].Verificados += 1;

      return acc;
    }, {});
  };

  const renderListaExtendida = (titulo, datos) => {
    const entidad = {
      parr:
        titulo.toLowerCase() === "por parroquia"
          ? 1
          : titulo.toLowerCase() === "por comuna"
          ? 2
          : titulo.toLowerCase() === "por consejo comunal"
          ? 3
          : 0, // Valor por defecto si no coincide
    };

    return (
      <div className="w-full flex flex-col gap-2">
        <BotonMostrarDetalles
          toggleDetalles={() => toggleEntidad(entidad.parr)}
          nombre={titulo}
          index={entidad.parr}
          indice={true}
        />

        {abiertoEntidad[entidad.parr] && (
          <div className="bg-white shadow-lg rounded-md p-4 w-full border">
            <Titulos indice={3} titulo={titulo} />
            <ul className="space-y-3">
              {Object.entries(datos).map(([clave, valores]) => (
                <li key={clave} className="border-b pb-2">
                  <Titulos
                    indice={5}
                    titulo={clave}
                    className={`text-blue-800 uppercase`}
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-2 text-sm text-[#082158] mt-2">
                    {Object.entries(valores).map(([tipo, count]) => (
                      <p
                        key={tipo}
                        className="flex justify-between border border-gray-300 rounded-md p-2 bg-gray-100"
                      >
                        <span>{tipo}</span>
                        <span className="font-bold">{count}</span>
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8">
      <Titulos indice={2} titulo={"📊 Estadísticas Voceros"} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { titulo: "Participantes", valor: totalParticipantes },
          { titulo: "Hombres", valor: totalHombres },
          { titulo: "Mujeres", valor: totalMujeres },
          { titulo: "Certificados", valor: totalCertificados },
          { titulo: "Verificados", valor: totalVerificados },
        ].map(({ titulo, valor }) => (
          <div
            key={titulo}
            className="bg-blue-50 p-4 rounded shadow text-center"
          >
            <p className="text-sm text-gray-600">{titulo}</p>
            <p className="text-xl font-bold text-blue-700">{valor}</p>
          </div>
        ))}
      </div>

      <div className="rounded flex flex-col gap-2">
        <BotonMostrarDetalles
          toggleDetalles={toggleVocero}
          nombre={"Detalles por entidad"}
          index={1}
        />

        {abierto && (
          <div className="flex flex-col mt-2 gap-2 rounded-md p-2 border border-gray-300 hover:border-green-500">
            {renderListaExtendida(
              "Por Parroquia",
              generarEstadisticasPorEntidad("parroquias")
            )}
            {renderListaExtendida(
              "Por Comuna",
              generarEstadisticasPorEntidad("comunas")
            )}
            {renderListaExtendida(
              "Por Consejo Comunal",
              generarEstadisticasPorEntidad("consejos")
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 import { useState } from "react";

const SeccionDesplegable = ({ titulo, datos }) => {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="border rounded shadow">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold flex justify-between items-center"
      >
        {titulo}
        <span>{abierto ? "▲" : "▼"}</span>
      </button>

      {abierto && (
        <div className="p-4 bg-white">
          <ul className="space-y-3">
            {Object.entries(datos).map(([clave, valores]) => (
              <li key={clave} className="border-b pb-2">
                <h4 className="font-semibold text-blue-600">{clave}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
                  {Object.entries(valores).map(([tipo, count]) => (
                    <p key={tipo} className="flex justify-between">
                      <span>{tipo}</span>
                      <span className="font-bold">{count}</span>
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
 */

/**
import Titulos from "./Titulos";

export default function EstadisticasVoceros({ registrosFiltrados }) {

  const totalParticipantes = registrosFiltrados.length;

  const totalHombres = registrosFiltrados.filter((registro) => {
    const vocero = registro.voceros;
    return vocero?.genero === true;
  }).length;

  const totalMujeres = registrosFiltrados.filter((registro) => {
    const vocero = registro.voceros;
    return vocero?.genero === false;
  }).length;

  const totalAdultosMayoresHombres = registrosFiltrados.filter((registro) => {
    const vocero = registro.voceros;
    return vocero?.genero === true && vocero?.edad >= 60;
  }).length;

  const totalAdultosMayoresMujeres = registrosFiltrados.filter((registro) => {
    const vocero = registro.voceros;
    return vocero?.genero === false && vocero?.edad >= 55;
  }).length;

  const totalCertificados = registrosFiltrados.filter(
    (registro) => registro.certificado === true
  ).length;

  const totalVerificados = registrosFiltrados.filter(
    (registro) => registro.verificado === true
  ).length;

  const participantesPorParroquia = registrosFiltrados.reduce(
    (acc, registro) => {
      const parroquia = registro.voceros?.parroquias?.nombre || "Sin parroquia";
      acc[parroquia] = (acc[parroquia] || 0) + 1;
      return acc;
    },
    {}
  );

  const participantesPorComuna = registrosFiltrados.reduce((acc, registro) => {
    const comuna = registro.voceros?.comunas?.nombre || "Sin comuna";
    acc[comuna] = (acc[comuna] || 0) + 1;
    return acc;
  }, {});

  const participantesPorConsejo = registrosFiltrados.reduce((acc, registro) => {
    const consejo = registro.voceros?.consejos?.nombre || "Sin consejo";
    acc[consejo] = (acc[consejo] || 0) + 1;
    return acc;
  }, {});

  const participantesPorGenero = registrosFiltrados.reduce((acc, registro) => {
    const genero =
      registro.voceros?.genero === true
        ? "Hombre"
        : registro.voceros?.genero === false
        ? "Mujer"
        : "Sin especificar";
    acc[genero] = (acc[genero] || 0) + 1;
    return acc;
  }, {});

  const participantesPorEdad = registrosFiltrados.reduce((acc, registro) => {
    const edad = registro.voceros?.edad;

    let grupo = "Sin edad";
    if (edad >= 60) grupo = "Adulto mayor";
    else if (edad >= 30) grupo = "Adulto";
    else if (edad >= 18) grupo = "Joven";

    acc[grupo] = (acc[grupo] || 0) + 1;
    return acc;
  }, {});

  const estadisticaPorFormador = registrosFiltrados.reduce((acc, registro) => {
    registro.asistencias?.forEach((asistencia) => {
      const nombre = asistencia.formador || "Sin formador";
      const modulo = asistencia.id_modulo || "Sin módulo";
      const fecha = asistencia.fecha_registro || "Sin fecha";
      const presente = asistencia.presente || false;

      if (!acc[nombre]) {
        acc[nombre] = {
          totalAsistencias: 0,
          modulos: new Set(),
          fechasPorModulo: {},
          presentes: 0,
        };
      }

      acc[nombre].totalAsistencias += 1;
      acc[nombre].modulos.add(modulo);

      if (!acc[nombre].fechasPorModulo[modulo]) {
        acc[nombre].fechasPorModulo[modulo] = new Set();
      }
      acc[nombre].fechasPorModulo[modulo].add(fecha);

      if (presente) acc[nombre].presentes += 1;
    });
    return acc;
  }, {});
  
  return (
    <div>
      <Titulos indice={6} titulo={'Estadisticas'} />
    </div>
  )
}

*/
