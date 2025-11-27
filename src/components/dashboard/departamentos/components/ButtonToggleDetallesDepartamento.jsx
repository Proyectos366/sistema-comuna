import Button from "@/components/padres/Button";

export default function ButtonToggleDetallesDepartamento({
  expanded,
  setExpanded,
  departamento,
}) {
  return (
    <Button
      onClick={() =>
        setExpanded(expanded === departamento.id ? null : departamento.id)
      }
      className={`w-full text-left font-semibold tracking-wide uppercase p-2  sm:p-0 sm:py-2 sm:px-4 transition-colors duration-200 cursor-pointer
                  ${
                    expanded === departamento.id
                      ? "rounded-t-md mb-2 sm:mb-0 hover:text-white"
                      : "rounded-md"
                  }
                  ${
                    departamento.borrado
                      ? "border-[#E61C45] hover:bg-[#E61C45] hover:text-[white] hover:border-[#E61C45]"
                      : "border-[#082158] hover:bg-[#082158] hover:text-[white]"
                  } cursor-pointer transition-colors duration-200`}
    >
      👤 {departamento.nombre}
    </Button>
  );
}
