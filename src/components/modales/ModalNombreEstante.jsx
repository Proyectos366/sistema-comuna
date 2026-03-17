import B from "@/components/padres/B";
import Div from "@/components/padres/Div";
import Li from "@/components/padres/Li";
import Span from "@/components/padres/Span";
import Ul from "@/components/padres/Ul";

export default function ModalNombreEstante({ visible, indice }) {
  if (!visible) return null;

  return (
    <Div
      className={`absolute z-50 bottom-full left-0 right-0 mb-2 bg-[#fbf9fa] p-3 rounded-md shadow-lg border border-[#082158] text-sm text-[#364153]`}
    >
      {indice === "estante2" && (
        <>
          <Span className="text-xl font-semibold">
            El nombre debe seguir el siguiente formato
          </Span>
          <Ul className="flex flex-col gap-1 w-full bg-[#f9fafb] mt-2">
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">
              Nombre comezar por: estante
            </Li>
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">Espacio</Li>
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">
              Cualquier otro texto
            </Li>
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">Luego numero</Li>
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">
              La longitud debe ser entre 10 y 254 caracteres
            </Li>
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">
              <Div className={"flex flex-col gap-1"}>
                <Span>
                  Ejemplo: <B>estante azul 001</B>
                </Span>
                <Span>
                  Ejemplo: <B>estante azul de madera 001</B>
                </Span>
                <Span>
                  Ejemplo: <B>estante 001</B>
                </Span>
              </Div>
            </Li>
          </Ul>
        </>
      )}
    </Div>
  );
}
