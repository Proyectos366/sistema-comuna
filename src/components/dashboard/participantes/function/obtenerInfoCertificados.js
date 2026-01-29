export function obtenerInfoCertificados(cursos) {
  return cursos?.map((curso) => ({
    fecha_certificado: curso.fecha_certificado,
    modulo: curso.asistencias?.[0]
      ? {
          id: curso.asistencias[0].id,
          nombre:
            curso.asistencias[0].modulos?.nombre ||
            `Módulo ${curso.asistencias[0].id_modulo}`,
          fecha_validada: curso.asistencias[0].fecha_validada,
        }
      : null,
    comuna: {
      id: curso.voceros?.comunas?.id,
      nombre: curso.voceros?.comunas?.nombre,
    },
    circuito: {
      id: curso.voceros?.circuitos?.id,
      nombre: curso.voceros?.circuitos?.nombre,
    },
    consejo: {
      id: curso.voceros?.consejos?.id,
      nombre: curso.voceros?.consejos?.nombre,
    },
  }));
}
