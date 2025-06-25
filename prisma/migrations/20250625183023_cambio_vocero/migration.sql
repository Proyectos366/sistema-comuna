-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vocero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "nombre_dos" TEXT,
    "apellido" TEXT NOT NULL,
    "apellido_dos" TEXT,
    "cedula" INTEGER NOT NULL,
    "genero" BOOLEAN NOT NULL,
    "edad" INTEGER NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT,
    "correo" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "laboral" TEXT NOT NULL,
    "f_n" DATETIME NOT NULL,
    "borrado" BOOLEAN NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_comuna" INTEGER,
    "id_consejo" INTEGER,
    "id_circuito" INTEGER,
    "id_parroquia" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vocero_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vocero_id_parroquia_fkey" FOREIGN KEY ("id_parroquia") REFERENCES "parroquia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vocero_id_comuna_fkey" FOREIGN KEY ("id_comuna") REFERENCES "comuna" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "vocero_id_consejo_fkey" FOREIGN KEY ("id_consejo") REFERENCES "consejo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "vocero_id_circuito_fkey" FOREIGN KEY ("id_circuito") REFERENCES "circuito" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_vocero" ("apellido", "apellido_dos", "borrado", "cedula", "correo", "createdAt", "direccion", "edad", "f_n", "genero", "id", "id_circuito", "id_comuna", "id_consejo", "id_parroquia", "id_usuario", "laboral", "nombre", "nombre_dos", "telefono", "token", "updatedAt") SELECT "apellido", "apellido_dos", "borrado", "cedula", "correo", "createdAt", "direccion", "edad", "f_n", "genero", "id", "id_circuito", "id_comuna", "id_consejo", "id_parroquia", "id_usuario", "laboral", "nombre", "nombre_dos", "telefono", "token", "updatedAt" FROM "vocero";
DROP TABLE "vocero";
ALTER TABLE "new_vocero" RENAME TO "vocero";
CREATE UNIQUE INDEX "vocero_cedula_key" ON "vocero"("cedula");
CREATE UNIQUE INDEX "vocero_correo_key" ON "vocero"("correo");
CREATE UNIQUE INDEX "vocero_token_key" ON "vocero"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
