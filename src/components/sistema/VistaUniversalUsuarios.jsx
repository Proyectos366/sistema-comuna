"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/context/AuthContext";
import { useSelector } from "react-redux";
import MenuLateralUsuario from "@/components/sistema/MenuLateralUsuarios";
import HeaderUsuarios from "@/components/sistema/HeaderUsuarios";
import Footer from "../Footer";
//import MostrarPerfilUsuario from "./MostrarPerfilUsuario";
//import MostrarCambiarClaveUsuario from "./MostrarCambiarClaveUsuario";

// import ComunasForm from "../opciones/ComunasForm";
// import CircuitoForm from "../opciones/CircuitosForm";
// import ConsejoForm from "../opciones/ConsejoForm";
// import VoceroForm from "../opciones/VoceroForm";
// //import MostrarAlInicioUsuarios from "./MostrarInicioUsuarios";
// import FormacionesForm from "../opciones/FormacionesForm";
// import ParticipantesForm from "../opciones/ParticipantesForm";
// import DepartamentosForm from "../opciones/DepartamentosForm";
// import EstadosForm from "../opciones/EstadoForm";
// import MunicipiosForm from "../opciones/MunicipioForm";
// import InstitucionesForm from "../opciones/InstitucionesForm";
//import NovedadesForm from "../opciones/NovedadesForm";

import UsuariosView from "@/components/dashboard/usuarios/UsuariosView";
import PaisesView from "@/components/dashboard/paises/PaisesView";
import EstadosView from "@/components/dashboard/estados/EstadosView";
import MunicipiosView from "@/components/dashboard/municipios/MunicipiosView";
import ParroquiasView from "@/components/dashboard/parroquias/ParroquiasView";
import InstitucionesView from "@/components/dashboard/instituciones/InstitucionesView";
import DepartamentosView from "@/components/dashboard/departamentos/DepartamentosView";
import CargosView from "@/components/dashboard/cargos/CargosView";

export default function VistaUniversalUsuarios() {
  const { screenSize } = useUser();

  const { usuarioActivo, departamento } = useSelector((state) => state.auth);

  const [vista, setVista] = useState("");
  const [abrirPanel, setAbrirPanel] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const userType = usuarioActivo?.id_rol;

  useEffect(() => {
    if (!usuarioActivo?.validado) {
      router.push(`/`, { shallow: true });
    }
  }, [usuarioActivo]);

  useEffect(() => {
    if (screenSize?.width > 640) {
      setAbrirPanel(true);
    } else {
      setAbrirPanel(false);
    }
  }, [screenSize]);

  // **Sincronizar URL antes de la vista**
  useEffect(() => {
    const subRuta = pathname.split("/").pop();

    if (
      !subRuta ||
      ["empleados", "director", "administrador", "master"].includes(subRuta)
    ) {
      if (vista !== "inicio") {
        router.push(`/dashboard/${subRuta || "empleados"}`, { shallow: true });
        setVista("inicio");
      }
    } else if (vista !== subRuta) {
      router.push(`/dashboard/${pathname.split("/")[2]}/${subRuta}`, {
        shallow: true,
      });
      setVista(subRuta);
    }
  }, [pathname]);

  // **Evitar redirecciones innecesarias**
  useEffect(() => {
    if (!userType) return;

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
      ],
    };

    const rutasPorDefecto = [
      null,
      "/dashboard/master",
      "/dashboard/administrador",
      "/dashboard/director",
      "/dashboard/empleados",
    ];
    const subRuta = pathname.split("/").pop();

    if (
      !permisos[userType]?.includes(subRuta) &&
      pathname !== rutasPorDefecto[userType]
    ) {
      router.replace(rutasPorDefecto[userType], { shallow: true });
    }
  }, [pathname, userType]);

  // **Función para cambiar la ruta correctamente**
  const cambiarRuta = (subRuta, nuevaVista, id_rol) => {
    let baseRuta = [
      null,
      "/dashboard/master",
      "/dashboard/administrador",
      "/dashboard/director",
      "/dashboard/empleados",
    ][id_rol];

    if (!baseRuta) {
      console.error("ID de rol inválido o no especificado.");
      return;
    }

    // **Primero cambiar la URL**
    router.push(`${baseRuta}/${subRuta || "inicio"}`, { shallow: true });

    // **Luego actualizar la vista después de que la URL cambie**
    setTimeout(() => {
      setVista(nuevaVista);
    }, 3000);
  };

  const abrirDashboar = () => setAbrirPanel(!abrirPanel);

  return (
    <>
      {usuarioActivo && (
        <div
          className={`flex flex-col ${
            abrirPanel ? "" : "container mx-auto px-2"
          }`}
        >
          <MenuLateralUsuario
            vista={vista}
            cambiarRuta={cambiarRuta}
            abrirPanel={abrirPanel}
          />

          <div
            className={`grid min-h-dvh grid-rows-[auto_1fr_auto] space-y-3 ${
              abrirPanel ? "ml-56 px-2" : "ml-0"
            } transition-all duration-500 ease-in-out`}
          >
            <header>
              <HeaderUsuarios
                abrirDashboar={abrirDashboar}
                abrirPanel={abrirPanel}
                vista={vista}
                cambiarRuta={cambiarRuta}
              />
            </header>

            <main className="bg-[#faf5f8] rounded-md">
              {vista === "usuarios" && <UsuariosView />}

              {vista === "paises" && <PaisesView />}

              {vista === "estados" && <EstadosView />}

              {vista === "municipios" && <MunicipiosView />}

              {vista === "parroquias" && <ParroquiasView />}

              {vista === "instituciones" && <InstitucionesView />}

              {vista === "departamentos" && <DepartamentosView />}

              {vista === "cargos" && <CargosView />}

              {/*
              {vista === "formaciones" && (
                <FormacionesForm
                  mostrar={mostrarModal}
                  abrirModal={abrirModal}
                  cerrarModal={cerrarModal}
                  mensaje={mensaje}
                  mostrarMensaje={mostrarMensaje}
                  abrirMensaje={abrirMensaje}
                  limpiarCampos={limpiarCampos}
                  ejecutarAccionesConRetraso={ejecutarAccionesConRetraso}
                  usuarioActivo={usuarioActivo}
                />
              )}

              {vista === "participantes" && (
                <ParticipantesForm
                  mostrar={mostrarModal}
                  abrirModal={abrirModal}
                  cerrarModal={cerrarModal}
                  mensaje={mensaje}
                  mostrarMensaje={mostrarMensaje}
                  abrirMensaje={abrirMensaje}
                  limpiarCampos={limpiarCampos}
                  ejecutarAccionesConRetraso={ejecutarAccionesConRetraso}
                  usuarioActivo={usuarioActivo}
                />
              )}

              {vista === "comunas" && (
                <ComunasForm
                  mostrar={mostrarModal}
                  abrirModal={abrirModal}
                  cerrarModal={cerrarModal}
                  mensaje={mensaje}
                  mostrarMensaje={mostrarMensaje}
                  abrirMensaje={abrirMensaje}
                  limpiarCampos={limpiarCampos}
                  ejecutarAccionesConRetraso={ejecutarAccionesConRetraso}
                  usuarioActivo={usuarioActivo}
                />
              )}

              {vista === "circuitos-comunales" && (
                <CircuitoForm
                  mostrar={mostrarModal}
                  abrirModal={abrirModal}
                  cerrarModal={cerrarModal}
                  mensaje={mensaje}
                  mostrarMensaje={mostrarMensaje}
                  abrirMensaje={abrirMensaje}
                  limpiarCampos={limpiarCampos}
                  ejecutarAccionesConRetraso={ejecutarAccionesConRetraso}
                  usuarioActivo={usuarioActivo}
                />
              )}

              {vista === "consejos-comunales" && (
                <ConsejoForm
                  mostrar={mostrarModal}
                  abrirModal={abrirModal}
                  cerrarModal={cerrarModal}
                  mensaje={mensaje}
                  mostrarMensaje={mostrarMensaje}
                  abrirMensaje={abrirMensaje}
                  limpiarCampos={limpiarCampos}
                  ejecutarAccionesConRetraso={ejecutarAccionesConRetraso}
                  usuarioActivo={usuarioActivo}
                />
              )}

              {vista === "voceros" && (
                <VoceroForm
                  mostrar={mostrarModal}
                  abrirModal={abrirModal}
                  cerrarModal={cerrarModal}
                  mensaje={mensaje}
                  mostrarMensaje={mostrarMensaje}
                  abrirMensaje={abrirMensaje}
                  limpiarCampos={limpiarCampos}
                  ejecutarAccionesConRetraso={ejecutarAccionesConRetraso}
                  usuarioActivo={usuarioActivo}
                />
              )} 

              {vista === "perfil" && (
                <MostrarPerfilUsuario
                  mostrar={mostrarModal}
                  abrirModal={abrirModal}
                  cerrarModal={cerrarModal}
                  mensaje={mensaje}
                  mostrarMensaje={mostrarMensaje}
                  abrirMensaje={abrirMensaje}
                  limpiarCampos={limpiarCampos}
                  ejecutarAccionesConRetraso={ejecutarAccionesConRetraso}
                  usuarioActivo={usuarioActivo}
                />
              )}

              {vista === "cambiar-clave" && (
                <MostrarCambiarClaveUsuario
                  mostrar={mostrarModal}
                  abrirModal={abrirModal}
                  cerrarModal={cerrarModal}
                  mensaje={mensaje}
                  mostrarMensaje={mostrarMensaje}
                  abrirMensaje={abrirMensaje}
                  limpiarCampos={limpiarCampos}
                  ejecutarAccionesConRetraso={ejecutarAccionesConRetraso}
                  usuarioActivo={usuarioActivo}
                />
              )}

              {vista === "novedades" && (
                <NovedadesForm
                  mostrar={mostrarModal}
                  abrirModal={abrirModal}
                  cerrarModal={cerrarModal}
                  mensaje={mensaje}
                  mostrarMensaje={mostrarMensaje}
                  abrirMensaje={abrirMensaje}
                  limpiarCampos={limpiarCampos}
                  ejecutarAccionesConRetraso={ejecutarAccionesConRetraso}
                  usuarioActivo={usuarioActivo}
                />
              )}*/}
            </main>

            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
