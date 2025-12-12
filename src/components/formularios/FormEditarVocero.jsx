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
import { rifRegex } from "@/utils/regex/rifRegex";
import { limpiarCampos } from "@/utils/limpiarForm";
import { cambiarSeleccionComuna } from "@/utils/dashboard/cambiarSeleccionComuna";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { cambiarSeleccionConsejo } from "@/utils/dashboard/cambiarSeleccionConsejo";

export default function FormEditarConsejo({
  acciones,
  datosVocero,
  validaciones,
  comunasCircuitos,
}) {
  const dispatch = useDispatch();

  const {
    setIdPais,
    setIdEstado,
    setIdMunicipio,
    setIdParroquia,
    setIdComuna,
    setIdCircuito,
    setIdConsejo,
    setIdVocero,

    setNombrePais,
    setNombreEstado,
    setNombreMunicipio,
    setNombreParroquia,
    setNombreComuna,
    setNombreCircuito,
    setNombreConsejo,

    setNombre,

    setOpcion,
  } = acciones;

  const {
    idPais,
    idEstado,
    idMunicipio,
    idParroquia,
    idComuna,
    idCircuito,
    idConsejo,
    idVocero,

    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombreComuna,
    nombreCircuito,
    nombreConsejo,

    nombre,

    opcion,
  } = datosVocero;

  const { validarNombre, setValidarNombre, validarCedula, setValidarCedula } =
    validaciones;

  useEffect(() => {
    const validarYActualizar = (valor, setValidar) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = textRegex.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
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
          idOpcion={
            opcion === "comuna"
              ? idComuna
              : opcion === "circuito"
              ? idCircuito
              : idConsejo
          }
          nombre={
            opcion === "comuna"
              ? "Comunas"
              : opcion === "circuito"
              ? "Circuitos comunales"
              : "Consejos comunales"
          }
          handleChange={(e) => {
            opcion === "comuna"
              ? cambiarSeleccionComuna(e, setIdComuna)
              : opcion === "circuito"
              ? cambiarSeleccionCircuito(e, setIdCircuito)
              : cambiarSeleccionConsejo(e, setIdConsejo);
          }}
          opciones={comunasCircuitos}
          seleccione={"Seleccione"}
          setNombre={
            opcion === "comuna"
              ? setNombreComuna
              : opcion === "circuito"
              ? setNombreCircuito
              : setNombreConsejo
          }
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
              id:
                opcion === "comuna"
                  ? idComuna
                  : opcion === "circuito"
                  ? idCircuito
                  : idConsejo,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({ setNombre });
            }}
            campos={{
              nombre,
              id:
                opcion === "comuna"
                  ? idComuna
                  : opcion === "circuito"
                  ? idCircuito
                  : idConsejo,
            }}
          />
        </div>
      </DivScroll>
    </Formulario>
  );
}
