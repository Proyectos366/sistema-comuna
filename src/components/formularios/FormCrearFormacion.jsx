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

export default function FormCrearFormacion({
  acciones,
  datosFormacion,
  validaciones,
}) {
  const dispatch = useDispatch();

  const mostrarCrear = useSelector((state) => state.modal.modales.crear);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.formacionForm
  );

  const { setNombre, setModulos, setDescripcion } = acciones;

  const { nombre, modulos, descripcion } = datosFormacion;

  const { validarNombre, setValidarNombre, validarModulo, setValidarModulo } =
    validaciones;

  useEffect(() => {
    if (mostrarCrear) {
      setNombre("");
      setModulos("");
      setDescripcion("");
    }
  }, [reiniciarForm, mostrarCrear]);

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
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
              dispatch(cerrarModal("crear"));
              dispatch(abrirModal("confirmar"));
            }}
            nombre={"Crear"}
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
