import Div from "@/components/padres/Div";
import P from "@/components/padres/P";
import Strong from "@/components/padres/Strong";
import Titulos from "@/components/Titulos";

export default function AvisoAdvertencia({ mensaje }) {
  return (
    <Div className=" border-l-4 border-[#E61C45] bg-[#e5fced] p-2 shadow-sm rounded-md mb-2">
      <Titulos
        indice={6}
        titulo={"⚠️ Aviso importante"}
        className={`text-[#e7113c] font-bold text-md sm:text-lg mb-1`}
      />
      <P className="text-[#e7113c] text-xs sm:text-sm text-justify">
        Revise cuidadosamente todos los datos. <Strong>{mensaje}</Strong>
      </P>
    </Div>
  );
}
