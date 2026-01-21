"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";
import ListadoParticipantes from "@/components/dashboard/participantes/components/ListadoParticipantes";
import ModalParticipantes from "./components/ModalParticipantes";

import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { abrirModal } from "@/store/features/modal/slicesModal";

import { fetchFormacionesInstitucion } from "@/store/features/formaciones/thunks/formacionesInstitucion";
import { fetchFormaciones } from "@/store/features/formaciones/thunks/todasFormaciones";
import SelectOpcion from "@/components/SelectOpcion";
import { cambiarSeleccionFormacion } from "@/utils/dashboard/cambiarSeleccionFormacion";

import { fetchParticipantes } from "@/store/features/participantes/thunks/todosParticipantes";
import {
  obtenerParticipantesFiltradosAgrupados,
  obtenerParticipantesFiltradosOrdenados,
  opcionesOrden,
} from "@/utils/filtrarOrdenarVocerosFormaciones";
import FichaDetallesVocero from "@/components/dashboard/participantes/components/FichaDetallesVocero";
import ButtonToggleDetallesVocero from "./components/ButtonToggleDetallesVocero";
import { fetchParticipantesIdFormacion } from "@/store/features/participantes/thunks/participantesIdFormacion";
import Titulos from "@/components/Titulos";
import DivOrdenVoceros from "./components/DivOrdenVoceros";
import { formatoTituloSimple } from "@/utils/formatearTextCapitalice";
import { opcionOrden } from "@/components/dashboard/participantes/function/opcionOrden";
import { fetchUsuariosNombres } from "@/store/features/usuarios/thunks/todosUsuariosNombres";

export default function ParticipantesView() {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { formaciones } = useSelector((state) => state.formaciones);
  const { usuarios } = useSelector((state) => state.usuarios);
  const { participantes, loading } = useSelector(
    (state) => state.participantes,
  );

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchFormaciones());
      dispatch(fetchParticipantes());
    } else {
      dispatch(fetchFormacionesInstitucion());
    }

    dispatch(fetchUsuariosNombres());
  }, [dispatch]);

  const [idFormacion, setIdFormacion] = useState("");
  const [nombreFormacion, setNombreFormacion] = useState("");
  const [expanded, setExpanded] = useState("");

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  const [datosActualizar, setDatosActualizar] = useState([]); // Estado solo para fecha

  useEffect(() => {
    if (usuarioActivo.id_rol !== 1 && idFormacion) {
      dispatch(fetchParticipantesIdFormacion(idFormacion));
    }
  }, [idFormacion, dispatch]);

  const participantesFiltradosOrdenados = useMemo(() => {
    return obtenerParticipantesFiltradosOrdenados(
      participantes,
      usuarios,
      busqueda,
      ordenCampo,
      ordenDireccion,
    );
  }, [participantes, usuarios, busqueda, ordenCampo, ordenDireccion]);

  const participantesFinales = useMemo(() => {
    if (ordenCampo) {
      return obtenerParticipantesFiltradosAgrupados(
        participantes,
        usuarios,
        busqueda,
        ordenCampo,
        ordenDireccion,
        ordenCampo,
      );
    }

    const filtradosOrdenados = obtenerParticipantesFiltradosOrdenados(
      participantes,
      usuarios,
      busqueda,
      ordenCampo,
      ordenDireccion,
    );

    return filtradosOrdenados.slice(first, first + rows);
  }, [
    participantes,
    usuarios,
    busqueda,
    ordenCampo,
    ordenDireccion,
    ordenCampo,
    first,
    rows,
  ]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  return (
    <>
      <ModalParticipantes datosActualizar={datosActualizar} />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión participantes"}
          funcion={() => {
            dispatch(abrirModal("confirmar"));
          }}
          indice={1}
        >
          <SelectOpcion
            idOpcion={idFormacion}
            nombre={"Formaciones"}
            handleChange={(e) => {
              cambiarSeleccionFormacion(e, setIdFormacion);
            }}
            opciones={formaciones}
            seleccione={"Seleccione"}
            setNombre={setNombreFormacion}
          />

          <BuscadorOrdenador
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            ordenCampo={ordenCampo}
            setOrdenCampo={setOrdenCampo}
            ordenDireccion={ordenDireccion}
            setOrdenDireccion={setOrdenDireccion}
            opcionesOrden={opcionesOrden}
          />

          <Div className="flex flex-col gap-2">
            {participantes?.length === 0 && loading ? (
              <Loader titulo="Cargando participantes..." />
            ) : (
              <>
                {ordenCampo && participantesFinales ? (
                  Object.entries(participantesFinales).map(
                    ([titulo, lista]) => {
                      return (
                        <DivOrdenVoceros
                          dato={lista}
                          expanded={expanded}
                          opcionOrden={opcionOrden(ordenCampo)}
                          key={titulo}
                        >
                          {opcionOrden(ordenCampo) && (
                            <Titulos
                              indice={4}
                              titulo={formatoTituloSimple(titulo)}
                            />
                          )}

                          {lista.map((participante, index) => (
                            <FichaDetallesVocero
                              key={participante.id}
                              dato={participante}
                              index={index}
                            >
                              <ButtonToggleDetallesVocero
                                expanded={expanded}
                                dato={participante}
                                setExpanded={setExpanded}
                              />
                              {expanded === participante.id && (
                                <ListadoParticipantes
                                  participante={participante}
                                  datosActualizar={datosActualizar}
                                  setDatosActualizar={setDatosActualizar}
                                />
                              )}
                            </FichaDetallesVocero>
                          ))}
                        </DivOrdenVoceros>
                      );
                    },
                  )
                ) : (
                  <EstadoMsjVacio dato={participantes} loading={loading} />
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
              totalRecords={participantesFiltradosOrdenados.length}
            />
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
