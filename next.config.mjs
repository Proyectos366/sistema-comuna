import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig = {
  // Tu configuración existente aquí
  allowedDevOrigins: ["192.168.0.130"], // 👈 Aquí agregas tu IP local
};

export default withPWA(nextConfig);
