"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import Formulario from "@/components/Formulario";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import InputClave from "@/components/inputs/InputClave";
import MostrarMsjEnModal from "@/components/mensaje/MostrarMsjEnModal";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal } from "@/store/features/modal/slicesModal";

import { limpiarCampos } from "@/utils/limpiarForm";

export default function FormEditarClaveUsuario({
  claveVieja,
  setClaveVieja,
  setClaveUno,
  setClaveDos,
  claveUno,
  claveDos,
  validarClave,
  setValidarClave,
}) {
  const dispatch = useDispatch();

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        if (claveVieja && claveUno && claveDos) {
          dispatch(abrirModal("confirmarCambios"));
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [claveVieja, claveUno, claveDos]);

  const leyendoClave1 = (e) => {
    const claveUnoUno = e.target.value;
    setClaveUno(claveUnoUno);
    verificarCoincidencia(claveUnoUno, claveDos);
    limiteSizeClave(claveUnoUno, claveDos);
  };

  const leyendoClave2 = (e) => {
    const claveDosDos = e.target.value;
    setClaveDos(claveDosDos);
    verificarCoincidencia(claveUno, claveDosDos);
    limiteSizeClave(claveUno, claveDosDos);
  };

  const limiteSizeClave = (clave, claveDos) => {
    if (clave && claveDos && clave === claveDos) {
      if (clave.length < 8 || claveDos.length > 16) {
        setMensaje("Clave debe ser entre 8 y 16 caracteres");
      } else if (
        (clave.length >= 8 || claveDos.length <= 16) &&
        !validarClave
      ) {
        setMensaje("Formato de clave invalido...");
      } else {
        setMensaje("");
      }
    }
  };

  const verificarCoincidencia = (clave, clave2) => {
    if (validarClave) {
      setMensaje("");
    } else {
      setMensaje("Formato clave invalido...");
    }

    if (clave !== clave2) {
      setMensaje("Claves no coinciden...");
    } else {
      setMensaje("");
    }
  };

  return (
    <Formulario onSubmit={(e) => e.preventDefault()}>
      <InputClave
        htmlFor={"claveVieja"}
        value={claveVieja}
        onChange={(e) => setClaveVieja(e.target.value)}
        indice={"clave"}
        nombre={"Clave vieja"}
        validarClave={true}
      />

      <InputClave
        value={claveUno}
        onChange={leyendoClave1}
        indice={"clave"}
        validarClave={validarClave}
        setValidarClave={setValidarClave}
      />

      <InputClave
        nombre={"Clave nueva confirmar"}
        value={claveDos}
        onChange={leyendoClave2}
        indice={"clave2"}
      />

      <MostrarMsjEnModal mostrarMensaje={mensaje} mensaje={mensaje} />

      <AgruparCamposForm>
        <BotonAceptarCancelar
          indice={"aceptar"}
          aceptar={() => {
            dispatch(abrirModal("confirmarCambios"));
          }}
          nombre={"Crear"}
          campos={{
            claveVieja,
            claveUno,
            claveDos,
          }}
        />

        <BotonLimpiarCampos
          aceptar={() => {
            limpiarCampos({
              setClaveVieja,
              setClaveUno,
              setClaveDos,
              setMensaje,
            });
          }}
          campos={{
            claveVieja,
            claveUno,
            claveDos,
          }}
        />
      </AgruparCamposForm>
    </Formulario>
  );
}
