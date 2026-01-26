/*
  Warnings:

  - You are about to drop the column `fecha_registro` on the `asistencia` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_asistencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "presente" BOOLEAN NOT NULL,
    "fecha_validada" DATETIME,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_formador" INTEGER,
    "id_vocero" INTEGER NOT NULL,
    "id_modulo" INTEGER NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_validador" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "asistencia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "asistencia_id_vocero_fkey" FOREIGN KEY ("id_vocero") REFERENCES "vocero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "asistencia_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "modulo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "asistencia_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "asistencia_id_formador_fkey" FOREIGN KEY ("id_formador") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "asistencia_id_validador_fkey" FOREIGN KEY ("id_validador") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_asistencia" ("borrado", "createdAt", "descripcion", "id", "id_curso", "id_formador", "id_modulo", "id_usuario", "id_validador", "id_vocero", "presente", "updatedAt") SELECT "borrado", "createdAt", "descripcion", "id", "id_curso", "id_formador", "id_modulo", "id_usuario", "id_validador", "id_vocero", "presente", "updatedAt" FROM "asistencia";
DROP TABLE "asistencia";
ALTER TABLE "new_asistencia" RENAME TO "asistencia";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
