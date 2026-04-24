import { useDispatch } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import InputNombreEstante from "@/components/inputs/InputNombreEstante";
import InputNombreSinValidar from "@/components/inputs/InputNombreSinValidar";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

import { limpiarCampos } from "@/utils/limpiarForm";

export default function FormCrearArchivo({
  acciones,
  datosArchivo,
  validaciones,
}) {
  const dispatch = useDispatch();

  const { setIdCarpeta, setArchivo, setNombre, setDescripcion, setAlias } = acciones;

  const { idCarpeta, archivo, nombre, descripcion, alias } = datosArchivo;

  const { validarAlias, setValidarAlias } = validaciones;

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <DivScroll>
        <InputNombreSinValidar
          value={nombre}
          setValue={setNombre}
          nombre={"Nombre"}
          placeholder={"expediente n° 001 - 1998"}
        />

        <InputDescripcion
          value={descripcion}
          setValue={setDescripcion}
          rows={6}
          max={500}
          autoComplete="off"
        />

        <InputNombreEstante
          value={alias}
          setValue={setAlias}
          validarEstante={validarAlias}
          setValidarEstante={setValidarAlias}
          nombre={"Alias"}
          indice="carpeta2"
          placeholder={"expediente no 001 1998"}
        />

        <AgruparCamposForm>
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={() => {
              dispatch(cerrarModal("crear"));
              dispatch(abrirModal("confirmar"));
            }}
            nombre={"Crear"}
            campos={{
              archivo,
              nombre,
              descripcion,
              alias,
              idCarpeta,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({
                setIdCarpeta,
                setArchivo,
                setNombre,
                setDescripcion,
                setAlias,
              });
            }}
            campos={{
              idCarpeta,
              archivo,
              nombre,
              descripcion,
              alias,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
