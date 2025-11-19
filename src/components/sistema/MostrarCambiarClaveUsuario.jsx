"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/modales/Modal";
import ModalDatos from "@/components/modales/ModalDatos";
import MostrarMsj from "@/components/MostrarMensaje";
import Formulario from "@/components/Formulario";
import ModalDatosContenedor from "@/components/modales/ModalDatosContenedor";
import BotonesModal from "@/components/botones/BotonesModal";
import SectionRegistroMostrar from "@/components/SectionRegistroMostrar";
import DivUnoDentroSectionRegistroMostrar from "@/components/DivUnoDentroSectionRegistroMostrar";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import LabelInput from "@/components/inputs/LabelInput";
import InputClave from "@/components/inputs/InputClave";
import MostarMsjEnModal from "@/components/mensaje/MostrarMsjEnModal";

export default function MostrarCambiarClaveUsuario({
  mostrar,
  abrirModal,
  cerrarModal,
  mensaje,
  mostrarMensaje,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
}) {
  const [claveVieja, setClaveVieja] = useState("");
  const [claveUno, setClaveUno] = useState("");
  const [claveDos, setClaveDos] = useState("");
  const [mensajeValidar, setMensajeValidar] = useState("");

  const [validarClave, setValidarClave] = useState(false);

  const [verModal, setVerModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !mostrar) {
        // Solo muestra el modal si no está ya abierto
        if (claveVieja && claveUno && claveDos) {
          abrirModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mostrar, claveVieja, claveUno, claveDos]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && mostrar) {
        // Solo confirma si el modal está abierto
        if (claveVieja && claveUno && claveDos && router && pathname) {
          cambiarClave();
          cerrarModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mostrar, claveVieja, claveUno, claveDos, router, pathname]);

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
        setMensajeValidar("Clave debe ser entre 8 y 16 caracteres");
      } else if (
        (clave.length >= 8 || claveDos.length <= 16) &&
        !validarClave
      ) {
        setMensajeValidar("Formato de clave invalido...");
      } else {
        setMensajeValidar("");
      }
    }
  };

  const verificarCoincidencia = (clave, clave2) => {
    if (validarClave) {
      setMensajeValidar("");
    } else {
      setMensajeValidar("Formato clave invalido...");
    }

    if (clave !== clave2) {
      setMensajeValidar("Claves no coinciden...");
    } else {
      setMensajeValidar("");
    }
  };

  const cambiarClave = async () => {
    try {
      const response = await axios.post(
        `/api/usuarios/cambiar-clave-logueado`,
        {
          claveVieja: claveVieja,
          claveUno: claveUno,
          claveDos: claveDos,
        }
      );

      abrirMensaje(response.data.message);

      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setClaveVieja(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setClaveUno(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setClaveDos(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setMensajeValidar(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    } catch (error) {
      console.log("Error, al cambiar clave de usuario loggeado: " + error);
      abrirMensaje(error?.response?.data?.message);
      ejecutarAccionesConRetraso([
        { accion: cerrarModal, tiempo: 3000 }, // Se ejecutará en 3 segundos
        { accion: () => setMensajeValidar(""), tiempo: 3000 }, // Se ejecutará en 3 segundos
      ]);
    }
  };

  return (
    <>
      <Modal
        isVisible={mostrar}
        onClose={cerrarModal}
        titulo={"¿Desea registrar usuario?"}
      >
        <ModalDatosContenedor>
          <ModalDatos
            titulo={"Clave vieja"}
            descripcion={claveVieja}
            indice={1}
          />
          <ModalDatos
            titulo={"Clave nueva"}
            descripcion={claveUno}
            indice={1}
          />
          <ModalDatos
            titulo={"Confirmar clave nueva"}
            descripcion={claveDos}
            indice={1}
          />
        </ModalDatosContenedor>

        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />

        <BotonesModal
          aceptar={cambiarClave}
          cancelar={cerrarModal}
          indiceUno={"crear"}
          indiceDos={"cancelar"}
          nombreUno={"Aceptar"}
          nombreDos={"Cancelar"}
          campos={{
            claveVieja,
            claveUno,
            claveDos,
          }}
        />
      </Modal>

      <SectionRegistroMostrar>
        <DivUnoDentroSectionRegistroMostrar nombre={"Cambiar clave"}>
          <Formulario
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <LabelInput nombre={"Clave vieja"}>
              <InputClave
                type={"password"}
                value={claveVieja}
                onChange={(e) => setClaveVieja(e.target.value)}
                indice={"clave"}
              />
            </LabelInput>

            <LabelInput nombre={"Clave nueva"}>
              <InputClave
                type={"password"}
                value={claveUno}
                onChange={leyendoClave1}
                indice={"clave"}
                validarClave={validarClave}
                setValidarClave={setValidarClave}
              />
            </LabelInput>

            <LabelInput nombre={"Clave nueva confirmar"}>
              <InputClave
                type={"password"}
                value={claveDos}
                onChange={leyendoClave2}
                indice={"clave2"}
              />
            </LabelInput>

            {mensajeValidar && <MostrarMsj mensaje={mensajeValidar} />}

            <div className="flex space-x-4">
              <BotonAceptarCancelar
                indice={"aceptar"}
                aceptar={abrirModal}
                nombre={"Crear"}
                campos={{
                  claveVieja,
                  claveUno,
                  claveDos,
                }}
              />

              <BotonAceptarCancelar
                indice={"limpiar"}
                aceptar={() => {
                  limpiarCampos({
                    setClaveVieja,
                    setClaveUno,
                    setClaveDos,
                    setMensajeValidar,
                  });
                }}
                nombre={"Limpiar"}
                campos={{
                  claveVieja,
                  claveUno,
                  claveDos,
                }}
              />
            </div>

            {/* <div className="flex space-x-2">
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
            </div> */}
          </Formulario>
        </DivUnoDentroSectionRegistroMostrar>
      </SectionRegistroMostrar>
    </>
  );
}

// const cambiarClave = async (
//   claveVieja,
//   claveUno,
//   claveDos,
//   setClaveVieja,
//   setClaveUno,
//   setClaveDos,
//   setMensaje,
//   router,
//   pathname
// ) => {
//   try {
//     const respuesta = await axios.post(`/api/usuarios/cambiar-clave-logueado`, {
//       claveVieja: claveVieja,
//       claveUno: claveUno,
//       claveDos: claveDos,
//     });

//     if (respuesta.data.status === "ok") {
//       setMensaje(respuesta.data.message);
//       setTimeout(() => {
//         setClaveVieja("");
//         setClaveUno("");
//         setClaveDos("");
//         setMensaje("");

//         if (pathname.endsWith("/cambiar-clave")) {
//           const nuevaRuta = pathname.replace("/cambiar-clave", "");
//           router.push(`${nuevaRuta}`, { shallow: true });
//         }
//       }, 5000);
//     } else {
//       setMensaje(respuesta.data.message);

//       setTimeout(() => {
//         setClaveVieja("");
//         setClaveUno("");
//         setClaveDos("");
//         setMensaje("");
//       }, 5000);
//     }
//   } catch (error) {
//     console.log("Error, al crear el usuario: " + error);

//     if (error.response) {
//       // El servidor respondió con un estado diferente de 2xx
//       setMensaje(error.response.data.message || "Error del servidor");
//     } else if (error.request) {
//       // La solicitud se envió pero no hubo respuesta
//       setMensaje("No hay respuesta del servidor. Inténtalo más tarde.");
//     } else {
//       // Ocurrió un error al configurar la solicitud
//       setMensaje("Error inesperado. Revisa tu conexión.");
//     }

//     setTimeout(() => {
//       setClaveVieja("");
//       setClaveUno("");
//       setClaveDos("");
//       setMensaje("");
//     }, 5000);
//   }
// };
