import Div from "@/components/padres/Div";

export default function DivScroll({ children, indice }) {
  return (
    <Div
      className={`w-full overflow-y-auto no-scrollbar flex flex-col ${!indice ? "gap-2 h-[390px]" : " items-center justify-between h-[300px] sm:h-[350px]"} px-1`}
    >
      {children}
    </Div>
  );
}
