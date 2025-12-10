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
import ListadoConsejos from "@/components/dashboard/consejos/components/ListadoConsejos";
import ModalConsejos from "@/components/dashboard/consejos/components/ModalConsejos";
import SelectOpcion from "@/components/SelectOpcion";
import EstadoMsjVacio from "@/components/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchEstadosIdPais } from "@/store/features/estados/thunks/estadosIdPais";
import { fetchMunicipiosIdEstado } from "@/store/features/municipios/thunks/municipiosIdEstado";
import { fetchParroquiasIdMunicipio } from "@/store/features/parroquias/thunks/parroquiasIdMunicipio";
import { fetchComunasIdParroquia } from "@/store/features/comunas/thunks/comunasIdParroquia";

import { fetchParroquias } from "@/store/features/parroquias/thunks/todasParroquias";
import { fetchConsejosIdComuna } from "@/store/features/consejos/thunks/consejosIdComuna";
import { fetchConsejosIdCircuito } from "@/store/features/consejos/thunks/consejosIdCircuito";
import { fetchConsejosIdParroquia } from "@/store/features/consejos/thunks/consejosIdParroquia";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";

import { cambiarSeleccionComuna } from "@/utils/dashboard/cambiarSeleccionComuna";
import { cambiarSeleccionCircuito } from "@/utils/dashboard/cambiarSeleccionCircuito";
import { cambiarSeleccionComunaCircuito } from "@/utils/dashboard/cambiarSeleccionComunaCircuito";

export default function ConsejosView() {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { paises } = useSelector((state) => state.paises);
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);
  const { parroquias } = useSelector((state) => state.parroquias);
  const { comunas } = useSelector((state) => state.comunas);
  const { circuitos } = useSelector((state) => state.circuitos);
  const { consejos, loading } = useSelector((state) => state.consejos);

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
  const [nombreCircuito, setNombreCircuito] = useState("");

  const [nombreConsejo, setNombreConsejo] = useState("");
  const [norteConsejo, setNorteConsejo] = useState("");
  const [surConsejo, setSurConsejo] = useState("");
  const [esteConsejo, setEsteConsejo] = useState("");
  const [oesteConsejo, setOesteConsejo] = useState("");
  const [direccionConsejo, setDireccionConsejo] = useState("");
  const [puntoConsejo, setPuntoConsejo] = useState("");
  const [rifConsejo, setRifConsejo] = useState("");
  const [codigoConsejo, setCodigoConsejo] = useState("");
  const [descripcionConsejo, setDescripcionConsejo] = useState("");

  const [idPais, setIdPais] = useState("");
  const [idEstado, setIdEstado] = useState("");
  const [idMunicipio, setIdMunicipio] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");
  const [idCircuito, setIdCircuito] = useState("");
  const [idConsejo, setIdConsejo] = useState("");

  const [expanded, setExpanded] = useState("");
  const [opcionComunaCircuito, setOpcionComunaCircuito] = useState("");

  const [validarNombreConsejo, setValidarNombreConsejo] = useState(false);
  const [validarRifConsejo, setValidarRifConsejo] = useState(false);
  const [validarCodigoConsejo, setValidarCodigoConsejo] = useState(false);

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

  useEffect(() => {
    if (idComuna && opcionComunaCircuito === "comuna") {
      dispatch(fetchConsejosIdComuna(idComuna));
    }
  }, [dispatch, idComuna]);

  useEffect(() => {
    if (idCircuito && opcionComunaCircuito === "circuito") {
      dispatch(fetchConsejosIdCircuito(idCircuito));
    }
  }, [dispatch, idCircuito]);

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
    setIdCircuito: setIdCircuito,
    setIdConsejo: setIdConsejo,
    setNombrePais: setNombrePais,
    setNombreEstado: setNombreEstado,
    setNombreMunicipio: setNombreMunicipio,
    setNombreParroquia: setNombreParroquia,
    setNombreComuna: setNombreComuna,
    setNombreCircuito: setNombreCircuito,
    setNombre: setNombreConsejo,
    setNorte: setNorteConsejo,
    setSur: setSurConsejo,
    setEste: setEsteConsejo,
    setOeste: setOesteConsejo,
    setDireccion: setDireccionConsejo,
    setPunto: setPuntoConsejo,
    setRif: setRifConsejo,
    setCodigo: setCodigoConsejo,
    setDescripcion: setDescripcionConsejo,
    setOpcionComunaCircuito: setOpcionComunaCircuito,
  };

  const datosConsejo = {
    idPais: idPais,
    idEstado: idEstado,
    idMunicipio: idMunicipio,
    idParroquia: idParroquia,
    idComuna: idComuna,
    idCircuito: idCircuito,
    idConsejo: idConsejo,
    nombrePais: nombrePais,
    nombreEstado: nombreEstado,
    nombreMunicipio: nombreMunicipio,
    nombreParroquia: nombreParroquia,
    nombreComuna: nombreComuna,
    nombreCircuito: nombreCircuito,
    nombre: nombreConsejo,
    norte: norteConsejo,
    sur: surConsejo,
    este: esteConsejo,
    oeste: oesteConsejo,
    direccion: direccionConsejo,
    punto: puntoConsejo,
    rif: rifConsejo,
    codigo: codigoConsejo,
    descripcion: descripcionConsejo,
    opcionComunaCircuito: opcionComunaCircuito,
  };

  const validaciones = {
    validarNombre: validarNombreConsejo,
    setValidarNombre: setValidarNombreConsejo,
    validarRif: validarRifConsejo,
    setValidarRif: setValidarRifConsejo,
    validarCodigo: validarCodigoConsejo,
    setValidarCodigo: setValidarCodigoConsejo,
  };

  const consejosFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      consejos,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda
    );
  }, [consejos, busqueda, ordenCampo, ordenDireccion]);

  const consejosPaginados = useMemo(() => {
    return consejosFiltradosOrdenados.slice(first, first + rows);
  }, [consejosFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarConsejo = (consejo) => {
    setIdParroquia(consejo.id_parroquia);
    setIdComuna(consejo.id_comuna);
    setIdCircuito(consejo.id_circuito);
    setNombreConsejo(consejo.nombre);
    setNorteConsejo(consejo.norte);
    setSurConsejo(consejo.sur);
    setEsteConsejo(consejo.este);
    setOesteConsejo(consejo.oeste);
    setDireccionConsejo(consejo.direccion);
    setPuntoConsejo(consejo.punto);
    setRifConsejo(consejo.rif);
    setCodigoConsejo(consejo.codigo);
    setDescripcionConsejo(consejo.descripcion);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalConsejos
        acciones={acciones}
        datosConsejo={datosConsejo}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión consejos comunales"}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
          {consejos.length !== 0 && (
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

                  if (idComuna) {
                    setIdComuna("");
                  }

                  if (idCircuito) {
                    setIdCircuito("");
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

                if (idComuna) {
                  setIdComuna("");
                }

                if (idCircuito) {
                  setIdCircuito("");
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

                if (idComuna) {
                  setIdComuna("");
                }

                if (idCircuito) {
                  setIdCircuito("");
                }
              }}
              opciones={municipios}
              seleccione={"Seleccione"}
              setNombre={setNombreMunicipio}
            />
          )}

          {idMunicipio && (
            <SelectOpcion
              idOpcion={opcionComunaCircuito}
              nombre={"Crear en"}
              handleChange={(e) => {
                cambiarSeleccionComunaCircuito(e, setOpcionComunaCircuito);
              }}
              opciones={[
                { id: "comuna", nombre: "comuna" },
                { id: "circuito", nombre: "circuito" },
              ]}
              seleccione={"Seleccione"}
              indice={1}
            />
          )}

          {idMunicipio && opcionComunaCircuito && (
            <SelectOpcion
              idOpcion={idParroquia}
              nombre={"Parroquias"}
              handleChange={(e) => {
                cambiarSeleccionParroquia(e, setIdParroquia);

                if (idComuna) {
                  setIdComuna("");
                }

                if (idCircuito) {
                  setIdCircuito("");
                }
              }}
              opciones={parroquias}
              seleccione={"Seleccione"}
              setNombre={setNombreParroquia}
            />
          )}

          {idParroquia && (
            <SelectOpcion
              idOpcion={
                opcionComunaCircuito === "comuna" ? idComuna : idCircuito
              }
              nombre={
                opcionComunaCircuito === "comuna"
                  ? "Comunas"
                  : "Circuitos comunales"
              }
              handleChange={(e) => {
                opcionComunaCircuito === "comuna"
                  ? cambiarSeleccionComuna(e, setIdComuna)
                  : cambiarSeleccionCircuito(e, setIdCircuito);
              }}
              opciones={opcionComunaCircuito === "comuna" ? comunas : circuitos}
              seleccione={"Seleccione"}
              setNombre={
                opcionComunaCircuito === "comuna"
                  ? setNombreComuna
                  : setNombreCircuito
              }
            />
          )}

          {/* {idParroquia && (
            <SelectOpcion
              idOpcion={opcionComunaCircuito}
              nombre={"Crear en"}
              handleChange={(e) => {
                cambiarSeleccionComunaCircuito(e, setIdParroquia);
              }}
              opciones={[
                { id: "comuna", nombre: "comuna" },
                { id: "circuito", nombre: "circuito" },
              ]}
              seleccione={"Seleccione"}
              indice={1}
            />
          )} */}

          {/* {idParroquia && (
            <SelectOpcion
              idOpcion={
                opcionComunaCircuito === "comuna" ? idComuna : idCircuito
              }
              nombre={
                opcionComunaCircuito === "comuna"
                  ? "Comunas"
                  : "Circuitos comunales"
              }
              handleChange={(e) => {
                opcionComunaCircuito === "comuna"
                  ? cambiarSeleccionComuna(e, setIdComuna)
                  : cambiarSeleccionCircuito(e, setIdCircuito);
              }}
              opciones={opcionComunaCircuito === "comuna" ? comunas : circuitos}
              seleccione={"Seleccione"}
              setNombre={
                opcionComunaCircuito === "comuna"
                  ? setNombreComuna
                  : setNombreCircuito
              }
            />
          )} */}

          {(opcionComunaCircuito === "comuna" ? idComuna : idCircuito) && (
            <>
              <Div className={`flex flex-col gap-2`}>
                {consejos?.length === 0 && loading ? (
                  <Loader titulo="Cargando consejos comunales..." />
                ) : (
                  <>
                    {consejosPaginados?.length !== 0 ? (
                      consejosPaginados.map((consejo, index) => {
                        return (
                          <FichaDetalles
                            key={consejo.id}
                            dato={consejo}
                            index={index}
                          >
                            <ButtonToggleDetalles
                              expanded={expanded}
                              dato={consejo}
                              setExpanded={setExpanded}
                            />

                            {expanded === consejo.id && (
                              <ListadoConsejos
                                consejo={consejo}
                                editarConsejo={editarConsejo}
                              />
                            )}
                          </FichaDetalles>
                        );
                      })
                    ) : (
                      <EstadoMsjVacio dato={consejos} loading={loading} />
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
                  totalRecords={consejosFiltradosOrdenados.length}
                />
              </Div>{" "}
            </>
          )}
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
