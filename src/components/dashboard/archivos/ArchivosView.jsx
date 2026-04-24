"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import FichaDetalles from "@/components/FichaDetalles";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoArchivos from "@/components/dashboard/archivos/components/ListadoArchivos";
import ModalArchivos from "@/components/dashboard/archivos/components/ModalArchivos";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";
import Titulos from "@/components/Titulos";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchArchivosIdCarpeta } from "@/store/features/archivos/thunks/archivosIdCarpeta";

export default function ArchivosView({ cambiarRuta, vista }) {
  const dispatch = useDispatch();

  //const { usuarioActivo } = useSelector((state) => state.auth);
  const { archivos, loading } = useSelector((state) => state.archivos);

  // Renombrar la propiedad 'nombre' de carpeta
  const { idCarpeta, nombre: nombre } = useSelector(
    (state) => state.carpetas.carpetaActual,
  );

  // Renombrar la propiedad 'nombre' de estante
  const { idEstante, nombre: nombreEstante } = useSelector(
    (state) => state.estantes.estanteActual,
  );

  console.log(nombreEstante, nombre);

  useEffect(() => {
    dispatch(fetchArchivosIdCarpeta(idCarpeta));
    setNombreCarpeta(nombre);
  }, [dispatch, idCarpeta]);

  const [archivo, setArchivo] = useState("");
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [descripcionArchivo, setDescripcionArchivo] = useState("");
  const [aliasArchivo, setAliasArchivo] = useState("");
  const [opcion, setOpcion] = useState("crear");

  const [nombreCarpeta, setNombreCarpeta] = useState("");
  const [borradoRestauradoArchivo, setBorradoRestauradoArchivo] = useState("");
  const [idArchivo, setIdArchivo] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreArchivo, setValidarNombreArchivo] = useState(false);
  const [validarAliasArchivo, setValidarAliasArchivo] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdArchivo: setIdArchivo,
    setNombre: setNombreArchivo,
    setDescripcion: setDescripcionArchivo,
    setAlias: setAliasArchivo,
    setBorradoRestaurado: setBorradoRestauradoArchivo,
    setOpcion: setOpcion,
  };

  const datosArchivo = {
    idCarpeta: idCarpeta,
    idArchivo: idArchivo,
    nombre: nombreArchivo,
    descripcion: descripcionArchivo,
    alias: aliasArchivo,
    borradoRestaurado: borradoRestauradoArchivo,
    opcion: opcion,
    nombreCarpeta: nombreCarpeta,
  };

  const validaciones = {
    validarNombre: validarNombreArchivo,
    setValidarNombre: setValidarNombreArchivo,
    validarAlias: validarAliasArchivo,
    setValidarAlias: setValidarAliasArchivo,
  };

  const archivosFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      archivos,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [archivos, busqueda, ordenCampo, ordenDireccion]);

  const archivosPaginados = useMemo(() => {
    return archivosFiltradosOrdenados.slice(first, first + rows);
  }, [archivosFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarArchivo = (carpeta) => {
    setIdArchivo(carpeta.id);
    setNombreArchivo(carpeta.nombre);
    setDescripcionArchivo(carpeta.descripcion);
    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalArchivos
        acciones={acciones}
        datosArchivo={datosArchivo}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión archivos"}
          first={first}
          setFirst={setFirst}
          rows={rows}
          setRows={setRows}
          datos={archivosFiltradosOrdenados}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          ordenCampo={ordenCampo}
          setOrdenCampo={setOrdenCampo}
          ordenDireccion={ordenDireccion}
          setOrdenDireccion={setOrdenDireccion}
          opcionesOrden={opcionesOrden}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          <Div className={`flex flex-col gap-2`}>
            {archivos?.length === 0 && loading ? (
              <Loader titulo="Cargando archivos..." />
            ) : (
              <>
                <Titulos
                  indice={6}
                  titulo={`${nombreEstante} / ${nombreCarpeta}`}
                  className={`text-center uppercase`}
                />

                {archivosPaginados?.length !== 0 ? (
                  archivosPaginados.map((archivo, index) => {
                    return (
                      <FichaDetalles
                        key={archivo.id}
                        dato={archivo}
                        index={index}
                      >
                        <ButtonToggleDetalles
                          expanded={expanded}
                          dato={archivo}
                          setExpanded={setExpanded}
                        />

                        {expanded === archivo.id && (
                          <ListadoArchivos
                            archivo={archivo}
                            editarArchivo={editarArchivo}
                            setOpcion={setOpcion}
                            setIdArchivo={setIdArchivo}
                            setBorradoRestaurado={setBorradoRestauradoArchivo}
                            cambiarRuta={cambiarRuta}
                            vista={vista}
                          />
                        )}
                      </FichaDetalles>
                    );
                  })
                ) : (
                  <EstadoMsjVacio dato={archivos} loading={loading} />
                )}
              </>
            )}
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
