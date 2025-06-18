-- CreateTable
CREATE TABLE "role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cedula" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "cargo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cargo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "parroquia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "borrado" BOOLEAN NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "parroquia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comuna" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "norte" TEXT NOT NULL,
    "sur" TEXT NOT NULL,
    "este" TEXT NOT NULL,
    "oeste" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "punto" TEXT NOT NULL,
    "rif" TEXT,
    "codigo" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_parroquia" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comuna_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comuna_id_parroquia_fkey" FOREIGN KEY ("id_parroquia") REFERENCES "parroquia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "circuito" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "norte" TEXT NOT NULL,
    "sur" TEXT NOT NULL,
    "este" TEXT NOT NULL,
    "oeste" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "punto" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL,
    "validado" BOOLEAN NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_parroquia" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "circuito_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "circuito_id_parroquia_fkey" FOREIGN KEY ("id_parroquia") REFERENCES "parroquia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "consejo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "norte" TEXT NOT NULL,
    "sur" TEXT NOT NULL,
    "este" TEXT NOT NULL,
    "oeste" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "punto" TEXT NOT NULL,
    "rif" TEXT,
    "codigo" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_comuna" INTEGER,
    "id_circuito" INTEGER,
    "id_parroquia" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "consejo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "consejo_id_comuna_fkey" FOREIGN KEY ("id_comuna") REFERENCES "comuna" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "consejo_id_circuito_fkey" FOREIGN KEY ("id_circuito") REFERENCES "circuito" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "consejo_id_parroquia_fkey" FOREIGN KEY ("id_parroquia") REFERENCES "parroquia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vocero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "nombre_dos" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "apellido_dos" TEXT NOT NULL,
    "cedula" INTEGER NOT NULL,
    "genero" BOOLEAN NOT NULL,
    "edad" INTEGER NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "laboral" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "formacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "culminada" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "formacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "modulo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "modulo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "curso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_vocero" INTEGER NOT NULL,
    "id_formacion" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_completado" DATETIME,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "certificado" BOOLEAN NOT NULL DEFAULT false,
    "culminado" BOOLEAN NOT NULL DEFAULT false,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "curso_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "curso_id_vocero_fkey" FOREIGN KEY ("id_vocero") REFERENCES "vocero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "curso_id_formacion_fkey" FOREIGN KEY ("id_formacion") REFERENCES "formacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "asistencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_vocero" INTEGER NOT NULL,
    "id_modulo" INTEGER NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "presente" BOOLEAN NOT NULL,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "asistencia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "asistencia_id_vocero_fkey" FOREIGN KEY ("id_vocero") REFERENCES "vocero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "asistencia_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "modulo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "asistencia_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_cargoTovocero" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_cargoTovocero_A_fkey" FOREIGN KEY ("A") REFERENCES "cargo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_cargoTovocero_B_fkey" FOREIGN KEY ("B") REFERENCES "vocero" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_formacionTomodulo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_formacionTomodulo_A_fkey" FOREIGN KEY ("A") REFERENCES "formacion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_formacionTomodulo_B_fkey" FOREIGN KEY ("B") REFERENCES "modulo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "role_nombre_key" ON "role"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_token_key" ON "usuario"("token");

-- CreateIndex
CREATE UNIQUE INDEX "cargo_nombre_key" ON "cargo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "comuna_rif_key" ON "comuna"("rif");

-- CreateIndex
CREATE UNIQUE INDEX "comuna_codigo_key" ON "comuna"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "consejo_rif_key" ON "consejo"("rif");

-- CreateIndex
CREATE UNIQUE INDEX "consejo_codigo_key" ON "consejo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "vocero_cedula_key" ON "vocero"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "vocero_correo_key" ON "vocero"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "vocero_token_key" ON "vocero"("token");

-- CreateIndex
CREATE UNIQUE INDEX "formacion_nombre_key" ON "formacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "modulo_nombre_key" ON "modulo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "_cargoTovocero_AB_unique" ON "_cargoTovocero"("A", "B");

-- CreateIndex
CREATE INDEX "_cargoTovocero_B_index" ON "_cargoTovocero"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_formacionTomodulo_AB_unique" ON "_formacionTomodulo"("A", "B");

-- CreateIndex
CREATE INDEX "_formacionTomodulo_B_index" ON "_formacionTomodulo"("B");
