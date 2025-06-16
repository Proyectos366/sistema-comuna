/**
export default function BotonAceptarCancelar({
  indice,
  aceptar,
  nombre,
  campos,
}) {
  const todosLosCamposLlenos = Object.values(campos).every(
    (valor) => typeof valor !== "undefined" && String(valor).trim() !== ""
  );

  // Definir clases según el índice
  const obtenerClase = () => {
    switch (indice) {
      case "crear":
        return "cursor-pointer bg-green-600 hover:bg-green-700"; // Activo, verde
      case "cancelar":
        return "cursor-pointer bg-red-600 hover:bg-red-700"; // Activo, rojo
      case "aceptar":
        return todosLosCamposLlenos
          ? "cursor-pointer color-fondo hover:bg-blue-700"
          : "cursor-not-allowed bg-gray-400"; // Depende de los campos, azul/gris
      case "limpiar":
        return todosLosCamposLlenos
          ? "cursor-pointer bg-yellow-500 hover:bg-yellow-600"
          : "cursor-not-allowed bg-gray-400"; // Depende de los campos, amarillo/gris
      default:
        return "cursor-not-allowed bg-gray-400"; // Estado por defecto
    }
  };

  return (
    <button
      disabled={
        indice === "aceptar" || indice === "limpiar"
          ? !todosLosCamposLlenos
          : false
      }
      type="button"
      onClick={() => aceptar()}
      className={`${obtenerClase()} w-full text-white font-semibold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105`}
    >
      {nombre}
    </button>
  );
}
*/

export default function BotonAceptarCancelar({
  indice,
  aceptar,
  nombre,
  campos,
}) {
  const todosLosCamposLlenos = Object.values(campos).every(
    (valor) => typeof valor !== "undefined" && String(valor).trim() !== ""
  );

  const algunCampoLleno = Object.values(campos).some(
    (valor) => typeof valor !== "undefined" && String(valor).trim() !== ""
  );

  // Definir clases según el índice
  const obtenerClase = () => {
    switch (indice) {
      case "crear":
        return "cursor-pointer bg-green-600 hover:bg-green-700"; // Activo, verde
      case "cancelar":
        return "cursor-pointer bg-red-600 hover:bg-red-700"; // Activo, rojo
      case "aceptar":
        return todosLosCamposLlenos
          ? "cursor-pointer color-fondo hover:bg-blue-700"
          : "cursor-not-allowed bg-gray-400"; // Azul/gris según estado
      case "limpiar":
        return algunCampoLleno
          ? "cursor-pointer bg-yellow-500 hover:bg-yellow-600"
          : "cursor-not-allowed bg-gray-400"; // Amarillo/gris según estado
      default:
        return "cursor-not-allowed bg-gray-400"; // Estado por defecto
    }
  };

  return (
    <button
      disabled={
        indice === "aceptar"
          ? !todosLosCamposLlenos
          : indice === "limpiar"
          ? !algunCampoLleno
          : false
      }
      type="button"
      onClick={() => aceptar()}
      className={`${obtenerClase()} w-full text-white font-semibold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105`}
    >
      {nombre}
    </button>
  );
}
