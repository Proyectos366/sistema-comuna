/**
 @fileoverview Componente principal ...slug de la vista del director. Renderiza la interfaz
 universal de usuarios dentro del entorno del dashboard. Este módulo sirve como punto de entrada
 para la sección del director. @module views/Director
*/
import VistaUniversalUsuarios from "@/components/sistema/VistaUniversalUsuarios"; // 1. Importa el componente de usuarios

/**
 Componente de la vista del director. Renderiza el componente de usuarios dentro de un fragmento
 React. @function Director
 @returns {JSX.Element} Vista del director con la interfaz de usuarios.
*/
export default function Director() {
  // 2. Retorna el componente de usuarios envuelto en un fragmento
  return (
    <>
      <VistaUniversalUsuarios></VistaUniversalUsuarios>
    </>
  );
}
