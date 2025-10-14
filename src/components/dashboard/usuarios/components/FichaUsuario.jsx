import Div from "@/components/padres/Div";

export default function FichaUsuario({ children, usuario, index }) {
  return (
    <Div
      className={`fade-in-up bg-[#e2e8f0] rounded-md shadow-md border 
                  ${
                    usuario.borrado
                      ? "border-[#E61C45] hover:bg-[#E61C45] text-[#E61C45]  hover:text-white"
                      : usuario.id_rol === 1
                      ? "bg-[#e2e8f0] hover:bg-gray-100 text-[#082158] border-gray-300"
                      : usuario.id_rol === 2
                      ? "border-[#082158] hover:bg-[#082158] text-[#082158] hover:text-white"
                      : usuario.id_rol === 3
                      ? "border-[#2FA807] hover:bg-[#2FA807] text-[#2FA807] hover:text-white"
                      : usuario.id_rol === 4
                      ? "border-[#A62A69] hover:bg-[#A62A69] text-[#A62A69] hover:text-white"
                      : "border-gray-300 text-gray-600" // Estilo por defecto si el rol no es reconocido
                  } transition-all`}
      style={{ animationDelay: `${index * 0.4}s` }}
    >
      {children}
    </Div>
  );
}
