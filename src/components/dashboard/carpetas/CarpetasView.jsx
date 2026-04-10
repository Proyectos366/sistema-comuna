"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";
import FichaDetalles from "@/components/FichaDetalles";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoCarpetas from "@/components/dashboard/carpetas/components/ListadoCarpetas";
import ModalCarpetas from "@/components/dashboard/carpetas/components/ModalCarpetas";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchCarpetasIdEstante } from "@/store/features/carpetas/thunks/carpetasIdEstante";

export default function CarpetasView({ cambiarRuta, vista }) {
  const dispatch = useDispatch();

  //const { usuarioActivo } = useSelector((state) => state.auth);
  const { carpetas, loading } = useSelector((state) => state.carpetas);
  const { idEstante, nombre, nivel, seccion } = useSelector(
    (state) => state.estantes.estanteActual,
  );

  //console.log(idEstante, nombre, nivel, seccion);
  

  useEffect(() => {
    dispatch(fetchCarpetasIdEstante(idEstante));
    setNombreEstante(nombre);
  }, [dispatch, idEstante]);

  const [nombreCarpeta, setNombreCarpeta] = useState("");
  const [descripcionCarpeta, setDescripcionCarpeta] = useState("");
  const [aliasCarpeta, setAliasCarpeta] = useState("");
  const [nivelCarpeta, setNivelCarpeta] = useState("");
  const [seccionCarpeta, setSeccionCarpeta] = useState("");
  const [cabeceraCarpeta, setCabeceraCarpeta] = useState("");
  const [opcion, setOpcion] = useState("crear");

  const [nombreEstante, setNombreEstante] = useState("");
  const [borradoRestauradoCarpeta, setBorradoRestauradoCarpeta] = useState("");
  const [idCarpeta, setIdCarpeta] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreCarpeta, setValidarNombreCarpeta] = useState(false);
  const [validarAliasCarpeta, setValidarAliasCarpeta] = useState(false);
  const [validarnivelCarpeta, setValidarnivelCarpeta] = useState(false);
  const [validarSeccionCarpeta, setValidarSeccionCarpeta] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdCarpeta: setIdCarpeta,
    setNombre: setNombreCarpeta,
    setDescripcion: setDescripcionCarpeta,
    setAlias: setAliasCarpeta,
    setNivel: setNivelCarpeta,
    setSeccion: setSeccionCarpeta,
    setCabecera: setCabeceraCarpeta,
    setBorradoRestaurado: setBorradoRestauradoCarpeta,
    setOpcion: setOpcion,
  };

  const datosCarpeta = {
    idCarpeta: idCarpeta,
    idEstante: idEstante,
    nombre: nombreCarpeta,
    descripcion: descripcionCarpeta,
    alias: aliasCarpeta,
    nivel: nivelCarpeta,
    seccion: seccionCarpeta,
    cabecera: cabeceraCarpeta,
    borradoRestaurado: borradoRestauradoCarpeta,
    opcion: opcion,
    nombreEstante: nombreEstante,
    nivelEstante: nivel,
    seccionEstante: seccion
  };

  const validaciones = {
    validarNombre: validarNombreCarpeta,
    setValidarNombre: setValidarNombreCarpeta,
    validarAlias: validarAliasCarpeta,
    setValidarAlias: setValidarAliasCarpeta,
    validarniveles: validarnivelCarpeta,
    setValidarniveles: setValidarnivelCarpeta,
    validarSecciones: validarSeccionCarpeta,
    setValidarSecciones: setValidarSeccionCarpeta,
  };

  const carpetasFiltradasOrdenadas = useMemo(() => {
    return filtrarOrdenar(
      carpetas,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [carpetas, busqueda, ordenCampo, ordenDireccion]);

  const carpetasPaginadas = useMemo(() => {
    return carpetasFiltradasOrdenadas.slice(first, first + rows);
  }, [carpetasFiltradasOrdenadas, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarCarpeta = (carpeta) => {
    setIdCarpeta(carpeta.id);
    setNombreCarpeta(carpeta.nombre);
    setDescripcionCarpeta(carpeta.descripcion);
    setNivelCarpeta(carpeta.nivel);
    setSeccionCarpeta(carpeta.seccion);
    setCabeceraCarpeta(carpeta.cabecera);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalCarpetas
        acciones={acciones}
        datosCarpeta={datosCarpeta}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión carpetas"}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          {carpetas.length !== 0 && (
            <BuscadorOrdenador
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              ordenCampo={ordenCampo}
              setOrdenCampo={setOrdenCampo}
              ordenDireccion={ordenDireccion}
              setOrdenDireccion={setOrdenDireccion}
              opcionesOrden={opcionesOrden}
            />
          )}

          <Div className={`flex flex-col gap-2`}>
            {carpetas?.length === 0 && loading ? (
              <Loader titulo="Cargando carpetas..." />
            ) : (
              <>
                {carpetasPaginadas?.length !== 0 ? (
                  carpetasPaginadas.map((carpeta, index) => {
                    return (
                      <FichaDetalles
                        key={carpeta.id}
                        dato={carpeta}
                        index={index}
                      >
                        <ButtonToggleDetalles
                          expanded={expanded}
                          dato={carpeta}
                          setExpanded={setExpanded}
                        />

                        {expanded === carpeta.id && (
                          <ListadoCarpetas
                            carpeta={carpeta}
                            editarCarpeta={editarCarpeta}
                            setOpcion={setOpcion}
                            setIdCarpeta={setIdCarpeta}
                            setBorradoRestaurado={setBorradoRestauradoCarpeta}
                            cambiarRuta={cambiarRuta}
                            vista={vista}
                          />
                        )}
                      </FichaDetalles>
                    );
                  })
                ) : (
                  <EstadoMsjVacio dato={carpetas} loading={loading} />
                )}
              </>
            )}
          </Div>

          <Div>
            <Paginador
              first={first}
              setFirst={setFirst}
              rows={rows}
              setRows={setRows}
              totalRecords={carpetasFiltradasOrdenadas.length}
            />
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}

/** 
import React from "react";
import { useSelector } from "react-redux";

export default function CarpetasView() {
  const { id, nombre, nivel, seccion } = useSelector(
    (state) => state.carpetas.estanteActual,
  );

  console.log(id, nombre, nivel, seccion);

  return <div>CarpetasView</div>;
}
*/
