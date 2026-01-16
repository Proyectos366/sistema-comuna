import Button from "@/components/padres/Button";

export default function ButtonToggleDetallesVocero({ expanded, setExpanded, dato }) {

  //console.log(dato);
  
  return (
    <Button
      onClick={() => setExpanded(expanded === dato.id ? null : dato.id)}
      className={`w-full text-left font-semibold tracking-wide uppercase p-2  sm:p-0 sm:py-2 sm:px-4 ${
        expanded === dato.id ? "rounded-t-md mb-2 sm:mb-0" : "rounded-md"
      }
                                cursor-pointer transition-colors duration-200
                                ${
                                  !dato.estaVerificado
                                    ? !dato.asistenciaAprobada
                                      ? "bg-[#e2e8f0] hover:bg-[#d3dce6] text-[#1e2939]"
                                      : "border-[#082158] text-[#082158] hover:bg-[#082158] hover:text-white"
                                    : !dato.estaCertificado
                                    ? expanded === dato.id
                                      ? "border-[#E61C45] text-[black] hover:bg-[#E61C45] hover:text-white"
                                      : "text-[#E61C45] hover:text-white"
                                    : expanded === dato.id
                                    ? "border-[#2FA807] text-[black] hover:bg-[#2FA807] hover:text-white"
                                    : "text-[#2FA807] hover:text-white"
                                }`}
    >
      👤 {dato.nombre} {dato.nombre_dos} {dato.apellido} {dato.apellido_dos}
    </Button>
  );
}
