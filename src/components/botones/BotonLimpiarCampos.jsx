import Button from "@/components/padres/Button";

export default function BotonLimpiarCampos({ campos, aceptar }) {
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
      title={"Boton para limpiar los datos del formulario"}
      className={`${
        hayDatos
          ? "cursor-pointer bg-yellow-500 hover:bg-yellow-600"
          : "cursor-not-allowed bg-gray-400"
      } w-full text-white font-semibold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105`}
    >
      Limpiar campos
    </Button>
  );
}
