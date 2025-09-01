# 🧬 Guia de la carpeta libs

Este documento describe cómo esta estructurada la carpeta libs

---

## 📁 Archivos

- AuthToken: contiene una clase con los siguientes metodos: tokenValidarUsuario es el token que se crea como una firma unica para cada usuario o empleado que se crea, tokenInicioSesion se crea y envia al cliente para iniciar sesion y descifrarToken se encarga de descifrar el token para ver si es correcto o no, esto se usa para las diferentes peticiones.

- CifrarDescifrarClaves: este archivo contiene 1 clase con 2 metodos uno para cifrar la clave al momento de crear el usuario y otro para comparar la clave a la hora de iniciar sesion.

- Prisma: es una funcion personalizada del cliente de prisma.

- Trigget: es una funcion personalizada que recibe ciertos datos para guardaslos en diferentes eventos que hace el usuario.
