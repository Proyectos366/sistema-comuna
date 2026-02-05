import B from "@/components/padres/B";
import Div from "@/components/padres/Div";
import Li from "@/components/padres/Li";
import Span from "@/components/padres/Span";
import Ul from "@/components/padres/Ul";

export default function ModalPequena({ visible, indice }) {
  if (!visible) return null;

  return (
    <Div
      className={`
        absolute
        z-50
        bottom-full
        left-0
        right-0
        mb-2
        bg-[#f9fafb]
        p-3
        rounded-md
        shadow-lg
        border border-[#e5e7eb]
        text-sm
        text-[#364153]
      `}
    >
      {indice === "clave2" && (
        <>
          <Span className="text-xl font-semibold">
            La clave debe contener minimo
          </Span>
          <Ul className="flex flex-col gap-1 w-full bg-[#f9fafb]">
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">* 1 mayuscula</Li>
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">* 1 minuscula</Li>
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">* 1 numero</Li>
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">
              * 1 caracter especial: [ /.*-@ ]
            </Li>
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">
              * La longitud debe ser entre 8 y 16 digitos
            </Li>
            <Li className="px-2 py-1 rounded-md bg-[#f1f4f7]">
              <Div>
                Ejemplo: <B>Carmen*12</B>
              </Div>
            </Li>
          </Ul>
        </>
      )}
    </Div>
  );
}
