import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const roles = [
      { nombre: "master", descripcion: "Acceso total al sistema y configuración avanzada." },
      { nombre: "administrador", descripcion: "Gestión de usuarios, configuraciones y operaciones." },
      { nombre: "director", descripcion: "Supervisión de procesos y toma de decisiones estratégicas." },
      { nombre: "empleado", descripcion: "Acceso a funcionalidades básicas para realizar tareas diarias." },
    ];

    for (const role of roles) {
      await prisma.role.upsert({
        where: { nombre: role.nombre },
        update: {},
        create: role,
      });
    }

    return generarRespuesta("ok", "Roles creados correctamente.", {}, 201);
  } catch (error) {
    console.error("Error al guardar roles:", error);
    return generarRespuesta("error", "Error interno al guardar roles.", {}, 500);
  }
}