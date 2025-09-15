/**
 @fileoverview Componente principal de la vista de inicio del master. Renderiza la interfaz
 universal de inicio dentro del entorno del dashboard. Este módulo sirve como punto de entrada para
 la sección inicial del master. @module views/MasterInicio
*/
import VistaUniversalInicio from "@/components/sistema/VistaUniversalInicio"; // 1. Importa el componente de inicio universal

/**
 Componente de la vista de inicio del master. Renderiza el componente de inicio dentro de
 un fragmento React.
 @function Master
 @returns {JSX.Element} Vista inicial del master.
*/
export default function Master() {
  // 2. Retorna el componente de inicio envuelto en un fragmento
  return (
    <>
      <VistaUniversalInicio />
    </>
  );
}
