"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

export default function CrearManuales() {
  const router = useRouter();

  const crearRoles = async () => {
    try {
      const responseRol = await axios.get(`/api/crear-manuales/crear-rol`);

      if (responseRol?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error al crear roles");
      }
    } catch (error) {
      console.log("Error, al crear roles: " + error);
    }
  };

  const crearParroquias = async () => {
    try {
      const responseParroquias = await axios.get(
        `/api/crear-manuales/crear-parroquias`
      );

      if (responseParroquias?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error al crear parroquias");
      }
    } catch (error) {
      console.log("Error, al crear parroquias: " + error);
    }
  };

  const crearComunasVillaDeCura = async () => {
    try {
      const responseComunasVillaDeCura = await axios.get(
        `/api/crear-manuales/crear-comunas`
      );

      if (responseComunasVillaDeCura?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error al crear comunas");
      }
    } catch (error) {
      console.log("Error, al crear comunas: " + error);
    }
  };

  const crearCargos = async () => {
    try {
      const responseCargos = await axios.get(`/api/crear-manuales/crear-cargo`);

      if (responseCargos?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error al crear cargo");
      }
    } catch (error) {
      console.log("Error, al crear cargo: " + error);
    }
  };

  const crearModulos = async () => {
    try {
      const responseModulos = await axios.get(
        `/api/crear-manuales/crear-modulos`
      );

      if (responseModulos?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error, al crear modulos");
      }
    } catch (error) {
      console.log("Error, al crear modulos: " + error);
    }
  };

  const crearFormaciones = async () => {
    try {
      const responseFormaciones = await axios.get(
        `/api/crear-manuales/crear-formaciones`
      );

      if (responseFormaciones?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error, al crear formaciones");
      }
    } catch (error) {
      console.log("Error, al crear formaciones: " + error);
    }
  };

  const crearDepartamentos = async () => {
    try {
      const responseDepartamentos = await axios.get(
        `/api/crear-manuales/crear-departamentos`
      );

      if (responseDepartamentos?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error, al crear departamentos");
      }
    } catch (error) {
      console.log("Error, al crear departamentos: " + error);
    }
  };

  const crearUsuarioMaster = async () => {
    try {
      const responseUsuarioMaster = await axios.get(
        `/api/crear-manuales/crear-usuario-master`
      );

      if (responseUsuarioMaster?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error al crear usuario master");
      }
    } catch (error) {
      console.log("Error, al crear usuario master: " + error);
    }
  };

  const crearBeneficios = async () => {
    try {
      const responseBeneficios = await axios.get(
        `/api/crear-manuales/crear-beneficios`
      );

      if (responseBeneficios?.data.status === "ok") {
        router.push("/", { shallow: true });
      } else {
        alert("Error, al crear beneficio");
      }
    } catch (error) {
      console.log("Error, al crear beneficio: " + error);
    }
  };

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto] space-y-3 container mx-auto">
      <header></header>
      <main className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen flex items-center justify-center p-10">
        <section className="grid grid-cols-3 gap-6">
          <BotonCreacionesManuales nombre={"Crear roles"} crear={crearRoles} />

          <BotonCreacionesManuales
            nombre={"Crear parroquias"}
            crear={crearParroquias}
          />

          <BotonCreacionesManuales
            nombre={"Crear comunas villa de cura"}
            crear={crearComunasVillaDeCura}
          />

          <BotonCreacionesManuales
            nombre={"Crear cargos"}
            crear={crearCargos}
          />

          <BotonCreacionesManuales
            nombre={"Crear modulos"}
            crear={crearModulos}
          />

          <BotonCreacionesManuales
            nombre={"Crear departamentos"}
            crear={crearDepartamentos}
          />

          <BotonCreacionesManuales
            nombre={"Crear usuario"}
            crear={crearUsuarioMaster}
          />

          <BotonCreacionesManuales
            nombre={"Crear beneficios"}
            crear={crearBeneficios}
          />

          {/* <BotonCreacionesManuales
            nombre={"Crear formaciones"}
            crear={crearFormaciones}
          /> */}
        </section>
      </main>
      <footer className="text-black mt-10">© 2025 - Tu Proyecto</footer>
    </div>
  );
}

function BotonCreacionesManuales({ nombre, crear }) {
  return (
    <div className="bg-white shadow-lg rounded-md p-6 flex justify-center items-center">
      <button
        className="cursor-pointer borde-fondo px-6 py-2 rounded-md bg-red-300 hover:bg-red-400 hover:px-8"
        onClick={() => crear()}
      >
        {nombre}
      </button>
    </div>
  );
}


/**
 //Base de datos funcional
 generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model role {
  id          Int      @id @default(autoincrement())
  nombre      String   @unique
  descripcion String?  @default("")
  borrado     Boolean  @default(false)
  updatedAt   DateTime @default(now())
  createdAt   DateTime @default(now())

  // Relaciones
  usuarios usuario[] @relation(name: "UsuarioRole")
}

model departamento {
  id          Int      @id @default(autoincrement())
  nombre      String   @unique
  descripcion String?  @default("")
  borrado     Boolean  @default(false)
  id_usuario  Int
  updatedAt   DateTime @default(now())
  createdAt   DateTime @default(now())

  // Relaciones
  creador  usuario   @relation(name: "CreadorDepartamento", fields: [id_usuario], references: [id])
  miembros usuario[] @relation("MiembrosDepartamento")
}

model usuario {
  id        Int      @id @default(autoincrement())
  cedula    Int
  nombre    String
  correo    String   @unique
  token     String   @unique
  clave     String
  borrado   Boolean
  id_rol    Int // Clave foránea hacia role
  updatedAt DateTime @default(now())
  createdAt DateTime @default(now())

  // Relaciones
  roles                  role           @relation(name: "UsuarioRole", fields: [id_rol], references: [id])
  CreadorDeDepartamentos departamento[] @relation(name: "CreadorDepartamento")
  MiembrosDepartamentos  departamento[] @relation(name: "MiembrosDepartamento")
  creadorDeComunas       comuna[]       @relation(name: "CreadorComuna")
  creadorDeCircuitos     circuito[]     @relation(name: "CreadorCircuito")
  creadorDeConsejos      consejo[]      @relation(name: "CreadorConsejo")
  voceros                vocero[]       @relation(name: "CreadorVocero") // El usuario solo crea voceros, no los "posee"
  parroquias             parroquia[]    @relation(name: "CreadorParroquia")
  cargos                 cargo[]        @relation(name: "CreadorCargo")
  modulos                modulo[]       @relation(name: "CreadorModulo")
  formaciones            formacion[]    @relation(name: "CreadorFormacion")
  cursos                 curso[]        @relation(name: "CreadorCurso")
  asistencias            asistencia[]   @relation(name: "CreadorAsistencia")
}

model cargo {
  id          Int      @id @default(autoincrement())
  nombre      String   @unique
  id_usuario  Int
  descripcion String
  borrado     Boolean
  updatedAt   DateTime @default(now())
  createdAt   DateTime @default(now())

  usuarios usuario  @relation(name: "CreadorCargo", fields: [id_usuario], references: [id])
  voceros  vocero[]
}

model parroquia {
  id         Int      @id @default(autoincrement())
  nombre     String
  id_usuario Int
  borrado    Boolean
  updatedAt  DateTime @default(now())
  createdAt  DateTime @default(now())

  // Relaciones
  usuarios  usuario    @relation("CreadorParroquia", fields: [id_usuario], references: [id])
  comunas   comuna[]   @relation("ComunaParroquia")
  circuitos circuito[] @relation("CircuitoParroquia")
  consejos  consejo[]  @relation("ConsejoParroquia") // Una parroquia puede tener múltiples consejos
  voceros   vocero[]   @relation("VoceroParroquia")
}

model comuna {
  id           Int      @id @default(autoincrement())
  nombre       String
  norte        String
  sur          String
  este         String
  oeste        String
  direccion    String
  punto        String
  rif          String?  @unique
  codigo       String   @unique
  borrado      Boolean
  id_usuario   Int // Clave foránea hacia usuario (administrador que crea la comuna)
  id_parroquia Int
  updatedAt    DateTime @default(now())
  createdAt    DateTime @default(now())

  // Relaciones
  usuarios   usuario   @relation(name: "CreadorComuna", fields: [id_usuario], references: [id])
  voceros    vocero[] // Voceros que pertenecen directamente a la comuna
  consejos   consejo[] // Consejos que están dentro de la comuna
  parroquias parroquia @relation("ComunaParroquia", fields: [id_parroquia], references: [id])
}

model circuito {
  id           Int      @id @default(autoincrement())
  nombre       String
  norte        String
  sur          String
  este         String
  oeste        String
  direccion    String
  punto        String
  borrado      Boolean
  validado     Boolean
  id_usuario   Int // Clave foránea hacia usuario (administrador que crea el circuito)
  id_parroquia Int
  updatedAt    DateTime @default(now())
  createdAt    DateTime @default(now())

  // Relaciones
  usuarios   usuario   @relation(name: "CreadorCircuito", fields: [id_usuario], references: [id])
  consejos   consejo[] // Consejos que pueden estar dentro de un circuito
  voceros    vocero[] // Voceros que pertenecen directamente a un circuito
  parroquias parroquia @relation("CircuitoParroquia", fields: [id_parroquia], references: [id])
}

model consejo {
  id           Int      @id @default(autoincrement())
  nombre       String
  norte        String
  sur          String
  este         String
  oeste        String
  direccion    String
  punto        String
  rif          String?  @unique
  codigo       String   @unique
  borrado      Boolean
  id_usuario   Int // Clave foránea hacia usuario (administrador que lo crea)
  id_comuna    Int? // Este consejo pertenece a una comuna
  id_circuito  Int? // Este consejo puede estar vinculado a un circuito
  id_parroquia Int // Nueva clave foránea para relacionar con parroquia
  updatedAt    DateTime @default(now())
  createdAt    DateTime @default(now())

  // Relaciones
  usuarios   usuario   @relation(name: "CreadorConsejo", fields: [id_usuario], references: [id])
  comunas    comuna?   @relation(fields: [id_comuna], references: [id])
  circuitos  circuito? @relation(fields: [id_circuito], references: [id])
  voceros    vocero[] // Voceros que pertenecen a este consejo
  parroquias parroquia @relation("ConsejoParroquia", fields: [id_parroquia], references: [id]) // Relación con parroquia
}

model vocero {
  id           Int      @id @default(autoincrement())
  nombre       String
  nombre_dos   String?
  apellido     String
  apellido_dos String?
  cedula       Int      @unique
  genero       Boolean
  edad         Int
  telefono     String
  direccion    String?
  correo       String
  token        String   @unique
  laboral      String
  f_n          DateTime
  borrado      Boolean
  id_usuario   Int
  id_comuna    Int?
  id_consejo   Int?
  id_circuito  Int?
  id_parroquia Int
  updatedAt    DateTime @default(now())
  createdAt    DateTime @default(now())

  usuarios   usuario   @relation(name: "CreadorVocero", fields: [id_usuario], references: [id])
  parroquias parroquia @relation("VoceroParroquia", fields: [id_parroquia], references: [id])
  comunas    comuna?   @relation(fields: [id_comuna], references: [id])
  consejos   consejo?  @relation(fields: [id_consejo], references: [id])
  circuitos  circuito? @relation(fields: [id_circuito], references: [id])

  cursos      curso[]
  asistencias asistencia[]
  cargos      cargo[]
}

model formacion {
  id         Int      @id @default(autoincrement())
  nombre     String   @unique
  id_usuario Int
  borrado    Boolean  @default(false)
  culminada  Boolean  @default(false)
  updatedAt  DateTime @default(now()) @updatedAt
  createdAt  DateTime @default(now())

  usuarios usuario  @relation(name: "CreadorFormacion", fields: [id_usuario], references: [id])
  modulos  modulo[]
  cursos   curso[]
}

model modulo {
  id         Int      @id @default(autoincrement())
  nombre     String   @unique
  borrado    Boolean  @default(false)
  id_usuario Int
  updatedAt  DateTime @default(now()) @updatedAt
  createdAt  DateTime @default(now())

  usuarios    usuario      @relation(name: "CreadorModulo", fields: [id_usuario], references: [id])
  formaciones formacion[]
  asistencias asistencia[]
}

model curso {
  id               Int       @id @default(autoincrement())
  id_vocero        Int
  id_formacion     Int
  id_usuario       Int
  fecha_completado DateTime?
  verificado       Boolean   @default(false)
  certificado      Boolean   @default(false)
  culminado        Boolean   @default(false)
  borrado          Boolean   @default(false)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @default(now()) @updatedAt

  usuarios    usuario      @relation(name: "CreadorCurso", fields: [id_usuario], references: [id])
  voceros     vocero       @relation(fields: [id_vocero], references: [id])
  formaciones formacion    @relation(fields: [id_formacion], references: [id])
  asistencias asistencia[]
}

model asistencia {
  id             Int      @id @default(autoincrement())
  id_vocero      Int
  id_modulo      Int
  id_curso       Int
  id_usuario     Int
  presente       Boolean
  formador       String?  @default("")
  borrado        Boolean  @default(false)
  fecha_registro DateTime @default(now())
  createdAt      DateTime @default(now())
  updatedAt      DateTime @default(now())

  usuarios usuario @relation(name: "CreadorAsistencia", fields: [id_usuario], references: [id])
  voceros  vocero  @relation(fields: [id_vocero], references: [id])
  modulos  modulo  @relation(fields: [id_modulo], references: [id])
  cursos   curso   @relation(fields: [id_curso], references: [id])
}
 */



 