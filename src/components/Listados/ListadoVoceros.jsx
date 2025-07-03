import { useState, useMemo } from "react";
import Input from "../inputs/Input";
import { formatearFecha } from "@/utils/Fechas";
import DetallesListadoVoceros from "./DetallesListadoVoceros";

export default function ListadoVoceros({ voceros, editar }) {
  // --- Hooks y lógica que deben ejecutarse siempre, sin condiciones, al inicio del componente ---
  const [abierto, setAbierto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra los voceros según el término de búsqueda usando useMemo
  // Esto asegura que el filtrado solo se recalcule cuando 'voceros' o 'searchTerm' cambian.
  const filteredVoceros = useMemo(() => {
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
  // Estas variables se recalculan automáticamente cada vez que filteredVoceros cambia.
  const totalVoceros = filteredVoceros?.length;
  const totalHombres = filteredVoceros?.filter(
    (vocero) => vocero.genero === true
  ).length;
  const totalMujeres = filteredVoceros?.filter(
    (vocero) => vocero.genero === false
  ).length;
  const totalAdultosMayoresHombres = filteredVoceros?.filter(
    (vocero) => vocero.genero === true && vocero.edad >= 60
  ).length;
  const totalAdultosMayoresMujeres = filteredVoceros?.filter(
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
    <div className="p-6 w-full flex flex-col gap-4 bg-white rounded-md shadow-lg">
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

      {/* Mensaje si no hay resultados de búsqueda */}
      {filteredVoceros.length === 0 && searchTerm !== "" ? (
        <div className="w-full bg-white p-4 rounded-md shadow-lg text-center">
          <p className="text-red-600 font-semibold">
            No se encontraron voceros que coincidan con la búsqueda.
          </p>
        </div>
      ) : (
        // Mapea y muestra los voceros filtrados
        filteredVoceros.map((vocero, index) => (
          <div
            key={vocero.cedula || index}
            className="bg-gray-200 px-4 py-2 rounded-md shadow-md"
          >
            <button
              onClick={() => toggleVocero(index)}
              className="w-full text-left text-white font-bold text-lg sm:text-xl tracking-wide bg-[#082158] py-2 px-4 rounded-md transition-all duration-300 hover:bg-blue-900 focus:outline-none cursor-pointer uppercase"
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
        ))
      )}
    </div>
  );
}
