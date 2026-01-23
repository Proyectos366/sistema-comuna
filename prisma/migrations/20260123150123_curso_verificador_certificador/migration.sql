-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_curso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha_completado" DATETIME,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "certificado" BOOLEAN NOT NULL DEFAULT false,
    "culminado" BOOLEAN NOT NULL DEFAULT false,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_vocero" INTEGER NOT NULL,
    "id_formacion" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_verifico" INTEGER,
    "id_certifico" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "curso_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "curso_id_vocero_fkey" FOREIGN KEY ("id_vocero") REFERENCES "vocero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "curso_id_formacion_fkey" FOREIGN KEY ("id_formacion") REFERENCES "formacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "curso_id_verifico_fkey" FOREIGN KEY ("id_verifico") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "curso_id_certifico_fkey" FOREIGN KEY ("id_certifico") REFERENCES "usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_curso" ("borrado", "certificado", "createdAt", "culminado", "descripcion", "fecha_completado", "id", "id_formacion", "id_usuario", "id_vocero", "updatedAt", "verificado") SELECT "borrado", "certificado", "createdAt", "culminado", "descripcion", "fecha_completado", "id", "id_formacion", "id_usuario", "id_vocero", "updatedAt", "verificado" FROM "curso";
DROP TABLE "curso";
ALTER TABLE "new_curso" RENAME TO "curso";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
