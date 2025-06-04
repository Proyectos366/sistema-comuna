import "@/app/globals.css";
import { UserProvider } from "@/app/context/AuthContext";

export const metadata = {
  title: "S.C Administrador",
  description: "Sistema de comunas contraloría, dashboard-administrador",
};

export default function DashboardAdministradorLayout({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
