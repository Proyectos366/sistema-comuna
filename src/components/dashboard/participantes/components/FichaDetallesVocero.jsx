import Div from "@/components/padres/Div";

export default function FichaDetallesVocero({ children, dato, index }) {
  return (
    <Div
      className={`bg-[#eef1f5] rounded-md shadow-md border 
                              ${
                                !dato.estaVerificado
                                  ? !dato.asistenciaAprobada
                                    ? "bg-[#e2e8f0] hover:bg-[#f6f3f3] text-[#1e2939] border-[#d1d5dc]"
                                    : "border-[#082158] text-[#082158]"
                                  : !dato.estaCertificado
                                  ? "border-[#E61C45] hover:bg-[#E61C45] text-[#000000] hover:border-[#E61C45]"
                                  : "border-[#2FA807] hover:bg-[#2FA807] text-[#000000] hover:border-[#2FA807] "
                              }
                              transition-all`}
      style={{ animationDelay: `${index * 0.4}s` }}
    >
      {children}
    </Div>
  );
}
