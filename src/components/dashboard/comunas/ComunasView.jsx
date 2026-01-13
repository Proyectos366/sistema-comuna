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
import ListadoComunas from "@/components/dashboard/comunas/components/ListadoComunas";
import ModalComunas from "@/components/dashboard/comunas/components/ModalComunas";
import SelectOpcion from "@/components/SelectOpcion";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchEstadosIdPais } from "@/store/features/estados/thunks/estadosIdPais";
import { fetchMunicipiosIdEstado } from "@/store/features/municipios/thunks/municipiosIdEstado";
import { fetchParroquiasIdMunicipio } from "@/store/features/parroquias/thunks/parroquiasIdMunicipio";
import { fetchComunasIdParroquia } from "@/store/features/comunas/thunks/comunasIdParroquia";
import { fetchParroquias } from "@/store/features/parroquias/thunks/todasParroquias";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";

export default function ComunasView() {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { paises } = useSelector((state) => state.paises);
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);
  const { parroquias } = useSelector((state) => state.parroquias);
  const { comunas, loading } = useSelector((state) => state.comunas);

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchPaises());
    } else {
      dispatch(fetchParroquias());
    }
  }, [dispatch, usuarioActivo]);

  const [nombrePais, setNombrePais] = useState("");
  const [nombreEstado, setNombreEstado] = useState("");
  const [nombreMunicipio, setNombreMunicipio] = useState("");
  const [nombreParroquia, setNombreParroquia] = useState("");

  const [nombreComuna, setNombreComuna] = useState("");
  const [norteComuna, setNorteComuna] = useState("");
  const [surComuna, setSurComuna] = useState("");
  const [esteComuna, setEsteComuna] = useState("");
  const [oesteComuna, setOesteComuna] = useState("");
  const [direccionComuna, setDireccionComuna] = useState("");
  const [puntoComuna, setPuntoComuna] = useState("");
  const [rifComuna, setRifComuna] = useState("");
  const [codigoComuna, setCodigoComuna] = useState("");

  const [idPais, setIdPais] = useState("");
  const [idEstado, setIdEstado] = useState("");
  const [idMunicipio, setIdMunicipio] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreComuna, setValidarNombreComuna] = useState(false);
  const [validarRifComuna, setValidarRifComuna] = useState(false);
  const [validarCodigoComuna, setValidarCodigoComuna] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  useEffect(() => {
    if (idPais && usuarioActivo.id_rol === 1) {
      dispatch(fetchEstadosIdPais(idPais));
    }
  }, [dispatch, idPais, usuarioActivo]);

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

  useEffect(() => {
    if (idParroquia) {
      dispatch(fetchComunasIdParroquia(idParroquia));
    }
  }, [dispatch, idParroquia]);

  const camposBusqueda = ["nombre", "rif", "codigo"];
  const opcionesOrden = [
    { id: "nombre", nombre: "Nombre" },
    { id: "rif", nombre: "Rif" },
    { id: "codigo", nombre: "Codigo" },
  ];

  const acciones = {
    setIdPais: setIdPais,
    setIdEstado: setIdEstado,
    setIdMunicipio: setIdMunicipio,
    setIdParroquia: setIdParroquia,
    setIdComuna: setIdComuna,
    setNombrePais: setNombrePais,
    setNombreEstado: setNombreEstado,
    setNombreMunicipio: setNombreMunicipio,
    setNombreParroquia: setNombreParroquia,
    setNombre: setNombreComuna,
    setNorte: setNorteComuna,
    setSur: setSurComuna,
    setEste: setEsteComuna,
    setOeste: setOesteComuna,
    setDireccion: setDireccionComuna,
    setPunto: setPuntoComuna,
    setRif: setRifComuna,
    setCodigo: setCodigoComuna,
  };

  const datosComuna = {
    idPais: idPais,
    idEstado: idEstado,
    idMunicipio: idMunicipio,
    idParroquia: idParroquia,
    idComuna: idComuna,
    nombrePais: nombrePais,
    nombreEstado: nombreEstado,
    nombreMunicipio: nombreMunicipio,
    nombreParroquia: nombreParroquia,
    nombre: nombreComuna,
    norte: norteComuna,
    sur: surComuna,
    este: esteComuna,
    oeste: oesteComuna,
    direccion: direccionComuna,
    punto: puntoComuna,
    rif: rifComuna,
    codigo: codigoComuna,
  };

  const validaciones = {
    validarNombre: validarNombreComuna,
    setValidarNombre: setValidarNombreComuna,
    validarRif: validarRifComuna,
    setValidarRif: setValidarRifComuna,
    validarCodigo: validarCodigoComuna,
    setValidarCodigo: setValidarCodigoComuna,
  };

  const comunasFiltradasOrdenadas = useMemo(() => {
    return filtrarOrdenar(
      comunas,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda
    );
  }, [comunas, busqueda, ordenCampo, ordenDireccion]);

  const comunasPaginadas = useMemo(() => {
    return comunasFiltradasOrdenadas.slice(first, first + rows);
  }, [comunasFiltradasOrdenadas, first, rows]);

  const resetearValores = () => {
    setIdPais("");
    setIdEstado("");
    setIdMunicipio("");
    setIdParroquia("");
  };

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarComuna = (comuna) => {
    setIdParroquia(comuna.id_parroquia);
    setIdComuna(comuna.id);
    setNombreComuna(comuna.nombre);
    setNorteComuna(comuna.norte);
    setSurComuna(comuna.sur);
    setEsteComuna(comuna.este);
    setOesteComuna(comuna.oeste);
    setDireccionComuna(comuna.direccion);
    setPuntoComuna(comuna.punto);
    setRifComuna(comuna.rif);
    setCodigoComuna(comuna.codigo);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalComunas
        acciones={acciones}
        datosComuna={datosComuna}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión comunas"}
          funcion={() => {
            dispatch(abrirModal("crear"));
            //resetearValores();
          }}
        >
          {comunas.length !== 0 && (
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

          {usuarioActivo.id_rol === 1 ? (
            <>
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

                  if (idParroquia) {
                    setIdParroquia("");
                  }
                }}
                opciones={paises}
                seleccione={"Seleccione"}
                setNombre={setNombrePais}
              />
            </>
          ) : (
            <SelectOpcion
              idOpcion={idParroquia}
              nombre={"Parroquias"}
              handleChange={(e) => {
                cambiarSeleccionParroquia(e, setIdParroquia);
              }}
              opciones={parroquias}
              seleccione={"Seleccione"}
              setNombre={setNombreParroquia}
            />
          )}

          {idPais && (
            <SelectOpcion
              idOpcion={idEstado}
              nombre={"Estados"}
              handleChange={(e) => {
                cambiarSeleccionEstado(e, setIdEstado);
                if (idMunicipio) {
                  setIdMunicipio("");
                }

                if (idParroquia) {
                  setIdParroquia("");
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
                if (idParroquia) {
                  setIdParroquia("");
                }
              }}
              opciones={municipios}
              seleccione={"Seleccione"}
              setNombre={setNombreMunicipio}
            />
          )}

          {idMunicipio && (
            <SelectOpcion
              idOpcion={idParroquia}
              nombre={"Parroquias"}
              handleChange={(e) => {
                cambiarSeleccionParroquia(e, setIdParroquia);
              }}
              opciones={parroquias}
              seleccione={"Seleccione"}
              setNombre={setNombreParroquia}
            />
          )}

          {idParroquia && (
            <>
              <Div className={`flex flex-col gap-2`}>
                {comunas?.length === 0 && loading ? (
                  <Loader titulo="Cargando comunas..." />
                ) : (
                  <>
                    {comunasPaginadas?.length !== 0 ? (
                      comunasPaginadas.map((comuna, index) => {
                        return (
                          <FichaDetalles
                            key={comuna.id}
                            dato={comuna}
                            index={index}
                          >
                            <ButtonToggleDetalles
                              expanded={expanded}
                              dato={comuna}
                              setExpanded={setExpanded}
                            />

                            {expanded === comuna.id && (
                              <ListadoComunas
                                comuna={comuna}
                                editarComuna={editarComuna}
                              />
                            )}
                          </FichaDetalles>
                        );
                      })
                    ) : (
                      <EstadoMsjVacio dato={comunas} loading={loading} />
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
                  totalRecords={comunasFiltradasOrdenadas.length}
                />
              </Div>{" "}
            </>
          )}
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
