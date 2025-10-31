import Button from "@/components/padres/Button";

export default function ButtonToggleDetallesPais({
  expanded,
  setExpanded,
  pais,
}) {
  return (
    <Button
      onClick={() => setExpanded(expanded === pais.id ? null : pais.id)}
      className={`w-full text-left font-semibold tracking-wide uppercase p-2  sm:p-0 sm:py-2 sm:px-4 transition-colors duration-200 cursor-pointer
                  ${
                    expanded === pais.id
                      ? "rounded-t-md mb-2 sm:mb-0 hover:text-white"
                      : "rounded-md"
                  }
                  ${
                    pais.borrado
                      ? "border-[#E61C45] hover:bg-[#E61C45] hover:text-[white] hover:border-[#E61C45]"
                      : "border-[#082158] hover:bg-[#082158] hover:text-[white]"
                  } cursor-pointer transition-colors duration-200`}
    >
      👤 {pais.nombre}
    </Button>
  );
}
