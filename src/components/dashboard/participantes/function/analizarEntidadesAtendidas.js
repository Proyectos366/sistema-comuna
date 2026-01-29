export function analizarEntidadesAtendidas(
  todosCursos,
  todasComunas,
  todosCircuitos,
  todosConsejos,
) {
  const resultado = {
    comunas: {
      atendidos: [],
      no_atendidos: [],
      total_atendidos: 0,
      total_no_atendidos: 0,
      agrupadas_por_parroquia: {},
    },
    circuitos: {
      atendidos: [],
      no_atendidos: [],
      total_atendidos: 0,
      total_no_atendidos: 0,
      agrupados_por_parroquia: {},
    },
    consejos: {
      atendidos: [],
      no_atendidos: [],
      total_atendidos: 0,
      total_no_atendidos: 0,
      agrupados_por_parroquia: {},
    },
  };

  const datosPorEntidad = {
    comunas: {},
    circuitos: {},
    consejos: {},
  };

  todosCursos.forEach((curso) => {
    procesarEntidad(curso, "comunas", curso.voceros?.comunas, datosPorEntidad);
    procesarEntidad(
      curso,
      "circuitos",
      curso.voceros?.circuitos,
      datosPorEntidad,
    );
    procesarEntidad(
      curso,
      "consejos",
      curso.voceros?.consejos,
      datosPorEntidad,
    );
  });

  procesarListaSimple(todasComunas, "comunas", datosPorEntidad, resultado);
  procesarListaSimple(todosCircuitos, "circuitos", datosPorEntidad, resultado);
  procesarListaSimple(todosConsejos, "consejos", datosPorEntidad, resultado);

  // AGREGAR AGRUPACIÓN POR PARROQUIA (sin perder datos originales)
  resultado.comunas.agrupadas_por_parroquia = agruparPorParroquia(
    resultado.comunas.atendidos,
  );
  resultado.circuitos.agrupados_por_parroquia = agruparPorParroquia(
    resultado.circuitos.atendidos,
  );
  resultado.consejos.agrupados_por_parroquia = agruparPorParroquia(
    resultado.consejos.atendidos,
  );

  return resultado;
}

function procesarEntidad(curso, tipo, entidad, datosPorEntidad) {
  if (!entidad) return;

  const entidadId = entidad.id;
  const key = `${tipo}_${entidadId}`;
  const parroquia = curso.voceros?.parroquias;
  const formacion = curso.formaciones;

  if (!datosPorEntidad[tipo][key]) {
    datosPorEntidad[tipo][key] = {
      id: entidadId,
      nombre: entidad.nombre,
      parroquia: parroquia
        ? {
            id: parroquia.id,
            nombre: parroquia.nombre,
          }
        : null,
      formacion: formacion
        ? {
            id: formacion.id,
            nombre: formacion.nombre,
          }
        : null,
      modulos: [],
      fechas: [],
    };
  }

  curso.asistencias?.forEach((asistencia) => {
    if (asistencia.fecha_validada) {
      datosPorEntidad[tipo][key].modulos.push({
        id: asistencia.id_modulo,
        validado: asistencia.presente,
        fecha_validada: asistencia.fecha_validada,
      });
      datosPorEntidad[tipo][key].fechas.push(asistencia.fecha_validada);
    }
  });
}

function procesarListaSimple(entidadesLista, tipo, datosPorEntidad, resultado) {
  if (!entidadesLista || !Array.isArray(entidadesLista)) return;

  entidadesLista.forEach((entidad) => {
    if (!entidad) return;

    const key = `${tipo}_${entidad.id}`;
    const datos = datosPorEntidad[tipo]?.[key];

    if (datos?.modulos?.length > 0) {
      const fechasOrdenadas = [...datos.fechas].sort();

      resultado[tipo].atendidos.push({
        id: entidad.id,
        nombre: entidad.nombre,
        parroquia: datos.parroquia,
        formacion: datos.formacion,
        modulos: datos.modulos,
        fecha_primer_atendido: fechasOrdenadas[0],
        fecha_ultimo_atendido: fechasOrdenadas[fechasOrdenadas.length - 1],
      });
    } else {
      resultado[tipo].no_atendidos.push({
        id: entidad.id,
        nombre: entidad.nombre,
        parroquia: null,
      });
    }
  });

  // ORDENAR por parroquia
  resultado[tipo].atendidos.sort((a, b) => {
    const parroquiaA = a.parroquia?.nombre || "";
    const parroquiaB = b.parroquia?.nombre || "";
    return parroquiaA.localeCompare(parroquiaB);
  });

  resultado[tipo].no_atendidos.sort((a, b) => {
    const parroquiaA = a.parroquia?.nombre || "";
    const parroquiaB = b.parroquia?.nombre || "";
    return parroquiaA.localeCompare(parroquiaB);
  });

  resultado[tipo].total_atendidos = resultado[tipo].atendidos.length;
  resultado[tipo].total_no_atendidos = resultado[tipo].no_atendidos.length;
}

// FUNCIÓN PARA AGRUPAR (no modifica los arrays originales)
function agruparPorParroquia(entidades) {
  return entidades.reduce((grupos, entidad) => {
    const parroquiaNombre = entidad.parroquia?.nombre || "Sin parroquia";

    if (!grupos[parroquiaNombre]) {
      grupos[parroquiaNombre] = {
        nombre: parroquiaNombre,
        cantidad: 0,
        entidades: [],
      };
    }

    grupos[parroquiaNombre].entidades.push(entidad);
    grupos[parroquiaNombre].cantidad++;

    return grupos;
  }, {});
}

/** 
export function analizarEntidadesAtendidas(
  todosCursos,
  todasComunas,
  todosCircuitos,
  todosConsejos,
) {
  // Estructura estandarizada - TODOS masculinos
  const resultado = {
    comunas: {
      atendidos: [],
      no_atendidos: [],
      total_atendidos: 0,
      total_no_atendidos: 0,
    },
    circuitos: {
      atendidos: [],
      no_atendidos: [],
      total_atendidos: 0,
      total_no_atendidos: 0,
    },
    consejos: {
      atendidos: [],
      no_atendidos: [],
      total_atendidos: 0,
      total_no_atendidos: 0,
    },
  };

  // 1. Procesar TODOS los cursos para acumular datos por entidad
  const datosPorEntidad = {
    comunas: {},
    circuitos: {},
    consejos: {},
  };

  todosCursos.forEach((curso) => {
    procesarEntidad(curso, "comunas", curso.voceros?.comunas, datosPorEntidad);
    procesarEntidad(
      curso,
      "circuitos",
      curso.voceros?.circuitos,
      datosPorEntidad,
    );
    procesarEntidad(
      curso,
      "consejos",
      curso.voceros?.consejos,
      datosPorEntidad,
    );
  });

  // 2. Procesar cada lista de entidades (versión simplificada)
  procesarListaSimple(todasComunas, "comunas", datosPorEntidad, resultado);
  procesarListaSimple(todosCircuitos, "circuitos", datosPorEntidad, resultado);
  procesarListaSimple(todosConsejos, "consejos", datosPorEntidad, resultado);

  return resultado;
}

function procesarEntidad(curso, tipo, entidad, datosPorEntidad) {
  if (!entidad) return;

  const entidadId = entidad.id;
  const key = `${tipo}_${entidadId}`;

  if (!datosPorEntidad[tipo][key]) {
    datosPorEntidad[tipo][key] = {
      id: entidadId,
      nombre: entidad.nombre,
      modulos: [],
      fechas: [],
    };
  }

  curso.asistencias?.forEach((asistencia) => {
    if (asistencia.fecha_validada) {
      datosPorEntidad[tipo][key].modulos.push({
        id: asistencia.id_modulo,
        validado: asistencia.presente,
        fecha_validada: asistencia.fecha_validada,
      });
      datosPorEntidad[tipo][key].fechas.push(asistencia.fecha_validada);
    }
  });
}

function procesarListaSimple(entidadesLista, tipo, datosPorEntidad, resultado) {
  if (!entidadesLista || !Array.isArray(entidadesLista)) return;

  entidadesLista.forEach((entidad) => {
    if (!entidad) return;

    const key = `${tipo}_${entidad.id}`;
    const datos = datosPorEntidad[tipo]?.[key];

    if (datos?.modulos?.length > 0) {
      const fechasOrdenadas = [...datos.fechas].sort();

      resultado[tipo].atendidos.push({
        id: entidad.id,
        nombre: entidad.nombre,
        modulos: datos.modulos,
        fecha_primer_atendido: fechasOrdenadas[0],
        fecha_ultimo_atendido: fechasOrdenadas[fechasOrdenadas.length - 1],
      });
    } else {
      resultado[tipo].no_atendidos.push({
        id: entidad.id,
        nombre: entidad.nombre,
      });
    }
  });

  resultado[tipo].total_atendidos = resultado[tipo].atendidos.length;
  resultado[tipo].total_no_atendidos = resultado[tipo].no_atendidos.length;
}
*/

// export function analizarEntidadesAtendidas(
//   todosCursos,
//   todasComunas,
//   todosCircuitos,
//   todosConsejos,
// ) {
//   // Estructuras para el resultado final
//   const resultado = {
//     comunas: {
//       atendidas: [],
//       no_atendidas: [],
//       total_atendidas: 0,
//       total_no_atendidas: 0,
//     },
//     circuitos: {
//       atendidos: [],
//       no_atendidos: [],
//       total_atendidos: 0,
//       total_no_atendidos: 0,
//     },
//     consejos: {
//       atendidos: [],
//       no_atendidos: [],
//       total_atendidos: 0,
//       total_no_atendidos: 0,
//     },
//   };

//   // 1. Procesar TODOS los cursos para acumular datos por entidad
//   const datosPorEntidad = {
//     comunas: {},
//     circuitos: {},
//     consejos: {},
//   };

//   todosCursos.forEach((curso) => {
//     procesarEntidad(curso, "comunas", curso.voceros?.comunas, datosPorEntidad);
//     procesarEntidad(
//       curso,
//       "circuitos",
//       curso.voceros?.circuitos,
//       datosPorEntidad,
//     );
//     procesarEntidad(
//       curso,
//       "consejos",
//       curso.voceros?.consejos,
//       datosPorEntidad,
//     );
//   });

//   // 2. Procesar cada lista de entidades
//   procesarListaEntidades(todasComunas, "comunas", datosPorEntidad, resultado);
//   procesarListaEntidades(
//     todosCircuitos,
//     "circuitos",
//     datosPorEntidad,
//     resultado,
//   );

//   procesarListaEntidades(todosConsejos, "consejos", datosPorEntidad, resultado);

//   return resultado;
// }

// // Función auxiliar para procesar una entidad específica
// function procesarEntidad(curso, tipo, entidad, datosPorEntidad) {
//   if (!entidad) return;

//   const entidadId = entidad.id;
//   const key = `${tipo}_${entidadId}`;

//   if (!datosPorEntidad[tipo][key]) {
//     datosPorEntidad[tipo][key] = {
//       id: entidadId,
//       nombre: entidad.nombre,
//       modulos: [],
//       fechas: [],
//     };
//   }

//   // Agregar módulos del curso actual
//   curso.asistencias?.forEach((asistencia) => {
//     if (asistencia.fecha_validada) {
//       datosPorEntidad[tipo][key].modulos.push({
//         id: asistencia.id_modulo,
//         validado: asistencia.presente,
//         fecha_validada: asistencia.fecha_validada,
//       });
//       datosPorEntidad[tipo][key].fechas.push(asistencia.fecha_validada);
//     }
//   });
// }

// function procesarListaEntidades(
//   entidadesLista,
//   tipo,
//   datosPorEntidad,
//   resultado,
// ) {
//   if (!entidadesLista || !Array.isArray(entidadesLista)) return;

//   // Determinar si es femenino (comunas) o masculino (circuitos, consejos)
//   const esFemenino = tipo === "comunas";
//   const claveAtendidas = esFemenino ? "atendidas" : "atendidos";
//   const claveNoAtendidas = esFemenino ? "no_atendidas" : "no_atendidos";

//   entidadesLista.forEach((entidad) => {
//     if (!entidad) return;

//     const key = `${tipo}_${entidad.id}`;
//     const datos = datosPorEntidad[tipo]?.[key];

//     if (datos?.modulos?.length > 0) {
//       const fechasOrdenadas = [...datos.fechas].sort();

//       resultado[tipo][claveAtendidas]?.push({
//         id: entidad.id,
//         nombre: entidad.nombre,
//         modulos: datos.modulos,
//         fecha_primer_atendido: fechasOrdenadas[0],
//         fecha_ultimo_atendido: fechasOrdenadas[fechasOrdenadas.length - 1],
//       });
//     } else {
//       resultado[tipo][claveNoAtendidas]?.push({
//         id: entidad.id,
//         nombre: entidad.nombre,
//       });
//     }
//   });

//   resultado[tipo].total_atendidas = resultado[tipo][claveAtendidas]?.length || 0;
//   resultado[tipo].total_no_atendidas = resultado[tipo][claveNoAtendidas]?.length || 0;
// }

/** 
// Función para procesar la lista completa de entidades
function procesarListaEntidades(
  entidadesLista,
  tipo,
  datosPorEntidad,
  resultado,
) {
  // Verifica que entidadesLista exista y sea array
  if (!entidadesLista || !Array.isArray(entidadesLista)) {
    console.error(
      `entidadesLista para ${tipo} no es un array válido:`,
      entidadesLista,
    );
    return;
  }

  entidadesLista.forEach((entidad) => {
    // Verifica que entidad exista
    if (!entidad) return;

    const key = `${tipo}_${entidad.id}`;
    const datos = datosPorEntidad[tipo]?.[key]; // Usa optional chaining

    if (datos?.modulos?.length > 0) {
      const fechasOrdenadas = [...datos.fechas].sort();

      resultado[tipo].atendidas?.push({
        id: entidad.id,
        nombre: entidad.nombre,
        modulos: datos.modulos,
        fecha_primer_atendido: fechasOrdenadas[0],
        fecha_ultimo_atendido: fechasOrdenadas[fechasOrdenadas.length - 1],
      });
    } else {
      resultado[tipo]?.no_atendidas?.push({
        id: entidad.id,
        nombre: entidad.nombre,
      });
    }
  });

  resultado[tipo].total_atendidas = resultado[tipo].atendidas?.length;
  resultado[tipo].total_no_atendidas = resultado[tipo].no_atendidas?.length;
}
*/
