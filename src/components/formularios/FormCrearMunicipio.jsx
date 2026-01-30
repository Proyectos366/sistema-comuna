"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import SelectOpcion from "@/components/SelectOpcion";
import InputNombre from "@/components/inputs/InputNombre";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { resetForm } from "@/store/features/formularios/formSlices";

export default function FormCrearMunicipio({
  idPais,
  setIdPais,
  idEstado,
  setIdEstado,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  validarNombre,
  setValidarNombre,
  paises,
  estados,
  setNombrePais,
  setNombreEstado,
}) {
  const dispatch = useDispatch();

  const mostrarCrear = useSelector((state) => state.modal.modales.crear);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.municipioForm,
  );

  useEffect(() => {
    if (mostrarCrear) {
      setNombre("");
      setDescripcion("");
      setNombrePais("");
      setNombreEstado("");
    }
  }, [reiniciarForm, mostrarCrear]);

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <DivScroll>
        <SelectOpcion
          idOpcion={idPais}
          nombre={"Paises"}
          handleChange={(e) => {
            cambiarSeleccionPais(e, setIdPais);
            if (idEstado) {
              setIdEstado("");
            }
          }}
          opciones={paises}
          seleccione={"Seleccione"}
          setNombre={setNombrePais}
        />

        {idPais && (
          <SelectOpcion
            idOpcion={idEstado}
            nombre={"Estados"}
            handleChange={(e) => {
              cambiarSeleccionEstado(e, setIdEstado);
            }}
            opciones={estados}
            seleccione={"Seleccione"}
            setNombre={setNombreEstado}
            indice={1}
          />
        )}

        {idEstado && (
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
          </>
        )}

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
              idPais,
              idEstado,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              dispatch(resetForm("municipioForm"));
            }}
            campos={{
              nombre,
              descripcion,
              idPais,
              idEstado,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
