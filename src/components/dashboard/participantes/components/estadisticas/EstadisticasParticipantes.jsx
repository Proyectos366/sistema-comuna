import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Div from "@/components/padres/Div";
import Ul from "@/components/padres/Ul";
import Li from "@/components/padres/Li";
import P from "@/components/padres/P";
import Span from "@/components/padres/Span";
import Titulos from "@/components/Titulos";
import BotonMostrarDetalles from "@/components/botones/BotonMostrarDetalles";
import EstadisticasEntidades from "@/components/dashboard/participantes/components/estadisticas/EstadisticasEntidades";

import { fetchCursos } from "@/store/features/cursos/thunks/todosCursos";
import { fetchCursosIdFormacion } from "@/store/features/cursos/thunks/cursosIdFormacion";
import { fetchTodasComunas } from "@/store/features/comunas/thunks/todasComunas";
import { fetchTodosCircuitos } from "@/store/features/circuitos/thunks/todosCircuitos";
import { fetchTodosConsejos } from "@/store/features/consejos/thunks/todosConsejos";

export default function EstadisticasParticipantes({
  registrosFiltrados,
  idFormacion,
}) {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchCursos());
    } else {
      dispatch(fetchCursosIdFormacion(idFormacion));
    }

    dispatch(fetchTodasComunas());
    dispatch(fetchTodosCircuitos());
    dispatch(fetchTodosConsejos());
  }, [dispatch, usuarioActivo, idFormacion]);

  const [abierto, setAbierto] = useState("");
  const [abiertoEntidad, setAbiertoEntidad] = useState({});

  const totalParticipantes = registrosFiltrados.length;

  const totalModulos = registrosFiltrados[0]?.asistencias?.length || 0;

  const faltantesPorModulo = {};
  const completadosPorModulo = {};

  for (let i = 0; i < totalModulos; i++) {
    const moduloIndex = i + 1;

    faltantesPorModulo[`Falta Módulo ${moduloIndex}`] =
      registrosFiltrados.filter(
        (r) => r.asistencias?.[i]?.presente !== true,
      ).length;

    completadosPorModulo[`Completado Módulo ${moduloIndex}`] =
      registrosFiltrados.filter(
        (r) => r.asistencias?.[i]?.presente === true,
      ).length;
  }

  const totalHombres = registrosFiltrados.filter(
    (r) => r.genero === true,
  ).length;

  const totalMujeres = registrosFiltrados.filter(
    (r) => r.genero === false,
  ).length;

  const totalAdultosMayoresHombres = registrosFiltrados.filter(
    (r) => r.genero === true && r.edad >= 60,
  ).length;

  const totalAdultosMayoresMujeres = registrosFiltrados.filter(
    (r) => r.genero === false && r.edad >= 55,
  ).length;

  const totalCertificados = registrosFiltrados.filter(
    (r) => r.estaCertificado === true,
  ).length;

  const totalVerificados = registrosFiltrados.filter(
    (r) => r.estaVerificado === true,
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
      const vocero = r;
      const entidadObj = vocero?.[claveEntidad];

      const entidadObjComunas = vocero?.[claveEntidad]
        ? vocero?.[claveEntidad]
        : "";

      //Asi estaba para mostrar solo si era vocero de comuna y no sonsejo comunal
      //const entidadObjComunas = vocero?.[claveEntidad] && !vocero?.consejos ? vocero?.[claveEntidad] : "";

      if (claveEntidad === "consejos" && !entidadObj?.nombre) return acc;
      if (claveEntidad === "comunas" && !entidadObjComunas?.nombre) return acc;

      const entidad = entidadObj?.nombre || `Sin ${claveEntidad}`;

      const cantidadModulos = r.asistencias.length;

      if (!acc[entidad]) {
        acc[entidad] = {
          Total: 0,
          Hombres: 0,
          Mujeres: 0,
          "Mayores Hombres": 0,
          "Mayores Mujeres": 0,
          Certificados: 0,
          Verificados: 0,
        };

        // Crear claves dinámicas para los módulos
        for (let i = 1; i <= cantidadModulos; i++) {
          acc[entidad][`Falta Módulo ${i}`] = 0;
        }
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

      for (let i = 0; i < r.asistencias.length; i++) {
        const modulo = r.asistencias[i];
        if (modulo.presente !== true) {
          acc[entidad][`Falta Módulo ${i + 1}`] += 1;
        }
      }

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
              : 0,
    };

    return (
      <Div className="w-full flex flex-col gap-2">
        <BotonMostrarDetalles
          toggleDetalles={() => toggleEntidad(entidad.parr)}
          nombre={titulo}
          index={entidad.parr}
          indice={true}
        />

        {abiertoEntidad[entidad.parr] && (
          <Div className="bg-[#ffffff] shadow-lg rounded-md p-2 sm:p-4 w-full border overflow-y-auto max-h-[470px] no-scrollbar">
            <Ul className="space-y-3">
              {Object.entries(datos).map(([clave, valores]) => {
                return (
                  <Li key={clave} className="border-b pb-2">
                    <Titulos
                      indice={5}
                      titulo={clave}
                      className={`text-[#193cb8] uppercase`}
                    />
                    <Div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-2 text-sm text-[#082158] mt-2">
                      {Object.entries(valores).map(([tipo, count]) => (
                        <P
                          key={tipo}
                          className="flex flex-col items-center sm:flex-row justify-between border border-[#d1d5dc] rounded-md p-2 bg-[#f3f4f6]"
                        >
                          <Span>{tipo}</Span>
                          <Span className="font-bold">{count}</Span>
                        </P>
                      ))}
                    </Div>
                  </Li>
                );
              })}
            </Ul>
          </Div>
        )}
      </Div>
    );
  };

  return (
    <Div className="p-1 sm:p-6 flex flex-col gap-2">
      <Titulos indice={2} titulo={"📊 Estadísticas Voceros"} />
      <Div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
        {[
          { titulo: "Participantes", valor: totalParticipantes },
          { titulo: "Hombres", valor: totalHombres },
          { titulo: "Mujeres", valor: totalMujeres },
          { titulo: "Hombres adulto mayor", valor: totalAdultosMayoresHombres },
          { titulo: "Mujeres adulta mayor", valor: totalAdultosMayoresMujeres },
          { titulo: "Certificados", valor: totalCertificados },
          { titulo: "Verificados", valor: totalVerificados },
        ]
          .concat(
            Object.entries(faltantesPorModulo).map(([titulo, valor]) => ({
              titulo,
              valor,
              color: "red",
            })),
            Object.entries(completadosPorModulo).map(([titulo, valor]) => ({
              titulo,
              valor,
              color: "green",
            })),
          )
          .map(({ titulo, valor, color = "blue" }) => (
            <Div
              key={titulo}
              className={`bg-${color}-50 border border-[#d1d5dc] shadow rounded-md text-center uppercase flex flex-col justify-center items-center p-2`}
            >
              <P className="text-sm text-[#4a5565] break-words text-center leading-tight">
                {titulo}
              </P>
              <P className={`text-xl font-bold text-${color}-700 mt-2`}>
                {valor}
              </P>
            </Div>
          ))}
      </Div>

      <Div className="rounded flex flex-col gap-2">
        <BotonMostrarDetalles
          toggleDetalles={toggleVocero}
          nombre={"Detalles por entidad"}
          index={1}
        />

        {abierto && (
          <Div className="flex flex-col gap-2 rounded-md p-2 border border-[#d1d5dc] hover:border-[#2FA807]">
            {renderListaExtendida(
              "Por Parroquia",
              generarEstadisticasPorEntidad("parroquias"),
            )}
            {renderListaExtendida(
              "Por Comuna",
              generarEstadisticasPorEntidad("comunas"),
            )}
            {renderListaExtendida(
              "Por Consejo Comunal",
              generarEstadisticasPorEntidad("consejos"),
            )}
          </Div>
        )}
      </Div>

      <Div className=" flex flex-col gap-2">
        <EstadisticasEntidades />
      </Div>
    </Div>
  );
}
