import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    const correo = descifrarToken.correo;

    //const todosCursos = await prisma.curso.findMany();

    /**
    const todosCursos = await prisma.curso.findMany({
      where: { verificado: false },
      include: {
        voceros: {
          select: {
            nombre: true,
            nombre_dos: true,
            apellido: true,
            apellido_dos: true,
            cedula: true,
            telefono: true,
            correo: true,
            edad: true,
            genero: true,
            comunas: {
              select: {
                nombre: true, // Trae el nombre de la comuna
              },
            },
          },
        },
        formaciones: {
          include: {
            modulos: true,
          },
        },
        asistencias: true,
      },
    });
    */

    
    const todosCursos = await prisma.curso.findMany({
      where: { borrado: false },
      include: {
        voceros: {
          select: {
            nombre: true,
            nombre_dos: true,
            apellido: true,
            apellido_dos: true,
            cedula: true,
            telefono: true,
            correo: true,
            edad: true,
            genero: true,
            comunas: {
              select: {
                nombre: true, // Trae el nombre de la comuna
              },
            },
            consejos: {
              select: {
                nombre: true,
              }
            },
            circuitos: {
              select: {
                nombre: true,
              }
            },
            parroquias: {
              select: {
                nombre: true,
              }
            }
          },
        },
        formaciones: {
          include: {
            modulos: {
              include: {
                asistencias: true, // Relaciona módulos con asistencias
              },
            },
          },
        },
        asistencias: true,
      },
    });

    if (!todosCursos) {
      return generarRespuesta(
        "error",
        "Error, al consultar cursos...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todas los cursos...",
        {
          cursos: todosCursos,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (cursos): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (cursos)",
      {},
      500
    );
  }
}




/**
 
 
 import Titulos from "./Titulos";
 
 export default function EstadisticasVoceros({ registrosFiltrados }) {
   const totalParticipantes = registrosFiltrados.length;
 
   const totalHombres = registrosFiltrados.filter(
     (r) => r.voceros?.genero === true
   ).length;
 
   const totalMujeres = registrosFiltrados.filter(
     (r) => r.voceros?.genero === false
   ).length;
 
   const totalCertificados = registrosFiltrados.filter(
     (r) => r.certificado === true
   ).length;
 
   const totalVerificados = registrosFiltrados.filter(
     (r) => r.verificado === true
   ).length;
 
   const generarEstadisticasPorEntidad = (claveEntidad) => {
     return registrosFiltrados.reduce((acc, r) => {
       const vocero = r.voceros;
       const entidadObj = vocero?.[claveEntidad];
 
       if (claveEntidad === "consejos" && !entidadObj?.nombre) return acc;
 
       const entidad = entidadObj?.nombre || `Sin ${claveEntidad}`;
 
       if (!acc[entidad]) {
         acc[entidad] = {
           Total: 0,
           Hombres: 0,
           Mujeres: 0,
           "Mayores Hombres": 0,
           "Mayores Mujeres": 0,
         };
       }
 
       acc[entidad].Total += 1;
 
       if (vocero?.genero === true) {
         acc[entidad].Hombres += 1;
         if (vocero?.edad >= 60) acc[entidad]["Mayores Hombres"] += 1;
       }
 
       if (vocero?.genero === false) {
         acc[entidad].Mujeres += 1;
         if (vocero?.edad >= 55) acc[entidad]["Mayores Mujeres"] += 1;
       }
 
       return acc;
     }, {});
   };
 
   const renderListaExtendida = (titulo, datos) => (
     <div className="bg-white shadow rounded p-4 w-full">
       <h3 className="text-lg font-semibold text-gray-700 mb-4">{titulo}</h3>
       <ul className="space-y-3">
         {Object.entries(datos).map(([clave, valores]) => (
           <li key={clave} className="border-b pb-2">
             <h4 className="font-semibold text-blue-600">{clave}</h4>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
               {Object.entries(valores).map(([tipo, count]) => (
                 <p key={tipo} className="flex justify-between">
                   <span>{tipo}</span>
                   <span className="font-bold">{count}</span>
                 </p>
               ))}
             </div>
           </li>
         ))}
       </ul>
     </div>
   );
 
   return (
     <div className="px-4 py-6 space-y-8">
       <Titulos indice={6} titulo={"Estadísticas"} />
       <h2 className="text-2xl font-bold text-gray-800">📊 Estadísticas Voceros</h2>
 
     
       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
         {[ 
           { titulo: "Participantes", valor: totalParticipantes },
           { titulo: "Hombres", valor: totalHombres },
           { titulo: "Mujeres", valor: totalMujeres },
           { titulo: "Certificados", valor: totalCertificados },
           { titulo: "Verificados", valor: totalVerificados },
         ].map(({ titulo, valor }) => (
           <div key={titulo} className="bg-blue-50 p-4 rounded shadow text-center">
             <p className="text-sm text-gray-600">{titulo}</p>
             <p className="text-xl font-bold text-blue-700">{valor}</p>
           </div>
         ))}
       </div>
 
       
       <div className="mt-8 flex flex-col gap-6">
         {renderListaExtendida("Por Parroquia", generarEstadisticasPorEntidad("parroquias"))}
         {renderListaExtendida("Por Comuna", generarEstadisticasPorEntidad("comunas"))}
         {renderListaExtendida("Por Consejo Comunal", generarEstadisticasPorEntidad("consejos"))}
       </div>
     </div>
   );
 }
 */