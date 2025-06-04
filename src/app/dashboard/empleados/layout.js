import "@/app/globals.css";
import { UserProvider } from "@/app/context/AuthContext";

export const metadata = {
  title: "S.C Empleados",
  description: "Sistema de comuna contraloría, dashboard-empleados",
};

export default function DashboardEmpleadosLayout({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
