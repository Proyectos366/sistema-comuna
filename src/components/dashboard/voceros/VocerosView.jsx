"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useEffectVocerosViews } from "@/components/dashboard/voceros/functions/useEffectVocerosViews";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";
import FichaDetalles from "@/components/FichaDetalles";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoVoceros from "@/components/dashboard/voceros/components/ListadoVoceros";
import ModalVoceros from "@/components/dashboard/voceros/components/ModalVoceros";
import EstadoMsjVacioVocero from "@/components/mensaje/EstadoMsjVacioVocero";
import Loader from "@/components/Loader";
import OpcionesVocero from "@/components/dashboard/voceros/components/OpcionesVocero";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";
import { limpiarCampos } from "@/utils/limpiarForm";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";
import { fetchParroquias } from "@/store/features/parroquias/thunks/todasParroquias";
import { fetchFormaciones } from "@/store/features/formaciones/thunks/todasFormaciones";
import { fetchFormacionesInstitucion } from "@/store/features/formaciones/thunks/formacionesInstitucion";
import { fetchCargos } from "@/store/features/cargos/thunks/todosCargos";

export default function VocerosView() {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { voceros, loading } = useSelector((state) => state.voceros);

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchPaises());
      dispatch(fetchFormaciones());
    } else {
      dispatch(fetchParroquias());
      dispatch(fetchFormacionesInstitucion());
    }

    dispatch(fetchCargos());
  }, [dispatch, usuarioActivo]);

  const [nombrePais, setNombrePais] = useState("");
  const [nombreEstado, setNombreEstado] = useState("");
  const [nombreMunicipio, setNombreMunicipio] = useState("");
  const [nombreParroquia, setNombreParroquia] = useState("");
  const [nombreComuna, setNombreComuna] = useState("");
  const [nombreCircuito, setNombreCircuito] = useState("");
  const [nombreConsejo, setNombreConsejo] = useState("");
  const [nombreCargo, setNombreCargo] = useState("");
  const [nombreFormacion, setNombreFormacion] = useState("");

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
  const [idCargo, setIdCargo] = useState([]);
  const [idFormacion, setIdFormacion] = useState([]);
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

  const [seleccionado, setSeleccionado] = useState(null);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  useEffectVocerosViews({
    idPais,
    usuarioActivo,
    idEstado,
    idMunicipio,
    idParroquia,
    opcion,
    idComuna,
    idCircuito,
    idConsejo,
  });

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
    setIdCargo: setIdCargo,
    setIdFormacion: setIdFormacion,
    setIdVocero: setIdVocero,

    setNombrePais: setNombrePais,
    setNombreEstado: setNombreEstado,
    setNombreMunicipio: setNombreMunicipio,
    setNombreParroquia: setNombreParroquia,
    setNombreComuna: setNombreComuna,
    setNombreCircuito: setNombreCircuito,
    setNombreConsejo: setNombreConsejo,
    setNombreCargo: setNombreCargo,
    setNombreFormacion: setNombreFormacion,

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
    idCargo: idCargo,
    idFormacion: idFormacion,
    idVocero: idVocero,

    nombrePais: nombrePais,
    nombreEstado: nombreEstado,
    nombreMunicipio: nombreMunicipio,
    nombreParroquia: nombreParroquia,
    nombreComuna: nombreComuna,
    nombreCircuito: nombreCircuito,
    nombreConsejo: nombreConsejo,
    nombreCargo: nombreCargo,
    nombreFormacion: nombreFormacion,

    cedula: cedulaVocero,
    nombre: nombreVocero,
    nombreDos: nombreDosVocero,
    apellido: apellidoVocero,
    apellidoDos: apellidoDosVocero,
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
    setIdComuna(vocero?.comunas?.id);
    setIdCircuito(vocero?.circuitos?.id);
    setIdConsejo(vocero?.consejos?.id);
    setIdCargo(vocero?.cargos?.[0]?.id);
    setIdFormacion(vocero?.cursos?.[0]?.formaciones?.id);

    setCedulaVocero(vocero.cedula);
    setEdadVocero(vocero.edad);
    setNombreVocero(vocero.nombre);
    setNombreDosVocero(vocero.nombre_dos);
    setApellidoVocero(vocero.apellido);
    setApellidoDosVocero(vocero.apellido_dos);
    setGeneroVocero(vocero.genero);
    setTelefonoVocero(vocero.telefono);
    setCorreoVocero(vocero.correo);
    setLaboralVocero(vocero.laboral);

    setNombreParroquia(vocero?.parroquias?.nombre);
    setNombreComuna(vocero?.comunas?.nombre);
    setNombreCircuito(vocero?.circuitos?.nombre);
    setNombreConsejo(vocero?.consejos?.nombre);
    setNombreCargo(vocero?.cargos?.[0]?.nombre);
    setNombreFormacion(vocero?.cursos?.[0]?.formaciones?.nombre);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalVoceros
        acciones={acciones}
        datosVocero={datosVocero}
        validaciones={validaciones}
        seleccionado={seleccionado}
      />

      <SectionMain>
        <SectionTertiary
          nombre={"Gestión voceros"}
          funcion={() => {
            limpiarCampos({
              setCedulaVocero,
              setNombreVocero,
              setNombreDosVocero,
              setApellidoVocero,
              setApellidoDosVocero,
              setGeneroVocero,
              setEdadVocero,
              setTelefonoVocero,
              setCorreoVocero,
              setLaboralVocero,
              setOpcion,
              setIdParroquia,
              setIdComuna,
              setIdCircuito,
              setIdConsejo,
            });

            dispatch(abrirModal("crear"));
            setSeleccionado(10);
          }}
        >
          <OpcionesVocero
            seleccionado={seleccionado}
            setSeleccionado={setSeleccionado}
            setOpcion={setOpcion}
            setIdParroquia={setIdParroquia}
          />

          {voceros.length !== 0 && (
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

          {voceros && (
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
                      <EstadoMsjVacioVocero
                        dato={voceros}
                        loading={loading}
                        seleccionado={seleccionado}
                      />
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
