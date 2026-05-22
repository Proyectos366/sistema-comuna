"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Div from "@/components/padres/Div";
import SectionMain from "@/components/SectionMain";
import SectionTertiary from "@/components/SectionTertiary";
import FichaDetalles from "@/components/FichaDetalles";
import ButtonToggleDetalles from "@/components/botones/ButtonToggleDetalles";
import ListadoFormaciones from "@/components/dashboard/formaciones/components/ListadoFormaciones";
import ModalFormaciones from "@/components/dashboard/formaciones/components/ModalFormaciones";
import EstadoMsjVacio from "@/components/mensaje/EstadoMsjVacio";
import Loader from "@/components/Loader";

import { filtrarOrdenar } from "@/utils/filtrarOrdenar";

import { abrirModal } from "@/store/features/modal/slicesModal";
import { fetchFormacionesInstitucion } from "@/store/features/formaciones/thunks/formacionesInstitucion";

export default function FormacionesView() {
  const dispatch = useDispatch();
  const { formaciones, loading } = useSelector((state) => state.formaciones);

  useEffect(() => {
    dispatch(fetchFormacionesInstitucion());
  }, [dispatch]);

  const [nombreCargo, setNombreFormacion] = useState("");
  const [modulosFormacion, setModulosFormacion] = useState("");
  const [descripcionCargo, setDescripcionFormacion] = useState("");

  const [idFormacion, setIdFormacion] = useState("");

  const [expanded, setExpanded] = useState("");

  const [validarNombreFormacion, setValidarNombreFormacion] = useState(false);
  const [validarModuloFormacion, setValidarModuloFormacion] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(25);

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenDireccion, setOrdenDireccion] = useState("asc");

  const camposBusqueda = ["nombre"];
  const opcionesOrden = [{ id: "nombre", nombre: "Nombre" }];

  const acciones = {
    setIdFormacion: setIdFormacion,
    setNombre: setNombreFormacion,
    setModulos: setModulosFormacion,
    setDescripcion: setDescripcionFormacion,
  };

  const datosFormacion = {
    idFormacion: idFormacion,
    nombre: nombreCargo,
    modulos: modulosFormacion,
    descripcion: descripcionCargo,
  };

  const validaciones = {
    validarNombre: validarNombreFormacion,
    setValidarNombre: setValidarNombreFormacion,
    validarModulo: validarModuloFormacion,
    setValidarModulo: setValidarModuloFormacion,
  };

  const formacionesFiltradasOrdenadas = useMemo(() => {
    return filtrarOrdenar(
      formaciones,
      busqueda,
      ordenCampo,
      ordenDireccion,
      camposBusqueda,
    );
  }, [formaciones, busqueda, ordenCampo, ordenDireccion]);

  const formacionesPaginadas = useMemo(() => {
    return formacionesFiltradasOrdenadas.slice(first, first + rows);
  }, [formacionesFiltradasOrdenadas, first, rows]);

  useEffect(() => {
    setFirst(0);
  }, [busqueda, ordenCampo, ordenDireccion]);

  const editarFormacion = (formacion) => {
    setIdFormacion(formacion.id);
    setNombreFormacion(formacion.nombre);
    setModulosFormacion(formacion.modulos.length);
    setDescripcionFormacion(formacion.descripcion);

    dispatch(abrirModal("editar"));
  };

  return (
    <>
      <ModalFormaciones
        acciones={acciones}
        datosFormacion={datosFormacion}
        validaciones={validaciones}
      />
      <SectionMain>
        <SectionTertiary
          nombre={"Gestión formaciones"}
          first={first}
          setFirst={setFirst}
          rows={rows}
          setRows={setRows}
          datos={formaciones}
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
            {formaciones?.length === 0 && loading ? (
              <Loader titulo="Cargando formaciones..." />
            ) : (
              <>
                {formacionesPaginadas?.length !== 0 ? (
                  formacionesPaginadas.map((formacion, index) => {
                    return (
                      <FichaDetalles
                        key={formacion.id}
                        dato={formacion}
                        index={index}
                      >
                        <ButtonToggleDetalles
                          expanded={expanded}
                          dato={formacion}
                          setExpanded={setExpanded}
                        />

                        {expanded === formacion.id && (
                          <ListadoFormaciones
                            formacion={formacion}
                            editarFormacion={editarFormacion}
                          />
                        )}
                      </FichaDetalles>
                    );
                  })
                ) : (
                  <EstadoMsjVacio dato={formaciones} loading={loading} />
                )}
              </>
            )}
          </Div>
        </SectionTertiary>
      </SectionMain>
    </>
  );
}
