"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import SelectOpcion from "@/components/SelectOpcion";
import InputNombre from "@/components/inputs/InputNombre";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { rifRegex } from "@/utils/regex/rifRegex";
import { limpiarCampos } from "@/utils/limpiarForm";
import { cambiarSeleccionComuna } from "@/utils/dashboard/cambiarSeleccionComuna";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

export default function FormEditarConsejo({
  acciones,
  datosConsejo,
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
    setNombrePais,
    setNombreEstado,
    setNombreMunicipio,
    setNombreParroquia,
    setNombreComuna,
    setNombreCircuito,
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
    idCircuito,
    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombreComuna,
    nombre,
    norte,
    sur,
    este,
    oeste,
    direccion,
    punto,
    rif,
    codigo,
    opcionComunaCircuito,
  } = datosConsejo;

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
          idOpcion={opcionComunaCircuito === "comuna" ? idComuna : idCircuito}
          nombre={opcionComunaCircuito === "comuna" ? "Comunas" : "Circuitos"}
          handleChange={(e) => {
            opcionComunaCircuito === "comuna"
              ? cambiarSeleccionComuna(e, setIdComuna)
              : cambiarSeleccionCircuito(e, setIdCircuito);
          }}
          opciones={comunasCircuitos}
          seleccione={"Seleccione"}
          setNombre={
            opcionComunaCircuito === "comuna"
              ? setNombreComuna
              : setNombreCircuito
          }
        />

        <InputNombre
          value={nombre}
          setValue={setNombre}
          validarNombre={validarNombre}
          setValidarNombre={setValidarNombre}
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
              id: opcionComunaCircuito === "comuna" ? idComuna : idCircuito,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({ setNombre });
            }}
            campos={{
              nombre,
              id: opcionComunaCircuito === "comuna" ? idComuna : idCircuito,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
