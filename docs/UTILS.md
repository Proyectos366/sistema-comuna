# 🧬 Guia de la carpeta utils

Este documento describe cómo esta estructurada la carpeta utils

---

## 📁 Archivos

- Fechas: contiene diferentes funciones tales como: formatearFecha que cambia la fecha de ISO a un formato de dia, mes y año; calcularFechaNacimientoPorEdad esta calcula el año de nacimiento por la edad introducida; calcularEdadPorFechaNacimiento esta calcula la edad por la fecha de nacimiento introducida; getTimeAgo esta funcion no se usa.

- FormatearCedula: se encarga de recibir un numero de cedula y devolverlo con una letra, guion y puntos.

- FormatearTelefono: se encarga de recibir un numero de telefono y devolverlo con un guion y puntos.

- FormatearTextCapitalice: se encarga de poner la primera letra de cada palabra del titulo minuscula y el otro metodo cambia solo a mayuscula las letras de la segunda palabra

- NombreToken: contiene el nombre del token que se usa en los inicios o cierre de sesion.

- ObtenerIp: se encarga de al recibir los datos encuentra la ip, esto es util para que al iniciar sesion se muestre de donde se hizo.

- QuitarCaracteres: se encarga de limpiar un texto, es decir, se le quitan los caracteres especiales.

- RespuestasAlFront: tiene 2 funciones una que se encarga de enviar respuestas al front, estan personalizadas y la otra envia respuestas al front pero de manera binaria.

- RespuestasValidaciones: es una funcion personalizada que envia respuesta desde los archivos de validacion hacia los controladores

- ValidarId: no se usa pero se dejo por si acaso a futuro se necesita
