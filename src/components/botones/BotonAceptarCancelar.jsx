import Button from "@/components/padres/Button";

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
        return "cursor-pointer bg-[#2FA807] hover:bg-green-600"; // Activo, verde
      case "cancelar":
        return "cursor-pointer bg-[#E61C45] hover:bg-[red-600]"; // Activo, rojo
      case "aceptar":
        return todosLosCamposLlenos
          ? "cursor-pointer color-fondo hover:bg-blue-700"
          : "cursor-not-allowed bg-gray-400"; // Azul/gris según estado
      case "limpiar":
        return algunCampoLleno
          ? "cursor-pointer bg-yellow-500 hover:bg-yellow-600"
          : "cursor-not-allowed bg-gray-400"; // Amarillo/gris según estado
      case "eliminar":
        return algunCampoLleno
          ? "cursor-pointer bg-[#E61C45]"
          : "cursor-not-allowed bg-gray-400"; // Amarillo/gris según estado
      case "cancelarEliminar":
        return "cursor-pointer bg-[#2FA807]"; // Activo, rojo
      default:
        return "cursor-not-allowed bg-gray-400"; // Estado por defecto
    }
  };

  return (
    <Button
      disabled={
        indice === "aceptar"
          ? !todosLosCamposLlenos
          : indice === "limpiar"
          ? !algunCampoLleno
          : false
      }
      type="button"
      onClick={() => aceptar()}
      className={`${obtenerClase()} w-full text-white font-semibold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105 flex items-center justify-center gap-2`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="11"
        className="text-white sm:hidden"
      >
        <path d="M173.9 439.4L7 272.5c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L192 312.1 448.5 55.5c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L225.4 439.4c-9.4 9.4-24.6 9.4-33.9 0z" />
      </svg>

      <span className="hidden sm:inline">{nombre}</span>
    </Button>
  );
}
