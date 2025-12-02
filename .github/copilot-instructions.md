# Instrucciones para agentes de codificación (Copilot)

Resumen rápido
- Proyecto: `sistema-comuna` — Next.js 15 (App Router) + Prisma (SQLite) + Redux Toolkit.
- Propósito: aplicación administrativa modular para gestión de comunas, voceros y entidades.

Arquitectura y puntos clave
- Rutas y UI: `src/app/` (App Router). Coloca páginas y API en subdirectorios de `app`.
- Componentes: `src/components/` contiene UI reutilizable; subcarpetas por dominio (ej. `dashboard/comunas`). Ejemplo: `src/components/dashboard/comunas/ComunasView.jsx`.
- Lógica de dominio/servicios: `src/services/` — funciones que consumen API y encapsulan llamadas HTTP.
- Utilidades y cliente DB: `src/libs/` — `prisma.js` exporta la instancia del cliente Prisma; `AuthTokens.js` gestiona JWT.
- Estado global: `src/store/` con slices por dominio y `src/store/provider.js` envuelve la app (ver `src/app/layout.js`).
- Persistencia: Prisma con `prisma/schema.prisma` (modelos en español, nombres en minúscula). Mantener consistencia con los nombres de modelo/columnas al escribir consultas.

Comandos y flujos de desarrollo
- Instalar dependencias: `npm install`.
- Desarrollo: `npm run dev` (usa `next dev --turbopack`).
- Build: `npm run build` (ejecuta `prisma generate && next build`). Asegúrate de tener `DATABASE_URL` configurada y de ejecutar migraciones si hace falta.
- Start (producción/after-build): `npm start` (usa `next start --port 3120`).
- Lint: `npm run lint`.
- Prisma útil: para aplicar migraciones locales usar `npx prisma migrate dev` y para generar cliente `npx prisma generate`.

Variables de entorno importantes
- `DATABASE_URL` — required para Prisma (archivo `.env` o sistema de despliegue).
- `JWT_SECRET`, `JWT_EXPIRATION`, `JWT_COOKIE_EXPIRES` — requeridas por `src/libs/AuthTokens.js`.

Convenciones del proyecto (específicas)
- Idioma: el código y modelos usan español; preferir nombres en español cuando añadas modelos, rutas o slices.
- Prisma: los modelos están en minúscula (`usuario`, `comuna`, `vocero`). No cambies a PascalCase en el schema.
- Estado/flags: muchos modelos usan `borrado` (soft delete) y `updatedAt`/`createdAt` — respeta estos campos en queries y updates.
- Tokens: campos `token` en `usuario` y `vocero` son únicos; evita colisiones al crear registros.
- UI: componentes visuales usan PrimeReact + Tailwind; importa temas en `src/app/layout.js`.
- Al añadir slices, regístralos en `src/store/store.js` y sigue el patrón existente (`features/<dominio>/<dominio>Slices.js`).

Patrones de integración
- Acceso DB: siempre usar la instancia única exportada en `src/libs/prisma.js` para evitar conexiones duplicadas.
- Autenticación: usar `src/libs/AuthTokens.js` para generar y validar JWT; las rutas deben leer `process.env` para los secretos.
- Storage: archivos subidos se colocan en `public/uploads` y/o `storage/` — respeta rutas relativas en los componentes y servicios.

Ejemplos rápidos (copiar/ajustar)
- Obtener lista de comunas (servicio): revisar `src/services/comunas/` o crear `src/services/comunas.js` que haga `axios.get('/api/comunas')`.
- Uso Prisma en API (ruta server-side):
  - import prisma from '@/libs/prisma';
  - const comunas = await prisma.comuna.findMany({ where: { borrado: false } });

Qué evitar o tener en cuenta
- No sobrescribir el cliente Prisma; siempre `import prisma from '@/libs/prisma'`.
- No asumir que el entorno es producción: `AuthTokens` configura `secure:false` por defecto — revisar antes de desplegar.
- Cuando modifiques `prisma/schema.prisma`, ejecutar `npx prisma generate` y crear la migración correspondiente.

Dónde mirar primero (archivos/dirs relevantes)
- `package.json` — scripts y dependencias.
- `prisma/schema.prisma` — modelos y relaciones.
- `src/libs/prisma.js`, `src/libs/AuthTokens.js` — patrones de DB y auth.
- `src/app/layout.js` — providers globales (Redux + PrimeReact).
- `src/store/` — slices y estructura de estado.
- `src/services/` — integración con API.
- `public/uploads`, `storage/` — rutas de archivos y persistencia de uploads.

Feedback
Si alguna sección está incompleta o quieres que agregue fragmentos de ejemplo más largos (endpoints API, slice template o migration checklist), dime qué prefieres y lo actualizo.

---
Archivo generado/actualizado automáticamente por agente.
