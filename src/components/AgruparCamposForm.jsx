import Div from "@/components/padres/Div";

export default function AgruparCamposForm({ children, indice }) {
  return (
    <Div
      className={`flex ${indice ? "" : "flex-col"} flex-row gap-2 sm:gap-4`}
    >
      {children}
    </Div>
  );
}
