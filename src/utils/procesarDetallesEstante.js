/**
 Procesa los estantes para calcular pesos totales y detalles de carpetas
 @param {Array} todosEstantes - Lista de estantes obtenidos de Prisma
 @returns {Array} - Estantes procesados con pesos y totales
*/
export default function procesarDetallesEstante(todosEstantes) {
  // Si no hay estantes, retornar array vacío
  if (!todosEstantes || todosEstantes.length === 0) {
    return [];
  }

  // Aplicar el mismo map que tenías
  const detallesEstante = todosEstantes.map((estante) => {
    const pesoTotalEstante =
      estante.archivos?.reduce(
        (sum, archivo) => sum + (archivo.size || 0),
        0,
      ) || 0;

    // Procesar carpetas con sus pesos
    const carpetasConPeso = estante.carpetas.map((carpeta) => {
      return {
        ...carpeta,
        pesoTotalArchivos: 0, // Temporal hasta que definamos cómo calcularlo
      };
    });

    return {
      ...estante,
      carpetas: carpetasConPeso,
      pesoTotalEstante,
      totalArchivos: estante._count.archivos || 0,
      archivos: undefined,
    };
  });

  return detallesEstante;
}
