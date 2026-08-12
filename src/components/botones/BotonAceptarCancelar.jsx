import Button from "@/components/padres/Button";

export default function BotonAceptarCancelar({
  indice,
  aceptar,
  nombre,
  campos,
  icono,
}) {
  const todosLosCamposLlenos = Object.values(campos).every(
    (valor) => typeof valor !== "undefined" && String(valor).trim() !== "",
  );

  const algunCampoLleno = Object.values(campos).some(
    (valor) => typeof valor !== "undefined" && String(valor).trim() !== "",
  );

  // Definir clases según el índice
  const obtenerClase = () => {
    switch (indice) {
      case "crear":
        return todosLosCamposLlenos
          ? "cursor-pointer bg-[#2FA807] hover:bg-[#2ca802]"
          : "cursor-not-allowed bg-[#99a1af]";
      case "cancelar":
        return "cursor-pointer bg-[#E61C45] hover:bg-[#e7113c]";
      case "aceptar":
        return todosLosCamposLlenos
          ? "cursor-pointer bg-[#082158] hover:bg-[#00184b]"
          : "cursor-not-allowed bg-[#99a1af]";
      case "limpiar":
        return algunCampoLleno
          ? "cursor-pointer bg-[#eeee17] hover:bg-[#ebeb0a]"
          : "cursor-not-allowed bg-[#99a1af]";
      case "eliminar":
        return algunCampoLleno
          ? "cursor-pointer bg-[#E61C45]"
          : "cursor-not-allowed bg-[#99a1af]";
      case "cancelarEliminar":
        return "cursor-pointer bg-[#2FA807]";
      default:
        return "cursor-not-allowed bg-[#99a1af]";
    }
  };

  // Función para renderizar el icono según el nombre
  const renderIcono = () => {
    switch (icono) {
      case "descarga":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="11"
            className="text-[#ffffff] sm:hidden"
          >
            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zM432 456c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24z" />
          </svg>
        );

      case "limpiar":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="11"
            className="text-[#ffffff] sm:hidden"
          >
            <path d="M448 64L64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64zM64 128l384 0c17.6 0 32 14.4 32 32l-64 0L32 160c0-17.6 14.4-32 32-32zm-32 64l64 0L96 352 32 352l0-160zm384 0l0 160-256 0 0-160 256 0zM32 384l0-32 64 0 0 32c0 17.6-14.4 32-32 32s-32-14.4-32-32zm384 32c-17.6 0-32-14.4-32-32l0-32 64 0 0 32c0 17.6-14.4 32-32 32z" />
            <path d="M128 224l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
          </svg>
        );

      case "check":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="11"
            className="text-[#ffffff] sm:hidden"
          >
            <path d="M173.9 439.4L7 272.5c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L192 312.1 448.5 55.5c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L225.4 439.4c-9.4 9.4-24.6 9.4-33.9 0z" />
          </svg>
        );

      case "cancelar":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="11"
            className="text-[#ffffff] sm:hidden"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
          </svg>
        );

      case "editar":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="11"
            className="text-[#ffffff] sm:hidden"
          >
            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3l-97.9-97.9L172.4 241.7zM64 96c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V304c0-17.7-14.3-32-32-32s-32 14.3-32 32V448c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32H208c17.7 0 32-14.3 32-32s-14.3-32-32-32H64z" />
          </svg>
        );

      default:
        // Icono por defecto (check)
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="24"
            height="24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="11"
            className="text-[#ffffff] sm:hidden"
          >
            <path d="M173.9 439.4L7 272.5c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L192 312.1 448.5 55.5c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L225.4 439.4c-9.4 9.4-24.6 9.4-33.9 0z" />
          </svg>
        );
    }
  };

  return (
    <Button
      disabled={
        indice === "aceptar" || indice === "crear"
          ? !todosLosCamposLlenos
          : indice === "limpiar"
            ? !algunCampoLleno
            : false
      }
      type="button"
      onClick={() => aceptar()}
      className={`${obtenerClase()} w-full text-[#ffffff] font-semibold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105 flex items-center justify-center gap-2`}
    >
      {renderIcono()}
      <span className="hidden sm:inline">{nombre}</span>
    </Button>
  );
}

/** 
import Button from "@/components/padres/Button";

export default function BotonAceptarCancelar({
  indice,
  aceptar,
  nombre,
  campos,
}) {
  const todosLosCamposLlenos = Object.values(campos).every(
    (valor) => typeof valor !== "undefined" && String(valor).trim() !== "",
  );

  const algunCampoLleno = Object.values(campos).some(
    (valor) => typeof valor !== "undefined" && String(valor).trim() !== "",
  );

  // Definir clases según el índice
  const obtenerClase = () => {
    switch (indice) {
      case "crear":
        return todosLosCamposLlenos
          ? "cursor-pointer bg-[#2FA807] hover:bg-[#2ca802]"
          : "cursor-not-allowed bg-[#99a1af]"; // Activo, verde
      case "cancelar":
        return "cursor-pointer bg-[#E61C45] hover:bg-[#e7113c]"; // Activo, rojo
      case "aceptar":
        return todosLosCamposLlenos
          ? "cursor-pointer bg-[#082158] hover:bg-[#00184b]"
          : "cursor-not-allowed bg-[#99a1af]"; // Azul/gris según estado
      case "limpiar":
        return algunCampoLleno
          ? "cursor-pointer bg-[#eeee17] hover:bg-[#ebeb0a]"
          : "cursor-not-allowed bg-[#99a1af]"; // Amarillo/gris según estado
      case "eliminar":
        return algunCampoLleno
          ? "cursor-pointer bg-[#E61C45]"
          : "cursor-not-allowed bg-[#99a1af]"; // Amarillo/gris según estado
      case "cancelarEliminar":
        return "cursor-pointer bg-[#2FA807]"; // Activo, rojo
      default:
        return "cursor-not-allowed bg-[#99a1af]"; // Estado por defecto
    }
  };

  return (
    <Button
      disabled={
        indice === "aceptar" || indice === "crear"
          ? !todosLosCamposLlenos
          : indice === "limpiar"
            ? !algunCampoLleno
            : false
      }
      type="button"
      onClick={() => aceptar()}
      className={`${obtenerClase()} w-full text-[#ffffff] font-semibold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105 flex items-center justify-center gap-2`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width="24"
        height="24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="11"
        className="text-[#ffffff] sm:hidden"
      >
        <path d="M173.9 439.4L7 272.5c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L192 312.1 448.5 55.5c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L225.4 439.4c-9.4 9.4-24.6 9.4-33.9 0z" />
      </svg>

      <span className="hidden sm:inline">{nombre}</span>
    </Button>
  );
}
*/
