"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { textRegex } from "@/utils/regex/textRegex";
import { moduloRegex } from "@/utils/regex/moduloRegex";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import LabelInput from "@/components/inputs/LabelInput";
import InputNombre from "@/components/inputs/InputNombre";
import InputModulo from "@/components/inputs/InputModulo";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { limpiarCampos } from "@/utils/limpiarForm";

export default function FormEditarFormacion({
  acciones,
  datosFormacion,
  validaciones,
}) {
  const dispatch = useDispatch();

  const { setNombre, setModulos, setDescripcion } = acciones;

  const { nombre, modulos, descripcion } = datosFormacion;

  const { validarNombre, setValidarNombre, validarModulo, setValidarModulo } =
    validaciones;

  useEffect(() => {
    const validarYActualizar = (valor, setValidar, regex) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = regex.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
      }
    };

    validarYActualizar(nombre, setValidarNombre, textRegex);

    validarYActualizar(modulos, setValidarModulo, moduloRegex);
  }, [nombre, modulos]);

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
            validarModulo={validarModulo}
            setValidarModulo={setValidarModulo}
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
              limpiarCampos({ setNombre, setModulos, setDescripcion });
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
