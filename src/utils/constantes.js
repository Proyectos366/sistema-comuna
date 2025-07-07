import path from "path";

export const rutaAlProyecto = path.resolve(process.cwd(), "src");
//console.log(rutaAlProyecto);

export const phoneRegex = /^0[0-9]{10}$/;

export const voceroRecibido = {
  nombre: "gabriela",
  nombre_dos: null,
  apellido: "mendez",
  apellido_dos: null,
  cedula: 21259244,
  edad: 67,
  genero: false,
  correo: "gabriela@gmail.com",
  telefono: "04144888094",
  laboral: "ama de casa",
  certificado: false,
  verificado: false,
  circuitos: null,
  comunas: {
    id: 4,
    id_parroquia: 5,
    nombre: "grandes luchadores por tocoron",
  },
  consejos: {
    nombre: "barrio lindo",
  },
  cursos: [
    {
      certificado: false,
      verificado: false,
      formaciones: {
        nombre: "primera formacion",
      },
      asistencias: [
        {
          id: 58,
          presente: false,
          fecha_registro: "2025-07-07T12:47:21.607Z",
          modulos: {
            id: 1,
            nombre: "modulo i",
          },
        },
        {
          id: 59,
          presente: false,
          fecha_registro: "2025-07-07T12:47:21.609Z",
          modulos: {
            id: 2,
            nombre: "modulo ii",
          },
        },
        {
          id: 60,
          presente: false,
          fecha_registro: "2025-07-07T12:47:21.612Z",
          modulos: {
            id: 3,
            nombre: "modulo iii",
          },
        },
      ],
    },
  ],
  formaciones: [
    {
      nombre: "primera formacion",
    },
  ],
  parroquias: {
    nombre: "augusto mijares",
  },
};
