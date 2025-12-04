"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import SelectOpcion from "@/components/SelectOpcion";
import LabelInput from "@/components/inputs/LabelInput";
import InputNombre from "@/components/inputs/InputNombre";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { textRegex } from "@/utils/regex/textRegex";
import { limpiarCampos } from "@/utils/limpiarForm";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

export default function FormEditarCircuito({
  acciones,
  datosCircuito,
  validaciones,
  parroquias,
}) {
  const dispatch = useDispatch();

  const {
    setIdPais,
    setIdEstado,
    setIdMunicipio,
    setIdParroquia,
    setIdCircuito,
    setNombrePais,
    setNombreEstado,
    setNombreMunicipio,
    setNombreParroquia,
    setNombre,
    setNorte,
    setSur,
    setEste,
    setOeste,
    setDireccion,
    setPunto,
    setCodigo,
  } = acciones;

  const {
    idPais,
    idEstado,
    idMunicipio,
    idParroquia,
    idCircuito,
    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombre,
    norte,
    sur,
    este,
    oeste,
    direccion,
    punto,
    codigo,
  } = datosCircuito;

  const { validarNombre, setValidarNombre, validarCodigo, setValidarCodigo } =
    validaciones;

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

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <DivScroll>
        <SelectOpcion
          idOpcion={idParroquia}
          nombre={"Parroquias"}
          handleChange={(e) => {
            cambiarSeleccionParroquia(e, setIdParroquia);
          }}
          opciones={parroquias}
          seleccione={"Seleccione"}
          setNombre={setNombreParroquia}
        />

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
              idParroquia,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({ setNombre });
            }}
            campos={{
              nombre,
              idParroquia,
            }}
          />
        </div>
      </DivScroll>
    </Formulario>
  );
}
