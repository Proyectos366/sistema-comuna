/**
 @fileoverview Inicialización del cliente Prisma para interactuar con la base de datos. Este módulo
 exporta una instancia única del cliente Prisma, permitiendo su reutilización en todo el proyecto para
 evitar múltiples conexiones simultáneas. @module libs/prisma
*/

import { PrismaClient } from "@prisma/client"; // Importa el cliente Prisma generado automáticamente

// Crea una instancia única del cliente Prisma
const prisma = new PrismaClient();

// Exporta la instancia para que pueda ser utilizada en otros módulos
export default prisma;
