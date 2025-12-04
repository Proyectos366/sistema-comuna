import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Crear roles iniciales
  await prisma.role.createMany({
    data: [
      {
        nombre: "master",
        descripcion:
          "rol con acceso total al sistema, puede operar todo el código y realizar cualquier acción sin restricciones.",
      },
      {
        nombre: "administrador",
        descripcion:
          "encargado de administrar únicamente la institución a la que pertenece, con permisos de gestión limitados a su ámbito.",
      },
      {
        nombre: "director",
        descripcion:
          "responsable de supervisar su departamento y tomar decisiones de dicho departamento.",
      },
      {
        nombre: "empleado",
        descripcion:
          "usuario con permisos básicos para ejecutar tareas operativas y acceder solo a las funciones necesarias para su trabajo.",
      },
    ],
  });

  // Crear un usuario inicial conectado al rol Master
  await prisma.usuario.createMany({
    data: [
      {
        cedula: 21259230,
        nombre: "carlos",
        apellido: "peraza",
        correo: "carlosjperazab@gmail.com",
        token: "6w2r5ks4rb1gd4r1",
        validado: true,
        clave: "$2a$05$qv5dKCZmInzicTS5D0BFu.ThM5g99ScAkKKDjqKfQzMraQjhRnqgS",
        id_rol: 1,
      },
      {
        cedula: 20960870,
        nombre: "jhorjan",
        apellido: "cordova",
        correo: "jhorjan2013@gmail.com",
        token: "cs9vot27ih0vm4tb",
        validado: true,
        id_rol: 2,
        clave: "$2a$05$029a1Dus7qStop21IuIKCOgGtrge/F6LvDwGgb9pnxz5/uqEQ3MU.",
      },
    ],
  });

  // Crear un pais inicial
  await prisma.pais.create({
    data: {
      nombre: "venezuela",
      capital: "caracas",
      serial: "ven",
      id_usuario: 1,
    },
  });

  // Crear estados inicial para un pais
  await prisma.estado.createMany({
    data: [
      {
        nombre: "amazonas",
        capital: "puerto ayacucho",
        cod_postal: "7101",
        serial: "ven-01",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "anzoátegui",
        capital: "barcelona",
        cod_postal: "6001",
        serial: "ven-02",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "apure",
        capital: "san fernando de apure",
        cod_postal: "7001",
        serial: "ven-03",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "aragua",
        capital: "maracay",
        cod_postal: "2101",
        serial: "ven-04",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "barinas",
        capital: "barinas",
        cod_postal: "5201",
        serial: "ven-05",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "bolívar",
        capital: "ciudad bolívar",
        cod_postal: "8001",
        serial: "ven-06",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "carabobo",
        capital: "valencia",
        cod_postal: "2001",
        serial: "ven-07",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "cojedes",
        capital: "san carlos",
        cod_postal: "2201",
        serial: "ven-08",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "delta amacuro",
        capital: "tucupita",
        cod_postal: "6401",
        serial: "ven-09",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "falcón",
        capital: "coro",
        cod_postal: "4101",
        serial: "ven-10",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "guárico",
        capital: "san juan de los morros",
        cod_postal: "2301",
        serial: "ven-11",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "lara",
        capital: "barquisimeto",
        cod_postal: "3001",
        serial: "ven-12",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "mérida",
        capital: "mérida",
        cod_postal: "5101",
        serial: "ven-13",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "miranda",
        capital: "los teques",
        cod_postal: "1201",
        serial: "ven-14",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "monagas",
        capital: "maturín",
        cod_postal: "6201",
        serial: "ven-15",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "nueva esparta",
        capital: "la asunción",
        cod_postal: "6301",
        serial: "ven-16",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "portuguesa",
        capital: "guanare",
        cod_postal: "3350",
        serial: "ven-17",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "sucre",
        capital: "cumaná",
        cod_postal: "6101",
        serial: "ven-18",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "tachira",
        capital: "san cristóbal",
        cod_postal: "5001",
        serial: "ven-19",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "trujillo",
        capital: "trujillo",
        cod_postal: "3150",
        serial: "ven-20",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "vargas",
        capital: "la guaira",
        cod_postal: "1160",
        serial: "ven-21",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "yaracuy",
        capital: "san felipe",
        cod_postal: "3201",
        serial: "ven-22",
        id_pais: 1,
        id_usuario: 1,
      },
      {
        nombre: "zulia",
        capital: "maracaibo",
        cod_postal: "4001",
        serial: "ven-23",
        id_pais: 1,
        id_usuario: 1,
      },
    ],
  });

  // Crear municipios inicial para un estado
  await prisma.municipio.createMany({
    data: [
      {
        nombre: "bolívar",
        serial: "ven-01-01",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "camatagua",
        serial: "ven-01-02",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "francisco linares alcántara",
        serial: "ven-01-03",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "girardot",
        serial: "ven-01-04",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "josé ángel lamas",
        serial: "ven-01-05",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "josé félix ribas",
        serial: "ven-01-06",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "josé rafael revenga",
        serial: "ven-01-07",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "libertador",
        serial: "ven-01-08",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "mario briceño iragorry",
        serial: "ven-01-09",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "san casimiro",
        serial: "ven-01-10",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "san sebastián",
        serial: "ven-01-11",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "santiago mariño",
        serial: "ven-01-12",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "sucre",
        serial: "ven-01-13",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "tovar",
        serial: "ven-01-14",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "urdaneta",
        serial: "ven-01-15",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "zamora",
        serial: "ven-01-16",
        id_estado: 4,
        id_usuario: 1,
      },
    ],
  });

  // Crear parroquias inicial para un municipio
  await prisma.parroquia.createMany({
    data: [
      {
        nombre: "augusto mijares",
        serial: "ven-01-01-01",
        id_municipio: 16,
        id_usuario: 1,
      },
      {
        nombre: "magdaleno",
        serial: "ven-01-01-02",
        id_municipio: 16,
        id_usuario: 1,
      },
      {
        nombre: "san francisco",
        serial: "ven-01-01-03",
        id_municipio: 16,
        id_usuario: 1,
      },
      {
        nombre: "valle de tucutunemo",
        serial: "ven-01-01-04",
        id_municipio: 16,
        id_usuario: 1,
      },
      {
        nombre: "villa de cura",
        serial: "ven-01-01-05",
        id_municipio: 16,
        id_usuario: 1,
      },
    ],
  });

  // Crear una institucion inicial
  await prisma.institucion.create({
    data: {
      nombre: "contraloria del municipio zamora",
      descripcion: "contraloria del municipio zamora del estado aragua",
      rif: "G-20001980-8",
      sector: "la coromoto",
      direccion: "calle principal",
      id_usuario: 1,
      id_pais: 1,
      id_estado: 4,
      id_municipio: 16,
      id_parroquia: 5,
    },
  });

  // Crear departamentos inicial para una institucion
  await prisma.departamento.createMany({
    data: [
      {
        nombre: "oac",
        descripcion: "sin descripcion",
        id_usuario: 1,
        id_institucion: 1,
      },
      {
        nombre: "despacho",
        descripcion: "sin descripcion",
        id_usuario: 1,
        id_institucion: 1,
      },
      {
        nombre: "informatica",
        descripcion: "sin descripcion",
        id_usuario: 1,
        id_institucion: 1,
      },
      {
        nombre: "determinacion y responsabilidad",
        descripcion: "sin descripcion",
        id_usuario: 1,
        id_institucion: 1,
      },
      {
        nombre: "direccion general",
        descripcion: "sin descripcion",
        id_usuario: 1,
        id_institucion: 1,
      },
      {
        nombre: "administracion y presupuesto",
        descripcion: "sin descripcion",
        id_usuario: 1,
        id_institucion: 1,
      },
      {
        nombre: "talento humano",
        descripcion: "sin descripcion",
        id_usuario: 1,
        id_institucion: 1,
      },
      {
        nombre: "control posterior",
        descripcion: "sin descripcion",
        id_usuario: 1,
        id_institucion: 1,
      },
      {
        nombre: "auditoria interna",
        descripcion: "sin descripcion",
        id_usuario: 1,
        id_institucion: 1,
      },
      {
        nombre: "potestad e investigacion",
        descripcion: "sin descripcion",
        id_usuario: 1,
        id_institucion: 1,
      },
      {
        nombre: "archivos",
        descripcion: "sin descripcion",
        id_usuario: 1,
        id_institucion: 1,
      },
    ],
  });

  // Crear modulos inicial para todas las instituciones
  await prisma.modulo.createMany({
    data: [
      { nombre: "modulo i", id_usuario: 1 },
      { nombre: "modulo ii", id_usuario: 1 },
      { nombre: "modulo iii", id_usuario: 1 },
      { nombre: "modulo iv", id_usuario: 1 },
      { nombre: "modulo v", id_usuario: 1 },
      { nombre: "modulo vi", id_usuario: 1 },
      { nombre: "modulo vii", id_usuario: 1 },
      { nombre: "modulo viii", id_usuario: 1 },
      { nombre: "modulo ix", id_usuario: 1 },
    ],
  });

  // Crear cargos inicial para todas las instituciones
  await prisma.cargo.createMany({
    data: [
      {
        nombre: "unidad ejecutiva",
        id_usuario: 1,
        descripcion:
          "encargada de implementar y ejecutar tareas específicas que forman parte de un plan o proyecto más amplio, transformando el presupuesto en bienes y servicios o gestionando fondos",
      },
      {
        nombre: "unidad financiera",
        id_usuario: 1,
        descripcion: "encargada de manejar los recursos que se han obtenido",
      },
      {
        nombre: "contraloria social",
        id_usuario: 1,
        descripcion: "encargado de controlar los recursos publicos",
      },
    ],
  });

  // Crear una formacion inicial para todas las instituciones
  await prisma.formacion.create({
    data: {
      nombre: "participación popular y contraloria social",
      descripcion:
        "primera formacion enviada por la cgr caracas, con el objetivo de certificar a las comunas",
      id_usuario: 1,
    },
  });

  // Asignar el usuario a las entidades correspondientes
  await prisma.usuario.update({
    where: { id: 2 },
    data: {
      id_usuario: 1,
      MiembrosPaises: {
        connect: { id: 1 },
      },
      MiembrosEstados: {
        connect: { id: 4 },
      },
      MiembrosMunicipios: {
        connect: { id: 16 },
      },
      MiembrosParroquias: {
        connect: { id: 5 },
      },
      MiembrosInstitucion: {
        connect: [{ id: 1 }],
      },
      MiembrosDepartamentos: {
        connect: [{ id: 3 }],
      },
    },
  });
}

main()
  .then(() => {
    console.log("Seed ejecutado correctamente 🚀");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
