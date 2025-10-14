/**
 @fileoverview Layout raíz de la aplicación. Aplica estilos globales, configura metadatos y envuelve
 la interfaz con el proveedor de PrimeReact. Este módulo sirve como punto de entrada para toda la
 estructura visual del sistema. @module layouts/RootLayout
*/
import "./globals.css"; // 1. Importa los estilos globales personalizados
import "primereact/resources/themes/saga-blue/theme.css"; // 2. Tema visual de PrimeReact
import "primereact/resources/primereact.min.css"; // 3. Estilos base de PrimeReact
import "primeicons/primeicons.css"; // 4. Iconos utilizados por PrimeReact
import ReduxProvider from "@/store/provider";

// 5. Proveedor de configuración para componentes PrimeReact
import { PrimeReactProvider } from "primereact/api";

/**
 Metadatos globales de la aplicación. Utilizados por Next.js para configurar el título, descripción
 y manifest del sitio.
 @constant
 @type {Object}
*/
export const metadata = {
  title: "Login", // 6. Título de la página principal
  description: "Sistema de comuna contraloria", // 7. Descripción para motores de búsqueda
  manifest: "/manifest.json", // 8. Ruta al archivo de configuración PWA
};

/**
 Layout raíz de la aplicación. Envuelve toda la interfaz con el proveedor de PrimeReact y aplica
 estilos globales.
 @function RootLayout
 @param {Object} props - Propiedades del componente.
 @param {React.ReactNode} props.children - Componentes hijos que se renderizan dentro del layout.
 @returns {JSX.Element} Estructura HTML base de la aplicación.
*/
export default function RootLayout({ children }) {
  // 9. Retorna la estructura HTML con el proveedor de PrimeReact aplicado
  return (
    <html lang="en">
      <body className="color-fondo">
        <ReduxProvider>
          <PrimeReactProvider>{children}</PrimeReactProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
