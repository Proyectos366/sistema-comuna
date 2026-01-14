import Button from "@/components/padres/Button";

export default function BotonConsultarCedula({ campos, aceptar }) {
  const hayDatos = Object.values(campos).some((valor) => {
    if (typeof valor === "boolean") return valor;
    if (typeof valor === "string") return valor.trim() !== "";
    if (typeof valor === "number") return valor !== null && valor !== undefined;
    return false;
  });

  return (
    <Button
      disabled={!hayDatos}
      type="button"
      onClick={() => aceptar()}
      title="Botón para consultar un vocero por su cedula"
      className={`${
        hayDatos
          ? "cursor-pointer bg-[#082158] hover:scale-105"
          : "cursor-not-allowed bg-[#918f8f]"
      } w-full text-white font-semibold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105 flex items-center justify-center gap-2`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="currentColor"
        className="block sm:hidden"
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
      </svg>
      <span className="hidden sm:inline">Consultar</span>
    </Button>
  );
}
