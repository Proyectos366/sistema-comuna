"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import SelectOpcion from "@/components/SelectOpcion";
import InputNombreSinValidar from "@/components/inputs/InputNombreSinValidar";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { rifRegex } from "@/utils/regex/rifRegex";
import { limpiarCampos } from "@/utils/limpiarForm";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

export default function FormEditarComuna({
  acciones,
  datosComuna,
  validaciones,
  parroquias,
}) {
  const dispatch = useDispatch();

  const {
    setIdPais,
    setIdEstado,
    setIdMunicipio,
    setIdParroquia,
    setIdComuna,
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
    setRif,
    setCodigo,
  } = acciones;

  const {
    idPais,
    idEstado,
    idMunicipio,
    idParroquia,
    idComuna,
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
    rif,
    codigo,
  } = datosComuna;

  const {
    validarNombre,
    setValidarNombre,
    validarRif,
    setValidarRif,
    validarCodigo,
    setValidarCodigo,
  } = validaciones;

  useEffect(() => {
    const validarYActualizar = (valor, setValidar) => {
      if (valor) {
        if (typeof setValidar === "function") setValidar(true);
      }
    };

    const validarRif = (valor, setValidar) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = rifRegex.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
      }
    };

    validarYActualizar(nombre, setValidarNombre);
    validarRif(rif, setValidarRif);
  }, [nombre, rif]);

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

        <InputNombreSinValidar value={nombre} setValue={setNombre} />

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
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
