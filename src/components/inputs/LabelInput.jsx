import Label from "../padres/Label";
import Span from "../padres/Span";

export default function LabelInput({ children, nombre, htmlFor }) {
  return (
    <Label className="flex flex-col gap-1 w-full" htmlFor={htmlFor}>
      <Span className="text-[#364153] font-medium -mb-1">{nombre}: </Span>
      {children}
    </Label>
  );
}
