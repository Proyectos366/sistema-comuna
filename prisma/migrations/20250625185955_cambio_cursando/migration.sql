/*
  Warnings:

  - You are about to alter the column `cedula` on the `cursando` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cursando" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cedula" INTEGER NOT NULL,
    "edad" INTEGER NOT NULL,
    "genero" BOOLEAN NOT NULL,
    "f_n" DATETIME NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_parroquia" INTEGER NOT NULL,
    "id_comuna" INTEGER,
    "id_consejo" INTEGER,
    "id_clase" INTEGER NOT NULL,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cursando_id_clase_fkey" FOREIGN KEY ("id_clase") REFERENCES "clase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cursando" ("borrado", "cedula", "createdAt", "edad", "f_n", "genero", "id", "id_clase", "id_comuna", "id_consejo", "id_parroquia", "id_usuario", "updatedAt") SELECT "borrado", "cedula", "createdAt", "edad", "f_n", "genero", "id", "id_clase", "id_comuna", "id_consejo", "id_parroquia", "id_usuario", "updatedAt" FROM "cursando";
DROP TABLE "cursando";
ALTER TABLE "new_cursando" RENAME TO "cursando";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
