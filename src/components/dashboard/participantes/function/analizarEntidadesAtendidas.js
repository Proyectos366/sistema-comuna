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
      agrupados_por_parroquia: {},
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
  resultado.comunas.agrupados_por_parroquia = agruparPorParroquia(
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
      // PARA NO ATENDIDOS: Obtener parroquia de la entidad original
      // Depende de cómo vengan tus datos (parroquias, parroquia, etc.)
      const parroquiaEntidad = entidad.parroquias || entidad.parroquia;

      resultado[tipo].no_atendidos.push({
        id: entidad.id,
        nombre: entidad.nombre,
        parroquia: parroquiaEntidad
          ? {
              id: parroquiaEntidad.id,
              nombre: parroquiaEntidad.nombre,
            }
          : null,
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
*/
