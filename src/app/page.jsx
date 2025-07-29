"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import LinkPaginas from "@/components/Link";
import MostrarMsj from "@/components/MostrarMensaje";
import Titulos from "@/components/Titulos";
import Formulario from "@/components/Formulario";
import InputCorreo from "@/components/inputs/InputCorreo";
import InputClave from "@/components/inputs/InputClave";
import LabelInput from "@/components/inputs/LabelInput";
import BotonAceptarCancelar from "@/components/BotonAceptarCancelar";
import ImgRegistroLogin from "@/components/ImgRegistroLogin";
import ImgDosRegistroLogin from "@/components/ImgDosRegistroLogin";

export default function Home() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [validarCorreo, setValidarCorreo] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // Estado de carga

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
    if (isLoading) return; // Evita múltiples envíos rápidos

    try {
      setIsLoading(true);

      const { data } = await axios.post("/api/login", { correo, clave });

      setMensaje("");
      setCorreo("");
      setClave("");
      window.location.href = data.redirect;
    } catch (error) {
      console.log("Error, al iniciar sesión: " + error);

      setMensaje(error?.response?.data?.message);

      setTimeout(() => {
        setMensaje("");
        setClave("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const limpiarCampos = () => {
    setCorreo("");
    setClave("");
  };

  const leyendoClave = (e) => {
    const claveUno = e.target.value;
    setClave(claveUno);
  };

  return (
    <div className="container mx-auto min-h-dvh rounded-md  flex items-center justify-center gap-4 px-2">
      <section className="flex flex-col items-center justify-center gap-4 min-h-[200px] sm:max-w-[400px] md:max-w-[600px] w-full bg-white border border-gray-300 rounded-md shadow-lg p-4">
        <ImgRegistroLogin indice={"login"} />

        <div className="flex flex-col w-full">
          <Titulos
            indice={1}
            titulo={"Entrar al Sistema"}
            className="text-center text-xl !hidden sm:!block font-semibold text-gray-700 mb-2"
          />

          <Formulario
            onSubmit={(e) => {
              e.preventDefault();
              iniciarSesion(correo, clave, setCorreo, setClave, setMensaje);
            }}
          >
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

            <div className="flex space-x-4">
              <BotonAceptarCancelar
                indice={"aceptar"}
                aceptar={iniciarSesion}
                nombre={isLoading ? "Iniciando..." : "Iniciar sesion"}
                campos={{
                  correo,
                  clave,
                }}
              />

              <BotonAceptarCancelar
                indice={"limpiar"}
                aceptar={limpiarCampos}
                nombre={"Limpiar"}
                campos={{
                  correo,
                  clave,
                }}
              />
            </div>
          </Formulario>
        </div>
      </section>
    </div>
  );
}
