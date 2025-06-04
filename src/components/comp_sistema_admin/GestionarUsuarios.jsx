import Titulos from "../Titulos";
import { useAdministrarUsuarios } from "@/app/context/GestionarUsuariosContext";

export default function GestionarUsuarios({ abrirPanel }) {
  const { usuariosActivos } = useAdministrarUsuarios();
  return (
    <div className={`mb-3 ${abrirPanel ? "hidden sm:flex" : "flex flex-col"} `}>
      <div className="mb-3 w-full flex flex-col">
        <Titulos indice={2} titulo={"Gestionar usuarios"} />

        <div className="border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 p-2 text-center">#</th>
                  <th className="border border-gray-300 p-2 text-left">
                    Nombre
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Cedula
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Correo
                  </th>
                  <th className="border border-gray-300 p-2 text-center">
                    Departamento
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Estado
                  </th>
                  <th className="border border-gray-300 p-2 text-center">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuariosActivos &&
                  usuariosActivos.map((usuario, index) => {
                    const departamento =
                      usuario.departamentos && usuario.departamentos.length > 0
                        ? usuario.departamentos[0].nombre
                        : "Sin asignar";

                    //Aqui debemos mostrar tambien el departamento que pertenece ese usuario

                    return (
                      <tr key={usuario.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 p-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 p-2 text-left">
                          {usuario.nombre}
                        </td>
                        <td className="border border-gray-300 p-2 text-left">
                          {usuario.cedula}
                        </td>
                        <td className="border border-gray-300 p-2 text-left">
                          {usuario.correo}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {departamento}
                        </td>
                        <td className="border border-gray-300 p-2 text-left">
                          {usuario.borrado ? "Inactivo" : "Activo"}
                        </td>
                        <td className="border border-gray-300 p-2 text-center space-x-2">
                          <button
                            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                            onClick={() => editarUsuario(usuario.id)}
                          >
                            <img
                              className="inline-block w-5 h-5"
                              src="ruta/iconos/editar.png"
                              alt="Editar"
                            />
                          </button>
                          <button
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                            onClick={() => eliminarUsuario(usuario.id)}
                          >
                            <img
                              className="inline-block w-5 h-5"
                              src="ruta/iconos/eliminar.png"
                              alt="Eliminar"
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
