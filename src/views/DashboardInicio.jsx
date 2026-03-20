"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/context/AuthContext";

import Div from "@/components/padres/Div";
import HeaderUsuarios from "@/components/dashboard/Inicio/HeaderUsuarios";
import Main from "@/components/padres/Main";
import Footer from "@/components/Footer";
import InicioUsuarios from "@/components/dashboard/Inicio/InicioUsuarios";
import MenuLateralUsuario from "@/components/dashboard/Inicio/MenuLateralUsuarios";

export default function DashboardInicio() {
  const { screenSize } = useUser();

  const { usuarioActivo, departamento } = useSelector((state) => state.auth);

  const [vista, setVista] = useState("");

  const [abrirPanel, setAbrirPanel] = useState(true);

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
      subRuta === "paises" ||
      subRuta === "estados" ||
      subRuta === "municipios" ||
      subRuta === "parroquias" ||
      subRuta === "instituciones" ||
      subRuta === "comunas" ||
      subRuta === "circuitos-comunales" ||
      subRuta === "usuarios" ||
      subRuta === "consejos-comunales" ||
      subRuta === "perfil" ||
      subRuta === "cambiar-clave" ||
      subRuta === "voceros" ||
      subRuta === "cargos" ||
      subRuta === "formaciones" ||
      subRuta === "modulos" ||
      subRuta === "participantes" ||
      subRuta === "departamentos" ||
      subRuta === "oac" ||
      subRuta === "novedades" ||
      subRuta === "estantes"
    ) {
      setVista(subRuta);
    } else {
      setVista("inicio");
      router.push("/", { shallow: true }); // Redirige a la principal
    }
  }, [pathname, router]);

  useEffect(() => {
    // Verifica que pathname y userType estén definidos antes de proceder
    if (!pathname || typeof pathname !== "string") {
      console.warn("No se detectó un pathname válido.");
      return; // Detén la ejecución si no hay un pathname válido
    }

    if (!userType) {
      //console.warn("No se detectó un tipo de usuario válido.");
      return; // Detén la ejecución si el tipo de usuario es inválido
    }

    // Define los permisos para cada tipo de usuario
    const permisos = {
      1: [
        "paises",
        "estados",
        "municipios",
        "parroquias",
        "instituciones",
        "comunas",
        "consejos-comunales",
        "usuarios",
        "circuitos-comunales",
        "cargos",
        "modulos",
        "formaciones",
        "participantes",
        "departamentos",
        "voceros",
        "perfil",
        "cambiar-clave",
        "oac",
        "novedades",
        "estantes",
      ],
      2: [
        "parroquias",
        "comunas",
        "consejos-comunales",
        "usuarios",
        "circuitos-comunales",
        "cargos",
        "modulos",
        "formaciones",
        "participantes",
        "departamentos",
        "voceros",
        "perfil",
        "cambiar-clave",
        "novedades",
        "estantes",
      ],
      3: [
        "comunas",
        "consejos-comunales",
        "circuitos-comunales",
        "formaciones",
        "cargos",
        "participantes",
        "voceros",
        "perfil",
        "cambiar-clave",
        "novedades",
        "estantes",
      ],
      4: [
        "comunas",
        "consejos-comunales",
        "circuitos-comunales",
        "voceros",
        "participantes",
        "perfil",
        "cambiar-clave",
        departamento?.nombre === "oac" ? "oac" : "",
        "novedades",
        "estantes",
      ],
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

  const abrirDashboar = () => {
    setAbrirPanel(!abrirPanel);
  };

  return (
    <>
      {usuarioActivo && (
        <Div
          className={`flex flex-col justify-between ${
            abrirPanel ? "" : "container mx-auto px-2"
          } `}
        >
          <Div
            className={`fixed inset-y-0 left-0 transform ${
              abrirPanel ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-1000 ease-in-out w-56 z-30`}
          >
            <MenuLateralUsuario
              vista={vista}
              cambiarRuta={cambiarRuta}
              abrirPanel={abrirPanel}
            />
          </Div>

          <Div
            className={`grid min-h-dvh grid-rows-[auto_1fr_auto] gap-4 ${
              abrirPanel ? "ml-56 px-2 " : "ml-0"
            } transition-all duration-1000 ease-in-out`}
          >
            <HeaderUsuarios
              abrirDashboar={abrirDashboar}
              abrirPanel={abrirPanel}
              vista={vista}
              cambiarRuta={cambiarRuta}
              screenSize={screenSize}
            />

            <Main className="bg-[#faf5f8] rounded-md p-4 h-full overflow-hidden">
              <Div className="h-full overflow-y-auto no-scrollbar">
                <InicioUsuarios />
              </Div>
            </Main>

            <Footer />
          </Div>
        </Div>
      )}
    </>
  );
}

{
  /*
    <Main className={`bg-[#faf5f8] rounded-md p-4 h-full`}>
      <Div className={"h-[calc(100vh-200px)] overflow-y-auto no-scrollbar"}
        <InicioUsuarios />
      </Div>
    </Main>
  */
}
