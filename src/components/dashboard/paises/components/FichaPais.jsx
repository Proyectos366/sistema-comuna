import Div from "@/components/padres/Div";

export default function FichaPais({ children, pais, index }) {
  return (
    <Div
      className={`fade-in-up bg-[#e2e8f0] rounded-md shadow-md border 
                  ${
                    pais.borrado
                      ? "border-[#E61C45] hover:bg-[#E61C45] text-[#E61C45]  hover:text-white"
                      : "border-[#082158] hover:bg-[#082158] text-[#082158] hover:text-white"
                  } transition-all`}
      style={{ animationDelay: `${index * 0.4}s` }}
    >
      {children}
    </Div>
  );
}
