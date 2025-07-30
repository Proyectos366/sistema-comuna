import "./globals.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { PrimeReactProvider } from "primereact/api";

export const metadata = {
  title: "Login",
  description: "Sistema de comuna contraloria",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="color-fondo">
        <PrimeReactProvider>{children}</PrimeReactProvider>
      </body>
    </html>
  );
}
