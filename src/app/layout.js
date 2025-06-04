import "./globals.css";

export const metadata = {
  title: "S.C Contraloria",
  description: "Sistema de comuna contraloria",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`color-fondo`}>{children}</body>
    </html>
  );
}
