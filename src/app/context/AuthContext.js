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
