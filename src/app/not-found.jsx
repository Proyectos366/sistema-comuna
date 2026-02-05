/**
 @fileoverview Página de error 404 para rutas no encontradas. Este componente muestra un mensaje
 amigable cuando el usuario accede a una ruta inexistente y ofrece un enlace para volver al
 inicio. Utiliza el layout principal `Main`. @module views/NotFound
*/

import Main from "@/components/padres/Main"; // 2. Importa el layout principal de la aplicación
import NotFoundPages from "@/views/NotFoundPages";

/**
 Componente de página no encontrada (404). Renderiza un mensaje de error y un botón para
 regresar al inicio.
 @function NotFound
 @returns {JSX.Element} Vista de error 404.
*/
export default function NotFound() {
  return (
    <Main>
      <NotFoundPages />
    </Main>
  );
}
