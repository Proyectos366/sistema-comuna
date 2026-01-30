"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import InputNombre from "@/components/inputs/InputNombre";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { resetForm } from "@/store/features/formularios/formSlices";

export default function FormEditarDepartamento({
  acciones,
  datosDepartamento,
  validaciones,
}) {
  const dispatch = useDispatch();

  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.departamentoForm,
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
        <InputNombre
          value={nombre}
          setValue={setNombre}
          validarNombre={validarNombre}
          setValidarNombre={setValidarNombre}
        />

        <InputDescripcion
          value={descripcion}
          setValue={setDescripcion}
          rows={6}
          max={500}
          autoComplete="off"
        />

        <AgruparCamposForm>
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
              dispatch(resetForm("departamentoForm"));
            }}
            campos={{
              nombre,
              descripcion,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
