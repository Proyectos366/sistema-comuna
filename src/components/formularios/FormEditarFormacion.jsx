"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import LabelInput from "@/components/inputs/LabelInput";
import InputNombre from "@/components/inputs/InputNombre";
import InputModulo from "@/components/inputs/InputModulo";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { resetForm } from "@/store/features/formularios/formSlices";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { textRegex } from "@/utils/regex/textRegex";
import { moduloRegex } from "@/utils/regex/moduloRegex";

export default function FormEditarFormacion({
  acciones,
  datosFormacion,
  validaciones,
}) {
  const dispatch = useDispatch();

  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.formacionForm
  );

  const { setNombre, setModulos, setDescripcion } = acciones;

  const { nombre, modulos, descripcion } = datosFormacion;

  const { validarNombre, setValidarNombre, validarModulos, setValidarModulos } =
    validaciones;

  useEffect(() => {
    if (modulos !== undefined && modulos !== null) {
      const valorSinEspacios = String(modulos).trim();

      // Validar que sea un número entre 1 y 9
      const esValido = moduloRegex.test(valorSinEspacios);
      setValidarModulos?.(esValido);

      // Si deseas guardar el valor limpio (sin espacios, por ejemplo)
      setModulos?.(valorSinEspacios);
    }
  }, [modulos]);

  useEffect(() => {
    const validarYActualizar = (valor, setValidar) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = textRegex.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
      }
    };

    validarYActualizar(nombre, setValidarNombre);
  }, [nombre]);

  useEffect(() => {
    if (!mostrarEditar) {
      setNombre("");
      setModulos("");
      setDescripcion("");
    }
  }, [reiniciarForm, mostrarEditar]);

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <DivScroll>
        <LabelInput nombre={"Nombre"}>
          <InputNombre
            type="text"
            indice="nombre"
            value={nombre}
            setValue={setNombre}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
          />
        </LabelInput>

        <LabelInput nombre={"Cantidad de modulos"}>
          <InputModulo
            type="text"
            indice="modulo"
            value={modulos}
            setValue={setModulos}
            validarModulo={validarModulos}
            setValidarModulo={setValidarModulos}
          />
        </LabelInput>

        <LabelInput nombre={"Descripción"}>
          <InputDescripcion
            value={descripcion}
            setValue={setDescripcion}
            rows={6}
            max={500}
            autoComplete="off"
          />
        </LabelInput>

        <div className="flex space-x-3">
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={() => {
              dispatch(cerrarModal("editar"));
              dispatch(abrirModal("confirmarCambios"));
            }}
            nombre={"Guardar cambios"}
            campos={{
              nombre,
              modulos,
              descripcion,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              dispatch(resetForm("formacionForm"));
            }}
            campos={{
              nombre,
              modulos,
              descripcion,
            }}
          />
        </div>
      </DivScroll>
    </Formulario>
  );
}
