import Button from "@/components/padres/Button";

export default function EnlacesBarraLateral({
  cambiarRuta,
  vista,
  vistaActual,
  nombre,
  id_rol,
  indice,
}) {
  return (
    <>
      <Button
        onClick={() => {
          cambiarRuta(
            vistaActual === "inicio" ? "" : vistaActual,
            vistaActual,
            id_rol,
          );
        }}
        className={`px-4 py-1 w-full rounded ${!indice ? 'hover:bg-[#E61C45] hover:text-[#ffffff]' : 'bg-[#082158] text-[#ffffff] hover:bg-[#E61C45] '} cursor-pointer ${
          vista === vistaActual
            ? !indice
              ? "bg-[#E61C45] text-[#ffffff]"
              : ""
            : !indice
              ? "bg-[#ffffff]"
              : ""
        }`}
      >
        {nombre}
      </Button>
    </>
  );
}
