/*
  Warnings:

  - You are about to drop the `recepcionDepartamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `borrado` on the `novedad` table. All the data in the column will be lost.
  - You are about to drop the column `id_depa_origen` on the `novedad` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `novedad` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "recepcionDepartamento";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "novedadDepartamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estatus" TEXT NOT NULL DEFAULT 'pendiente',
    "fechaRecepcion" DATETIME,
    "id_novedad" INTEGER NOT NULL,
    "id_departamento" INTEGER NOT NULL,
    CONSTRAINT "novedadDepartamento_id_novedad_fkey" FOREIGN KEY ("id_novedad") REFERENCES "novedad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "novedadDepartamento_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "departamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notificacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mensaje" TEXT NOT NULL,
    "fechaEnvio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_emisor" INTEGER NOT NULL,
    "id_receptor" INTEGER NOT NULL,
    "estatus" TEXT NOT NULL DEFAULT 'enviada',
    CONSTRAINT "notificacion_id_emisor_fkey" FOREIGN KEY ("id_emisor") REFERENCES "departamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "notificacion_id_receptor_fkey" FOREIGN KEY ("id_receptor") REFERENCES "departamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_novedad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prioridad" TEXT NOT NULL DEFAULT 'baja',
    "id_usuario" INTEGER NOT NULL,
    "id_institucion" INTEGER,
    "id_departamento" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "novedad_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "novedad_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "institucion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "novedad_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "departamento" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_novedad" ("createdAt", "descripcion", "id", "id_institucion", "id_usuario", "nombre", "updatedAt") SELECT "createdAt", "descripcion", "id", "id_institucion", "id_usuario", "nombre", "updatedAt" FROM "novedad";
DROP TABLE "novedad";
ALTER TABLE "new_novedad" RENAME TO "novedad";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
