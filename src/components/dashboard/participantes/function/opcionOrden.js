export const opcionOrden = (nombreCampo) => {
  switch (nombreCampo) {
    case "cedula":
    case "nombre":
    case "correo":
    case "edad":
    case "createdAt":
      return false;

    default:
      return true; // o lo que quieras devolver si no coincide
  }
};
