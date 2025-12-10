"use client";

import { useEffect } from "react";
import SelectOpcion from "../SelectOpcion";
import Formulario from "../Formulario";
import LabelInput from "../inputs/LabelInput";
import Input from "../inputs/Input";
import BotonAceptarCancelar from "../botones/BotonAceptarCancelar";
import { useDispatch, useSelector } from "react-redux";

export default function FormCrearConsejo({
  acciones,
  datosConsejo,
  validaciones,
  estados,
  municipios,
  parroquias,
  comunasCircuitos
}) {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { paises } = useSelector((state) => state.paises);

  const {
    setIdPais,
    setIdEstado,
    setIdMunicipio,
    setIdParroquia,
    setIdComuna,
    setIdCircuito,
    setIdConsejo,
    setNombrePais,
    setNombreEstado,
    setNombreMunicipio,
    setNombreParroquia,
    setNombreComuna,
    setNombreCircuito,
    setNombre,
    setNorte,
    setSur,
    setEste,
    setOeste,
    setDireccion,
    setPunto,
    setRif,
    setCodigo,
    setDescripcion,
    setOpcionComunaCircuito,
  } = acciones;

  const {
    idPais,
    idEstado,
    idMunicipio,
    idParroquia,
    idComuna,
    idCircuito,
    idConsejo,
    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombreComuna,
    nombreCircuito,
    nombre,
    norte,
    sur,
    este,
    oeste,
    direccion,
    punto,
    rif,
    codigo,
    descripcion,
    opcionComunaCircuito,
  } = datosConsejo;

  const {
    validarNombre,
    setValidarNombre,
    validarRif,
    setValidarRif,
    validarCodigo,
    setValidarCodigo,
  } = validaciones;

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <DivScroll>
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
            idOpcion={opcionComunaCircuito === "comuna" ? idComuna : idCircuito}
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

        {(opcionComunaCircuito === "comuna" ? idComuna : idCircuito) && (
          <>
            <LabelInput nombre={"Nombre"}>
              <InputNombre
                type="text"
                indice="nombre"
                value={nombre}
                setValue={setNombre}
                validarNombre={validarNombre}
                setValidarNombre={setValidarNombre}
              />
            </LabelInput>

            <div className="flex space-x-3">
                          <BotonAceptarCancelar
                            indice={"aceptar"}
                            aceptar={() => {
                              dispatch(cerrarModal("crear"));
                              dispatch(abrirModal("confirmar"));
                            }}
                            nombre={"Crear"}
                            campos={{
                              nombre,
                              idParroquia,
                            }}
                          />
            
                          <BotonLimpiarCampos
                            aceptar={() => {
                              limpiarCampos({ setNombre });
                            }}
                            campos={{
                              nombre,
                              idParroquia,
                            }}
                          />
                        </div>
          </>
        )}
      </DivScroll>
    </Formulario>
  );
}
