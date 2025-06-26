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
//import LabelInput from "@/components/LabelInput";
import SelectOpcion from "@/components/SelectOpcion";
import BotonAceptarCancelar from "@/components/BotonAceptarCancelar";
import InputClave from "@/components/inputs/InputClave";
import ModalDatosContenedor from "@/components/ModalDatosContenedor";
import BotonesModal from "@/components/BotonesModal";

import LabelInput from "@/components/inputs/LabelInput";
import InputCedula from "@/components/inputs/InputCedula";
import InputNombre from "@/components/inputs/InputNombre";
import InputCorreo from "@/components/inputs/InputCorreo";

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

  const [todosDepartamentos, setTodosDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [idDepartamento, setIdDepartamento] = useState("");
  const [nombreDepartamento, setNombreDepartamento] = useState("");

  const [seleccionarDepartamentos, setSeleccionarDepartamentos] = useState([]);

  const mostrarModalS = () => setVisible(true);
  const ocultarModal = () => setVisible(false);

  useEffect(() => {
    const fetchDatosDepartamentos = async () => {
      try {
        const response = await axios.get(
          "/api/departamentos/todos-departamentos"
        );
        setTodosDepartamentos(response.data.departamentos || []);
      } catch (error) {
        console.log("Error, al obtener los departamentos: " + error);
      } finally {
        setIsLoading(false); // Evita el pantallazo mostrando carga antes de datos
      }
    };

    fetchDatosDepartamentos();
  }, []);

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
          crearUsuario(
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

  const crearUsuario = async () => {
    try {
      const data = {
        cedula: cedula,
        nombre: nombre,
        correo: correo,
        claveUno: claveUno,
        claveDos: claveDos,
        departamento:
          seleccionarDepartamentos.length > 0
            ? seleccionarDepartamentos.map(({ id }) => ({ id }))
            : [],
      };

      const respuesta = await axios.post(`/api/usuarios/crear-usuario`, data);

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
      }
    } catch (error) {
      console.log("Error, al crear el usuario: " + error);

      if (error && error.response && error.response.status === 400) {
        setMensaje(error.response.data.message);
      } else {
        setMensaje("Error interno");
      }

      setTimeout(() => {
        cerrarModal();
      }, 5000);
    }
  };

  const cambiarSeleccionDepartamento = (e) => {
    const valor = parseInt(e.target.value);

    // Si el valor es vacío o no es un número válido, vaciar selección
    if (isNaN(valor)) {
      setSeleccionarDepartamentos([]);
      setIdDepartamento("");
      return;
    }

    const nuevo = { id: valor };

    setSeleccionarDepartamentos((prev) => {
      const existe = prev.some((departamento) => departamento.id === valor);
      return existe
        ? prev.filter((departamento) => departamento.id !== valor)
        : [...prev, nuevo];
    });

    setIdDepartamento(valor);
  };

  function limpiarCampos() {
    setCedula("");
    setNombre("");
    setCorreo("");
    setClaveUno("");
    setClaveDos("");
    setIdDepartamento("");
  }

  return (
    <>
      {/* <ImagenFondo /> */}

      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Desea registrar usuario?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Cedula"} descripcion={cedula} />
          <ModalDatos titulo={"Nombre"} descripcion={nombre} />
          <ModalDatos titulo={"Correo"} descripcion={correo} />
          <ModalDatos
            titulo={"Departamento"}
            descripcion={nombreDepartamento}
          />
          <ModalDatos titulo={"Clave"} descripcion={claveUno} />
          <ModalDatos titulo={"Confirmar clave"} descripcion={claveDos} />
          <ModalDatos
            titulo={"Departamento"}
            descripcion={nombreDepartamento}
          />
        </ModalDatosContenedor>

        {mensaje && (
          <div className="w-full mb-3">
            <MostrarMsj mensaje={mensaje} />
          </div>
        )}

        <BotonesModal
          aceptar={crearUsuario}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            nombre,
          }}
        />
      </Modal>

      <Main>
        <div className="flex flex-col items-center max-w-[700px] bg-white w-full rounded-md px-2 py-5 sm:px-10 sm:py-10 border border-black shadow-lg">
          <Titulos indice={2} titulo={"Crear usuario"} />

          <Formulario
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="w-full flex flex-col sm:flex-row sm:space-x-4 space-y-2">
              <LabelInput nombre={"Cedula"}>
                <InputCedula
                  type="text"
                  indice={"cedula"}
                  value={cedula}
                  setValue={setCedula}
                  validarCedula={validarCedula}
                  setValidarCedula={setValidarCedula}
                />
              </LabelInput>

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
            </div>

            <div className="w-full flex flex-col sm:flex-row sm:space-x-4 -mt-2 space-y-2">
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

              <SelectOpcion
                idOpcion={idDepartamento}
                nombre={"Departamentos"}
                handleChange={cambiarSeleccionDepartamento}
                opciones={todosDepartamentos}
                seleccione={"Seleccione"}
                setNombre={setNombreDepartamento}
              />
            </div>

            <div className="w-full flex flex-col space-y-2 -mt-2">
              <LabelInput nombre={"Clave"}>
                <InputClave
                  type={"password"}
                  value={claveUno}
                  onChange={leyendoClave1}
                  indice={"clave"}
                  validarClave={validarClave}
                  setValidarClave={setValidarClave}
                />
              </LabelInput>

              <LabelInput nombre={"Clave confirmar"}>
                <InputClave
                  type={"password"}
                  value={claveDos}
                  onChange={leyendoClave2}
                  indice={"clave2"}
                  mostrarModalS={mostrarModalS}
                  ocultarModal={ocultarModal}
                />
              </LabelInput>

              {/* <div className="flex justify-between w-full space-x-4 border">
                <div className="w-[80%]">
                  <LabelInput nombre={"Clave"}>
                    <InputClave
                      type={"password"}
                      nombre={"Clave confirmar"}
                      value={claveDos}
                      onChange={leyendoClave2}
                      indice={"clave2"}
                    />
                  </LabelInput>
                </div>

                <div className="flex w-[20%]">
                  <div
                    onMouseEnter={mostrarModalS}
                    onMouseLeave={ocultarModal}
                    className="w-full bg-white h-10 flex justify-center items-center rounded-md border border-gray-300 hover:border-[#082158]"
                  >
                    <svg
                      fill="#082158"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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
              </div> */}


            </div>

            <ModalPequena visible={visible} />

            <div className="flex items-center justify-between -mt-3 sm:mt-0">
              <LinkPaginas href="/" nombre={"Login"} />
              <LinkPaginas
                href="/recuperar-clave-correo"
                nombre={"Olvido su clave?"}
              />
            </div>

            <div className="flex space-x-4">
              <BotonAceptarCancelar
                indice={"aceptar"}
                aceptar={mostrarModal}
                nombre={"Crear"}
                campos={{
                  cedula,
                  correo,
                  nombre,
                  idDepartamento,
                  claveUno,
                  claveDos,
                }}
              />

              <BotonAceptarCancelar
                indice={"limpiar"}
                aceptar={() => {
                  limpiarCampos({
                    setCedula,
                    setCorreo,
                    setNombre,
                    setIdDepartamento,
                    setClaveUno,
                    setClaveDos,
                  });
                }}
                nombre={"Limpiar"}
                campos={{
                  cedula,
                  correo,
                  nombre,
                  idDepartamento,
                  claveUno,
                  claveDos,
                }}
              />
            </div>
          </Formulario>
        </div>
      </Main>
    </>
  );
}

/** 
const crearUsuario = async (
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
  setMensaje,
  seleccionarDepartamentos
) => {
  try {
    console.log(seleccionarDepartamentos);

    const data = {
      cedula: cedula,
      nombre: nombre,
      correo: correo,
      claveUno: claveUno,
      claveDos: claveDos,
      departamento:
        seleccionarDepartamentos.length > 0
          ? seleccionarDepartamentos.map(({ id }) => ({ id }))
          : [],
    };

    const respuesta = await axios.post(`/api/usuarios/crear-usuario`, data);

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
*/
