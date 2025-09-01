# 🛠️ Guía de la carpeta `services`

Este documento describe la estructura y propósito de la carpeta `services/` en el proyecto **sistema-comuna**, enfocándose en la lógica de negocio, validación y funciones auxiliares que complementan las rutas de la API.

---

## 📁 Propósito general

La carpeta `services/` centraliza la **lógica de negocio**, **validación**, y **funciones reutilizables** que se usan en los endpoints de la API. Su objetivo principal es mantener el código de las rutas (`app/api/`) limpio y enfocado únicamente en manejar las solicitudes y respuestas HTTP, delegando el procesamiento de datos a estos servicios.

---

## 📂 Estructura ampliada

La carpeta `services` está organizada por entidades, lo que permite una mejor modularización y escalabilidad del proyecto. Cada entidad (`asistencias`, `usuarios`, `voceros`, etc.) tiene su propia carpeta, y dentro de ellas se encuentran los archivos de validación específicos para las diferentes operaciones (crear, editar, eliminar).

---

## 📂 Subcarpetas destacadas

### 🗂️ `asistencias/`

- **Propósito:** Contiene la lógica para validar el registrar, consultar todas y actualizar las asistencia de voceros a cursos o formaciones.
- **Estado:** Actualmente no está en uso activo, pero está preparada para futuras funcionalidades.

### 🗂️ `cargos/`

- **Propósito:** Permite validar el crear, actualizar y consultar los cargos asignados a voceros.
- **Relación:** Aplica a entidades territoriales como comunas, circuitos y consejos comunales.

### 🗂️ `circuitos/` y `comunas/`

- **Propósito:** Representan las entidades territoriales a las que pertenece cada vocero.
- **Uso:** Se utilizan para validar el registrar y consultar la relación entre voceros y sus comunidades.

### 🏘️ `consejos/`

- **Propósito:** Gestiona las validaciones de la creación, actualización y consulta de los consejos comunales.
- **Relación:** Se encarga de que un consejo comunal pertenezca a una comuna o un circuito comunal. Además, vincula a los voceros con sus respectivas organizaciones comunitarias.

### 🎓 `cursos/`

- **Propósito:** Permite validar el registrar nuevos cursos, consultar los existentes y actualizarlos.
- **Relación:** Se vincula con las formaciones y las asistencias de los participantes.

### 🌎 `pais/`, `estado/`, `municipio/`, `parroquia/`

- **Propósito:** Definen la jerarquía geográfica del sistema.
- **Uso:** Cada carpeta gestiona las validaciones de creación y consulta de su entidad territorial correspondiente. Se utilizan para ubicar instituciones y voceros dentro del contexto nacional.

### 🏫 `institucion/`

- **Propósito:** Administra la información de las instituciones públicas del estado (ej. contralorías), permite la validacion de crear, editar y mostrar instituciones.
- **Contenido:** Incluye datos como nombre, RIF, ubicación y los miembros de la institución.

### 🧩 `departamento/`

- **Propósito:** Define los departamentos internos dentro de una institución, validando el crear, editar y mostrar departamentos.
- **Uso:** Se usa para organizar roles, empleados y tareas por área funcional.

### 📚 `formaciones/`

- **Propósito:** Maneja las validaciones de la lógica de inscripción, consulta y actualización de formaciones.
- **Relación:** Se vincula con los cursos, asistencias y los voceros participantes. Al crear una formación, se especifica la cantidad de módulos que tiene.

### 🧱 `modulos/`

- **Propósito:** Define las validaciones de los módulos que se usarán al crear una formación.
- **Uso:** Se utiliza para asegurar que las formaciones no tengan módulos de más o de menos.

### 🆕 `novedades/`

- **Propósito:** Permite las validaciones al momento registrar y consultar novedades o notificaciones dentro del sistema.
- **Uso:** Cada usuario puede reportar eventualidades, problemas o enviar notificaciones a uno o a todos los departamentos.

### 🛡️ `roles/`

- **Propósito:** Administra los distintos roles de usuario (master, administrador, director y empleado).
- **Funcionalidad:** Define los permisos y niveles de acceso según el rol asignado.
- **Nota:** Esto esta creado pero en realidad no se usa

### 👥 `usuarios/`

- **Propósito:** Gestiona y valida lo necesario para la creación, edición, eliminar y consulta de usuarios registrados.
- **Relación:** Se vincula con el resto de los modelos, ya que los usuarios, en este caso, son los empleados de la institución.

### 🗣️ `voceros/`

- **Propósito:** Administra la información de los voceros comunitarios y sus respectivas validaciones para la creacion, editar y eliminar voceros.
- **Contenido:** Incluye datos personales, cargos, entidades a las que pertenecen y su participación en cursos o formaciones.

## 🧠 Buenas prácticas

- Todas las funciones de validación devuelven objetos con estructura clara: `{ status: string, message: string, cod: number }`.
- Se recomienda mantener las validaciones puras, sin efectos secundarios.
- Si una validación depende de datos externos (como verificar existencia en la base de datos), se documenta claramente en el archivo.

## 🧠 Buenas prácticas

### 🗣️ `ValidarCampos/`

- Es un archivo encargado de las validaciones de campos de los diferentes formularios

### 🗣️ `validarInicioSesion/`

- Es un archivo encargado de las validaciones para el inicio de sesion del usuario
