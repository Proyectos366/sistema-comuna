-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_formacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "id_usuario" INTEGER NOT NULL,
    "id_departamento" INTEGER,
    "id_institucion" INTEGER,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "culminada" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "formacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "formacion_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "institucion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "formacion_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "departamento" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_formacion" ("borrado", "createdAt", "culminada", "descripcion", "id", "id_departamento", "id_usuario", "nombre", "updatedAt") SELECT "borrado", "createdAt", "culminada", "descripcion", "id", "id_departamento", "id_usuario", "nombre", "updatedAt" FROM "formacion";
DROP TABLE "formacion";
ALTER TABLE "new_formacion" RENAME TO "formacion";
CREATE UNIQUE INDEX "formacion_nombre_key" ON "formacion"("nombre");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
