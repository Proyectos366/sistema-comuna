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
        if (typeof setValidar === "function") setValidar(true);
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
