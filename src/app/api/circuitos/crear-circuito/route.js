/**
@fileoverview Controlador de API para la creación de un nuevo circuito comunal.
Este archivo maneja la lógica para crear un nuevo circuito comunal en la base de datos a 
través de una solicitud POST. Utiliza Prisma para la interacción con la base de datos y un 
servicio de validación previopara asegurar que la información proporcionada es correcta.
@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearCircuito from "@/services/circuitos-comunales/validarCrearCircuito"; // Servicio para validar los datos del nuevo circuito.
/**
Maneja las solicitudes HTTP POST para crear un nuevo circuito comunal.@async@function POST@param {Request} request - Objeto de la solicitud que contiene la información del circuito a crear.@returns {Promise>} - Una respuesta HTTP en formato JSON con el circuito creado o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    //const {nombre, direccion, norte, sur, este, oeste, punto, rif, id_parroquia } = await request.json();
    const { nombre, id_parroquia } = await request.json();

    /** Inicializa valores para otras propiedades. Esto se esta haciendo hasta que se pidan estos
      datos a la hora de crear el circuito desde el front-end
     */
    const { direccion, norte, sur, este, oeste, punto } = "";

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearCircuito(
      nombre,
      direccion,
      norte,
      sur,
      este,
      oeste,
      punto,
      id_parroquia
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 4. Crea un nuevo circuito en la base de datos utilizando los datos validados
    const nuevoCircuito = await prisma.circuito.create({
      data: {
        nombre: validaciones.nombre,
        direccion: validaciones.direccion,
        norte: validaciones.norte,
        sur: validaciones.sur,
        este: validaciones.este,
        oeste: validaciones.oeste,
        punto: validaciones.punto,
        borrado: false,
        validado: false,
        id_usuario: validaciones.id_usuario,
        id_parroquia: validaciones.id_parroquia,
      },
    });

    // 5. Condición de error si no se crea el circuito
    if (!nuevoCircuito) {
      return generarRespuesta(
        "error",
        "Error, no se creo el circuito",
        {},
        400
      );
    } else {
      // 6. Condición de éxito: el circuito fue creado correctamente
      return generarRespuesta(
        "ok",
        "Circuito creado...",
        {
          circuito: nuevoCircuito,
        },
        201
      );
    }
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (circuitos): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (circuitos)", {}, 500);
  }
}
