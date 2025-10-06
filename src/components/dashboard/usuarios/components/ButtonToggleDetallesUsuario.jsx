import Button from "@/components/padres/Button";

export default function ButtonToggleDetallesUsuario({
  expanded,
  setExpanded,
  usuario,
}) {
  return (
    <Button
      onClick={() => setExpanded(expanded === usuario.id ? null : usuario.id)}
      className={`w-full text-left font-semibold tracking-wide uppercase p-2  sm:p-0 sm:py-2 sm:px-4 transition-colors duration-200 cursor-pointer
                          ${
                            expanded === usuario.id
                              ? "rounded-t-md mb-2 sm:mb-0 hover:text-white"
                              : "rounded-md"
                          }
                          ${
                            usuario.borrado
                              ? "border-[#E61C45] hover:bg-[#E61C45] hover:text-[white] hover:border-[#E61C45]"
                              : usuario.id_rol === 1
                              ? "bg-[#e2e8f0] hover:bg-gray-100 text-[#082158] border-gray-300"
                              : usuario.id_rol === 2
                              ? "border-[#082158] hover:bg-[#082158] hover:text-[white]"
                              : usuario.id_rol === 3
                              ? "border-[#2FA807] hover:bg-[#2FA807] hover:text-[white]"
                              : usuario.id_rol === 4
                              ? "border-[#A62A69] hover:bg-[#A62A69] hover:text-[white]"
                              : "border-gray-300 text-gray-600" // Estilo por defecto si el rol no es reconocido
                          }
                          cursor-pointer transition-colors duration-200`}
    >
      👤 {usuario.nombre} {usuario.apellido}
    </Button>
  );
}
