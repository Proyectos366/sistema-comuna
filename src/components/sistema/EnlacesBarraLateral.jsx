export default function EnlacesBarraLateral({
  cambiarRuta,
  vista,
  vistaActual,
  nombre,
  id_rol,
  indice,
  volverInicio,
}) {
  return (
    <>
      <button
        onClick={() => {
          cambiarRuta(
            vistaActual === "inicio" ? "" : vistaActual,
            vistaActual,
            id_rol
          );
          volverInicio();
        }}
        className={`px-4 py-2 w-full bg-amber-300 rounded hover:bg-red-400 cursor-pointer ${
          vista === vistaActual
            ? !indice
              ? "bg-red-300"
              : ""
            : !indice
            ? "bg-white"
            : ""
        }`}
      >
        {nombre}
      </button>
    </>
  );
}
