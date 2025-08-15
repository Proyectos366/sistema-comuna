"use client";

import { useEffect } from "react";
import LabelInput from "../inputs/LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import Input from "../inputs/Input";
import InputNombre from "../inputs/InputNombre";
import InputRif from "../inputs/InputRif";

export default function FormEditarInstitucion({
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  rif,
  setRif,
  sector,
  setSector,
  direccion,
  setDireccion,
  validarNombre,
  setValidarNombre,
  validarRif,
  setValidarRif,
  limpiarCampos,
  mostrarMensaje,
  editar,
  mensaje,
}) {
  useEffect(() => {
    const validarYActualizar = (valor, setValidar) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
      }
    };

    const validarRif = (valor, setValidar) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = /^[VEJPGCL]-\d{8}-\d$/.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
      }
    };

    validarYActualizar(nombre, setValidarNombre);
    validarRif(rif, setValidarRif);
  }, [nombre, rif]);

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <div className="flex flex-col w-full gap-2 px-1">
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
          <Input
            type={"text"}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </LabelInput>

        <LabelInput nombre={"Rif"}>
          <InputRif
            type="text"
            indice="rif"
            value={rif}
            setValue={setRif}
            validarRif={validarRif}
            setValidarRif={setValidarRif}
          />
        </LabelInput>

        <LabelInput nombre={"Sector"}>
          <Input
            type={"text"}
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />
        </LabelInput>

        <LabelInput nombre={"Dirección"}>
          <Input
            type={"text"}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </LabelInput>

        <div className="">
          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        </div>

        <div className="flex space-x-4">
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={editar}
            nombre={"Guardar cambios"}
            campos={{
              nombre,
              descripcion,
              rif,
              sector,
              direccion,
            }}
          />

          <BotonAceptarCancelar
            indice={"limpiar"}
            aceptar={() => {
              limpiarCampos({
                setNombre,
                setDescripcion,
                setRif,
                setSector,
                setDireccion,
              });
            }}
            nombre={"Limpiar"}
            campos={{
              nombre,
              descripcion,
              rif,
              sector,
              direccion,
            }}
          />
        </div>
      </div>
    </Formulario>
  );
}
