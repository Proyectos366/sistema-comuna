"use client";

import { useEffect } from "react";
import LabelInput from "@/components/inputs/LabelInput";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import Formulario from "@/components/Formulario";
import InputNombre from "@/components/inputs/InputNombre";
import InputDescripcion from "@/components/inputs/InputDescripcion";

export default function FormEditarMunicipio({
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  validarNombre,
  setValidarNombre,
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

    validarYActualizar(nombre, setValidarNombre);
  }, [nombre]);

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
          <InputDescripcion
            value={descripcion}
            setValue={setDescripcion}
            rows={6}
            max={500}
            autoComplete="off"
          />
        </LabelInput>

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
