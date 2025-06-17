"use client";

import { useState, useEffect, useRef } from "react";
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
import CircuitoForm from "../opciones/CircuitosForm";
import ConsejoForm from "../opciones/ConsejoForm";
import VoceroForm from "../opciones/VoceroForm";
import MostrarAlInicioUsuarios from "./MostrarInicioUsuarios";
import FormacionesForm from "../opciones/FormacionesForm";
import ParticipantesForm from "../opciones/ParticipantesForm";

export default function VistaUniversalUsuarios({ children }) {
  const {
    usuarioActivo,
    screenSize,
    mostrarModal,
    abrirModal,
    cerrarModal,
    mensaje,
    mostrarMensaje,
    abrirMensaje,
    limpiarCampos,
    ejecutarAccionesConRetraso,
  } = useUser();

  const [vista, setVista] = useState("");
  const [cargandoVista, setCargandoVista] = useState(false);
  const [abrirPanel, setAbrirPanel] = useState(true);

  const [vistaCargando, setVistaCargando] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const userType = usuarioActivo?.id_rol;

  useEffect(() => {
    setAbrirPanel(screenSize?.width > 640);
  }, [screenSize]);

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

    setCargandoVista(true);
    setVistaCargando(nuevaVista);

    // **Primero cambiar la URL**
    router.push(`${baseRuta}/${subRuta || "inicio"}`, { shallow: true });

    // **Luego actualizar la vista después de que la URL cambie**
    setTimeout(() => {
      setVista(nuevaVista);
      setCargandoVista(false);
    }, 3000);
  };

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
        "parroquias",
        "comunas",
        "consejos-comunales",
        "usuarios",
        "circuitos-comunales",
        "cargos",
        "modulos",
        "formaciones",
        "participantes",
        "voceros",
        "perfil",
        "cambiar-clave",
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
        "voceros",
        "perfil",
        "cambiar-clave",
      ],
      3: [
        "consejos-comunales",
        "circuitos-comunales",
        "cargos",
        "participantes",
        "voceros",
        "perfil",
        "cambiar-clave",
      ],
      4: [
        "consejos-comunales",
        "circuitos-comunales",
        "cargos",
        "voceros",
        "perfil",
        "cambiar-clave",
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

  const abrirDashboar = () => setAbrirPanel(!abrirPanel);

  return (
    <>
      {usuarioActivo && (
        <div
          className={`flex flex-col ${
            abrirPanel ? "" : "container mx-auto px-2"
          }`}
        >
          <div
            className={`fixed inset-y-0 left-0 transform ${
              abrirPanel ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-500 ease-in-out w-48 z-30`}
          >
            <MenuLateralUsuario
              vista={vista}
              cambiarRuta={cambiarRuta}
              abrirPanel={abrirPanel}
              id_rol={usuarioActivo.id_rol}
            />
          </div>

          <div
            className={`grid min-h-dvh grid-rows-[auto_1fr_auto] space-y-3 ${
              abrirPanel ? "ml-48 px-2" : "ml-0"
            } transition-all duration-500 ease-in-out`}
          >
            <header>
              <HeaderUsuarios
                abrirDashboar={abrirDashboar}
                abrirPanel={abrirPanel}
                usuarioActivo={usuarioActivo}
                vista={vista}
                cambiarRuta={cambiarRuta}
              />
            </header>

            <main className="bg-[#faf5f8] rounded-md">
              {cargandoVista ? (
                <p className="text-center text-gray-600 text-xl">
                  Cargando vista {vistaCargando}...
                </p>
              ) : (
                <>
                  {vista === "parroquias" && (
                    <ParroquiasForm
                      mostrar={mostrarModal}
                      abrirModal={abrirModal}
                      cerrarModal={cerrarModal}
                      mensaje={mensaje}
                      mostrarMensaje={mostrarMensaje}
                      abrirMensaje={abrirMensaje}
                      limpiarCampos={limpiarCampos}
                      ejecutarAccionesConRetraso={ejecutarAccionesConRetraso}
                    />
                  )}
                  {vista === "cargos" && (
                    <CargosForm
                      mostrar={mostrarModal}
                      abrirModal={abrirModal}
                      cerrarModal={cerrarModal}
                      mensaje={mensaje}
                      mostrarMensaje={mostrarMensaje}
                      abrirMensaje={abrirMensaje}
                      limpiarCampos={limpiarCampos}
                      ejecutarAccionesConRetraso={ejecutarAccionesConRetraso}
                    />
                  )}

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
                    />
                  )}
                  {vista === "perfil" && (
                    <MostrarPerfilUsuario abrirPanel={abrirPanel} />
                  )}
                  {vista === "cambiar-clave" && (
                    <MostrarCambiarClaveUsuario abrirPanel={abrirPanel} />
                  )}
                </>
              )}
            </main>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
