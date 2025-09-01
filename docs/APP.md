# 🧬 Guía de la carpeta `app`

Este documento describe la estructura y propósito de la carpeta `app/` en el proyecto sistema-comuna.

---

## 📁 Estructura general

- La carpeta `app/` define las rutas de la aplicación utilizando el nuevo sistema de **App Router**.
  Cada subcarpeta representa una ruta, y los archivos `route.js` definen el contenido o comportamiento
  de esa ruta.

---

## 📂 Carpeta `api/`

Contiene todos los endpoints que responden a peticiones del cliente. En lugar de agruparlos en un archivo de rutas tradicional, cada endpoint se organiza en subcarpetas que representan rutas específicas.

## Ejemplo:

---

## 📂 Subcarpetas destacadas

### 🗂️ `asistencias/`

- Contiene lógica para crear y actualizar asistencias al momento de inscribir un curso o formación.
- Actualmente no está en uso activo, pero está preparada para futuras funcionalidades.

### 🗂️ `cargos/`

- Permite crear, actualizar y consultar los cargos asignados a voceros.
- Aplica a entidades como comunas, circuitos y consejos comunales.

### 🗂️ `circuitos/` y `comunas/`

- Representan las entidades territoriales a las que pertenece cada vocero.
- Se utilizan para registrar y consultar la relación entre voceros y sus comunidades.

### 🏘️ `consejos/`

- Gestiona la creación, actualización y consulta de los consejos comunales.
- Gestiona que un consejo comunal pertenezca a una comuna o a un circuito comunal.
- Relaciona voceros con sus respectivas organizaciones comunitarias.

### 🎓 `cursos/`

- Permite registrar nuevos cursos, consultar los existentes y actualizarlos.
- Se vincula con las formaciones y las asistencias de los participantes.

### 🌎 `pais/`, `estado/`, `municipio/`, `parroquia/`

- Define la jerarquía geográfica del sistema.
- Cada carpeta gestiona la creación y consulta de su entidad territorial correspondiente.
- Se utilizan para ubicar instituciones y voceros dentro del contexto nacional.

### 🏫 `institucion/`

- Administra las instituciones publicas del estado en este caso las contralorias.
- Incluye datos como nombre, rif, ubicación y miembros de la institucion.

### 🧩 `departamento/`

- Define los departamentos internos dentro de una institución.
- Se usa para organizar roles, empleados y tareas por área funcional.

### 📚 `formaciones/`

- Maneja la lógica de inscripción, consulta y actualización de formaciones.
- Se vincula con cursos, asistencias y voceros participantes.
- A su vez al momento de crear una formacion se especifica la cantidad de modulos que tiene esa formacion.

### 🔐 `login/`

- Contiene la lógica de autenticación de usuarios.
- Maneja el inicio de sesión, validación de credenciales y generación de tokens.

### 🧱 `modulos/`

- Define los módulos que se van a usar al momento de crear una formacion.
- Se utiliza para para evitar que las formaciones tengan modulos demas.

### 🆕 `novedades/`

- Permite registrar y consultar novedades dentro del sistema.
- Puede incluir actualizaciones, anuncios o cambios relevantes para los usuarios.
- Se usa para que cada usuario en el sistema reporte eventualidades, problemas o notificaciones entre 1 o todos los departamentos.

### 🛡️ `roles/`

- Administra los distintos roles de usuario (master, administrador, director y empleado).
- Define permisos y accesos según el rol asignado.

### 👥 `usuarios/`

- Gestiona la creación, edición y consulta de usuarios registrados.
- Se vincula con el resto de modelos ya que los usuarios en este caso son los empleados de la institucion.

### 🗣️ `voceros/`

- Administra la información de los voceros comunitarios.
- Incluye datos personales, cargos, entidades a las que pertenecen y su participación en cursos o formaciones.

---

## 📂 Carpeta `context/`

Contiene el archivo de autenticacion, los datos del usuario activo y funciones que se usan en muchos de los componentes del sistema.

---

## 📂 Carpeta `crear-varios-manuales/`

Se usa para crear diferentes registros en la base de datos cuando se inicia el sistema y se crea la base de datos.

---

## 📂 Carpeta `dashboard/`

Contiene los archivos de las diferentes vistas, es decir, para los diferentes tipos de usuarios.

---

## 📂 Carpeta `recuperar-clave-correo/`

## Contiene la vista para recuperar la clave por el correo en caso que la misma se olvide, actualmente no esta en funcionamiento pero se dejo para uso a futuro.

## 📂 Carpeta `registro-usuario/`

Contiene la vista para registrarse como un usuario nuevo, actualmente no esta en uso pero se dejo por ahora, esperando la decision si se iba a crear por aqui o internamente.

---

## 📂 Archivos `favicon.ico/`, `global.css/`, `layout.js/`, `not-found.jsx/`, `page.jsx/`

Esta sección describe brevemente la función de los archivos principales que suelen encontrarse en la raíz de cada ruta dentro de la carpeta `app/`.

### 🖼️ `favicon.ico`

- Icono que se muestra en la pestaña del navegador.
- Ayuda a identificar visualmente el sitio web.

### 🎨 `global.css`

- Archivo de estilos globales que se aplica a toda la aplicación.
- Define tipografías, colores, márgenes, y otros estilos base.

### 🧱 `layout.js`

- Componente que define la estructura común de la página (encabezado, pie de página, navegación).
- Se renderiza alrededor de cada `page.jsx` dentro de una ruta.
- Ideal para mantener consistencia visual entre diferentes vistas.

### 🚫 `not-found.jsx`

- Página personalizada que se muestra cuando una ruta no existe.
- Permite mostrar un mensaje amigable de error 404.

### 📄 `page.jsx`

- Componente principal que representa el contenido de la ruta.
- Es el punto de entrada para renderizar la vista asociada a esa URL.
- En este caso es la vista login

---

## 🧠 Notas adicionales

- Cada carpeta puede contener un archivo `route.js` para definir la lógica del endpoint (GET, POST, etc.).
- Si se requiere interactividad en el cliente, se puede usar `"use client"` en los componentes correspondientes.
- Las rutas protegidas se gestionan mediante `middleware.js` en la raíz del proyecto.

---

## 📚 Recursos recomendados

- [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
