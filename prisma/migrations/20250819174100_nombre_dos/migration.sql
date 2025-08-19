-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_notificacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mensaje" TEXT NOT NULL,
    "fechaEnvio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_emisor" INTEGER,
    "id_receptor" INTEGER NOT NULL,
    "estatus" TEXT NOT NULL DEFAULT 'enviada',
    CONSTRAINT "notificacion_id_emisor_fkey" FOREIGN KEY ("id_emisor") REFERENCES "departamento" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "notificacion_id_receptor_fkey" FOREIGN KEY ("id_receptor") REFERENCES "departamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_notificacion" ("estatus", "fechaEnvio", "id", "id_emisor", "id_receptor", "mensaje") SELECT "estatus", "fechaEnvio", "id", "id_emisor", "id_receptor", "mensaje" FROM "notificacion";
DROP TABLE "notificacion";
ALTER TABLE "new_notificacion" RENAME TO "notificacion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
