import { useState, useMemo } from "react";
import Input from "../inputs/Input";
import DetallesListadoVoceros from "./DetallesListadoVoceros";
import ItemsInputPorPagina from "./ItemsInputPorPagina";
import Leyenda from "./Leyenda";

export default function ListadoVoceros({ voceros, editar }) {
  const [abierto, setAbierto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(5);

  const vocerosFiltrados = useMemo(() => {
    if (!searchTerm) return voceros;
    const lower = searchTerm.toLowerCase();
    return voceros.filter((vocero) =>
      Object.values(vocero).some((value) => {
        if (typeof value === "string" || typeof value === "number") {
          return String(value).toLowerCase().includes(lower);
        }
        if (typeof value === "boolean") {
          return (value ? "masculino" : "femenino").includes(lower);
        }
        if (typeof value === "object" && value !== null) {
          if (
            value.nombre &&
            String(value.nombre).toLowerCase().includes(lower)
          )
            return true;
          if (Array.isArray(value)) {
            return value.some((item) =>
              Object.values(item).some((itemValue) => {
                if (
                  typeof itemValue === "string" ||
                  typeof itemValue === "number"
                ) {
                  return String(itemValue).toLowerCase().includes(lower);
                }
                if (typeof itemValue === "boolean") {
                  return (itemValue ? "sí" : "no").includes(lower);
                }
                if (
                  typeof itemValue === "object" &&
                  itemValue !== null &&
                  itemValue.nombre
                ) {
                  return String(itemValue.nombre).toLowerCase().includes(lower);
                }
                return false;
              })
            );
          }
        }
        return false;
      })
    );
  }, [voceros, searchTerm]);

  // Estadísticas
  const totalVoceros = vocerosFiltrados.length;
  const totalHombres = vocerosFiltrados.filter((v) => v.genero === true).length;
  const totalMujeres = vocerosFiltrados.filter(
    (v) => v.genero === false
  ).length;
  const totalAdultosMayoresHombres = vocerosFiltrados.filter(
    (v) => v.genero === true && v.edad >= 60
  ).length;
  const totalAdultosMayoresMujeres = vocerosFiltrados.filter(
    (v) => v.genero === false && v.edad >= 55
  ).length;

  const totalPaginas = Math.ceil(totalVoceros / itemsPorPagina);

  const vocerosPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    return vocerosFiltrados.slice(inicio, fin);
  }, [vocerosFiltrados, paginaActual, itemsPorPagina]);

  const toggleVocero = (index) => {
    setAbierto(abierto === index ? null : index);
  };

  const irPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const incrementarItems = () =>
    setItemsPorPagina((prev) => Math.min(prev + 1, 100));

  const reducirItems = () => setItemsPorPagina((prev) => Math.max(prev - 1, 1));

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
    <div className="sm:p-6 w-full flex flex-col gap-4 bg-white rounded-md shadow-lg">
      <div className="flex flex-col gap-2 sm:gap-4 bg-gray-100 p-4 rounded-md">
        <Input
          type="text"
          placeholder="Buscar por nombre, cédula, parroquia, curso..."
          value={searchTerm}
          className="bg-white"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPaginaActual(1);
          }}
        />

        <ItemsInputPorPagina
          reducirItems={reducirItems}
          itemsPorPagina={itemsPorPagina}
          setItemsPorPagina={setItemsPorPagina}
          incrementarItems={incrementarItems}
        />
      </div>

      {/* Voceros filtrados por página */}
      {vocerosPagina.length === 0 && searchTerm !== "" ? (
        <div className="w-full bg-white p-4 rounded-md shadow-lg text-center">
          <p className="text-red-600 font-semibold">
            No se encontraron voceros que coincidan con la búsqueda.
          </p>
        </div>
      ) : (
        vocerosPagina.map((vocero, index) => {
          const tieneCursosNoVerificados = vocero.cursos?.some(
            (curso) => curso.verificado === true
          );

          return (
            <div
              key={vocero.cedula || index}
              className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
            >
              <button
                onClick={() => toggleVocero(index)}
                className={`w-full text-left text-white font-semibold text-lg tracking-wide
                  ${
                    tieneCursosNoVerificados
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-[#082158] hover:bg-[#051a40]"
                  }
                  py-1 px-4 rounded-md transition-all duration-300 focus:outline-none cursor-pointer uppercase`}
              >
                {vocero.nombre} {vocero.nombre_dos} {vocero.apellido}{" "}
                {vocero.apellido_dos}
              </button>

              <DetallesListadoVoceros
                abierto={abierto}
                index={index}
                vocero={vocero}
                editar={editar}
              />
            </div>
          );
        })
      )}

      <div className="flex flex-col bg-gray-100 p-4 rounded-md">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4 items-center">
            <button
              onClick={irPaginaAnterior}
              disabled={paginaActual === 1}
              className={`px-3 py-1 rounded bg-blue-600 text-white ${
                paginaActual === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              Anterior
            </button>
            <span className="text-sm font-semibold">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              onClick={irPaginaSiguiente}
              disabled={paginaActual === totalPaginas}
              className={`px-3 py-1 rounded bg-blue-600 text-white ${
                paginaActual === totalPaginas
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-4 ">
          <Leyenda
            titulo={"Total voceros"}
            totalVoceros={totalVoceros}
            totalHombres={totalHombres}
            totalMujeres={totalMujeres}
          />

          <Leyenda
            titulo={"Total adultos mayor"}
            totalVoceros={
              totalAdultosMayoresHombres + totalAdultosMayoresMujeres
            }
            totalHombres={totalAdultosMayoresHombres}
            totalMujeres={totalAdultosMayoresMujeres}
          />
        </div>
      </div>
    </div>
  );
}

/**
import { useState, useMemo } from "react";
import Input from "../inputs/Input";
import DetallesListadoVoceros from "./DetallesListadoVoceros";

export default function ListadoVoceros({ voceros, editar }) {
  // --- Hooks y lógica que deben ejecutarse siempre, sin condiciones, al inicio del componente ---
  const [abierto, setAbierto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra los voceros según el término de búsqueda usando useMemo
  // Esto asegura que el filtrado solo se recalcule cuando 'voceros' o 'searchTerm' cambian.
  const vocerosFiltrados = useMemo(() => {
    if (!searchTerm) {
      return voceros;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return voceros.filter((vocero) =>
      Object.values(vocero).some((value) => {
        if (typeof value === "string" || typeof value === "number") {
          return String(value).toLowerCase().includes(lowerCaseSearchTerm);
        }
        if (typeof value === "boolean") {
          // Para manejar el género (true/false)
          const genderText = value ? "masculino" : "femenino";
          return genderText.includes(lowerCaseSearchTerm);
        }
        if (typeof value === "object" && value !== null) {
          // Busca en objetos anidados como parroquias, comunas, consejos
          if (
            value.nombre &&
            String(value.nombre).toLowerCase().includes(lowerCaseSearchTerm)
          ) {
            return true;
          }
          // Busca dentro de los cursos y sus datos anidados
          if (Array.isArray(value)) {
            return value.some((item) =>
              Object.values(item).some((itemValue) => {
                if (
                  typeof itemValue === "string" ||
                  typeof itemValue === "number"
                ) {
                  return String(itemValue)
                    .toLowerCase()
                    .includes(lowerCaseSearchTerm);
                }
                if (typeof itemValue === "boolean") {
                  // Para manejar verificado/certificado/presente
                  const booleanText = itemValue ? "sí" : "no";
                  return booleanText.includes(lowerCaseSearchTerm);
                }
                if (
                  typeof itemValue === "object" &&
                  itemValue !== null &&
                  itemValue.nombre
                ) {
                  return String(itemValue.nombre)
                    .toLowerCase()
                    .includes(lowerCaseSearchTerm);
                }
                return false;
              })
            );
          }
        }
        return false;
      })
    );
  }, [voceros, searchTerm]);

  // Calcula las estadísticas del resumen basadas en los voceros filtrados
  // Estas variables se recalculan automáticamente cada vez que vocerosFiltrados cambia.
  const totalVoceros = vocerosFiltrados?.length;
  const totalHombres = vocerosFiltrados?.filter(
    (vocero) => vocero.genero === true
  ).length;
  const totalMujeres = vocerosFiltrados?.filter(
    (vocero) => vocero.genero === false
  ).length;
  const totalAdultosMayoresHombres = vocerosFiltrados?.filter(
    (vocero) => vocero.genero === true && vocero.edad >= 60
  ).length;
  const totalAdultosMayoresMujeres = vocerosFiltrados?.filter(
    (vocero) => vocero.genero === false && vocero.edad >= 55
  ).length;

  const toggleVocero = (index) => {
    setAbierto(abierto === index ? null : index);
  };
  // --- Fin de Hooks y lógica inicial ---

  // Este retorno temprano está bien porque se ejecuta DESPUÉS de todos los Hooks.
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
    <div className="sm:p-6 w-full flex flex-col gap-4 bg-white rounded-md shadow-lg">
      <div className="bg-gray-100 p-4 rounded-md shadow-inner gap-4">
        <div>
          <Input
            type="text"
            placeholder="Buscar por nombre, cédula, parroquia, curso..."
            value={searchTerm}
            className={`bg-white`}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-4">
          <div className="border borde-fondo w-full p-2 rounded-md">
            <div className="flex justify-between">
              <span className="font-semibold">Total de voceros:</span>
              <b>{totalVoceros}</b>
            </div>

            <div>
              <div className="flex justify-between">
                <span className="font-semibold">Cantidad de hombres:</span>
                <b>{totalHombres}</b>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Cantidad de mujeres:</span>
                <b>{totalMujeres}</b>
              </div>
            </div>
          </div>

          <div className="border border-red-600 w-full p-2 rounded-md">
            <div className="flex justify-between">
              <span className="font-semibold">Total adultos mayores:</span>
              <b>{totalAdultosMayoresHombres + totalAdultosMayoresMujeres}</b>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="font-semibold">Cantidad de hombres:</span>
                <b>{totalAdultosMayoresHombres}</b>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Cantidad de mujeres:</span>
                <b>{totalAdultosMayoresMujeres}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      {vocerosFiltrados.length === 0 && searchTerm !== "" ? (
        <div className="w-full bg-white p-4 rounded-md shadow-lg text-center">
          <p className="text-red-600 font-semibold">
            No se encontraron voceros que coincidan con la búsqueda.
          </p>
        </div>
      ) : (
        // Mapea y muestra los voceros filtrados
        vocerosFiltrados.map((vocero, index) => {
          const tieneCursosNoVerificados = vocero.cursos?.some(
            (curso) => curso.verificado === true
          );

          return (
            <div
              key={vocero.cedula || index}
              className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
            >
              <button
                onClick={() => toggleVocero(index)}
                className={`w-full text-left text-white font-semibold text-lg tracking-wide
                ${
                  tieneCursosNoVerificados
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-[#082158] hover:bg-[#051a40]"
                }  py-1 px-4 rounded-md transition-all duration-300  focus:outline-none cursor-pointer uppercase`}
              >
                {vocero.nombre} {vocero.nombre_dos} {vocero.apellido}{" "}
                {vocero.apellido_dos}
              </button>

              <DetallesListadoVoceros
                abierto={abierto}
                index={index}
                vocero={vocero}
                editar={editar}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
 */
