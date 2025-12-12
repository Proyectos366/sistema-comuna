"use client";

import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import LabelInput from "@/components/inputs/LabelInput";
import InputNombre from "@/components/inputs/InputNombre";
import SelectOpcion from "@/components/SelectOpcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";
import { cambiarSeleccionComunaCircuitoConsejo } from "@/utils/dashboard/cambiarSeleccionComunaCircuitoConsejo";
import { limpiarCampos } from "@/utils/limpiarForm";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { cambiarSeleccionComuna } from "@/utils/dashboard/cambiarSeleccionComuna";
import { cambiarSeleccionCircuito } from "@/utils/dashboard/cambiarSeleccionCircuito";
import { cambiarSeleccionConsejo } from "@/utils/dashboard/cambiarSeleccionConsejo";
import InputCedula from "../inputs/InputCedula";

export default function FormCrearVocero({
  acciones,
  datosVocero,
  validaciones,
  estados,
  municipios,
  parroquias,
  comunasCircuitosConsejos,
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
    setIdVocero,

    setNombrePais,
    setNombreEstado,
    setNombreMunicipio,
    setNombreParroquia,
    setNombreComuna,
    setNombreCircuito,
    setNombreConsejo,

    setNombre,
    setCedula,
    setOpcion,
  } = acciones;

  const {
    idPais,
    idEstado,
    idMunicipio,
    idParroquia,
    idComuna,
    idCircuito,
    idConsejo,
    idVocero,

    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombreComuna,
    nombreCircuito,
    nombreConsejo,

    nombre,
    cedula,
    opcion,
  } = datosVocero;

  const { validarNombre, setValidarNombre, validarCedula, setValidarCedula } =
    validaciones;

  const resetOpcion = () => {
    setIdParroquia("");
    setIdComuna("");
    setIdCircuito("");
    setIdConsejo("");
    setNombre("");
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

                setIdEstado("");
                setIdMunicipio("");
                setIdParroquia("");
                setIdComuna("");
                setIdCircuito("");
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

                  setIdMunicipio("");
                  setIdParroquia("");
                  setIdComuna("");
                  setIdCircuito("");
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

                  setIdParroquia("");
                  setIdComuna("");
                  setIdCircuito("");
                }}
                opciones={municipios}
                seleccione={"Seleccione"}
                setNombre={setNombreMunicipio}
              />
            )}

            {idMunicipio && (
              <SelectOpcion
                idOpcion={opcion}
                nombre={"Crear en"}
                handleChange={(e) => {
                  cambiarSeleccionComunaCircuitoConsejo(e, setOpcion);
                  resetOpcion();
                }}
                opciones={[
                  { id: "comuna", nombre: "comuna" },
                  { id: "circuito", nombre: "circuito" },
                  { id: "consejo", nombre: "consejo" },
                ]}
                seleccione={"Seleccione"}
              />
            )}
          </>
        ) : (
          <>
            <SelectOpcion
              idOpcion={opcion}
              nombre={"Crear en"}
              handleChange={(e) => {
                cambiarSeleccionComunaCircuitoConsejo(e, setOpcion);
              }}
              opciones={[
                { id: "comuna", nombre: "comuna" },
                { id: "circuito", nombre: "circuito" },
                { id: "consejo", nombre: "consejo" },
              ]}
              seleccione={"Seleccione"}
            />

            {opcion && (
              <SelectOpcion
                idOpcion={idParroquia}
                nombre={"Parroquias"}
                handleChange={(e) => {
                  cambiarSeleccionParroquia(e, setIdParroquia);

                  setIdComuna("");
                  setIdCircuito("");
                }}
                opciones={parroquias}
                seleccione={"Seleccione"}
                setNombre={setNombreParroquia}
              />
            )}
          </>
        )}

        {idMunicipio && opcion && (
          <SelectOpcion
            idOpcion={idParroquia}
            nombre={"Parroquias"}
            handleChange={(e) => {
              cambiarSeleccionParroquia(e, setIdParroquia);

              setIdComuna("");
              setIdCircuito("");
              setNombre("");
              setCedula("");
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
              opcion === "comuna"
                ? cambiarSeleccionComuna(e, setIdComuna)
                : opcion === "circuito"
                ? cambiarSeleccionCircuito(e, setIdCircuito)
                : cambiarSeleccionConsejo(e, setIdConsejo);

              setNombre("");
              setCedula("");
            }}
            opciones={comunasCircuitosConsejos}
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

            <LabelInput nombre={"Cédula"}>
              <InputCedula
                type={"text"}
                indice={"cedula"}
                value={cedula}
                setValue={setCedula}
                validarCedula={validarCedula}
                setValidarCedula={setValidarCedula}
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
                  id:
                    opcion === "comuna"
                      ? idComuna
                      : opcion === "circuito"
                      ? idCircuito
                      : idConsejo,
                }}
              />

              <BotonLimpiarCampos
                aceptar={() => {
                  limpiarCampos({ setNombre });
                }}
                campos={{
                  nombre,
                  id:
                    opcion === "comuna"
                      ? idComuna
                      : opcion === "circuito"
                      ? idCircuito
                      : idConsejo,
                }}
              />
            </div>
          </>
        )}
      </DivScroll>
    </Formulario>
  );
}
