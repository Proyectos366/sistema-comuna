/*
  Warnings:

  - You are about to alter the column `cedula` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cedula" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_usuario" ("borrado", "cedula", "clave", "correo", "createdAt", "id", "id_rol", "nombre", "token", "updatedAt") SELECT "borrado", "cedula", "clave", "correo", "createdAt", "id", "id_rol", "nombre", "token", "updatedAt" FROM "usuario";
DROP TABLE "usuario";
ALTER TABLE "new_usuario" RENAME TO "usuario";
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");
CREATE UNIQUE INDEX "usuario_token_key" ON "usuario"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
