"use client";

import { useState, useEffect } from "react";
import LabelInput from "../inputs/LabelInput";
import BotonAceptarCancelar from "../botones/BotonAceptarCancelar";
import Formulario from "../Formulario";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import Input from "../inputs/Input";
import InputModulo from "../inputs/InputModulo";
import InputDescripcion from "../inputs/InputDescripcion";

export default function FormEditarFormacion({
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  modulo,
  setModulo,
  validarModulo,
  setValidarModulo,
  limpiarCampos,
  mostrarMensaje,
  editar,
  mensaje,
}) {
  useEffect(() => {
    if (modulo !== undefined && modulo !== null) {
      const valorSinEspacios = String(modulo).trim();

      // Validar que sea un número entre 1 y 9
      const esValido = /^[1-9]$/.test(valorSinEspacios);
      setValidarModulo?.(esValido);

      // Si deseas guardar el valor limpio (sin espacios, por ejemplo)
      setModulo?.(valorSinEspacios);
    }
  }, [modulo]);

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <div className="flex flex-col w-full gap-2 px-1">
        <LabelInput nombre={"Nombre"}>
          <Input
            type={"text"}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </LabelInput>

        <LabelInput nombre={"Cantidad de modulos"}>
          <InputModulo
            type="text"
            indice="modulo"
            value={modulo}
            setValue={setModulo}
            validarModulo={validarModulo}
            setValidarModulo={setValidarModulo}
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
            }}
          />

          <BotonAceptarCancelar
            indice={"limpiar"}
            aceptar={() => {
              limpiarCampos({
                setNombre,
                setDescripcion,
              });
            }}
            nombre={"Limpiar"}
            campos={{
              nombre,
              descripcion,
            }}
          />
        </div>
      </div>
    </Formulario>
  );
}
