import { formatearFecha } from "@/utils/Fechas";
import { formatearCedula } from "@/utils/formatearCedula";
import ListaDetallesVocero from "./ListaDetalleVocero";

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
}) {
  return (
    <div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <ListaDetallesVocero
        indice={1}
        nombre={"Cédula"}
        valor={formatearCedula(usuario.cedula)}
      />

      <div className="flex items-center justify-between gap-2">
        <ListaDetallesVocero
          indice={1}
          nombre={"Departamento"}
          valor={departamentoActual?.nombre}
        />

        <div className="flex items-center justify-between gap-2">
          {departamentoActual?.nombre ? (
            <>
              <button
                title="Cambiar departamento"
                onClick={() => {
                  abrirModal();
                  setAccion("cambiarDepartamento");
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

      <ListaDetallesVocero
        indice={1}
        nombre={"Correo"}
        valor={usuario.correo}
      />

      <div className="flex items-center justify-between gap-2">
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

      <div className="flex items-center justify-between gap-2">
        <ListaDetallesVocero
          indice={4}
          nombre={"Estado"}
          valor={usuario.borrado}
        />

        <button
          title="Cambiar estado"
          onClick={() => {
            abrirModal();
            setAccion("cambiarEstado");
            setEstado(usuario.borrado);
            setNombreUsuario(usuario.nombre);
            setIdUsuario(usuario.id);
          }}
          className={`p-1 sm:px-4 sm:py-1 sm:min-w-28 rounded-md ${
            usuario.borrado ? "bg-[#E61C45]" : "bg-[#082158]"
          } text-white shadow-md hover:scale-105 transition cursor-pointer`}
        >
          <span className="hidden sm:block">
            {usuario.borrado ? "Habilitar" : "Deshabilitar"}
          </span>
          <div className="sm:hidden w-6 h-6 flex items-center justify-center">
            <img className="w-6 h-5" src="/img/editar.png" alt="" />
          </div>
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <ListaDetallesVocero
          indice={5}
          nombre={"Autorizado"}
          valor={usuario.validado}
        />

        <button
          title="Autorizar"
          onClick={() => {
            abrirModal();
            setAccion("cambiarAutorizacion");
            setValidado(usuario.validado);
            setNombreUsuario(usuario.nombre);
            setIdUsuario(usuario.id);
          }}
          className={`p-1 sm:px-4 sm:py-1 sm:min-w-28 rounded-md ${
            !usuario.validado ? "bg-[#E61C45]" : "bg-[#082158]"
          } text-white shadow-md hover:scale-105 transition cursor-pointer`}
        >
          <span className="hidden sm:block">
            {!usuario.validado ? "Autorizar" : "Restringir"}
          </span>
          <div className="sm:hidden w-6 h-6 flex items-center justify-center">
            <img className="w-6 h-5" src="/img/editar.png" alt="" />
          </div>
        </button>
      </div>

      <ListaDetallesVocero
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(usuario.createdAt)}
      />
    </div>
  );
}
