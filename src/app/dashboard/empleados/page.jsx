/**
 @fileoverview Componente principal de la vista de inicio del empleado. Renderiza la interfaz
 universal de inicio dentro del entorno del dashboard. Este módulo sirve como punto de entrada para
 la sección inicial del empleado. @module views/EmpleadoInicio
*/
import VistaUniversalInicio from "@/components/sistema/VistaUniversalInicio"; // 1. Importa el componente de inicio universal

/**
 Componente de la vista de inicio del empleado. Renderiza el componente de inicio dentro de
 un fragmento React.
 @function Empleado
 @returns {JSX.Element} Vista inicial del empleado.
*/
export default function Empleados() {
  // 2. Retorna el componente de inicio envuelto en un fragmento
  return (
    <>
      <VistaUniversalInicio />
    </>
  );
}
