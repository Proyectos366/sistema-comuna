-- CreateTable
CREATE TABLE "role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cedula" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "nombre_dos" TEXT DEFAULT '',
    "apellido" TEXT,
    "apellido_dos" TEXT DEFAULT '',
    "sector" TEXT DEFAULT '',
    "direccion" TEXT DEFAULT '',
    "f_n" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cargo" TEXT DEFAULT '',
    "f_ingreso" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profesion" TEXT DEFAULT '',
    "correo" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "validado" BOOLEAN NOT NULL DEFAULT false,
    "id_rol" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "imagen" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "nombreOriginal" TEXT NOT NULL,
    "nombreSistema" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "formato" TEXT NOT NULL,
    "peso" INTEGER NOT NULL,
    "perfil" BOOLEAN NOT NULL DEFAULT true,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "imagen_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "serial" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pais_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "estado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "cod_postal" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "serial" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_pais" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "estado_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "estado_id_pais_fkey" FOREIGN KEY ("id_pais") REFERENCES "pais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "municipio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "serial" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "municipio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "municipio_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estado" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "parroquia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "serial" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_municipio" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "parroquia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "parroquia_id_municipio_fkey" FOREIGN KEY ("id_municipio") REFERENCES "municipio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "institucion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "rif" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" INTEGER NOT NULL,
    "id_pais" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,
    "id_municipio" INTEGER NOT NULL,
    "id_parroquia" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "institucion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "institucion_id_pais_fkey" FOREIGN KEY ("id_pais") REFERENCES "pais" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "institucion_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estado" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "institucion_id_municipio_fkey" FOREIGN KEY ("id_municipio") REFERENCES "municipio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "institucion_id_parroquia_fkey" FOREIGN KEY ("id_parroquia") REFERENCES "parroquia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "departamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" INTEGER NOT NULL,
    "id_institucion" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "departamento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "departamento_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "institucion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cargo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cargo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "asignacion_geografica" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pais" TEXT,
    "estado" TEXT,
    "municipio" TEXT,
    "parroquia" TEXT,
    "nivel" TEXT NOT NULL,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" INTEGER NOT NULL,
    CONSTRAINT "asignacion_geografica_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "borrado" BOOLEAN NOT NULL DEFAULT false,
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
    "borrado" BOOLEAN NOT NULL DEFAULT false,
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
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
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
CREATE TABLE "entidad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "entidad_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "proyecto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "fecha_creado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" INTEGER NOT NULL,
    "estatus" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "proyecto_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "beneficio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "beneficio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "familiar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" INTEGER NOT NULL,
    "parentesco" TEXT NOT NULL,
    "f_n" DATETIME NOT NULL,
    "genero" BOOLEAN NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_vocero" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "familiar_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "familiar_id_vocero_fkey" FOREIGN KEY ("id_vocero") REFERENCES "vocero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vocero" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "nombre_dos" TEXT,
    "apellido" TEXT NOT NULL,
    "apellido_dos" TEXT,
    "cedula" INTEGER NOT NULL,
    "genero" BOOLEAN NOT NULL,
    "edad" INTEGER NOT NULL,
    "telefono" TEXT NOT NULL,
    "pais" TEXT DEFAULT '',
    "estado" TEXT DEFAULT '',
    "municipio" TEXT DEFAULT '',
    "parroquia" TEXT DEFAULT '',
    "sector" TEXT DEFAULT '',
    "direccion" TEXT DEFAULT '',
    "correo" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "laboral" TEXT NOT NULL,
    "f_n" DATETIME NOT NULL,
    "jefe_comunidad" BOOLEAN NOT NULL DEFAULT false,
    "jefe_calle" BOOLEAN NOT NULL DEFAULT false,
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" INTEGER NOT NULL,
    "id_comuna" INTEGER,
    "id_consejo" INTEGER,
    "id_circuito" INTEGER,
    "id_parroquia" INTEGER NOT NULL,
    "id_entidad" INTEGER,
    "id_proyecto" INTEGER,
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

-- CreateTable
CREATE TABLE "modulo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT DEFAULT 'sin descripcion',
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
    "descripcion" TEXT DEFAULT 'sin descripcion',
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
    "formador" TEXT DEFAULT '',
    "fecha_registro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT DEFAULT 'sin descripcion',
    "borrado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "asistencia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "asistencia_id_vocero_fkey" FOREIGN KEY ("id_vocero") REFERENCES "vocero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "asistencia_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "modulo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "asistencia_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tabla" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "id_objeto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "ip" TEXT DEFAULT '',
    "descripcion" TEXT DEFAULT '',
    "datosAntes" JSONB,
    "datosDespues" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_MiembrosPaises" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MiembrosPaises_A_fkey" FOREIGN KEY ("A") REFERENCES "pais" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MiembrosPaises_B_fkey" FOREIGN KEY ("B") REFERENCES "usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MiembrosEstados" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MiembrosEstados_A_fkey" FOREIGN KEY ("A") REFERENCES "estado" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MiembrosEstados_B_fkey" FOREIGN KEY ("B") REFERENCES "usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MiembrosMunicipios" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MiembrosMunicipios_A_fkey" FOREIGN KEY ("A") REFERENCES "municipio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MiembrosMunicipios_B_fkey" FOREIGN KEY ("B") REFERENCES "usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MiembrosParroquias" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MiembrosParroquias_A_fkey" FOREIGN KEY ("A") REFERENCES "parroquia" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MiembrosParroquias_B_fkey" FOREIGN KEY ("B") REFERENCES "usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MiembrosInstitucion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MiembrosInstitucion_A_fkey" FOREIGN KEY ("A") REFERENCES "institucion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MiembrosInstitucion_B_fkey" FOREIGN KEY ("B") REFERENCES "usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MiembrosDepartamento" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MiembrosDepartamento_A_fkey" FOREIGN KEY ("A") REFERENCES "departamento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MiembrosDepartamento_B_fkey" FOREIGN KEY ("B") REFERENCES "usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_cargoTovocero" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_cargoTovocero_A_fkey" FOREIGN KEY ("A") REFERENCES "cargo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_cargoTovocero_B_fkey" FOREIGN KEY ("B") REFERENCES "vocero" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_entidadTovocero" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_entidadTovocero_A_fkey" FOREIGN KEY ("A") REFERENCES "entidad" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_entidadTovocero_B_fkey" FOREIGN KEY ("B") REFERENCES "vocero" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_proyectoTovocero" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_proyectoTovocero_A_fkey" FOREIGN KEY ("A") REFERENCES "proyecto" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_proyectoTovocero_B_fkey" FOREIGN KEY ("B") REFERENCES "vocero" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_beneficioTovocero" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_beneficioTovocero_A_fkey" FOREIGN KEY ("A") REFERENCES "beneficio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_beneficioTovocero_B_fkey" FOREIGN KEY ("B") REFERENCES "vocero" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE UNIQUE INDEX "usuario_cedula_key" ON "usuario"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_token_key" ON "usuario"("token");

-- CreateIndex
CREATE UNIQUE INDEX "pais_nombre_key" ON "pais"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "pais_serial_key" ON "pais"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "estado_serial_key" ON "estado"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "municipio_serial_key" ON "municipio"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "parroquia_serial_key" ON "parroquia"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "institucion_nombre_key" ON "institucion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "institucion_rif_key" ON "institucion"("rif");

-- CreateIndex
CREATE UNIQUE INDEX "departamento_nombre_key" ON "departamento"("nombre");

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
CREATE UNIQUE INDEX "entidad_nombre_key" ON "entidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "proyecto_nombre_key" ON "proyecto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "beneficio_nombre_key" ON "beneficio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "familiar_cedula_key" ON "familiar"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "vocero_cedula_key" ON "vocero"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "vocero_token_key" ON "vocero"("token");

-- CreateIndex
CREATE UNIQUE INDEX "formacion_nombre_key" ON "formacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "modulo_nombre_key" ON "modulo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "_MiembrosPaises_AB_unique" ON "_MiembrosPaises"("A", "B");

-- CreateIndex
CREATE INDEX "_MiembrosPaises_B_index" ON "_MiembrosPaises"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MiembrosEstados_AB_unique" ON "_MiembrosEstados"("A", "B");

-- CreateIndex
CREATE INDEX "_MiembrosEstados_B_index" ON "_MiembrosEstados"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MiembrosMunicipios_AB_unique" ON "_MiembrosMunicipios"("A", "B");

-- CreateIndex
CREATE INDEX "_MiembrosMunicipios_B_index" ON "_MiembrosMunicipios"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MiembrosParroquias_AB_unique" ON "_MiembrosParroquias"("A", "B");

-- CreateIndex
CREATE INDEX "_MiembrosParroquias_B_index" ON "_MiembrosParroquias"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MiembrosInstitucion_AB_unique" ON "_MiembrosInstitucion"("A", "B");

-- CreateIndex
CREATE INDEX "_MiembrosInstitucion_B_index" ON "_MiembrosInstitucion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MiembrosDepartamento_AB_unique" ON "_MiembrosDepartamento"("A", "B");

-- CreateIndex
CREATE INDEX "_MiembrosDepartamento_B_index" ON "_MiembrosDepartamento"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_cargoTovocero_AB_unique" ON "_cargoTovocero"("A", "B");

-- CreateIndex
CREATE INDEX "_cargoTovocero_B_index" ON "_cargoTovocero"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_entidadTovocero_AB_unique" ON "_entidadTovocero"("A", "B");

-- CreateIndex
CREATE INDEX "_entidadTovocero_B_index" ON "_entidadTovocero"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_proyectoTovocero_AB_unique" ON "_proyectoTovocero"("A", "B");

-- CreateIndex
CREATE INDEX "_proyectoTovocero_B_index" ON "_proyectoTovocero"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_beneficioTovocero_AB_unique" ON "_beneficioTovocero"("A", "B");

-- CreateIndex
CREATE INDEX "_beneficioTovocero_B_index" ON "_beneficioTovocero"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_formacionTomodulo_AB_unique" ON "_formacionTomodulo"("A", "B");

-- CreateIndex
CREATE INDEX "_formacionTomodulo_B_index" ON "_formacionTomodulo"("B");
