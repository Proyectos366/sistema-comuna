import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import SelectOpcion from "@/components/SelectOpcion";
import LabelInput from "@/components/inputs/LabelInput";
import InputNombre from "@/components/inputs/InputNombre";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";
import { limpiarCampos } from "@/utils/limpiarForm";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

export default function FormCrearCircuito({
  acciones,
  datosCircuito,
  validaciones,
  estados,
  municipios,
  parroquias,
}) {
  const dispatch = useDispatch();

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { paises } = useSelector((state) => state.paises);

  const {
    setIdPais,
    setIdEstado,
    setIdMunicipio,
    setIdParroquia,
    setIdCircuito,
    setNombrePais,
    setNombreEstado,
    setNombreMunicipio,
    setNombreParroquia,
    setNombre,
    setNorte,
    setSur,
    setEste,
    setOeste,
    setDireccion,
    setPunto,
    setCodigo,
  } = acciones;

  const {
    idPais,
    idEstado,
    idMunicipio,
    idParroquia,
    idCircuito,
    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombre,
    norte,
    sur,
    este,
    oeste,
    direccion,
    punto,
    codigo,
  } = datosCircuito;

  const { validarNombre, setValidarNombre, validarCodigo, setValidarCodigo } =
    validaciones;

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
            }}
            opciones={parroquias}
            seleccione={"Seleccione"}
            setNombre={setNombreParroquia}
          />
        )}

        {idParroquia && (
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
