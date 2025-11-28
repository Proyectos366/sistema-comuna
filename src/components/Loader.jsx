import { BounceLoader } from "react-spinners";
import Div from "@/components/padres/Div";
import Span from "@/components/padres/Span";

export default function Loader({ color, size, titulo }) {
  return (
    <Div className="flex items-center gap-4">
      <BounceLoader color={color ? color : "#082158"} size={size ? size : 50} />
      <Span>{titulo}</Span>
    </Div>
  );
}
