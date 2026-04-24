import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import Button from "@/components/padres/Button";
import Span from "@/components/padres/Span";
import BloqueInfo from "@/components/BloqueInfo";
import EnlacesBarraLateral from "@/components/dashboard/Inicio/EnlacesBarraLateral";

import { formatearFecha } from "@/utils/Fechas";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { setArchivoActual } from "@/store/features/archivos/archivosSlices";

export default function ListadoArchivos({
  archivo,
  editarArchivo,
  setOpcion,
  setIdArchivo,
  setBorradoRestaurado,
  cambiarRuta,
  vista,
}) {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <Div className="flex items-center justify-between gap-2">
        <BloqueInfo
          indice={1}
          nombre={"Descripción"}
          valor={archivo.descripcion}
        />

        <Button
          title="Editar"
          onClick={() => {
            editarArchivo(archivo);
          }}
          className="p-1 sm:px-4 sm:py-1 sm:min-w-28 rounded-md bg-[#082158]  text-white shadow-md hover:scale-105 transition cursor-pointer"
        >
          <Span className="hidden sm:block">Actualizar</Span>
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

      <BloqueInfo indice={1} nombre={"Alias"} valor={archivo.alias} />
      <BloqueInfo indice={1} nombre={"Código"} valor={archivo.codigo} />

      {/* <BloqueInfo
        indice={1}
        nombre={"Archivos"}
        valor={archivo._count?.archivos}
      />

      <BloqueInfo
        indice={1}
        nombre={"Tamaño total"}
        valor={archivo.pesoTotalArchivos}
      /> */}

      <Div className="flex items-center justify-between">
        <BloqueInfo
          indice={!archivo.borrado ? 3 : 2}
          nombre={"archivo"}
          valor={!archivo.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!archivo.borrado}
          onToggle={() => {
            setOpcion("eliminar");
            setIdArchivo(archivo.id);
            setBorradoRestaurado(archivo.borrado);
            dispatch(abrirModal("confirmarEliminarRestaurar"));
          }}
        />
      </Div>

      <BloqueInfo
        indice={1}
        nombre={"Creada"}
        valor={formatearFecha(archivo.createdAt)}
      />

      {!archivo.borrado && (
        <Div
          onClick={() => {
            dispatch(
              setArchivoActual({
                idarchivo: archivo.id,
                nombre: archivo.nombre,
                nivel: archivo.nivel,
                seccion: archivo.seccion,
              }),
            );
          }}
        >
          <EnlacesBarraLateral
            id_rol={usuarioActivo.id_rol}
            cambiarRuta={cambiarRuta}
            vista={vista}
            vistaActual={"archivos"}
            nombre={"Abrir archivo"}
            indice={1}
          />
        </Div>
      )}
    </Div>
  );
}
