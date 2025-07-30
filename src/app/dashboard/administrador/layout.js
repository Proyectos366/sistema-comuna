import "@/app/globals.css";
import { UserProvider } from "@/app/context/AuthContext";

export const metadata = {
  title: "Administrador",
  description: "Sistema de comunas contraloría, dashboard-administrador",
};

export default function DashboardAdministradorLayout({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
