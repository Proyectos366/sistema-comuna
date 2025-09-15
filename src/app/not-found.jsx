/**
 @fileoverview Página de error 404 para rutas no encontradas. Este componente muestra un mensaje
 amigable cuando el usuario accede a una ruta inexistente y ofrece un enlace para volver al inicio.
 Utiliza el layout principal `Main`. @module views/NotFound
*/

import Link from "next/link"; // 1. Importa el componente Link para navegación interna
import Main from "@/components/Main"; // 2. Importa el layout principal de la aplicación

/**
 Componente de página no encontrada (404). Renderiza un mensaje de error y un botón para regresar al
 inicio.
 @function NotFound
 @returns {JSX.Element} Vista de error 404.
*/
export default function NotFound() {
  // 3. Retorna la estructura visual del error 404 dentro del layout principal
  return (
    <Main>
      <section className="flex h-screen flex-col items-center justify-center space-y-8 text-center text-white">
        {/* 4. Título principal del error */}
        <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl">
          404
        </h1>

        {/* 5. Subtítulo explicativo */}
        <h6 className="text-2xl font-semibold sm:text-3xl">
          Página no encontrada
        </h6>

        {/* 6. Mensaje descriptivo del error */}
        <p className="max-w-md text-gray-200">
          Lo sentimos, la página que estás buscando no existe. Es posible que
          hayas escrito mal la dirección o que la página haya sido eliminada.
        </p>

        {/* 7. Botón para volver al inicio */}
        <Link
          className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-900"
          href={"/"}
        >
          Volver al inicio
        </Link>
      </section>
    </Main>
  );
}
