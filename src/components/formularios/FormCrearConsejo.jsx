"use client";

import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import LabelInput from "@/components/inputs/LabelInput";
import InputNombre from "@/components/inputs/InputNombre";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import SelectOpcion from "@/components/SelectOpcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";
import { cambiarSeleccionComuna } from "@/utils/dashboard/cambiarSeleccionComuna";
import { cambiarSeleccionCircuito } from "@/utils/dashboard/cambiarSeleccionCircuito";
import { cambiarSeleccionComunaCircuito } from "@/utils/dashboard/cambiarSeleccionComunaCircuito";
import { limpiarCampos } from "@/utils/limpiarForm";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

export default function FormCrearConsejo({
  acciones,
  datosConsejo,
  validaciones,
  estados,
  municipios,
  parroquias,
  comunasCircuitos,
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

  const resetOpcion = () => {
    setIdParroquia("");
    setIdComuna("");
    setIdCircuito("");
    setNombre("");
    setDescripcion("");
  };

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
            />

            {opcionComunaCircuito && (
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
          </>
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
              resetOpcion();
            }}
            opciones={[
              { id: "comuna", nombre: "comuna" },
              { id: "circuito", nombre: "circuito" },
            ]}
            seleccione={"Seleccione"}
          />
        )}

        {idMunicipio && opcionComunaCircuito && (
          <SelectOpcion
            idOpcion={idParroquia}
            nombre={"Parroquias"}
            handleChange={(e) => {
              cambiarSeleccionParroquia(e, setIdParroquia);

              setIdComuna("");
              setIdCircuito("");
              setNombre("");
              setDescripcion("");
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

              setNombre("");
              setDescripcion("");
            }}
            opciones={comunasCircuitos}
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

            <LabelInput nombre={"Descripción"}>
              <InputDescripcion
                value={descripcion}
                setValue={setDescripcion}
                rows={6}
                max={500}
                autoComplete="off"
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
                  descripcion,
                  id: opcionComunaCircuito === "comuna" ? idComuna : idCircuito,
                }}
              />

              <BotonLimpiarCampos
                aceptar={() => {
                  limpiarCampos({ setNombre });
                }}
                campos={{
                  nombre,
                  descripcion,
                  id: opcionComunaCircuito === "comuna" ? idComuna : idCircuito,
                }}
              />
            </div>
          </>
        )}
      </DivScroll>
    </Formulario>
  );
}
