import Label from "../padres/Label";
import Span from "../padres/Span";

export default function LabelInput({ children, nombre, htmlFor }) {
  return (
    <Label className="block w-full" htmlFor={htmlFor}>
      <Span className="text-gray-700 font-medium">{nombre}: </Span>
      {children}
    </Label>
  );
}
