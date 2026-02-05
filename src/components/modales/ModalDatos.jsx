import Div from "@/components/padres/Div";
import Span from "@/components/padres/Span";

export default function ModalDatos({ titulo, descripcion, indice }) {
  return (
    <Div className="w-full flex flex-row sm:items-start">
      <Span className="w-1/2 text-sm text-[#1e2939] font-semibold mb-1 sm:mb-0 uppercase">
        {titulo}:
      </Span>
      <Span
        className={`w-1/2 break-words whitespace-pre-wrap text-sm font-medium ps-1 ${
          indice ? "" : "uppercase"
        }`}
      >
        {descripcion}
      </Span>
    </Div>
  );
}
