/** 

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuarioActivo, setUsuarioActivo] = useState("");
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 }); // Inicializa con valores seguros

  const router = useRouter();

  // Función para consultar el usuario activo
  const consultarUserActivo = useCallback(async () => {
    try {
      const response = await axios.get(`/api/usuarios/usuario-activo`);

      if (response?.data?.status === "ok") {
        setUsuarioActivo(response.data.usuarioActivo);
      }
    } catch (error) {
      console.error("Error, al mostrar usuario activo: " + error);

      if (error?.response?.status === 400) {
        router.push("/", { shallow: true });
      }
    }
  }, [router]);

  // Ejecutar consultarUserActivo al montar
  useEffect(() => {
    if (!usuarioActivo) {
      consultarUserActivo();
    }
  }, [usuarioActivo, consultarUserActivo]);

  // Actualiza el tamaño de pantalla solo en el cliente
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Ejecuta al montar el componente
    handleResize();

    // Escucha cambios de tamaño de pantalla
    window.addEventListener("resize", handleResize);

    // Limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <UserContext.Provider value={{ usuarioActivo, screenSize }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
*/

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuarioActivo, setUsuarioActivo] = useState("");
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 }); // Inicializa con valores seguros
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para el modal
  const [mensaje, setMensaje] = useState("");
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [estado, setEstado] = useState({});

  const router = useRouter();

  // Función para consultar el usuario activo
  const consultarUserActivo = useCallback(async () => {
    try {
      const response = await axios.get(`/api/usuarios/usuario-activo`);

      if (response?.data?.status === "ok") {
        setUsuarioActivo(response.data.usuarioActivo);
      }
    } catch (error) {
      console.error("Error, al mostrar usuario activo: " + error);

      if (error?.response?.status === 400) {
        router.push("/", { shallow: true });
      }
    }
  }, [router]);

  // Ejecutar consultarUserActivo al montar
  useEffect(() => {
    if (!usuarioActivo) {
      consultarUserActivo();
    }
  }, [usuarioActivo, consultarUserActivo]);

  // Actualiza el tamaño de pantalla solo en el cliente
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Ejecuta al montar el componente
    handleResize();

    // Escucha cambios de tamaño de pantalla
    window.addEventListener("resize", handleResize);

    // Limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Funciones para controlar el modal
  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  const abrirMensaje = (nuevoMensaje, tiempo) => {
    setMensaje(nuevoMensaje);
    setMostrarMensaje(true);

    // Ocultar el mensaje después de "tiempo" milisegundos
    setTimeout(
      () => {
        cerrarMensaje();
      },
      !tiempo ? 3000 : tiempo
    );
  };

  const cerrarMensaje = () => {
    setMensaje(""); // Limpia el mensaje
    setMostrarMensaje(false);
  };

  // Función universal para limpiar campos dinámicos
  const limpiarCampos = (objetoEstados) => {
    // Iterar sobre los setters y actualizar cada uno con una cadena vacía
    Object.keys(objetoEstados).forEach((key) => {
      objetoEstados[key](""); // Llama a cada setter con una cadena vacía
    });
  };

  return (
    <UserContext.Provider
      value={{
        usuarioActivo,
        screenSize,
        mostrarModal,
        abrirModal,
        cerrarModal,
        mensaje,
        mostrarMensaje,
        abrirMensaje,
        limpiarCampos,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// import { createContext, useContext, useState } from "react";

// const LimpiarContext = createContext();

// export const LimpiarProvider = ({ children }) => {
//   const [estado, setEstado] = useState({});

//   // Función universal para limpiar campos dinámicos
//   const limpiarCampos = (objetoEstados) => {
//     const nuevoEstado = Object.keys(objetoEstados).reduce((acc, key) => {
//       acc[key] = ""; // Resetea cada estado a una cadena vacía
//       return acc;
//     }, {});

//     setEstado(nuevoEstado);
//   };

//   return (
//     <LimpiarContext.Provider value={{ estado, setEstado, limpiarCampos }}>
//       {children}
//     </LimpiarContext.Provider>
//   );
// };

// export const useLimpiar = () => useContext(LimpiarContext);
