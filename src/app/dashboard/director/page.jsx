/**
 @fileoverview Componente principal de la vista de inicio del director. Renderiza la interfaz
 universal de inicio dentro del entorno del dashboard. Este módulo sirve como punto de entrada para
 la sección inicial del director. @module views/DirectorInicio
*/
import VistaUniversalInicio from "@/components/sistema/VistaUniversalInicio"; // 1. Importa el componente de inicio universal

/**
 Componente de la vista de inicio del director. Renderiza el componente de inicio dentro de
 un fragmento React.
 @function Director
 @returns {JSX.Element} Vista inicial del director.
*/
export default function Director() {
  // 2. Retorna el componente de inicio envuelto en un fragmento
  return (
    <>
      <VistaUniversalInicio />
    </>
  );
}
