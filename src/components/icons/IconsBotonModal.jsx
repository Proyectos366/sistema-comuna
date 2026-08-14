import IconoDescarga from "@/components/icons/IconDescarga";
import IconoLimpiar from "@/components/icons/IconLimpiar";
import IconoCheck from "@/components/icons/IconoCheck";
import IconoCancelar from "@/components/icons/IconCancelar";
import IconoEditar from "@/components/icons/IconEditar";
import IconoBasura from "@/components/icons/IconBasura";
import IconoEscoba from "@/components/icons/IconEscoba";

const renderIcono = (icono, props = {}) => {
  switch (icono) {
    case "descarga":
      return <IconoDescarga {...props} />;

    case "limpiar":
      return <IconoLimpiar {...props} />;

    case "check":
      return <IconoCheck {...props} />;

    case "cancelar":
      return <IconoCancelar {...props} />;

    case "editar":
      return <IconoEditar {...props} />;

    case "basura":
      return <IconoBasura {...props} />;

    case "escoba":
      return <IconoEscoba {...props} />;

    default:
      return <IconoCheck {...props} />;
  }
};

export default renderIcono;
