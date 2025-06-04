"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import Titulos from "../Titulos";
import ToggleMenuLateral from "./ToggleMenuLateral";
import EnlacesBarraLateral from "./EnlacesBarraLateral";

export default function HeaderUsuarios({
  abrirDashboar,
  abrirPanel,
  usuarioActivo,
  cambiarRuta,
  vista,
  id_rol,
  toggleMenu,
  menuOpcionesUsuario,
  setMenuOpcionesUsuario,
  menuNotificaciones,
  setMenuNotificaciones,
  setAbrirModalCarpetas,
  refMenuPerfil,
  refMenuNotificaciones,
  volverInicio,
}) {
  const router = useRouter();

  // Alternar menú de opciones de usuario
  const toggleMenuOpcionesUsuario = () =>
    toggleMenu(setMenuOpcionesUsuario, [
      setMenuNotificaciones,
      setAbrirModalCarpetas,
    ]);

  const toggleMenuNotificaciones = () =>
    toggleMenu(setMenuNotificaciones, [
      setMenuOpcionesUsuario,
      setAbrirModalCarpetas,
    ]);

  const cerrarSesion = async () => {
    try {
      const response = await axios.get(`/api/login`);

      if (response?.data?.status === "ok") {
        // localStorage.removeItem("rutaCarpeta");
        // localStorage.removeItem("carpetaActual");
        // localStorage.removeItem("historialRutas");
        router.push("/", { shallow: true });
      }
    } catch (error) {
      console.error("Error, no se pudo cerrar sesion:", error);
    }
  };

  return (
    <>
      <section className="bg-white rounded-md p-2 flex justify-between items-center mt-2">
        <div className={`flex items-center space-x-2 w-1/2`}>
          <ToggleMenuLateral
            abrirDashboar={abrirDashboar}
            abrirPanel={abrirPanel}
          />

          <div className={`${abrirPanel ? "hidden sm:flex" : "flex"}`}>
            <Titulos indice={5} titulo={"Gestión de comunas"} />
          </div>
        </div>

        <div
          className={`${
            abrirPanel ? "hidden sm:flex " : "flex"
          } space-x-5 items-center justify-end w-1/2`}
        >
          <div
            onClick={toggleMenuNotificaciones}
            className="borde-fondo cursor-pointer p-1 rounded-full hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="#082158"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12 2C16.9706 2 21 6.04348 21 11.0314V20H3V11.0314C3 6.04348 7.02944 2 12 2ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"></path>
            </svg>

            {menuNotificaciones && (
              <div
                ref={refMenuNotificaciones}
                className="absolute w-48 top-0 mt-14 me-20 right-0 bg-white border border-gray-300 rounded-md shadow-lg p-2 z-50"
              >
                <ul>
                  <li className="rounded-md py-2 text-center hover:bg-gray-200 hover:font-semibold">
                    Usuario: uno
                  </li>
                  <li className="rounded-md py-2 text-center hover:bg-gray-200 hover:font-semibold">
                    Usuario: dos
                  </li>
                  <li className="rounded-md py-2 text-center hover:bg-gray-200 hover:font-semibold">
                    Usuario: tres
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div
            onClick={toggleMenuOpcionesUsuario}
            className="relative flex items-center space-x-2 cursor-pointer"
          >
            <div className="borde-fondo p-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="#082158"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path>
              </svg>
            </div>

            {/* Nombre del usuario */}
            <span>{usuarioActivo && usuarioActivo.nombre}</span>

            {menuOpcionesUsuario && (
              <div
                ref={refMenuPerfil}
                className="absolute w-48 top-0 mt-8 right-0 bg-white border border-gray-300 rounded-md shadow-lg p-2 z-50"
              >
                <ul>
                  <li className="">
                    <EnlacesBarraLateral
                      id_rol={id_rol}
                      cambiarRuta={cambiarRuta}
                      vista={vista}
                      vistaActual={"perfil"}
                      nombre={"Perfil"}
                      volverInicio={volverInicio}
                    />
                  </li>
                  <li className="">
                    <EnlacesBarraLateral
                      id_rol={id_rol}
                      cambiarRuta={cambiarRuta}
                      vista={vista}
                      vistaActual={"cambiar-clave"}
                      nombre={"Cambiar clave"}
                      volverInicio={volverInicio}
                    />
                  </li>
                  <li
                    className="px-4 py-2 text-center hover:bg-red-400 hover:text-black hover:rounded-md hover:font-semibold cursor-pointer text-red-500"
                    onClick={cerrarSesion}
                  >
                    Salir
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
