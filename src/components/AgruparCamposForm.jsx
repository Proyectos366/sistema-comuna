import Div from "@/components/padres/Div";

export default function AgruparCamposForm({ children }) {
  return (
    <Div className={`flex flex-col sm:flex-row gap-2 sm:gap-4`}>{children}</Div>
  );
}
