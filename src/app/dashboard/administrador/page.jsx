/**
 @fileoverview Componente principal de la vista de inicio del administrador. Renderiza la
 interfaz universal de inicio dentro del entorno del dashboard. Este módulo sirve como punto
 de entrada para la sección inicial del administrador. @module views/AdministradorInicio
*/
import DashboardInicio from "@/views/DashboardInicio";

/**
 Componente de la vista de inicio del administrador. Renderiza el componente de inicio dentro de
 un fragmento React.
 @function Administrador
 @returns {JSX.Element} Vista inicial del administrador.
*/
export default function Administrador() {
  // 2. Retorna el componente de inicio envuelto en un fragmento
  return (
    <>
      <DashboardInicio />
    </>
  );
}
