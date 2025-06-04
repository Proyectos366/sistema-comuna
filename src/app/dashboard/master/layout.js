import "@/app/globals.css";
import { UserProvider } from "@/app/context/AuthContext";

export const metadata = {
  title: "S.C Master",
  description: "Sistema de comuna contraloría, dashboard-master",
};

export default function DashboardMasterLayout({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
