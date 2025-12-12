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
import ListadoVoceros from "@/components/dashboard/voceros/components/ListadoVoceros";
import ModalVoceros from "@/components/dashboard/voceros/components/ModalVoceros";
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
import { fetchCircuitosIdParroquia } from "@/store/features/circuitos/thunks/circuitosIdParroquia";

import { fetchParroquias } from "@/store/features/parroquias/thunks/todasParroquias";
import { fetchConsejosIdComuna } from "@/store/features/consejos/thunks/consejosIdComuna";
import { fetchConsejosIdCircuito } from "@/store/features/consejos/thunks/consejosIdCircuito";
import { fetchConsejosIdParroquia } from "@/store/features/consejos/thunks/consejosIdParroquia";

import { fetchVocerosIdComuna } from "@/store/features/voceros/thunks/vocerosIdComuna";
import { fetchVocerosIdCircuito } from "@/store/features/voceros/thunks/vocerosIdCircuito";
import { fetchVocerosIdConsejo } from "@/store/features/voceros/thunks/vocerosIdConsejo";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";

import { cambiarSeleccionComuna } from "@/utils/dashboard/cambiarSeleccionComuna";
import { cambiarSeleccionCircuito } from "@/utils/dashboard/cambiarSeleccionCircuito";
import { cambiarSeleccionComunaCircuito } from "@/utils/dashboard/cambiarSeleccionComunaCircuito";
import { cambiarSeleccionConsejo } from "@/utils/dashboard/cambiarSeleccionConsejo";
import { limpiarCampos } from "@/utils/limpiarForm";

export default function VocerosView() {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { paises } = useSelector((state) => state.paises);
  const { estados } = useSelector((state) => state.estados);
  const { municipios } = useSelector((state) => state.municipios);
  const { parroquias } = useSelector((state) => state.parroquias);
  const { comunas } = useSelector((state) => state.comunas);
  const { circuitos } = useSelector((state) => state.circuitos);
  const { consejos } = useSelector((state) => state.consejos);
  const { voceros, loading } = useSelector((state) => state.voceros);

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

  const [cedulaVocero, setCedulaVocero] = useState("");
  const [nombreVocero, setNombreVocero] = useState("");
  const [nombreDosVocero, setNombreDosVocero] = useState("");
  const [apellidoVocero, setApellidoVocero] = useState("");
  const [apellidoDosVocero, setApellidoDosVocero] = useState("");
  const [generoVocero, setGeneroVocero] = useState("");
  const [edadVocero, setEdadVocero] = useState("");
  const [telefonoVocero, setTelefonoVocero] = useState("");
  const [correoVocero, setCorreoVocero] = useState("");
  const [laboralVocero, setLaboralVocero] = useState("");

  const [idPais, setIdPais] = useState("");
  const [idEstado, setIdEstado] = useState("");
  const [idMunicipio, setIdMunicipio] = useState("");
  const [idParroquia, setIdParroquia] = useState("");
  const [idComuna, setIdComuna] = useState("");
  const [idCircuito, setIdCircuito] = useState("");
  const [idConsejo, setIdConsejo] = useState("");
  const [idVocero, setIdVocero] = useState("");

  const [expanded, setExpanded] = useState("");
  const [opcion, setOpcion] = useState("");

  const [validarCedula, setValidarCedula] = useState(false);
  const [validarNombre, setValidarNombre] = useState(false);
  const [validarNombreDos, setValidarNombreDos] = useState(false);
  const [validarApellido, setValidarApellido] = useState(false);
  const [validarApellidoDos, setValidarApellidoDos] = useState(false);
  const [validarEdad, setValidarEdad] = useState(false);
  const [validarTelefono, setValidarTelefono] = useState(false);
  const [validarCorreo, setValidarCorreo] = useState(false);
  const [validarLaboral, setValidarLaboral] = useState(false);

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
    if (idParroquia && opcion === "comuna") {
      dispatch(fetchComunasIdParroquia(idParroquia));
    }

    if (idParroquia && opcion === "circuito") {
      dispatch(fetchCircuitosIdParroquia(idParroquia));
    }
  }, [dispatch, idParroquia, opcion]);

  useEffect(() => {
    if (idComuna) {
      dispatch(fetchVocerosIdComuna(idComuna));
    }
  }, [dispatch, idComuna]);

  useEffect(() => {
    if (idCircuito) {
      dispatch(fetchVocerosIdCircuito(idCircuito));
    }
  }, [dispatch, idCircuito]);

  useEffect(() => {
    if (idConsejo) {
      dispatch(fetchVocerosIdConsejo(idConsejo));
    }
  }, [dispatch, idConsejo]);

  const camposBusqueda = ["cedula", "nombre", "apellido", "correo", "telefono"];
  const opcionesOrden = [
    { id: "cedula", nombre: "Cédula" },
    { id: "nombre", nombre: "Nombre" },
    { id: "apellido", nombre: "Apellido" },
    { id: "correo", nombre: "Correo" },
    { id: "telefono", nombre: "Teléfono" },
  ];

  const acciones = {
    setIdPais: setIdPais,
    setIdEstado: setIdEstado,
    setIdMunicipio: setIdMunicipio,
    setIdParroquia: setIdParroquia,
    setIdComuna: setIdComuna,
    setIdCircuito: setIdCircuito,
    setIdConsejo: setIdConsejo,
    setIdVocero: setIdVocero,

    setNombrePais: setNombrePais,
    setNombreEstado: setNombreEstado,
    setNombreMunicipio: setNombreMunicipio,
    setNombreParroquia: setNombreParroquia,
    setNombreComuna: setNombreComuna,
    setNombreCircuito: setNombreCircuito,
    setNombreConsejo: setNombreConsejo,

    setCedula: setCedulaVocero,
    setNombre: setNombreVocero,
    setNombreDos: setNombreDosVocero,
    setApellido: setApellidoVocero,
    setApellidoDos: setApellidoDosVocero,
    setGenero: setGeneroVocero,
    setEdad: setEdadVocero,
    setTelefono: setTelefonoVocero,
    setCorreo: setCorreoVocero,
    setLaboral: setLaboralVocero,
    setOpcion: setOpcion,
  };

  const datosVocero = {
    idPais: idPais,
    idEstado: idEstado,
    idMunicipio: idMunicipio,
    idParroquia: idParroquia,
    idComuna: idComuna,
    idCircuito: idCircuito,
    idConsejo: idConsejo,
    idVocero: idVocero,

    nombrePais: nombrePais,
    nombreEstado: nombreEstado,
    nombreMunicipio: nombreMunicipio,
    nombreParroquia: nombreParroquia,
    nombreComuna: nombreComuna,
    nombreCircuito: nombreCircuito,
    nombreConsejo: nombreConsejo,

    cedula: cedulaVocero,
    nombre: nombreVocero,
    nombreDos: nombreDosVocero,
    apellido: apellidoVocero,
    apellido: apellidoDosVocero,
    genero: generoVocero,
    edad: edadVocero,
    telefono: telefonoVocero,
    correo: correoVocero,
    laboral: laboralVocero,
    opcion: opcion,
  };

  const validaciones = {
    validarCedula: validarCedula,
    setValidarCedula: setValidarCedula,
    validarNombre: validarNombre,
    setValidarNombre: setValidarNombre,
    validarNombreDos: validarNombreDos,
    setValidarNombreDos: setValidarNombreDos,
    validarApellido: validarApellido,
    setValidarApellido: setValidarApellido,
    validarApellidoDos: validarApellidoDos,
    setValidarApellidoDos: setValidarApellidoDos,
    validarEdad: validarEdad,
    setValidarEdad: setValidarEdad,
    validarTelefono: validarTelefono,
    setValidarTelefono: setValidarTelefono,
    validarCorreo: validarCorreo,
    setValidarCorreo: setValidarCorreo,
    validarLaboral: validarLaboral,
    setValidarLaboral: setValidarLaboral,
  };

  const vocerosFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      voceros,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda
    );
  }, [voceros, busqueda, ordenCampo, ordenDireccion]);

  const vocerosPaginados = useMemo(() => {
    return vocerosFiltradosOrdenados.slice(first, first + rows);
  }, [vocerosFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarVocero = (vocero) => {
    setIdVocero(vocero.id);
    setIdParroquia(vocero.id_parroquia);
    setIdComuna(vocero.id_comuna);
    setIdCircuito(vocero.id_circuito);
    setIdConsejo(vocero.id_consejo);

    setNombreVocero(vocero.nombre);
    setCedulaVocero(vocero.descripcion);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalVoceros
        acciones={acciones}
        datosVocero={datosVocero}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión voceros"}
          funcion={() => {
            dispatch(abrirModal("crear"));
            limpiarCampos({ setNombreVocero, setCedulaVocero });
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

                  setIdEstado("");
                  setIdMunicipio("");
                  setIdParroquia("");
                  setIdComuna("");
                  setIdCircuito("");
                  setIdConsejo("");
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
            </>
          ) : (
            <>
              <SelectOpcion
                idOpcion={opcion}
                nombre={"Mostrar en"}
                handleChange={(e) => {
                  cambiarSeleccionComunaCircuito(e, setOpcion);

                  setIdParroquia("");
                  setIdComuna("");
                  setIdCircuito("");
                  setIdConsejo("");
                  setNombreVocero("");
                  setCedulaVocero("");
                }}
                opciones={[
                  { id: "comuna", nombre: "comuna" },
                  { id: "circuito", nombre: "circuito" },
                  { id: "consejo", nombre: "Consejo comunal" },
                ]}
                seleccione={"Seleccione"}
                indice={1}
              />

              {opcion && (
                <SelectOpcion
                  idOpcion={idParroquia}
                  nombre={"Parroquias"}
                  handleChange={(e) => {
                    cambiarSeleccionParroquia(e, setIdParroquia);

                    setIdComuna("");
                    setIdCircuito("");
                    setIdConsejo("");
                    setNombreVocero("");
                    setCedulaVocero("");
                  }}
                  opciones={parroquias}
                  seleccione={"Seleccione"}
                  setNombre={setNombreParroquia}
                />
              )}
            </>
          )}

          {idMunicipio && (
            <SelectOpcion
              idOpcion={opcion}
              nombre={"Mostrar en"}
              handleChange={(e) => {
                cambiarSeleccionComunaCircuito(e, setOpcion);
              }}
              opciones={[
                { id: "comuna", nombre: "comuna" },
                { id: "circuito", nombre: "circuito" },
                { id: "consejo", nombre: "consejo" },
              ]}
              seleccione={"Seleccione"}
              indice={1}
            />
          )}

          {idMunicipio && opcion && (
            <SelectOpcion
              idOpcion={idParroquia}
              nombre={"Parroquias"}
              handleChange={(e) => {
                cambiarSeleccionParroquia(e, setIdParroquia);

                setIdComuna("");
                setIdCircuito("");
                setIdConsejo("");
              }}
              opciones={parroquias}
              seleccione={"Seleccione"}
              setNombre={setNombreParroquia}
            />
          )}

          {idParroquia && (
            <SelectOpcion
              idOpcion={
                opcion === "comuna"
                  ? idComuna
                  : opcion === "circuito"
                  ? idCircuito
                  : idConsejo
              }
              nombre={
                opcion === "comuna"
                  ? "Comunas"
                  : opcion === "circuito"
                  ? "Circuitos comunales"
                  : "Consejos comunales"
              }
              handleChange={(e) => {
                if (opcion === "comuna") {
                  cambiarSeleccionComuna(e, setIdComuna);
                } else if (opcion === "circuito") {
                  cambiarSeleccionCircuito(e, setIdCircuito);
                } else {
                  cambiarSeleccionConsejo(e, setIdConsejo);
                }

                setNombreVocero("");
                setCedulaVocero("");
              }}
              opciones={
                opcion === "comuna"
                  ? comunas
                  : opcion === "circuito"
                  ? circuitos
                  : consejos
              }
              seleccione={"Seleccione"}
              setNombre={
                opcion === "comuna"
                  ? setNombreComuna
                  : opcion === "circuito"
                  ? setNombreCircuito
                  : setNombreConsejo
              }
            />
          )}

          {(opcion === "comuna"
            ? idComuna
            : opcion === "circuito"
            ? idCircuito
            : idConsejo) && (
            <>
              <Div className={`flex flex-col gap-2`}>
                {voceros?.length === 0 && loading ? (
                  <Loader titulo="Cargando voceros..." />
                ) : (
                  <>
                    {vocerosPaginados?.length !== 0 ? (
                      vocerosPaginados.map((vocero, index) => {
                        return (
                          <FichaDetalles
                            key={vocero.id}
                            dato={vocero}
                            index={index}
                          >
                            <ButtonToggleDetalles
                              expanded={expanded}
                              dato={vocero}
                              setExpanded={setExpanded}
                            />

                            {expanded === vocero.id && (
                              <ListadoVoceros
                                vocero={vocero}
                                editarVocero={editarVocero}
                              />
                            )}
                          </FichaDetalles>
                        );
                      })
                    ) : (
                      <EstadoMsjVacio dato={voceros} loading={loading} />
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
                  totalRecords={vocerosFiltradosOrdenados.length}
                />
              </Div>
            </>
          )}
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
