import { filtrarOrdenar } from "@/utils/filtrarOrdenar"; // si ya tienes la función en otro archivo

// Configuración de búsqueda y orden
export const camposBusqueda = ["cedula", "nombre", "correo"];

export const opcionesOrden = [
  { id: "cedula", nombre: "Cédula" },
  { id: "nombre", nombre: "Nombre" },
  { id: "correo", nombre: "Correo" },
  { id: "edad", nombre: "Edad" },
  { id: "createdAt", nombre: "Fecha de registro" },
  { id: "formacion", nombre: "Formación" },
  { id: "modulo1", nombre: "Modulo I" },
  { id: "modulo2", nombre: "Modulo II" },
  { id: "modulo3", nombre: "Modulo III" },
];

export function prepararVocerosConCurso(todosParticipantes) {
  return todosParticipantes?.map((curso) => {
    const vocero = curso.voceros;

    const totalAsistencias = curso.asistencias?.length || 0;
    const tieneAsistenciasPendientes = curso.asistencias?.some(
      (asistencia) => !asistencia.presente
    );

    const tieneAsistenciasAprobada = curso.asistencias?.some(
      (asistencia) => asistencia.presente
    );

    const estaVerificado = curso.verificado;
    const estaCertificado = curso.certificado;

    // Extraer nombres de formaciones
    let nombresFormaciones = "";

    if (Array.isArray(curso.formaciones)) {
      nombresFormaciones = curso.formaciones.map((f) => f.nombre).join(", ");
    } else if (curso.formaciones) {
      nombresFormaciones = curso.formaciones.nombre;
    }

    // Extraer nombres de formaciones
    let nombresModulos = "";

    if (Array.isArray(curso.asistencias)) {
      nombresModulos = curso.asistencias.map((f) => f.asistencia).join(", ");
    } else if (curso.asistencias) {
      nombresModulos = curso.asistencias.modulos;
    }

    return {
      ...vocero,
      cursoId: curso.id,
      cursoNombre: curso.nombre,
      asistencias: curso.asistencias,
      modulos: nombresModulos,
      formaciones: curso.formaciones,
      formacion: nombresFormaciones,
      totalAsistencias,
      asistenciaAprobada: tieneAsistenciasAprobada,
      puedeVerificar: !tieneAsistenciasPendientes,
      puedeCertificar: !tieneAsistenciasPendientes && estaVerificado,
      estaVerificado,
      estaCertificado,
    };
  });
}

// Función que aplica filtrado y ordenamiento
export function obtenerParticipantesFiltradosOrdenados(
  todosParticipantes,
  busqueda,
  ordenCampo,
  ordenDireccion
) {
  const vocerosConCurso = prepararVocerosConCurso(todosParticipantes);

  return filtrarOrdenar(
    vocerosConCurso,
    busqueda,
    ordenCampo,
    ordenDireccion,
    camposBusqueda
  );
}

/**
export function prepararVocerosConCurso(todosParticipantes) {
  return todosParticipantes?.map((curso) => {
    const vocero = curso.voceros;

    const totalAsistencias = curso.asistencias?.length || 0;
    const tieneAsistenciasPendientes = curso.asistencias?.some(
      (asistencia) => !asistencia.presente
    );
    const estaVerificado = curso.verificado;
    const estaCertificado = curso.certificado;

    return {
      ...vocero,
      cursoId: curso.id,
      cursoNombre: curso.nombre,
      asistencias: curso.asistencias,
      modulos: curso.formaciones?.modulos || [],
      formaciones: curso.formaciones,
      totalAsistencias,
      puedeVerificar: !tieneAsistenciasPendientes,
      puedeCertificar: !tieneAsistenciasPendientes && estaVerificado,
      estaVerificado,
      estaCertificado,
    };
  });
}
*/

/** 
// Función que recibe los cursos y devuelve voceros con curso + asistencias/modulos
export function prepararVocerosConCurso(todosParticipantes) {
  return todosParticipantes?.map((curso) => {
    const vocero = curso.voceros; // es un objeto único

    return {
      ...vocero,
      cursoId: curso.id,
      cursoNombre: curso.nombre,
      asistencias: curso.asistencias,
      modulos: curso.formaciones?.modulos || [],
    };
  });
}
*/
