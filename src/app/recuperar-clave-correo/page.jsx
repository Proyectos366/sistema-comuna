"use client";

import ImagenFondo from "@/components/ImagenFondo";
import { useState } from "react";
import axios from "axios";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Boton from "@/components/Boton";
import LinkPaginas from "@/components/Link";
import Modal from "@/components/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import MostrarMsj from "@/components/MostrarMensaje";
import Titulos from "@/components/Titulos";
import Formulario from "@/components/Formulario";
import Main from "@/components/Main";

export default function RegistrarUsuario() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [validarCorreo, setValidarCorreo] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  const mostrarModal = () => {
    setMostrar(true);
  };

  const cerrarModal = () => {
    setCorreo("");

    setMostrar(false);
  };

  return (
    <>
      {/* <ImagenFondo /> */}

      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Desea enviar este correo?"}
      >
        <div className="flex flex-col justify-center items-center space-y-1 pb-4">
          <ModalDatos titulo={"Correo"} descripcion={correo} />
        </div>

        <div className="flex space-x-2 px-10">
          <Boton
            className={`py-2`}
            nombre={"Aceptar"}
            onClick={() => {
              enviarCorreoRecuperarClave(correo, setCorreo, setMensaje);
              setMostrar(false);
            }}
          />

          <Boton
            className={`py-2`}
            nombre={"Cancelar"}
            onClick={() => {
              cancelarAsistencia(setCorreo);
              setMostrar(false);
            }}
          />
        </div>
      </Modal>

      <Main>
        <div className="flex flex-col items-center max-w-[700px] bg-white w-full rounded-md px-2 py-5 sm:px-10 sm:py-10 space-y-5 border border-black shadow-lg">
          <Titulos indice={2} titulo={"Recuperar clave"} />

          <Formulario
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="space-y-1">
              <Label
                htmlFor={"email"}
                nombre={"Correo"}
                className={`font-semibold`}
              />

              <Input
                id={"email"}
                indice={"email"}
                type={"text"}
                placeholder={"name@company.com"}
                name={"email"}
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                setValidarCorreo={setValidarCorreo}
                validarCorreo={validarCorreo}
                autoComplete={"email"}
              />
            </div>

            <div className="flex items-center justify-between">
              <LinkPaginas
                href="/registro-usuario"
                nombre={"Registro usuario"}
              />
              <LinkPaginas href="/" nombre={"Login"} />
            </div>

            {mensaje && <MostrarMsj mensaje={mensaje} />}

            <div className="flex space-x-2">
              <Boton
                onClick={() => mostrarModal()}
                disabled={!correo}
                type={"button"}
                nombre={"Registrar"}
                className={`${
                  !correo ? "cursor-not-allowed" : "cursor-pointer"
                } py-3 text-lg hover:border-blue-500 hover:bg-[#f1e6e6]`}
              />

              <Boton
                disabled={!correo}
                type={"button"}
                nombre={"Limpiar campos"}
                className={`${
                  !correo ? "cursor-not-allowed" : "cursor-pointer"
                } py-3 text-lg hover:border-blue-500 hover:bg-[#f1e6e6]`}
                onClick={() => limpiar(setCorreo)}
              />
            </div>
          </Formulario>
        </div>
      </Main>
    </>
  );
}

const enviarCorreoRecuperarClave = async (correo, setCorreo, setMensaje) => {
  try {
    const respuesta = await axios.post(`/api/usuarios/recuperar-clave-correo`, {
      correo: correo,
    });

    console.log(respuesta.data);

    if (respuesta.data.status === "ok") {
      setMensaje(respuesta.data.message);
      setTimeout(() => {
        window.location.href = respuesta.data.redirect;
      }, 5000);
    } else {
      setMensaje(respuesta.data.message);
    }

    setTimeout(() => {
      setMensaje("");
      setCorreo("");
    }, 5000);
  } catch (error) {
    console.log("Error, al eviar correo de recuperar clave: " + error);
    if (error && error.response.status === 400) {
      setMensaje(error.response.data.message);
    } else {
      setMensaje("Error, interno del servidor...");
    }
    setTimeout(() => {
      setMensaje("");
      setCorreo("");
    }, 5000);
  }
};

function limpiar(setCorreo) {
  setCorreo("");
}

function cancelarAsistencia(setCorreo) {
  setCorreo("");
}
