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
      title="Botón para limpiar los datos del formulario"
      className={`${
        hayDatos
          ? "cursor-pointer bg-yellow-500 hover:bg-yellow-600"
          : "cursor-not-allowed bg-gray-400"
      } w-full text-white font-semibold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105 flex items-center justify-center gap-2`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width="24"
        height="24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-white sm:hidden"
      >
        <path d="M598.6 118.6C611.1 106.1 611.1 85.8 598.6 73.3C586.1 60.8 565.8 60.8 553.3 73.3L361.3 265.3L326.6 230.6C322.4 226.4 316.6 224 310.6 224C298.1 224 288 234.1 288 246.6L288 275.7L396.3 384L425.4 384C437.9 384 448 373.9 448 361.4C448 355.4 445.6 349.6 441.4 345.4L406.7 310.7L598.7 118.7zM373.1 417.4L254.6 298.9C211.9 295.2 169.4 310.6 138.8 341.2L130.8 349.2C108.5 371.5 96 401.7 96 433.2C96 440 103.1 444.4 109.2 441.4L160.3 415.9C165.3 413.4 169.8 420 165.7 423.8L39.3 537.4C34.7 541.6 32 547.6 32 553.9C32 566.1 41.9 576 54.1 576L227.4 576C266.2 576 303.3 560.6 330.8 533.2C361.4 502.6 376.7 460.1 373.1 417.4z" />
      </svg>
      <span className="hidden sm:inline">Limpiar campos</span>
    </Button>
  );
}
