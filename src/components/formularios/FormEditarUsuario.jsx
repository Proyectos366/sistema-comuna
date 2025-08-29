"use client";

import { useEffect } from "react";
import LabelInput from "../inputs/LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import InputNombre from "../inputs/InputNombre";

export default function FormEditarUsuario({
  nombre,
  setNombre,
  apellido,
  setApellido,
  validarNombre,
  setValidarNombre,
  validarApellido,
  setValidarApellido,
  limpiarCampos,
  mostrarMensaje,
  editar,
  mensaje,
}) {
  useEffect(() => {}, [nombre]);

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <div className="flex flex-col w-full gap-2 px-1">
        <LabelInput nombre={"Nombre"}>
          <InputNombre
            type={"text"}
            indice={"nombre"}
            value={nombre}
            setValue={setNombre}
            validarNombre={validarNombre}
            setValidarNombre={setValidarNombre}
          />
        </LabelInput>

        <LabelInput nombre={"Apellido"}>
          <InputNombre
            type={"text"}
            indice={"nombre"}
            value={apellido}
            setValue={setApellido}
            validarNombre={validarApellido}
            setValidarNombre={setValidarApellido}
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
              apellido,
            }}
          />

          <BotonAceptarCancelar
            indice={"limpiar"}
            aceptar={() => {
              limpiarCampos({
                setNombre,
                setApellido,
              });
            }}
            nombre={"Limpiar"}
            campos={{
              nombre,
              apellido,
            }}
          />
        </div>
      </div>
    </Formulario>
  );
}
