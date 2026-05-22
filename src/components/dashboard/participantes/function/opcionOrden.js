const opcionOrden = (nombreCampo) => {
  switch (nombreCampo) {
    case "cedula":
    case "nombre":
    case "correo":
    case "edad":
    case "createdAt":
      return false;

    default:
      return true;
  }
};

export default opcionOrden;
