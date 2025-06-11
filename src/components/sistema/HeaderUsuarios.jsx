"use client";

import { useState, useEffect, useRef } from "react";
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
}) {
  const router = useRouter();
  const [menuOpcionesUsuario, setMenuOpcionesUsuario] = useState(false); // Estado para la modal
  const refMenuPerfil = useRef(null);

  // Cierra la modal si se da clic fuera de ella
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        refMenuPerfil.current &&
        !refMenuPerfil.current.contains(event.target)
      ) {
        setMenuOpcionesUsuario(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cerrarSesion = async () => {
    try {
      const response = await axios.get(`/api/login`);

      if (response?.data?.status === "ok") {
        router.push("/", { shallow: true });
      }
    } catch (error) {
      console.error("Error, no se pudo cerrar sesión:", error);
    }
  };

  return (
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
          onClick={() => setMenuOpcionesUsuario(!menuOpcionesUsuario)}
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

          <span>{usuarioActivo?.nombre}</span>

          {menuOpcionesUsuario && (
            <div
              ref={refMenuPerfil}
              className="absolute w-48 top-0 mt-8 right-0 bg-white border border-gray-300 rounded-md shadow-lg p-2 z-50"
            >
              <ul>
                <li onClick={() => setMenuOpcionesUsuario(false)}>
                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"perfil"}
                    nombre={"Perfil"}
                  />
                </li>
                <li onClick={() => setMenuOpcionesUsuario(false)}>
                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"cambiar-clave"}
                    nombre={"Cambiar clave"}
                  />
                </li>
                <li
                  className="px-4 py-2 text-center hover:bg-red-400 hover:text-black hover:rounded-md hover:font-semibold cursor-pointer text-red-500"
                  onClick={() => {
                    cerrarSesion();
                    setMenuOpcionesUsuario(false);
                  }}
                >
                  Salir
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
