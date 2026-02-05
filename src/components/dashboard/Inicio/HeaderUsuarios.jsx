"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import Titulos from "@/components/Titulos";
import ButtonToggleMenuLateral from "@/components/dashboard/Inicio/ToggleMenuLateral";
import EnlacesBarraLateral from "@/components/dashboard/Inicio/EnlacesBarraLateral";

import Header from "@/components/padres/Header";
import Div from "@/components/padres/Div";
import Span from "@/components/padres/Span";
import Ul from "@/components/padres/Ul";
import Li from "@/components/padres/Li";

import { cerrarSesion } from "@/store/features/auth/thunks/cerrarSesion";

export default function HeaderUsuarios({
  abrirDashboar,
  abrirPanel,
  cambiarRuta,
  vista,
  screenSize,
}) {
  const { usuarioActivo } = useSelector((state) => state.auth);

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

  const dispatch = useDispatch();

  const handleCerrarSesion = async () => {
    try {
      await dispatch(cerrarSesion()).unwrap();
      router.push("/", { shallow: true });
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  return (
    <Header className="bg-[#ffffff] rounded-md p-2 flex justify-between items-center mt-2">
      <Div className={`flex items-center gap-2 w-1/2`}>
        <ButtonToggleMenuLateral
          abrirDashboar={abrirDashboar}
          abrirPanel={abrirPanel}
        />

        <Div className={`${abrirPanel ? "hidden sm:flex" : "flex"}`}>
          <Titulos
            indice={5}
            titulo={
              screenSize.width >= 640
                ? "Gestión Contraloria Municipio Zamora"
                : "Gestión CMZ"
            }
          />
        </Div>
      </Div>

      <Div
        className={`${
          abrirPanel ? "hidden sm:flex" : "flex"
        } items-center justify-end w-1/2`}
      >
        <Div
          onClick={() => setMenuOpcionesUsuario(!menuOpcionesUsuario)}
          className="relative py-1 cursor-pointer transition-all transform group"
        >
          <Div
            className={`${
              menuOpcionesUsuario ? "bg-[#E61C45]" : "bg-[#082158]"
            } flex items-center gap-4 px-2 py-1 rounded-md shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            <Div className="p-2 rounded-full bg-[#ffffff]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="#082158"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" />
              </svg>
            </Div>

            <Span className="text-[#ffffff] text-md tracking-wide drop-shadow-md truncate text-end uppercase">
              {usuarioActivo?.nombre}
            </Span>
          </Div>

          {menuOpcionesUsuario && (
            <Div
              ref={refMenuPerfil}
              className="absolute w-48 top-0 mt-12 right-0 bg-[#ffffff] border border-[#d1d5dc] rounded-md shadow-lg p-2 z-50"
            >
              <Ul className="flex flex-col gap-2">
                <Li onClick={() => setMenuOpcionesUsuario(false)}>
                  <EnlacesBarraLateral
                    id_rol={usuarioActivo.id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"perfil"}
                    nombre={"Perfil"}
                  />
                </Li>
                <Li onClick={() => setMenuOpcionesUsuario(false)}>
                  <EnlacesBarraLateral
                    id_rol={usuarioActivo.id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"cambiar-clave"}
                    nombre={"Cambiar clave"}
                  />
                </Li>
                <Li
                  className="px-4 py-1 text-center hover:bg-[#E61C45] hover:text-[#ffffff] hover:rounded-md hover:font-semibold cursor-pointer text-[#ee113d]"
                  onClick={() => {
                    handleCerrarSesion();
                    setMenuOpcionesUsuario(false);
                  }}
                >
                  Salir
                </Li>
              </Ul>
            </Div>
          )}
        </Div>
      </Div>
    </Header>
  );
}
