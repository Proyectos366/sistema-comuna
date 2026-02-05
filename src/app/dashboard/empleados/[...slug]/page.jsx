/**
 @fileoverview Componente principal ...slug de la vista del empleado. Renderiza la interfaz
 universal de usuarios dentro del entorno del dashboard. Este módulo sirve como punto de entrada
 para la sección del empleado. @module views/Empleado
*/
import Dashboard from "@/views/Dashboard";

/**
 Componente de la vista del empleado. Renderiza el componente de usuarios dentro de un fragmento
 React. @function Empleado
 @returns {JSX.Element} Vista del empleado con la interfaz de usuarios.
*/
export default function Empleados() {
  // 2. Retorna el componente de usuarios envuelto en un fragmento
  return (
    <>
      <Dashboard />
    </>
  );
}
