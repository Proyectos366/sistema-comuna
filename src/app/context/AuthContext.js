/**
 @fileoverview Proveedor de contexto global para gestionar el estado del usuario activo, tamaño de
 pantalla, modales, mensajes y utilidades compartidas en la aplicación. Este módulo permite validar
 el usuario activo mediante una consulta a la API, controlar la interfaz y ejecutar acciones comunes
 desde cualquier componente. @module context/UserProvider
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

// 1. Crea el contexto de usuario
const UserContext = createContext();

/**
 Proveedor de contexto para compartir datos del usuario y funciones globales. @component
 @param {Object} props - Propiedades del componente. @param {React.ReactNode} props.children - 
 Componentes hijos envueltos por el proveedor. @returns {JSX.Element} Contexto del usuario.
*/
export const UserProvider = ({ children }) => {
  // 2. Estados globales del contexto
  const [usuarioActivo, setUsuarioActivo] = useState("");
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 }); // Tamaño de pantalla
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para el modal
  const [mensaje, setMensaje] = useState(""); // Texto del mensaje o respuesta a mostrar
  const [mostrarMensaje, setMostrarMensaje] = useState(false); // Visibilidad del mensaje
  const [departamento, setDepartamento] = useState(""); // Departamento del usuario

  const router = useRouter();

  /**
   Consulta el usuario activo desde la API. Si la respuesta es válida, actualiza el estado. Si hay
   error 400, redirige al inicio. @async @function consultarUserActivo
  */
  const consultarUserActivo = useCallback(async () => {
    try {
      // 3. Realiza la consulta al endpoint de usuario activo
      const response = await axios.get(`/api/usuarios/usuario-activo`);

      // 4. Si la respuesta es válida, actualiza los estados
      if (response?.data?.status === "ok") {
        setUsuarioActivo(response.data.usuarioActivo);
        setDepartamento(response.data.departamento);
      }
    } catch (error) {
      // 5. Manejo de errores y redirección si es necesario
      console.error("Error, al mostrar usuario activo: " + error);

      if (error?.response?.status === 400) {
        router.push("/", { shallow: true });
      }
    }
  }, [router]);

  // 6. Ejecuta la consulta del usuario activo al montar el componente
  useEffect(() => {
    if (!usuarioActivo) {
      consultarUserActivo();
    }
  }, [usuarioActivo, consultarUserActivo]);

  // 7. Actualiza el tamaño de pantalla al montar y en cada cambio de tamaño
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

  // Funciones para abrir el modal
  const abrirModal = () => {
    setMostrarModal(true);
  };

  // Funciones para cerrar el modal
  const cerrarModal = () => setMostrarModal(false);

  /**
   Muestra un mensaje temporal en pantalla. @function abrirMensaje
   @param {string} nuevoMensaje - Texto del mensaje.
   @param {number} [tiempo=3000] - Tiempo en milisegundos antes de ocultar el mensaje.
  */
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

  // Cierra el mensaje mostrado
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

  /**
   Ejecuta múltiples acciones con retraso. @function ejecutarAccionesConRetraso
   @param {Array<{accion: Function, tiempo: number}>} acciones - Lista de acciones con tiempo.
  */
  const ejecutarAccionesConRetraso = (acciones) => {
    // 8. Ejecuta cada acción después del tiempo especificado
    acciones.forEach(({ accion, tiempo }) => {
      setTimeout(() => {
        accion();
      }, tiempo);
    });
  };

  // 9. Retorna el proveedor con todos los valores y funciones disponibles
  return (
    <UserContext.Provider
      value={{
        usuarioActivo,
        departamento,
        screenSize,
        mostrarModal,
        abrirModal,
        cerrarModal,
        mensaje,
        mostrarMensaje,
        abrirMensaje,
        limpiarCampos,
        ejecutarAccionesConRetraso,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto del usuario.
 *
 * @function useUser
 * @returns {Object} Valores y funciones del contexto de usuario.
 */
export const useUser = () => useContext(UserContext);
