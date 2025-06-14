"use client";

import ImagenFondo from "@/components/ImagenFondo";
import { useState, useEffect } from "react";
import axios from "axios";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Boton from "@/components/Boton";
import LinkPaginas from "@/components/Link";
import Main from "@/components/Main";
import MostrarMsj from "@/components/MostrarMensaje";
import Titulos from "@/components/Titulos";

export default function Home() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [validarCorreo, setValidarCorreo] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        // Verifica si se presionó "Enter"
        if (correo && clave) {
          iniciarSesion(correo, clave, setCorreo, setClave, setMensaje);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Limpia el evento cuando el componente se desmonta
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [correo, clave]); // Dependencias

  return (
    <>
      {/* <ImagenFondo /> */}
      <Main>
        <div className="flex flex-col items-center max-w-[700px] bg-white w-full rounded-md px-2 py-5 sm:px-10 sm:py-10 space-y-5 border border-black shadow-lg">
          <Titulos indice={1} titulo={"Entrar al sistema"} />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              iniciarSesion(correo, clave, setCorreo, setClave, setMensaje);
            }}
            className="space-y-4 w-full"
          >
            <div className="space-y-1">
              <Label
                htmlFor={"correo_login"}
                nombre={"Correo"}
                className={`font-semibold`}
              />

              <Input
                id={"correo_login"}
                indice={"email"}
                type={"email"}
                placeholder={"name@company.com"}
                name={"email"}
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                validarCorreo={validarCorreo}
                setValidarCorreo={setValidarCorreo}
                autoComplete={"email"}
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor={"clave_login"}
                nombre={"Clave"}
                className={`font-semibold`}
              />

              <Input
                id={"clave_login"}
                indice={"clave1"}
                type={"password"}
                placeholder={"**********************"}
                name={"clave"}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <LinkPaginas
                href="/registro-usuario"
                nombre={"Registro usuario"}
              />
              <LinkPaginas
                href="/recuperar-clave-correo"
                nombre={"Olvido su clave?"}
              />
            </div>

            {mensaje && <MostrarMsj mensaje={mensaje} />}

            <div className="flex space-x-2">
              <Boton
                onClick={() =>
                  iniciarSesion(correo, clave, setCorreo, setClave, setMensaje)
                }
                type={"button"}
                disabled={!correo || !clave}
                nombre={"Iniciar sesion"}
                className={`py-3 text-lg hover:border-blue-500 hover:bg-[#f1e6e6]`}
              />

              <Boton
                onClick={() => limpiar(setCorreo, setClave)}
                disabled={!correo && !clave}
                type={"button"}
                nombre={"Limpiar campos"}
                className={`py-3 text-lg hover:border-blue-500 hover:bg-[#f1e6e6]`}
              />
            </div>
          </form>
        </div>
      </Main>
    </>
  );
}

const iniciarSesion = async (
  correo,
  clave,
  setCorreo,
  setClave,
  setMensaje
) => {
  try {
    const respuesta = await axios.post(`/api/login`, { correo, clave });

    console.log(respuesta.data);

    if (respuesta.data.status === "ok") {
      window.location.href = respuesta.data.redirect;
    } else {
      setMensaje(respuesta.data.message);
    }

    setTimeout(() => {
      setMensaje("");
      setCorreo("");
      setClave("");
    }, 5000);
  } catch (error) {
    console.log("Error al iniciar sesión: " + error);
    if (error && error.response && error.response.status === 400) {
      setMensaje(error.response.data.message);
    } else {
      setMensaje("Error interno...");
    }
    setTimeout(() => {
      setMensaje("");
      setClave("");
    }, 5000);
  }
};

function limpiar(setCorreo, setClave) {
  setCorreo("");
  setClave("");
}
