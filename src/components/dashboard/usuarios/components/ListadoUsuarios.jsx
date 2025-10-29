import { formatearFecha } from "@/utils/Fechas";
import { formatearCedula } from "@/utils/formatearCedula";
import SwitchToggle from "@/components/SwitchToggle";
import Button from "@/components/padres/Button";
import Div from "@/components/padres/Div";
import Span from "@/components/padres/Span";
import Image from "next/image";
import BloqueInfoUsuario from "./BloqueInfoUsuario";
import { useDispatch } from "react-redux";
import { cambiarAccesoUsuario } from "@/store/features/usuarios/thunks/cambiarAccesoUsuario";
import { eliminarRestaurarUsuario } from "@/store/features/usuarios/thunks/eliminarRestaurarUsuario";

export default function ListadoUsuarios({
  usuario,
  departamentoActual,
  abrirModal,
  setAccion,
  setNombreUsuario,
  setNombreDepartamento,
  setIdDepartamento,
  setIdUsuario,
  setIdRol,
  setNombreRol,
  setOpcion,
}) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <BloqueInfoUsuario
        indice={1}
        nombre={"Cédula"}
        valor={formatearCedula(usuario.cedula)}
      />

      <BloqueInfoUsuario indice={1} nombre={"Correo"} valor={usuario.correo} />

      <Div className="flex items-center justify-between">
        <BloqueInfoUsuario
          indice={1}
          nombre={"Departamento"}
          valor={departamentoActual?.nombre}
        />

        <Div className="flex items-center justify-between">
          {departamentoActual?.nombre ? (
            <>
              <Button
                title="Cambiar departamento"
                onClick={() => {
                  abrirModal();
                  setAccion("cambiarDepartamento");
                  setOpcion("editar");
                  setNombreUsuario(usuario.nombre);
                  setNombreDepartamento(departamentoActual.nombre);
                  setIdDepartamento("");
                  setIdUsuario(usuario.id);
                }}
                className="p-1 sm:px-4 sm:py-1 sm:min-w-28 rounded-md bg-[#082158]  text-white shadow-md hover:scale-105 transition cursor-pointer"
              >
                <Span className="hidden sm:block">Cambiar</Span>
                <Div className="sm:hidden w-6 h-6 flex items-center justify-center">
                  <Image
                    width={24}
                    height={20}
                    src="/img/editar.png"
                    alt="Imagen del boton editar"
                  />
                </Div>
              </Button>
            </>
          ) : (
            <Button
              title="Asignar departamento"
              onClick={() => {
                abrirModal();
                setAccion("asignarDepartamento");
                setOpcion("editar");
                setNombreUsuario(usuario.nombre);
                setNombreDepartamento("");
                setIdDepartamento("");
                setIdUsuario(usuario.id);
              }}
              className="p-1 sm:px-4 sm:py-1 sm:min-w-28 rounded-md bg-[#2FA807] text-white shadow-md hover:scale-105 transition cursor-pointer"
            >
              <Span className="hidden sm:block">Asignar</Span>
              <Div className="sm:hidden w-6 h-6 flex items-center justify-center">
                <Image
                  width={24}
                  height={20}
                  src="/img/editar.png"
                  alt="Imagen del boton editar"
                />
              </Div>
            </Button>
          )}
        </Div>
      </Div>

      <Div className="flex items-center justify-between">
        <BloqueInfoUsuario
          indice={1}
          nombre={"Rol"}
          valor={
            usuario.id_rol === 2
              ? "Administrador"
              : usuario.id_rol === 3
              ? "Director"
              : usuario.id_rol === 4
              ? "Empleado"
              : "Sin rol asignado"
          }
        />

        <Button
          title="Cambiar rol"
          onClick={() => {
            abrirModal();
            setAccion("cambiarRol");
            setOpcion("editar");
            setNombreUsuario(usuario.nombre);
            setIdRol("");
            setNombreRol(usuario.roles.nombre);
            setIdUsuario(usuario.id);
          }}
          className="p-1 sm:px-4 sm:py-1 sm:min-w-28 rounded-md bg-[#082158] text-white shadow-md hover:scale-105 transition cursor-pointer"
        >
          <Span className="hidden sm:block">Cambiar</Span>
          <Div className="sm:hidden w-6 h-6 flex items-center justify-center">
            <Image
              width={24}
              height={20}
              src="/img/editar.png"
              alt="Imagen del boton editar"
            />
          </Div>
        </Button>
      </Div>

      <Div className="flex items-center justify-between">
        <BloqueInfoUsuario
          indice={!usuario.borrado ? 3 : 2}
          nombre={"Estado"}
          valor={!usuario.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!usuario.borrado}
          onToggle={() => {
            dispatch(
              eliminarRestaurarUsuario({
                estado: usuario.borrado,
                id_usuario: usuario.id,
              })
            );
          }}
        />
      </Div>

      <Div className="flex items-center justify-between">
        <BloqueInfoUsuario
          indice={usuario.validado ? 3 : 2}
          nombre={"Autorizado"}
          valor={usuario.validado ? "Si" : "No"}
        />

        <SwitchToggle
          checked={usuario.validado}
          onToggle={() => {
            dispatch(
              cambiarAccesoUsuario({
                validado: usuario.validado,
                idUsuario: usuario.id,
              })
            );
          }}
        />
      </Div>

      <BloqueInfoUsuario
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(usuario.createdAt)}
      />
    </Div>
  );
}
