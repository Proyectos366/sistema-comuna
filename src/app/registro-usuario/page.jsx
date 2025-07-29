"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import LinkPaginas from "@/components/Link";
import Modal from "@/components/Modal";
import ModalDatos from "@/components/ModalDatos";
import MostrarMsj from "@/components/MostrarMensaje";
import Formulario from "@/components/Formulario";
import Titulos from "@/components/Titulos";
import SelectOpcion from "@/components/SelectOpcion";
import BotonAceptarCancelar from "@/components/BotonAceptarCancelar";
import InputClave from "@/components/inputs/InputClave";
import ModalDatosContenedor from "@/components/ModalDatosContenedor";
import BotonesModal from "@/components/BotonesModal";
import LabelInput from "@/components/inputs/LabelInput";
import InputCedula from "@/components/inputs/InputCedula";
import InputNombre from "@/components/inputs/InputNombre";
import InputCorreo from "@/components/inputs/InputCorreo";
import ImgRegistroLogin from "@/components/ImgRegistroLogin";
import ImgDosRegistroLogin from "@/components/ImgDosRegistroLogin";
import Footer from "@/components/Footer";
import MostarMsjEnModal from "@/components/MostrarMsjEnModal";

export default function RegistrarUsuario() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [claveUno, setClaveUno] = useState("");
  const [claveDos, setClaveDos] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [mensajeBackEnd, setMensajeBackEnd] = useState("");

  const [validarCorreo, setValidarCorreo] = useState(false);
  const [validarCedula, setValidarCedula] = useState(false);
  const [validarNombre, setValidarNombre] = useState(false);
  const [validarApellido, setValidarApellido] = useState(false);
  const [validarClave, setValidarClave] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [verModal, setVerModal] = useState(false);

  const [todosDepartamentos, setTodosDepartamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [idDepartamento, setIdDepartamento] = useState("");
  const [nombreDepartamento, setNombreDepartamento] = useState("");

  const [seleccionarDepartamentos, setSeleccionarDepartamentos] = useState([]);

  useEffect(() => {
    const fetchDatosDepartamentos = async () => {
      try {
        const response = await axios.get(
          "/api/departamentos/todos-departamentos-fuera"
        );
        setTodosDepartamentos(response.data.departamentos || []);
      } catch (error) {
        console.log("Error, al obtener los departamentos: " + error);
      }
    };

    fetchDatosDepartamentos();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !verModal) {
        // Solo muestra el modal si no está ya abierto
        if (cedula && nombre && apellido && correo && claveUno && claveDos) {
          mostrarModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [verModal, cedula, nombre, apellido, correo, claveUno, claveDos]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && verModal) {
        // Solo confirma si el modal está abierto
        if (cedula && nombre && apellido && correo && claveUno && claveDos) {
          crearUsuario();
          cerrarModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [verModal, cedula, nombre, apellido, correo, claveUno, claveDos]);

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
      setIsLoading(true);

      const payload = {
        cedula,
        nombre,
        apellido,
        correo,
        claveUno,
        claveDos,
        departamento: seleccionarDepartamentos.map(({ id }) => ({ id })),
      };

      const { data } = await axios.post("/api/usuarios/crear-usuario", payload);

      setMensajeBackEnd(data.message);

      setTimeout(() => {
        limpiarCampos(); // agrupamos limpieza de estados
        setMensajeBackEnd("");
        window.location.href = data.redirect;
      }, 2000);
    } catch (error) {
      console.log("Error, al crear el usuario: " + error);

      const mensajeError =
        error?.response?.data?.message || "Error inesperado.";
      setMensajeBackEnd(mensajeError);

      setTimeout(() => {
        cerrarModal();
        setMensajeBackEnd("");
      }, 3000);
    } finally {
      setIsLoading(false);
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
    setApellido("");
    setCorreo("");
    setClaveUno("");
    setClaveDos("");
    setIdDepartamento("");
  }

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Crear usuario?"}
      >
        <ModalDatosContenedor>
          <ModalDatos titulo={"Cedula"} descripcion={cedula} />
          <ModalDatos titulo={"Nombre"} descripcion={nombre} />
          <ModalDatos titulo={"Apellido"} descripcion={apellido} />
          <ModalDatos titulo={"Correo"} descripcion={correo} />
          <ModalDatos
            titulo={"Departamento"}
            descripcion={nombreDepartamento}
          />
          <ModalDatos titulo={"Clave"} descripcion={claveUno} indice={1} />
          <ModalDatos
            titulo={"Clave confirmar"}
            descripcion={claveDos}
            indice={1}
          />
        </ModalDatosContenedor>

        {mensajeBackEnd && (
          <div className="w-full mb-3">
            <MostrarMsj mensaje={mensajeBackEnd} />
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
            cedula,
            nombre,
            apellido,
            correo,
            idDepartamento,
            claveUno,
            claveDos,
          }}
        />
      </Modal>

      <div className="container mx-auto min-h-dvh rounded-md  flex items-center justify-center gap-4 p-2">
        <section className="flex flex-col items-center justify-center gap-4 min-h-[400px] sm:max-w-[400px] md:max-w-[600px] w-full bg-white border border-gray-300 rounded-md shadow-lg p-4">
          <ImgRegistroLogin indice={"usuario"} />

          <div className="relative z-10 w-full">
            <Titulos
              indice={1}
              titulo={"Crear usuario"}
              className="text-center text-xl !hidden sm:!block font-semibold text-gray-700 mb-4"
            />
            <Formulario
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="w-full flex flex-col gap-2 hover:bg-white">
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

                <SelectOpcion
                  idOpcion={idDepartamento}
                  nombre={"Departamentos"}
                  handleChange={cambiarSeleccionDepartamento}
                  opciones={todosDepartamentos}
                  seleccione={"Seleccione"}
                  setNombre={setNombreDepartamento}
                />

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
                  />
                </LabelInput>
              </div>

              <div className="flex items-center justify-between">
                <LinkPaginas href="/" nombre={"Login"} />
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
                  aceptar={mostrarModal}
                  nombre={"Crear"}
                  campos={{
                    cedula,
                    correo,
                    nombre,
                    apellido,
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
                      setApellido,
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
                    apellido,
                    idDepartamento,
                    claveUno,
                    claveDos,
                  }}
                />
              </div>
            </Formulario>
          </div>
        </section>
      </div>
    </>
  );
}
