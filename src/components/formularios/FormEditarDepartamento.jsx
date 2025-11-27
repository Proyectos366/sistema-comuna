"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import LabelInput from "@/components/inputs/LabelInput";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import Formulario from "@/components/Formulario";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import DivScroll from "@/components/DivScroll";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

export default function FormEditarDepartamento({
  acciones,
  datosDepartamento,
  validaciones,
}) {
  const dispatch = useDispatch();

  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.departamentoForm
  );

  const { setNombre, setDescripcion } = acciones;

  const { nombre, descripcion } = datosDepartamento;

  const { validarNombre, setValidarNombre } = validaciones;

  useEffect(() => {
    const validarYActualizar = (valor, setValidar) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
      }
    };

    validarYActualizar(nombre, setValidarNombre);
  }, [nombre]);

  useEffect(() => {
    if (!mostrarEditar) {
      setNombre("");
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
              descripcion,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              dispatch(resetForm("institucionForm"));
            }}
            campos={{
              nombre,
              descripcion,
            }}
          />
        </div>
      </DivScroll>
    </Formulario>
  );
}
