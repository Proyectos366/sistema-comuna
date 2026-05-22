"use client";

import { useState, useEffect, useMemo } from "react";
import { BounceLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import FichaDetalles from "@/components/FichaDetalles";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoParroquias from "@/components/dashboard/parroquias/components/ListadoParroquias";
import ModalParroquias from "@/components/dashboard/parroquias/components/ModalParroquias";
import SelectOpcion from "@/components/SelectOpcion";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchEstadosIdPais } from "@/store/features/estados/thunks/estadosIdPais";
import { fetchMunicipiosIdEstado } from "@/store/features/municipios/thunks/municipiosIdEstado";
import { fetchParroquiasIdMunicipio } from "@/store/features/parroquias/thunks/parroquiasIdMunicipio";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";
import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";

export default function ParroquiasView() {
  const dispatch = useDispatch();
  const { paises } = useSelector((state) => state.paises);
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);
  const { parroquias, loading } = useSelector((state) => state.parroquias);

  useEffect(() => {
    dispatch(fetchPaises());
  }, [dispatch]);

  const [nombrePais, setNombrePais] = useState("");
  const [nombreEstado, setNombreEstado] = useState("");
  const [nombreMunicipio, setNombreMunicipio] = useState("");

  const [nombreParroquia, setNombreParroquia] = useState("");
  const [descripcionParroquia, setDescripcionParroquia] = useState("");

  const [idPais, setIdPais] = useState("");
  const [idEstado, setIdEstado] = useState("");
  const [idMunicipio, setIdMunicipio] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreParroquia, setValidarNombreParroquia] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenDireccion, setOrdenDireccion] = useState("asc");

  useEffect(() => {
    if (idPais) {
      dispatch(fetchEstadosIdPais(idPais));
    }
  }, [dispatch, idPais]);

  useEffect(() => {
    if (idEstado) {
      dispatch(fetchMunicipiosIdEstado(idEstado));
    }
  }, [dispatch, idEstado]);

  useEffect(() => {
    if (idMunicipio) {
      dispatch(fetchParroquiasIdMunicipio(idMunicipio));
    }
  }, [dispatch, idMunicipio]);

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdPais: setIdPais,
    setIdEstado: setIdEstado,
    setIdMunicipio: setIdMunicipio,
    setNombrePais: setNombrePais,
    setNombreEstado: setNombreEstado,
    setNombreMunicipio: setNombreMunicipio,
    setNombre: setNombreParroquia,
    setDescripcion: setDescripcionParroquia,
  };

  const datosParroquia = {
    idPais: idPais,
    idEstado: idEstado,
    idMunicipio: idMunicipio,
    nombrePais: nombrePais,
    nombreEstado: nombreEstado,
    nombreMunicipio: nombreMunicipio,
    nombre: nombreParroquia,
    descripcion: descripcionParroquia,
  };

  const validaciones = {
    validarNombre: validarNombreParroquia,
    setValidarNombre: setValidarNombreParroquia,
  };

  const parroquiasFiltradasOrdenadas = useMemo(() => {
    return filtrarOrdenar(
      parroquias,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [parroquias, busqueda, ordenCampo, ordenDireccion]);

  const parroquiasPaginados = useMemo(() => {
    return parroquiasFiltradasOrdenadas.slice(first, first + rows);
  }, [parroquiasFiltradasOrdenadas, first, rows]);

  const resetearValores = () => {
    setIdPais("");
    setIdEstado("");
    setIdMunicipio("");
  };

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  return (
    <>
      <ModalParroquias
        acciones={acciones}
        datosParroquia={datosParroquia}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión parroquias"}
          first={first}
          setFirst={setFirst}
          rows={rows}
          setRows={setRows}
          datos={parroquias}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          ordenCampo={ordenCampo}
          setOrdenCampo={setOrdenCampo}
          ordenDireccion={ordenDireccion}
          setOrdenDireccion={setOrdenDireccion}
          opcionesOrden={opcionesOrden}
          funcion={() => {
            dispatch(abrirModal("crear"));
            resetearValores();
          }}
        >
          <SelectOpcion
            idOpcion={idPais}
            nombre={"Paises"}
            handleChange={(e) => {
              cambiarSeleccionPais(e, setIdPais);
              if (idEstado) {
                setIdEstado("");
              }

              if (idMunicipio) {
                setIdMunicipio("");
              }
            }}
            opciones={paises}
            seleccione={"Seleccione"}
            setNombre={setNombrePais}
          />

          {idPais && (
            <SelectOpcion
              idOpcion={idEstado}
              nombre={"Estados"}
              handleChange={(e) => {
                cambiarSeleccionEstado(e, setIdEstado);
                if (idMunicipio) {
                  setIdMunicipio("");
                }
              }}
              opciones={estados}
              seleccione={"Seleccione"}
              setNombre={setNombreEstado}
            />
          )}

          {idEstado && (
            <SelectOpcion
              idOpcion={idMunicipio}
              nombre={"Municipios"}
              handleChange={(e) => {
                cambiarSeleccionMunicipio(e, setIdMunicipio);
              }}
              opciones={municipios}
              seleccione={"Seleccione"}
              setNombre={setNombreMunicipio}
            />
          )}

          {idMunicipio && (
            <Div className={`flex flex-col gap-2`}>
              {parroquias?.length === 0 && loading ? (
                <Div className="flex items-center gap-4">
                  <BounceLoader color="#082158" size={50} /> Cargando
                  parroquias...
                </Div>
              ) : (
                <>
                  {parroquiasPaginados?.length !== 0 ? (
                    parroquiasPaginados.map((parroquia, index) => {
                      return (
                        <FichaDetalles
                          key={parroquia.id}
                          dato={parroquia}
                          index={index}
                        >
                          <ButtonToggleDetalles
                            expanded={expanded}
                            dato={parroquia}
                            setExpanded={setExpanded}
                          />

                          {expanded === parroquia.id && (
                            <ListadoParroquias parroquia={parroquia} />
                          )}
                        </FichaDetalles>
                      );
                    })
                  ) : (
                    <EstadoMsjVacio dato={parroquias} loading={loading} />
                  )}
                </>
              )}
            </Div>
          )}
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
