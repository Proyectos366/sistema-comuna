# 🧬 Prisma ORM — Guía Técnica

Este documento describe cómo se configura y utiliza Prisma en este proyecto.

---

## ⚙️ Configuración

- Archivo principal: `prisma/schema.prisma`
- Base de datos: Sqlite
- Cliente Prisma: generado automáticamente con `npx prisma generate`

---

## 📁 Estructura

- En el archivo principal: `prisma/schema.prisma`, se encuentran los modelos de la base de datos
  junto con relaciones y casi que ordenada de manera en como se usa.

- En la carpeta prisma se encuentran tambien la carpeta de migraciones y la carpeta donde esta
  la base de datos que en este caso es Sqlite

- Se esta usando la version 6.5.0 de prisma para este proyecto
