import "@/app/globals.css";
import { UserProvider } from "@/app/context/AuthContext";

export const metadata = {
  title: "Director",
  description: "Sistema de comunas contraloría, dashboard-director",
};

export default function DashboardDirectorLayout({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
