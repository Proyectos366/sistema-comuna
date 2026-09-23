import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Opcional: desactiva PWA en desarrollo para mayor rapidez
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.0.130"],
  turbopack: {}, // 👈 Evita que Next.js lance el error por la config de Webpack de PWA
};

export default withPWA(nextConfig);

// import withPWAInit from "@ducanh2912/next-pwa";

// const withPWA = withPWAInit({
//   dest: "public",
// });

// const nextConfig = {
//   // Tu configuración existente aquí
//   allowedDevOrigins: ["192.168.0.130"], // 👈 Aquí agregas tu IP local
// };

// export default withPWA(nextConfig);
