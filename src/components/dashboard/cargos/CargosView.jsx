"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import FichaDetalles from "@/components/FichaDetalles";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoCargos from "@/components/dashboard/cargos/components/ListadoCargos";
import ModalCargos from "@/components/dashboard/cargos/components/ModalCargos";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchCargos } from "@/store/features/cargos/thunks/todosCargos";

export default function CargosView() {
  const dispatch = useDispatch();
  const { cargos, loading } = useSelector((state) => state.cargos);

  useEffect(() => {
    dispatch(fetchCargos());
  }, [dispatch]);

  const [nombreCargo, setNombreCargo] = useState("");
  const [descripcionCargo, setDescripcionCargo] = useState("");

  const [idCargo, setIdCargo] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreCargo, setValidarNombreCargo] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenDireccion, setOrdenDireccion] = useState("asc");

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdCargo: setIdCargo,
    setNombre: setNombreCargo,
    setDescripcion: setDescripcionCargo,
  };

  const datosCargo = {
    idCargo: idCargo,
    nombre: nombreCargo,
    descripcion: descripcionCargo,
  };

  const validaciones = {
    validarNombre: validarNombreCargo,
    setValidarNombre: setValidarNombreCargo,
  };

  const cargosFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      cargos,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [cargos, busqueda, ordenCampo, ordenDireccion]);

  const cargosPaginados = useMemo(() => {
    return cargosFiltradosOrdenados.slice(first, first + rows);
  }, [cargosFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarCargo = (cargo) => {
    setIdCargo(cargo.id);
    setNombreCargo(cargo.nombre);
    setDescripcionCargo(cargo.descripcion);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalCargos
        acciones={acciones}
        datosCargo={datosCargo}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión Cargos"}
          first={first}
          setFirst={setFirst}
          rows={rows}
          setRows={setRows}
          datos={cargos}
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
            {cargos?.length === 0 && loading ? (
              <Loader titulo="Cargando cargos..." />
            ) : (
              <>
                {cargosPaginados?.length !== 0 ? (
                  cargosPaginados.map((cargo, index) => {
                    return (
                      <FichaDetalles key={cargo.id} dato={cargo} index={index}>
                        <ButtonToggleDetalles
                          expanded={expanded}
                          dato={cargo}
                          setExpanded={setExpanded}
                        />

                        {expanded === cargo.id && (
                          <ListadoCargos
                            cargo={cargo}
                            editarCargo={editarCargo}
                          />
                        )}
                      </FichaDetalles>
                    );
                  })
                ) : (
                  <EstadoMsjVacio dato={cargos} loading={loading} />
                )}
              </>
            )}
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
