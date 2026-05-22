"use client";

import { useState } from "react";

import SectionMain from "@/components/SectionMain";
import ModalCambiarClave from "@/components/dashboard/cambiar-clave/components/ModalPerfil";
import FormEditarClaveUsuario from "@/components/formularios/FormEditarClaveUsuario";
import SectionQuaternary from "@/components/SectionQuaternary";

export default function CambiarClaveView() {
  const [claveVieja, setClaveVieja] = useState("");
  const [claveNuevaUno, setClaveNuevaUno] = useState("");
  const [claveNuevaDos, setClaveNuevaDos] = useState("");

  const [validarClave, setValidarClave] = useState(false);

  return (
    <>
      <ModalCambiarClave
        claveVieja={claveVieja}
        claveUno={claveNuevaUno}
        claveDos={claveNuevaDos}
        setClaveVieja={setClaveVieja}
        setClaveUno={setClaveNuevaUno}
        setClaveDos={setClaveNuevaDos}
      />

      <SectionMain>
        <SectionQuaternary
          indice={1}
          nombre={"Gestión de claves"}
          funcion={() => {}}
        >
          <FormEditarClaveUsuario
            claveVieja={claveVieja}
            setClaveVieja={setClaveVieja}
            claveUno={claveNuevaUno}
            setClaveUno={setClaveNuevaUno}
            claveDos={claveNuevaDos}
            setClaveDos={setClaveNuevaDos}
            validarClave={validarClave}
            setValidarClave={setValidarClave}
          />
        </SectionQuaternary>
      </SectionMain>
    </>
  );
}
