/*
  Warnings:

  - You are about to drop the column `alto` on the `imagen` table. All the data in the column will be lost.
  - You are about to drop the column `ancho` on the `imagen` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `imagen` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_mime` on the `imagen` table. All the data in the column will be lost.
  - You are about to alter the column `peso` on the `imagen` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - Added the required column `nombreOriginal` to the `imagen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreSistema` to the `imagen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `imagen` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_imagen" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_usuario" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "nombreOriginal" TEXT NOT NULL,
    "nombreSistema" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "peso" INTEGER NOT NULL,
    "perfil" BOOLEAN NOT NULL DEFAULT true,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "imagen_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_imagen" ("borrado", "createdAt", "descripcion", "formato", "id", "id_usuario", "path", "perfil", "peso", "updatedAt") SELECT "borrado", "createdAt", "descripcion", "formato", "id", "id_usuario", "path", "perfil", "peso", "updatedAt" FROM "imagen";
DROP TABLE "imagen";
ALTER TABLE "new_imagen" RENAME TO "imagen";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
