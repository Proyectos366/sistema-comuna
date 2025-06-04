"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import MenuLateralUsuario from "@/components/sistema/MenuLateralUsuarios";
import HeaderUsuarios from "@/components/sistema/HeaderUsuarios";
import Footer from "../Footer";
import { useUser } from "@/app/context/AuthContext";
import MostrarPerfilUsuario from "./MostrarPerfilUsuario";
import MostrarCambiarClaveUsuario from "./MostrarCambiarClaveUsuario";
import ParroquiasForm from "../opciones/ParroquiasForm";
import CargosForm from "../opciones/CargosForm";
import ComunasForm from "../opciones/ComunasForm";

export default function VistaUniversalUsuarios({ children }) {
  const { usuarioActivo, screenSize } = useUser();

  const [buscador, setBuscador] = useState("");
  const [vista, setVista] = useState("");

  const [abrirPanel, setAbrirPanel] = useState(true);
  const [abrirModalCarpetas, setAbrirModalCarpetas] = useState(false);

  //Esto es para el header, donde esta el icono de notificaciones y el de usuario
  const [menuOpcionesUsuario, setMenuOpcionesUsuario] = useState(false);
  const [menuNotificaciones, setMenuNotificaciones] = useState(false);

  //Carpetas y rutas que se usan  en las carpetas
  const [carpetaActual, setCarpetaActual] = useState(null);
  const [rutaCarpetas, setRutaCarpetas] = useState(null);
  const [haRetrocedido, setHaRetrocedido] = useState(null);
  const [historialRutas, setHistorialRutas] = useState([]);
  const [indiceHistorial, setIndiceHistorial] = useState(-1);

  const [resultados, setResultados] = useState([]);

  const refMenuPerfil = useRef(null);
  const refMenuNotificaciones = useRef(null);
  const refMenuCarpetas = useRef(null);

  const router = useRouter();
  const pathname = usePathname();

  const userType = usuarioActivo?.id_rol;

  useEffect(() => {
    if (screenSize?.width > 640) {
      setAbrirPanel(true);
    } else {
      setAbrirPanel(false);
    }
  }, [screenSize]);

  useEffect(() => {
    const subRuta = pathname.split("/").pop();

    if (
      !subRuta ||
      subRuta === "empleados" ||
      subRuta === "director" ||
      subRuta === "administrador" ||
      subRuta === "master"
    ) {
      setVista("inicio");
      if (!subRuta || subRuta === "empleados") {
        router.push("/dashboard/empleados", { shallow: true }); // Redirige a la principal
      } else if (subRuta === "director") {
        router.push("/dashboard/director", { shallow: true }); // Redirige a la principal
      } else if (subRuta === "administrador") {
        router.push("/dashboard/administrador", { shallow: true }); // Redirige a la principal
      } else if (subRuta === "master") {
        router.push("/dashboard/master", { shallow: true }); // Redirige a la principal
      }
    } else if (
      subRuta === "parroquias" ||
      subRuta === "comunas" ||
      subRuta === "circuitos-comunales" ||
      subRuta === "usuarios" ||
      subRuta === "consejos-comunales" ||
      subRuta === "perfil" ||
      subRuta === "cambiar-clave" ||
      subRuta === "voceros" ||
      subRuta === "cargos"
    ) {
      setVista(subRuta);
    } else {
      console.log(subRuta);

      setVista("inicio");
      router.push("/", { shallow: true }); // Redirige a la principal
    }

    const clickListener = (event) => {
      clickFueraCierraMenu(event);
    };

    document.addEventListener("mousedown", clickListener);

    return () => {
      document.removeEventListener("mousedown", clickListener);
    };
  }, [pathname, router]);

  useEffect(() => {
    if (!pathname || typeof pathname !== "string") {
      console.warn("No se detectó un pathname válido.");
      return;
    }

    if (!userType) {
      //console.warn("No se detectó un tipo de usuario válido.");
      return;
    }

    // Define los permisos para cada tipo de usuario
    const permisos = {
      1: [
        "parroquias",
        "comunas",
        "consejos-comunales",
        "usuarios",
        "circuitos-comunales",
        "cargos",
        "voceros",
        "perfil",
        "cambiar-clave",
      ], // Rol 1: Master
      2: [
        "parroquias",
        "comunas",
        "consejos-comunales",
        "usuarios",
        "circuitos-comunales",
        "cargos",
        "voceros",
        "perfil",
        "cambiar-clave",
      ], // Rol 2: Administrador
      3: [
        "consejos-comunales",
        "circuitos-comunales",
        "cargos",
        "voceros",
        "perfil",
        "cambiar-clave",
      ], // Rol 3: Director
      4: [
        "consejos-comunales",
        "circuitos-comunales",
        "cargos",
        "voceros",
        "perfil",
        "cambiar-clave",
      ], // Rol 4: Empleados
    };

    // Define las rutas por defecto para cada tipo de usuario
    const rutasPorDefecto = {
      1: "/dashboard/master", // Ruta por defecto para Master
      2: "/dashboard/administrador", // Ruta por defecto para Administrador
      3: "/dashboard/director", // Ruta por defecto para Directores
      4: "/dashboard/empleados", // Ruta por defecto para Empleados
    };

    // Obtén la última parte de la ruta
    const subRuta = pathname.split("/").pop();

    // Verifica si la subruta pertenece a los permisos del usuario
    const tienePermiso = (ruta) => {
      const permisosUsuario = permisos[userType] || []; // Obtén los permisos según el tipo de usuario
      return permisosUsuario.includes(ruta); // Devuelve true si tiene permiso para la ruta
    };

    // Ruta predeterminada basada en el tipo de usuario
    const redireccion = rutasPorDefecto[userType];

    // Redirige solo si la subruta no está permitida
    if (!tienePermiso(subRuta)) {
      if (pathname !== redireccion) {
        // Evita redirecciones innecesarias
        router.replace(redireccion, { shallow: true });
      }
      return; // Termina la ejecución después de redirigir
    }
  }, [pathname, router, userType]);

  const toggleModalCarpetas = (id) => {
    //console.log("ID recibido:" + id); // Verifica el ID que llega
    setAbrirModalCarpetas((prevId) => {
      return prevId === id ? null : id; // Alterna entre abrir/cerrar
    });
  };

  /**
    useEffect(() => {
      // Registrar cada tecla presionada en la consola
    const detectarTecla = (event) => {
      console.log(`Tecla presionada: ${event.key}`);
    };

    document.addEventListener("keydown", detectarTecla);

    return () => {
      document.removeEventListener("keydown", detectarTecla);
    };
    }, []);
  */

  const cambiarRuta = (subRuta, nuevaVista, id_rol) => {
    // Determinar la base de la ruta según el id_rol
    let baseRuta = ""; // Por defecto, no hay ninguna ruta
    if (id_rol === 1) {
      baseRuta = "/dashboard/master";
    } else if (id_rol === 2) {
      baseRuta = "/dashboard/administrador";
    } else if (id_rol === 3) {
      baseRuta = "/dashboard/director";
    } else if (id_rol === 4) {
      baseRuta = "/dashboard/empleados";
    } else {
      console.log("ID de rol inválido o no especificado.");
      return; // Detener si el rol no es válido
    }

    // Construir la ruta completa
    router.push(`${baseRuta}${subRuta ? `/${subRuta}` : ""}`, {
      shallow: true,
    });

    // Actualizar la vista
    setVista(nuevaVista);
  };

  const clickFueraCierraMenu = (event) => {
    if (
      refMenuPerfil.current &&
      !refMenuPerfil.current.contains(event.target)
    ) {
      setMenuOpcionesUsuario(false);
    }

    if (
      refMenuNotificaciones.current &&
      !refMenuNotificaciones.current.contains(event.target)
    ) {
      setMenuNotificaciones(false);
    }

    if (
      refMenuCarpetas.current &&
      !refMenuCarpetas.current.contains(event.target)
    ) {
      setAbrirModalCarpetas(false);
    }
  };

  const abrirDashboar = () => {
    setAbrirPanel(!abrirPanel);
  };

  const toggleMenu = (setFunctionToToggle, setFunctionsToClose = []) => {
    setFunctionToToggle((prevState) => !prevState); // Cambia el estado del menú objetivo
    setFunctionsToClose.forEach((setFunction) => setFunction(false)); // Cierra otros menús si están abiertos
  };

  const volverInicio = () => {
    setRutaCarpetas(null); // Limpiar la ruta porque volvemos al nivel principal
    setCarpetaActual(null); // Opcional: Limpiar carpeta actual
    setHaRetrocedido(null);
    setHistorialRutas([]);
    setIndiceHistorial(-1);

    // Limpiar localStorage
    localStorage.removeItem("rutaCarpeta"); // Eliminar la ruta almacenada
    localStorage.removeItem("carpetaActual"); // Eliminar la carpeta almacenada
    localStorage.removeItem("estadoCarpeta");
    localStorage.removeItem("historialRutas");
    localStorage.removeItem("dondeGuardar");
  };

  console.log(vista);
  
  return (
    <>
      {usuarioActivo && (
        <div
          className={`flex flex-col  ${
            abrirPanel ? "" : "container mx-auto px-2"
          } `}
        >
          <div
            className={`fixed inset-y-0 left-0 transform ${
              abrirPanel ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-1000 ease-in-out w-48 z-30`}
          >
            <MenuLateralUsuario
              vista={vista}
              cambiarRuta={cambiarRuta}
              abrirPanel={abrirPanel}
              id_rol={usuarioActivo.id_rol}
              volverInicio={volverInicio}
            />
          </div>

          <div
            className={`grid min-h-dvh grid-rows-[auto_1fr_auto] space-y-3 ${
              abrirPanel ? "ml-48 px-2 " : "ml-0"
            } transition-all duration-1000 ease-in-out`}
          >
            <header>
              <HeaderUsuarios
                abrirDashboar={abrirDashboar}
                abrirPanel={abrirPanel}
                usuarioActivo={usuarioActivo}
                cambiarRuta={cambiarRuta}
                vista={vista}
                id_rol={usuarioActivo.id_rol}
                toggleMenu={toggleMenu}
                menuNotificaciones={menuNotificaciones}
                menuOpcionesUsuario={menuOpcionesUsuario}
                setMenuNotificaciones={setMenuNotificaciones}
                setMenuOpcionesUsuario={setMenuOpcionesUsuario}
                setAbrirModalCarpetas={setAbrirModalCarpetas}
                refMenuPerfil={refMenuPerfil}
                refMenuNotificaciones={refMenuNotificaciones}
                volverInicio={volverInicio}
              />
            </header>

            <main className={`bg-[#faf5f8] rounded-md`}>

              {vista === "parroquias" && (
                <ParroquiasForm />
              )}

              {vista === "cargos" && (
                <CargosForm />
              )}

              {vista === "comunas" && (
                <ComunasForm />
              )}

              {vista === "perfil" && (
                <MostrarPerfilUsuario abrirPanel={abrirPanel} />
              )}

              {vista === "cambiar-clave" && (
                <MostrarCambiarClaveUsuario abrirPanel={abrirPanel} />
              )}
            </main>

            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
