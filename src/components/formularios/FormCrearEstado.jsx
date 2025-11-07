"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import Formulario from "@/components/Formulario";
import InputCodigoPostal from "@/components/inputs/InputCodigoPostal";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import InputNombre from "@/components/inputs/InputNombre";
import LabelInput from "@/components/inputs/LabelInput";
import SelectOpcion from "@/components/SelectOpcion";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionPais } from "@/components/dashboard/estados/funciones/cambiarSeleccionPais";
import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { resetForm } from "@/store/features/formularios/formSlices";

export default function FormCrearEstado({
  idPais,
  setIdPais,
  nombre,
  setNombre,
  capital,
  setCapital,
  codigoPostal,
  setCodigoPostal,
  descripcion,
  setDescripcion,
  validarNombre,
  setValidarNombre,
  validarCapital,
  setValidarCapital,
  validarCodigoPostal,
  setValidarCodigoPostal,
  setNombrePais,
}) {
  const dispatch = useDispatch();
  const { paises } = useSelector((state) => state.paises);

  const mostrarCrear = useSelector((state) => state.modal.modales.crear);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.estadoForm
  );

  useEffect(() => {
    if (mostrarCrear) {
      setNombre("");
      setCapital("");
      setCodigoPostal("");
      setDescripcion("");
      setNombrePais("");
    }
  }, [reiniciarForm, mostrarCrear]);

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <SelectOpcion
        idOpcion={idPais}
        nombre={"Paises"}
        handleChange={(e) => cambiarSeleccionPais(e, setIdPais)}
        opciones={paises}
        seleccione={"Seleccione"}
        setNombre={setNombrePais}
      />

      {idPais && (
        <>
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

          <LabelInput nombre={"Capital"}>
            <InputNombre
              type="text"
              indice="nombre"
              value={capital}
              setValue={setCapital}
              validarNombre={validarCapital}
              setValidarNombre={setValidarCapital}
            />
          </LabelInput>

          <LabelInput nombre={"Código postal"}>
            <InputCodigoPostal
              value={codigoPostal}
              setValue={setCodigoPostal}
              validarCodigoPostal={validarCodigoPostal}
              setValidarCodigoPostal={setValidarCodigoPostal}
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
                capital,
                codigoPostal,
                descripcion,
                idPais,
              }}
            />

            <BotonLimpiarCampos
              aceptar={() => {
                dispatch(resetForm("estadoForm"));
              }}
              campos={{
                nombre,
                capital,
                codigoPostal,
                descripcion,
                idPais,
              }}
            />
          </div>
        </>
      )}
    </Formulario>
  );
}
