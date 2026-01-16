"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoParticipantes from "@/components/dashboard/participantes/components/ListadoParticipantes";
//import ModalParticipantes from "@/components/dashboard/paises/components/ModalParticipantes";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { abrirModal } from "@/store/features/modal/slicesModal";

import { fetchFormacionesInstitucion } from "@/store/features/formaciones/thunks/formacionesInstitucion";
import { fetchFormaciones } from "@/store/features/formaciones/thunks/todasFormaciones";
import SelectOpcion from "@/components/SelectOpcion";
import { cambiarSeleccionFormacion } from "@/utils/dashboard/cambiarSeleccionFormacion";

import { fetchParticipantes } from "@/store/features/participantes/thunks/todosParticipantes";
import { obtenerParticipantesFiltradosOrdenados, opcionesOrden } from "@/utils/filtrarOrdenarVocerosFormaciones";
import FichaDetallesVocero from "@/components/dashboard/participantes/components/FichaDetallesVocero";
import ButtonToggleDetallesVocero from "./components/ButtonToggleDetallesVocero";

//import { fetchParticipantesIdFormacion } from "@/store/features/participantes/thunks/participantesIdFormacion";

export default function ParticipantesView() {
  const dispatch = useDispatch();
  const { usuarioActivo } = useSelector((state) => state.auth);
  const { formaciones } = useSelector((state) => state.formaciones);
  const { participantes, loading } = useSelector(
    (state) => state.participantes
  );

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchFormaciones());
    } else {
      dispatch(fetchFormacionesInstitucion());
    }
  }, [dispatch]);

  const [idFormacion, setIdFormacion] = useState("");
  const [nombreFormacion, setNombreFormacion] = useState("");
  const [expanded, setExpanded] = useState("");

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  useEffect(() => {
    if (usuarioActivo.id_rol === 1) {
      dispatch(fetchParticipantes());
    } else {
      dispatch(fetchFormacionesInstitucion());
    }
  }, [idFormacion]);

  /** 
  const camposBusqueda = ["cedula", "nombre", "correo"];
    const opcionesOrden = [
      { id: "cedula", nombre: "Cédula" },
      { id: "nombre", nombre: "Nombre" },
      { id: "correo", nombre: "Correo" },
    ];

    const participantesFiltradosOrdenados = useMemo(() => {
      return filtrarOrdenar(
        participantes,
        busqueda,
        ordenCampo,
        ordenDireccion,
        camposBusqueda
      );
    }, [participantes, busqueda, ordenCampo, ordenDireccion]);

    const participantesPaginados = useMemo(() => {
      return participantesFiltradosOrdenados.slice(first, first + rows);
    }, [participantesFiltradosOrdenados, first, rows]);
  */

  const participantesFiltradosOrdenados = useMemo(() => {
    return obtenerParticipantesFiltradosOrdenados(
      participantes,
      busqueda,
      ordenCampo,
      ordenDireccion
    );
  }, [participantes, busqueda, ordenCampo, ordenDireccion]);

  const participantesPaginados = useMemo(() => {
    return participantesFiltradosOrdenados.slice(first, first + rows);
  }, [participantesFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);


  //console.log(participantesPaginados);
  

  return (
    <>
      {/* <ModalParticipantes /> */}
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

          <Div className={`flex flex-col gap-2`}>
            {participantes?.length === 0 && loading ? (
              <Loader titulo="Cargando participantes..." />
            ) : (
              <>
                {participantesPaginados?.length !== 0 ? (
                  participantesPaginados.map((participante, index) => {
                    
                    return (
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
                          <ListadoParticipantes participante={participante} />
                        )}
                      </FichaDetallesVocero>
                    );
                  })
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
