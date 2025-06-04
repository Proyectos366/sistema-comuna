"use client";

import ImagenFondo from "@/components/ImagenFondo";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Boton from "@/components/Boton";
import Modal from "@/components/Modal";
import ModalDatos from "@/components/ModalDatos";
import MostrarMsj from "@/components/MostrarMensaje";
import Formulario from "@/components/Formulario";
import Titulos from "@/components/Titulos";
import ModalPequena from "@/components/ModalPeque";

export default function MostrarCambiarClaveUsuario({ abrirPanel }) {
  const [claveVieja, setClaveVieja] = useState("");
  const [claveUno, setClaveUno] = useState("");
  const [claveDos, setClaveDos] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [mostrar, setMostrar] = useState(false);
  const [visible, setVisible] = useState(false);
  const [validarClave, setValidarClave] = useState(false);
  const [verModal, setVerModal] = useState(false);

  const mostrarModalS = () => setVisible(true);
  const ocultarModal = () => setVisible(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !verModal) {
        // Solo muestra el modal si no está ya abierto
        if (claveVieja && claveUno && claveDos) {
          setVerModal(true); // Activa el estado para mostrar el modal
          mostrarModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [verModal, claveVieja, claveUno, claveDos]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && verModal) {
        // Solo confirma si el modal está abierto
        if (claveVieja && claveUno && claveDos && router && pathname) {
          cambiarClave(
            claveVieja,
            claveUno,
            claveDos,
            setClaveVieja,
            setClaveUno,
            setClaveDos,
            setMensaje,
            router,
            pathname
          );
          setMostrar(false); // Cierra el modal después de confirmar
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [verModal, claveVieja, claveUno, claveDos, router, pathname]);

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
    console.log(validarClave);

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

  const mostrarModal = () => {
    setMostrar(true);
  };

  const cerrarModal = () => {
    setClaveUno("");
    setClaveDos("");

    setMostrar(false);
  };

  return (
    <div
      className={`mb-3 ${
        abrirPanel ? "hidden sm:flex sm:flex-col" : "flex flex-col"
      } `}
    >
      {/* <ImagenFondo /> */}

      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Desea registrar usuario?"}
      >
        <div className="flex flex-col justify-center items-center space-y-1 pb-4">
          <ModalDatos titulo={"Clave vieja"} descripcion={claveVieja} />
          <ModalDatos titulo={"Clave nueva"} descripcion={claveUno} />
          <ModalDatos titulo={"Confirmar clave nueva"} descripcion={claveDos} />
        </div>

        <div className="flex space-x-2 px-10">
          <Boton
            className={`py-2`}
            nombre={"Aceptar"}
            onClick={() => {
              cambiarClave(
                claveVieja,
                claveUno,
                claveDos,
                setClaveVieja,
                setClaveUno,
                setClaveDos,
                setMensaje,
                router,
                pathname
              );
              setMostrar(false);
            }}
          />

          <Boton
            className={`py-2`}
            nombre={"Cancelar"}
            onClick={() => {
              cancelarCambiaClave(setClaveVieja, setClaveUno, setClaveDos);
              setMostrar(false);
            }}
          />
        </div>
      </Modal>

      <Titulos indice={2} titulo={"Cambiando clave"} />
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center max-w-[700px] w-full rounded-md px-2 py-5 mt-5 sm:px-10  space-y-5   shadow-lg">
          <Formulario
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="space-y-1">
              <Label
                htmlFor={"clave-vieja"}
                nombre={"Clave vieja"}
                className={`font-semibold`}
              />

              <Input
                id={"clave-vieja"}
                indice={"clave1"}
                type={"password"}
                placeholder={"*************************"}
                name={"clave-vieja"}
                value={claveVieja}
                onChange={(e) => setClaveVieja(e.target.value)}
              />
            </div>

            <div className="space-y-1 flex flex-col">
              <Label
                htmlFor={"claveUno_registro_usuario"}
                nombre={"Clave nueva"}
                className={`font-semibold`}
              />

              <div className="flex justify-between w-full space-x-3">
                <div className="w-[80%]">
                  <Input
                    id={"claveUno_registro_usuario"}
                    indice={"clave"}
                    type={"password"}
                    placeholder={"**************************"}
                    name={"claveUno"}
                    value={claveUno}
                    onChange={leyendoClave1}
                    setValidarClave={setValidarClave}
                  />
                </div>

                <div
                  onMouseEnter={mostrarModalS}
                  onMouseLeave={ocultarModal}
                  className="w-[20%] bg-white flex justify-center items-center rounded-md border border-[black] hover:border-[#005cf4]"
                >
                  <svg
                    fill="#000000"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 52 52"
                    enableBackground="new 0 0 52 52"
                    xmlSpace="preserve"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <path d="M26.7,42.8c0.8,0,1.5,0.7,1.5,1.5v3.2c0,0.8-0.7,1.5-1.5,1.5h-3.2c-0.8,0-1.5-0.7-1.5-1.5v-3.2 c0-0.8,0.7-1.5,1.5-1.5H26.7z"></path>
                        <path d="M28.2,35.1c0-2.1,1.3-4,3.1-4.8h0.1c5.2-2.1,8.8-7.2,8.8-13.2c0-7.8-6.4-14.2-14.2-14.2 c-7.2,0-13.2,5.3-14.2,12.2v0.1c-0.1,0.9,0.6,1.6,1.5,1.6h3.2c0.8,0,1.4-0.5,1.5-1.1v-0.2c0.7-3.7,4-6.5,7.9-6.5 c4.5,0,8.1,3.6,8.1,8.1c0,2.1-0.8,4-2.1,5.5l-0.1,0.1c-0.9,1-2.1,1.6-3.3,2c-4,1.4-6.7,5.2-6.7,9.4v1.5c0,0.8,0.6,1.4,1.4,1.4h3.2 c0.8,0,1.6-0.6,1.6-1.5L28.2,35.1z"></path>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor={"claveDos_registro_usuario"}
                nombre={"Confirmar clave nueva"}
                className={`font-semibold`}
              />

              <Input
                id={"claveDos_registro_usuario"}
                indice={"clave1"}
                type={"password"}
                placeholder={"**************************"}
                name={"claveDos"}
                value={claveDos}
                onChange={leyendoClave2}
              />
            </div>

            <ModalPequena indice={1} visible={visible} />

            {mensaje && <MostrarMsj mensaje={mensaje} />}

            <div className="flex space-x-2">
              <Boton
                onClick={() => mostrarModal()}
                disabled={!claveVieja || !claveUno || !claveDos}
                type={"button"}
                nombre={"Cambiar"}
                className={`${
                  !claveVieja || !claveUno || !claveDos
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } py-3 text-lg hover:border-blue-500 hover:bg-[#f1e6e6]`}
              />

              <Boton
                disabled={!claveVieja && !claveUno && !claveDos}
                type={"button"}
                nombre={"Limpiar campos"}
                className={`${
                  claveVieja || claveUno || claveDos
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                } py-3 text-lg hover:border-blue-500 hover:bg-[#f1e6e6]`}
                onClick={() => limpiar(setClaveVieja, setClaveUno, setClaveDos)}
              />
            </div>
          </Formulario>
        </div>
      </div>
    </div>
  );
}

const cambiarClave = async (
  claveVieja,
  claveUno,
  claveDos,
  setClaveVieja,
  setClaveUno,
  setClaveDos,
  setMensaje,
  router,
  pathname
) => {
  try {
    const respuesta = await axios.post(`/api/usuarios/cambiar-clave-logueado`, {
      claveVieja: claveVieja,
      claveUno: claveUno,
      claveDos: claveDos,
    });

    if (respuesta.data.status === "ok") {
      setMensaje(respuesta.data.message);
      setTimeout(() => {
        setClaveVieja("");
        setClaveUno("");
        setClaveDos("");
        setMensaje("");

        if (pathname.endsWith("/cambiar-clave")) {
          const nuevaRuta = pathname.replace("/cambiar-clave", "");
          router.push(`${nuevaRuta}`, { shallow: true });
        }
      }, 5000);
    } else {
      setMensaje(respuesta.data.message);

      setTimeout(() => {
        setClaveVieja("");
        setClaveUno("");
        setClaveDos("");
        setMensaje("");
      }, 5000);
    }
  } catch (error) {
    console.log("Error, al crear el usuario: " + error);

    if (error.response) {
      // El servidor respondió con un estado diferente de 2xx
      setMensaje(error.response.data.message || "Error del servidor");
    } else if (error.request) {
      // La solicitud se envió pero no hubo respuesta
      setMensaje("No hay respuesta del servidor. Inténtalo más tarde.");
    } else {
      // Ocurrió un error al configurar la solicitud
      setMensaje("Error inesperado. Revisa tu conexión.");
    }

    setTimeout(() => {
      setClaveVieja("");
      setClaveUno("");
      setClaveDos("");
      setMensaje("");
    }, 5000);
  }
};

function limpiar(setClaveVieja, setClaveUno, setClaveDos) {
  setClaveVieja("");
  setClaveUno("");
  setClaveDos("");
}

function cancelarCambiaClave(setClaveVieja, setClaveUno, setClaveDos) {
  setClaveVieja("");
  setClaveUno("");
  setClaveDos("");
}
