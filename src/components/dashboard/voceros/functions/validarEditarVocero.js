import {
  validarCedulaVoceroEditar,
  validarCorreoVoceroEditar,
  validarEdadVoceroEditar,
  validarNombreVoceroEditar,
  validarTelefonoVoceroEditar,
} from "./validacionesEditarVocero";

// --- Validador central ---
export const validarEditarVocero = (datosVocero, validaciones, acciones) => {
  validarCedulaVoceroEditar(
    datosVocero?.cedula,
    acciones?.setCedula,
    validaciones?.setValidarCedula
  );

  validarEdadVoceroEditar(
    datosVocero?.edad,
    acciones?.setEdad,
    validaciones?.setValidarEdad
  );

  validarNombreVoceroEditar(
    datosVocero?.nombre,
    acciones?.setNombre,
    validaciones?.setValidarNombre
  );

  validarNombreVoceroEditar(
    datosVocero?.nombreDos,
    acciones?.setNombreDos,
    validaciones?.setValidarNombreDos
  );

  validarNombreVoceroEditar(
    datosVocero?.apellido,
    acciones?.setApellido,
    validaciones?.setValidarApellido
  );

  validarNombreVoceroEditar(
    datosVocero?.apellidoDos,
    acciones?.setApellidoDos,
    validaciones?.setValidarApellidoDos
  );

  validarTelefonoVoceroEditar(
    datosVocero?.telefono,
    acciones?.setTelefono,
    validaciones?.setValidarTelefono
  );

  validarCorreoVoceroEditar(
    datosVocero?.correo,
    acciones?.setCorreo,
    validaciones?.setValidarCorreo
  );

  validarNombreVoceroEditar(
    datosVocero?.laboral,
    acciones?.setLaboral,
    validaciones?.setValidarLaboral
  );
};
