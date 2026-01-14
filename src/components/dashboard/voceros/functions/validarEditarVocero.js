import {
  validarCedulaVoceroEditar,
  validarNombreVoceroEditar,
} from "./validacionesEditarVocero";

// --- Validador central ---
export const validarEditarVocero = (datosVocero, validaciones, acciones) => {
  validarNombreVoceroEditar(
    datosVocero?.nombre,
    validaciones?.setValidarNombre
  );
  validarCedulaVoceroEditar(
    datosVocero?.cedula,
    acciones?.setCedula,
    validaciones?.setValidarCedula
  );
};
