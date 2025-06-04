"use client";

import ImagenFondo from "@/components/ImagenFondo";
import { useState, useEffect } from "react";
import axios from "axios";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Boton from "@/components/Boton";
import LinkPaginas from "@/components/Link";
import Modal from "@/components/Modal";
import ModalDatos from "@/components/ModalDatos";
import MostrarMsj from "@/components/MostrarMensaje";
import Formulario from "@/components/Formulario";
import Titulos from "@/components/Titulos";
import ModalPequena from "@/components/ModalPeque";
import Main from "@/components/Main";

export default function RegistrarUsuario() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [claveUno, setClaveUno] = useState("");
  const [claveDos, setClaveDos] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [validarCorreo, setValidarCorreo] = useState(false);
  const [validarCedula, setValidarCedula] = useState(false);
  const [validarNombre, setValidarNombre] = useState(false);
  const [validarClave, setValidarClave] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [visible, setVisible] = useState(false);
  const [verModal, setVerModal] = useState(false);

  const mostrarModalS = () => setVisible(true);
  const ocultarModal = () => setVisible(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !verModal) {
        // Solo muestra el modal si no está ya abierto
        if (cedula && nombre && correo && claveUno && claveDos) {
          setVerModal(true); // Activa el estado para mostrar el modal
          mostrarModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [verModal, cedula, nombre, correo, claveUno, claveDos]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && verModal) {
        // Solo confirma si el modal está abierto
        if (cedula && nombre && correo && claveUno && claveDos) {
          registrarNuevoUsuario(
            cedula,
            nombre,
            correo,
            claveUno,
            claveDos,
            setCedula,
            setNombre,
            setCorreo,
            setClaveUno,
            setClaveDos,
            setMensaje
          );
          setMostrar(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [verModal, cedula, nombre, correo, claveUno, claveDos]);

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

  const mostrarModal = () => {
    setMostrar(true);
  };

  const cerrarModal = () => {
    setClaveUno("");
    setClaveDos("");

    setMostrar(false);
  };

  return (
    <>
      {/* <ImagenFondo /> */}

      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Desea registrar usuario?"}
      >
        <div className="flex flex-col justify-center items-center space-y-1 pb-4">
          <ModalDatos titulo={"Cedula"} descripcion={cedula} />
          <ModalDatos titulo={"Nombre"} descripcion={nombre} />
          <ModalDatos titulo={"Correo"} descripcion={correo} />
          <ModalDatos titulo={"Clave"} descripcion={claveUno} />
          <ModalDatos titulo={"Confirmar clave"} descripcion={claveDos} />
        </div>

        <div className="flex space-x-2 px-10">
          <Boton
            className={`py-2`}
            nombre={"Aceptar"}
            onClick={() => {
              registrarNuevoUsuario(
                cedula,
                nombre,
                correo,
                claveUno,
                claveDos,
                setCedula,
                setNombre,
                setCorreo,
                setClaveUno,
                setClaveDos,
                setMensaje
              );
              setMostrar(false);
            }}
          />

          <Boton
            className={`py-2`}
            nombre={"Cancelar"}
            onClick={() => {
              cancelarRegistro(setClaveUno, setClaveDos);
              setMostrar(false);
            }}
          />
        </div>
      </Modal>

      <Main>
        <div className="flex flex-col items-center max-w-[700px] bg-white w-full rounded-md px-2 py-5 sm:px-10 sm:py-10 space-y-5 border border-black shadow-lg">
          <Titulos indice={2} titulo={"Crear usuario"} />

          <Formulario
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between space-x-3 space-y-3">
              <div className="w-full sm:w-1/2">
                <Label
                  htmlFor={"cedula-registro-usuario"}
                  nombre={"Cedula"}
                  className={`font-semibold`}
                />

                <Input
                  id={"cedula-registro-usuario"}
                  indice={"cedula"}
                  type={"text"}
                  placeholder={"Ejemplo: 20.202.220"}
                  name={"cedula"}
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  validarCedula={validarCedula}
                  setValidarCedula={setValidarCedula}
                />
              </div>

              <div className="w-full sm:w-1/2">
                <Label
                  htmlFor={"email_registro_usuario"}
                  nombre={"Correo"}
                  className={`font-semibold`}
                />

                <Input
                  id={"email_registro_usuario"}
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
            </div>

            <div className="space-y-1">
              <Label
                htmlFor={"nombre_registro_usuario"}
                nombre={"Nombre"}
                className={`font-semibold`}
              />

              <Input
                id={"nombre_registro_usuario"}
                indice={"nombre"}
                type={"text"}
                placeholder={""}
                name={"nombre"}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                validarTexto={validarNombre}
                setValidarTexto={setValidarNombre}
                autoComplete={"nombre"}
              />
            </div>

            <div className="space-y-1 flex flex-col">
              <Label
                htmlFor={"claveUno_registro_usuario"}
                nombre={"Clave"}
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
                nombre={"Confirmar clave"}
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

            <ModalPequena visible={visible} />

            <div className="flex items-center justify-between">
              <LinkPaginas href="/" nombre={"Login"} />
              <LinkPaginas
                href="/recuperar-clave-correo"
                nombre={"Olvido su clave?"}
              />
            </div>

            {mensaje && <MostrarMsj mensaje={mensaje} />}

            <div className="flex space-x-2">
              <Boton
                onClick={() => mostrarModal()}
                disabled={
                  !cedula || !nombre || !correo || !claveUno || !claveDos
                }
                type={"button"}
                nombre={"Registrar"}
                className={` py-3 text-lg hover:border-blue-500 hover:bg-[#f1e6e6]`}
              />

              <Boton
                disabled={
                  !cedula && !nombre && !correo && !claveUno && !claveDos
                }
                type={"button"}
                nombre={"Limpiar campos"}
                className={`py-3 text-lg hover:border-blue-500 hover:bg-[#f1e6e6]`}
                onClick={() =>
                  limpiar(
                    setCedula,
                    setNombre,
                    setCorreo,
                    setClaveUno,
                    setClaveDos
                  )
                }
              />
            </div>
          </Formulario>
        </div>
      </Main>
    </>
  );
}

const registrarNuevoUsuario = async (
  cedula,
  nombre,
  correo,
  claveUno,
  claveDos,
  setCedula,
  setNombre,
  setCorreo,
  setClaveUno,
  setClaveDos,
  setMensaje
) => {
  try {
    const respuesta = await axios.post(`/api/usuarios/crear-usuario`, {
      cedula: cedula,
      nombre: nombre,
      correo: correo,
      claveUno: claveUno,
      claveDos: claveDos,
    });

    console.log(respuesta.data);

    if (respuesta.data.status === "ok") {
      setMensaje(respuesta.data.message);
      setTimeout(() => {
        setCedula("");
        setNombre("");
        setCorreo("");
        setClaveUno("");
        setClaveDos("");
        setMensaje("");
        window.location.href = respuesta.data.redirect;
      }, 5000);
    } else {
      setMensaje(respuesta.data.message);

      setTimeout(() => {
        setClaveUno("");
        setClaveDos("");
        setMensaje("");
      }, 5000);
    }
  } catch (error) {
    console.log("Error, al crear el usuario: " + error);

    if (error && error.response && error.response.status === 400) {
      setMensaje(error.response.data.message);
    } else {
      setMensaje("Error interno");
    }

    setTimeout(() => {
      setClaveUno("");
      setClaveDos("");
      setMensaje("");
    }, 5000);
  }
};

function limpiar(setCedula, setNombre, setCorreo, setClaveUno, setClaveDos) {
  setCedula("");
  setNombre("");
  setCorreo("");
  setClaveUno("");
  setClaveDos("");
}

function cancelarRegistro(setClaveUno, setClaveDos) {
  setClaveUno("");
  setClaveDos("");
}
