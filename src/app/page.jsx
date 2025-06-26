"use client";

import ImagenFondo from "@/components/ImagenFondo";
import { useState, useEffect } from "react";
import axios from "axios";
import LinkPaginas from "@/components/Link";
import Main from "@/components/Main";
import MostrarMsj from "@/components/MostrarMensaje";
import Titulos from "@/components/Titulos";
import Formulario from "@/components/Formulario";
import InputCorreo from "@/components/inputs/InputCorreo";
import InputClave from "@/components/inputs/InputClave";
import BotonesModal from "@/components/BotonesModal";
import LabelInput from "@/components/inputs/LabelInput";

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

  const iniciarSesion = async () => {
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

      setMensaje(error?.response?.data?.message);
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

  const leyendoClave = (e) => {
    const claveUno = e.target.value;
    setClave(claveUno);
  };

  return (
    <>
      {/* <ImagenFondo /> */}
      <Main>
        <div className="flex flex-col items-center max-w-[700px] bg-white w-full rounded-md px-2 py-5 sm:px-10 sm:py-10 space-y-5 border border-black shadow-lg">
          <Titulos indice={1} titulo={"Entrar al sistema"} />

          <Formulario
            onSubmit={(e) => {
              e.preventDefault();
              iniciarSesion(correo, clave, setCorreo, setClave, setMensaje);
            }}
          >
            <div className="w-full flex flex-col space-y-2">
              <LabelInput nombre={"Correo"}>
                <InputCorreo
                  type="text"
                  indice="email"
                  value={correo}
                  setValue={setCorreo}
                  validarCorreo={validarCorreo}
                  setValidarCorreo={setValidarCorreo}
                />
              </LabelInput>

              <LabelInput nombre={"Clave"}>
                <InputClave
                  type={"password"}
                  nombre={"Clave"}
                  value={clave}
                  onChange={leyendoClave}
                  indice={"clave"}
                />
              </LabelInput>
            </div>

            {/* <div className="space-y-1">
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
            </div> */}

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

            {mensaje && (
              <div className="w-full mb-3">
                <MostrarMsj mensaje={mensaje} />
              </div>
            )}

            <BotonesModal
              aceptar={iniciarSesion}
              cancelar={limpiar}
              indiceUno={"crear"}
              indiceDos={"cancelar"}
              nombreUno={"Aceptar"}
              nombreDos={"Cancelar"}
              campos={{
                correo,
              }}
            />

            {/* <div className="flex space-x-2">
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
            </div> */}
          </Formulario>
        </div>
      </Main>
    </>
  );
}
