/**
 @fileoverview Layout principal para el dashboard del empleado. Este componente aplica estilos
 globales, define metadatos de la página y envuelve toda la interfaz con el proveedor de contexto
 de usuario. @module layouts/DashboardEmpleadoLayout
*/
import "@/app/globals.css"; // 1. Importa los estilos globales de la aplicación
import { UserProvider } from "@/app/context/AuthContext"; // 2. Importa el proveedor de contexto de usuario
import ReduxProvider from "@/store/provider";
import InitAuth from "@/components/InitAuth";

/**
 Metadatos para el dashboard del empleado. Utilizados por Next.js para configurar el título y
 descripción de la página. @constant
 @type {Object}
*/
export const metadata = {
  title: "Empleados", // 3. Título de la página
  description: "Sistema de comuna contraloría, dashboard-empleados", // 4. Descripción para SEO
};

/**
 Layout del dashboard del empleado. Envuelve los componentes hijos con el contexto de usuario.
 @function DashboardEmpleadoLayout
 @param {Object} props - Propiedades del componente.
 @param {React.ReactNode} props.children - Componentes hijos que se renderizan dentro del layout.
 @returns {JSX.Element} Layout con contexto aplicado.
*/
export default function DashboardEmpleadosLayout({ children }) {
  // 5. Retorna el layout envuelto en el contexto de usuario
  return (
    <ReduxProvider>
      <InitAuth />
      <UserProvider>{children}</UserProvider>
    </ReduxProvider>
  );
}
