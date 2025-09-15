/**
 @fileoverview Componente principal ...slug de la vista del master. Renderiza la interfaz
 universal de usuarios dentro del entorno del dashboard. Este módulo sirve como punto de entrada
 para la sección del master. @module views/Master
*/
import VistaUniversalUsuarios from "@/components/sistema/VistaUniversalUsuarios"; // 1. Importa el componente de usuarios

/**
 Componente de la vista del master. Renderiza el componente de usuarios dentro de un fragmento
 React. @function Master
 @returns {JSX.Element} Vista del master con la interfaz de usuarios.
*/
export default function Master() {
  // 2. Retorna el componente de usuarios envuelto en un fragmento
  return (
    <>
      <VistaUniversalUsuarios></VistaUniversalUsuarios>
    </>
  );
}
