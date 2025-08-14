"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/app/context/AuthContext";
import MenuLateralUsuario from "@/components/sistema/MenuLateralUsuarios";
import HeaderUsuarios from "@/components/sistema/HeaderUsuarios";
import Footer from "../Footer";
import MostrarPerfilUsuario from "./MostrarPerfilUsuario";
import MostrarCambiarClaveUsuario from "./MostrarCambiarClaveUsuario";
import ParroquiasForm from "../opciones/ParroquiasForm";
import CargosForm from "../opciones/CargosForm";
import ComunasForm from "../opciones/ComunasForm";
import CircuitoForm from "../opciones/CircuitosForm";
import ConsejoForm from "../opciones/ConsejoForm";
import VoceroForm from "../opciones/VoceroForm";
//import MostrarAlInicioUsuarios from "./MostrarInicioUsuarios";
import FormacionesForm from "../opciones/FormacionesForm";
import ParticipantesForm from "../opciones/ParticipantesForm";
import UsuariosForm from "../opciones/UsuariosForm";
import OacDepartamento from "../departamentos/Oac";
import DepartamentosForm from "../opciones/DepartamentosForm";
import PaisesForm from "../opciones/PaisForm";
import EstadosForm from "../opciones/EstadoForm";
import MunicipiosForm from "../opciones/MunicipioForm";

export default function VistaUniversalUsuarios({ children }) {
  const {
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
  } = useUser();

  const [vista, setVista] = useState("");
  const [cargandoVista, setCargandoVista] = useState(false);
  const [abrirPanel, setAbrirPanel] = useState(true);

  const [vistaCargando, setVistaCargando] = useState("");

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
              nombreDepartamento={departamento?.nombre}
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
                  {vista === "usuarios" && (
                    <UsuariosForm
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

                  {vista === "paises" && (
                    <PaisesForm
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

                  {vista === "estados" && (
                    <EstadosForm
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

                  {vista === "municipios" && (
                    <MunicipiosForm
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

                  {vista === "departamentos" && (
                    <DepartamentosForm
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
                      usuarioActivo={usuarioActivo}
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
                      usuarioActivo={usuarioActivo}
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

                  {vista === "oac" &&
                    (departamento?.nombre === "oac" ||
                      usuarioActivo?.id_rol === 1) && (
                      <OacDepartamento
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
