"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "../AgruparCamposForm";
import SelectOpcion from "../SelectOpcion";
import InputNombre from "@/components/inputs/InputNombre";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionInstitucion } from "@/utils/dashboard/cambiarSeleccionInstitucion";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { resetForm } from "@/store/features/formularios/formSlices";

export default function FormCrearDepartamento({
  acciones,
  datosDepartamento,
  validaciones,
  instituciones,
}) {
  const dispatch = useDispatch();

  const mostrarCrear = useSelector((state) => state.modal.modales.crear);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.departamentoForm,
  );

  const { setIdInstitucion, setNombre, setDescripcion, setNombreInstitucion } =
    acciones;

  const { idInstitucion, nombre, descripcion } = datosDepartamento;

  const { validarNombre, setValidarNombre } = validaciones;

  useEffect(() => {
    if (mostrarCrear) {
      setNombre("");
      setDescripcion("");
    }
  }, [reiniciarForm, mostrarCrear]);

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col"
    >
      <DivScroll>
        <SelectOpcion
          idOpcion={idInstitucion}
          nombre={"Instituciones"}
          handleChange={(e) => {
            cambiarSeleccionInstitucion(e, setIdInstitucion);
          }}
          opciones={instituciones}
          seleccione={"Seleccione"}
          setNombre={setNombreInstitucion}
          indice={0}
        />

        {idInstitucion && (
          <>
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
                  dispatch(cerrarModal("crear"));
                  dispatch(abrirModal("confirmar"));
                }}
                nombre={"Crear"}
                campos={{
                  nombre,
                  descripcion,
                  idInstitucion,
                }}
              />

              <BotonLimpiarCampos
                aceptar={() => {
                  dispatch(resetForm("departamentoForm"));
                }}
                campos={{
                  nombre,
                  descripcion,
                  idInstitucion,
                }}
              />
            </AgruparCamposForm>
          </>
        )}
      </DivScroll>
    </Formulario>
  );
}
