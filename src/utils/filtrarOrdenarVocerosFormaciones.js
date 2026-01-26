import { filtrarOrdenarParticipantes } from "@/utils/filtrarOrdenarParticipantes";

// Configuración de búsqueda y orden
export const camposBusqueda = [
  "cedula",
  "nombre",
  "apellido",
  "correo",
  "edad",
];

export const opcionesOrden = [
  { id: "cedula", nombre: "Cédula" },
  { id: "nombre", nombre: "Nombre" },
  { id: "apellido", nombre: "Apellido" },
  { id: "correo", nombre: "Correo" },
  { id: "edad", nombre: "Edad" },
  { id: "createdAt", nombre: "Fecha de registro" },
  { id: "parroquia", nombre: "Parroquia" },
  { id: "comuna", nombre: "Comuna" },
  { id: "circuito", nombre: "Circuito comunal" },
  { id: "consejo", nombre: "Consejo comunal" },
  { id: "formacion", nombre: "Formación" },
  { id: "modulo1", nombre: "Modulo I" },
  { id: "modulo2", nombre: "Modulo II" },
  { id: "modulo3", nombre: "Modulo III" },
];

export function prepararVocerosConCurso(todosParticipantes, usuarios) {
  return todosParticipantes?.map((curso) => {
    const vocero = curso.voceros;

    const totalAsistencias = curso.asistencias?.length || 0;
    const tieneAsistenciasPendientes = curso.asistencias?.some(
      (asistencia) => !asistencia.presente,
    );

    const tieneAsistenciasAprobada = curso.asistencias?.some(
      (asistencia) => asistencia.presente,
    );

    const estaVerificado = curso.verificado;
    const estaCertificado = curso.certificado;
    const estaCulminado = curso.culminado;
    const fechaVerificado = curso.fecha_verificado;
    const fechaCertificado = curso.fecha_certificado;

    // Extraer nombres de formaciones
    let nombresFormaciones = "";

    if (Array.isArray(curso.formaciones)) {
      nombresFormaciones = curso.formaciones.map((f) => f.nombre).join(", ");
    } else if (curso.formaciones) {
      nombresFormaciones = curso.formaciones.nombre;
    }

    // Extraer nombres de cargos
    let nombreCargos = "";

    if (Array.isArray(vocero.cargos)) {
      nombreCargos = vocero.cargos.map((f) => f.nombre).join(", ");
    } else if (vocero.cargos) {
      nombreCargos = vocero.cargos.nombre;
    }

    // Procesar asistencias con información del validador
    let asistenciasConValidador = [];
    let nombresModulos = "";

    if (Array.isArray(curso.asistencias)) {
      // Procesar cada asistencia para agregar info del validador
      asistenciasConValidador = curso.asistencias.map((asistencia) => {
        let nombreValidador = "";
        let nombreFormador = "";

        // Buscar el validador por id_validador en el array de usuarios
        if (asistencia.id_validador && usuarios) {
          const validador = usuarios.find(
            (user) => user.id === asistencia.id_validador,
          );

          const formador = usuarios.find(
            (user) => user.id === asistencia.id_formador,
          );

          if (validador) {
            nombreValidador = `${validador.nombre} ${validador.apellido}`;
          }

          if (formador) {
            nombreFormador = `${formador.nombre} ${formador.apellido}`;
          }
        }

        return {
          ...asistencia,
          nombreValidador: nombreValidador,
          nombreFormador: nombreFormador,
          moduloNombre: "modulo " + asistencia.id_modulo,
        };
      });

      // Crear string de módulos con validadores
      nombresModulos = asistenciasConValidador
        .map((a) => `${a.moduloNombre} (Validado por: ${a.nombreFormador})`)
        .join(", ");
    } else if (curso.asistencias) {
      nombresModulos = curso.asistencias.modulos?.nombre || "";
    }

    return {
      ...vocero,
      cursoId: curso.id,
      cursoNombre: curso.nombre,
      asistencias: asistenciasConValidador, // Asistencias con info de validador
      modulos: nombresModulos, // Módulos con nombres de validadores
      formaciones: curso.formaciones,
      formacion: nombresFormaciones,
      cargos: nombreCargos,
      totalAsistencias,
      asistenciaAprobada: tieneAsistenciasAprobada,
      puedeVerificar: !tieneAsistenciasPendientes,
      puedeCertificar: !tieneAsistenciasPendientes && estaVerificado,
      estaVerificado,
      estaCertificado,
      estaCulminado,
      fecha_verificado: fechaVerificado,
      fecha_certificado: fechaCertificado,
    };
  });
}
export function agruparParticipantes(voceros, campo) {
  return voceros.reduce((acc, item) => {
    let clave;

    switch (campo) {
      case "comuna":
        clave = item?.comunas?.nombre || "Sin comuna";
        break;

      case "consejo":
        clave = item?.consejos?.nombre || "Sin consejo";
        break;

      case "parroquia":
        clave = item?.parroquias?.nombre || "Sin parroquia";
        break;

      case "circuito":
        clave = item?.circuitos?.nombre || "Sin circuito";
        break;

      case "certificado":
        clave = item.estaCertificado ? "Certificado" : "No Certificado";
        break;

      case "validado":
        clave = item.estaVerificado ? "Validado" : "No Validado";
        break;

      default:
        // Para módulos: modulo1, modulo2, etc.
        const matchModulo = campo.match(/^modulo(\d+)$/);
        if (matchModulo) {
          const index = parseInt(matchModulo[1], 10) - 1;
          clave = item.asistencias?.[index]?.presente
            ? `Módulo ${index + 1} aprobado`
            : `Falta Módulo ${index + 1}`;
        } else {
          clave = item[campo] || "Sin información";
        }
        break;
    }

    if (!acc[clave]) acc[clave] = [];
    acc[clave].push(item);
    return acc;
  }, {});
}

export function obtenerParticipantesAgrupados(
  todosParticipantes,
  campoAgrupacion,
) {
  const vocerosConCurso = prepararVocerosConCurso(todosParticipantes);
  return agruparParticipantes(vocerosConCurso, campoAgrupacion);
}

// Función que aplica filtrado y ordenamiento
export function obtenerParticipantesFiltradosOrdenados(
  todosParticipantes,
  usuarios,
  busqueda,
  ordenCampo,
  ordenDireccion,
) {
  const vocerosConCurso = prepararVocerosConCurso(todosParticipantes, usuarios);

  return filtrarOrdenarParticipantes(
    vocerosConCurso,
    usuarios,
    busqueda,
    ordenCampo,
    ordenDireccion,
    camposBusqueda,
  );
}

export function obtenerParticipantesFiltradosAgrupados(
  todosParticipantes,
  usuarios,
  busqueda,
  ordenCampo,
  ordenDireccion,
  campoAgrupacion,
) {
  // 1. Preparar, filtrar y ordenar primero
  const vocerosConCurso = prepararVocerosConCurso(todosParticipantes, usuarios);

  const filtradosOrdenados = filtrarOrdenarParticipantes(
    vocerosConCurso,
    usuarios,
    busqueda,
    ordenCampo,
    ordenDireccion,
    camposBusqueda,
  );

  // 2. Agrupar sobre la lista ya filtrada y ordenada
  return agruparParticipantes(filtradosOrdenados, campoAgrupacion);
}
