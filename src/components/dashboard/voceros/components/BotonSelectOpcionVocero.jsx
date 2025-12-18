import Button from "@/components/padres/Button";

export default function BotonSelectOpcionVocero({
  indice,
  nombre,
  seleccionar,
  consultar,
}) {
  return (
    <Button
      onClick={() => consultar()}
      className={`px-4 py-2 m-1 rounded-md ${
        seleccionar == indice ? "border-2" : "border"
      } ${seleccionar == indice ? "#007bff" : "#f5f5f5"} cursor-pointer`}
    >
      {nombre}
    </Button>
  );
}
