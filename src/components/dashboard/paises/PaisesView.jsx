"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import BuscadorOrdenador from "@/components/BuscadorOrdenador";
import Paginador from "@/components/templates/PlantillaPaginacion";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoPaises from "@/components/dashboard/paises/components/ListadoPaises";
import ModalPaises from "@/components/dashboard/paises/components/ModalPaises";
import FichaDetalles from "@/components/FichaDetalles";
import EstadoMsjVacio from "@/components/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { filtrarOrdenar } from "@/utils/filtrarOrdenar";
import { fetchPaises } from "@/store/features/paises/thunks/todosPaises";

export default function PaisesView() {
  const dispatch = useDispatch();
  const { paises, loading } = useSelector((state) => state.paises);

  useEffect(() => {
    dispatch(fetchPaises());
  }, [dispatch]);

  const [nombrePais, setNombrePais] = useState("");
  const [capitalPais, setCapitalPais] = useState("");
  const [descripcionPais, setDescripcionPais] = useState("");
  const [serialPais, setSerialPais] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombrePais, setValidarNombrePais] = useState("");
  const [validarCapitalPais, setValidarCapitalPais] = useState("");
  const [validarSerialPais, setValidarSerialPais] = useState("");

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // o 'cedula'
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // 'asc' o 'desc'

  const camposBusqueda = ["nombre", "capital", "serial"];
  const opcionesOrden = [
    { id: "nombre", nombre: "Nombre" },
    { id: "capital", nombre: "Capital" },
    { id: "serial", nombre: "Serial" },
  ];

  const acciones = {
    setNombre: setNombrePais,
    setCapital: setCapitalPais,
    setDescripcion: setDescripcionPais,
    setSerial: setSerialPais,
  };

  const datosPais = {
    nombre: nombrePais,
    capital: capitalPais,
    descripcion: descripcionPais,
    serial: serialPais,
  };

  const validaciones = {
    validarNombre: validarNombrePais,
    setValidarNombre: setValidarNombrePais,
    validarCapital: validarCapitalPais,
    setValidarCapital: setValidarCapitalPais,
    validarSerial: validarSerialPais,
    setValidarSerial: setValidarSerialPais,
  };

  const paisesFiltradosOrdenados = useMemo(() => {
    return filtrarOrdenar(
      paises,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda
    );
  }, [paises, busqueda, ordenCampo, ordenDireccion]);

  const paisesPaginados = useMemo(() => {
    return paisesFiltradosOrdenados.slice(first, first + rows);
  }, [paisesFiltradosOrdenados, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  return (
    <>
      <ModalPaises
        acciones={acciones}
        datosPais={datosPais}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión paises"}
          funcion={() => {
            dispatch(abrirModal("crear"));
          }}
        >
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
            {paises?.length === 0 && loading ? (
              <Loader titulo="Cargando paises..." />
            ) : (
              <>
                {paisesPaginados?.length !== 0 ? (
                  paisesPaginados.map((pais, index) => {
                    return (
                      <FichaDetalles key={pais.id} dato={pais} index={index}>
                        <ButtonToggleDetalles
                          expanded={expanded}
                          dato={pais}
                          setExpanded={setExpanded}
                        />

                        {expanded === pais.id && <ListadoPaises pais={pais} />}
                      </FichaDetalles>
                    );
                  })
                ) : (
                  <EstadoMsjVacio dato={paises} loading={loading} />
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
              totalRecords={paisesFiltradosOrdenados.length}
            />
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
