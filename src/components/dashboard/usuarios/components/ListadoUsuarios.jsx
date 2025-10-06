import { formatearFecha } from "@/utils/Fechas";
import { formatearCedula } from "@/utils/formatearCedula";
import ListaDetallesVocero from "../../../Listados/ListaDetalleVocero";
import SwitchToggle from "@/components/SwitchToggle";
import Button from "@/components/padres/Button";

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
  setEstado,
  setValidado,
  setNombreRol,
  setOpcion,
  cambiarUsuarioAcceso,
  eliminarRestaurarUsuario,
}) {
  return (
    <div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <ListaDetallesVocero
        indice={1}
        nombre={"Cédula"}
        valor={formatearCedula(usuario.cedula)}
      />

      <ListaDetallesVocero
        indice={1}
        nombre={"Correo"}
        valor={usuario.correo}
      />

      <div className="flex items-center justify-between">
        <ListaDetallesVocero
          indice={1}
          nombre={"Departamento"}
          valor={departamentoActual?.nombre}
        />

        <div className="flex items-center justify-between">
          {departamentoActual?.nombre ? (
            <>
              <button
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
                <span className="hidden sm:block">Cambiar</span>
                <div className="sm:hidden w-6 h-6 flex items-center justify-center">
                  <img className="w-6 h-5" src="/img/editar.png" alt="" />
                </div>
              </button>
            </>
          ) : (
            <button
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
              <span className="hidden sm:block">Asignar</span>
              <div className="sm:hidden w-6 h-6 flex items-center justify-center">
                <img className="w-6 h-5" src="/img/editar.png" alt="" />
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ListaDetallesVocero
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

        <button
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
          <span className="hidden sm:block">Cambiar</span>
          <div className="sm:hidden w-6 h-6 flex items-center justify-center">
            <img className="w-6 h-5" src="/img/editar.png" alt="" />
          </div>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <ListaDetallesVocero
          indice={4}
          nombre={"Estado"}
          valor={usuario.borrado}
        />

        <SwitchToggle
          checked={!usuario.borrado}
          onToggle={() => {
            eliminarRestaurarUsuario(usuario.borrado, usuario.id);
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <ListaDetallesVocero
          indice={5}
          nombre={"Autorizado"}
          valor={usuario.validado}
        />

        <SwitchToggle
          checked={usuario.validado}
          onToggle={() => {
            cambiarUsuarioAcceso(usuario.validado, usuario.id);
          }}
        />
      </div>

      <ListaDetallesVocero
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(usuario.createdAt)}
      />
    </div>
  );
}
