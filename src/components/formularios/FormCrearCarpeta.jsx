import { useDispatch } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import InputNombreEstante from "@/components/inputs/InputNombreEstante";
import InputNombreSinValidar from "@/components/inputs/InputNombreSinValidar";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import SelectOpcion from "@/components/SelectOpcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

import { limpiarCampos } from "@/utils/limpiarForm";
import { cambiarSeleccionNivel } from "@/utils/dashboard/cambiarSeleccionNivel";
import { cambiarSeleccionSeccion } from "@/utils/dashboard/cambiarSeleccionSeccion";
import { generarItems } from "@/utils/generarItems";

export default function FormCrearCarpeta({
  acciones,
  datosCarpeta,
  validaciones,
}) {
  const dispatch = useDispatch();

  const { setNombre, setDescripcion, setAlias, setNivel, setSeccion } =
    acciones;

  const {
    idEstante,
    nombre,
    descripcion,
    alias,
    nivel,
    seccion,
    nivelEstante,
    seccionEstante,
  } = datosCarpeta;

  const {
    validarNombre,
    setValidarNombre,
    validarAlias,
    setValidarAlias,
    validarniveles,
    setValidarniveles,
    validarSecciones,
    setValidarSecciones,
  } = validaciones;

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
          placeholder={"carpeta marrón n° 001"}
        />

        <InputDescripcion
          value={descripcion}
          setValue={setDescripcion}
          rows={6}
          max={500}
          autoComplete="off"
        />

        <SelectOpcion
          idOpcion={nivel}
          nombre={"Nivel"}
          handleChange={(e) => {
            cambiarSeleccionNivel(e, setNivel);
          }}
          opciones={generarItems(nivelEstante, { indice: true })}
          seleccione={"Seleccione"}
        />

        <SelectOpcion
          idOpcion={seccion}
          nombre={"Sección"}
          handleChange={(e) => {
            cambiarSeleccionSeccion(e, setSeccion);
          }}
          opciones={generarItems(seccionEstante)}
          seleccione={"Seleccione"}
        />

        <InputNombreEstante
          value={alias}
          setValue={setAlias}
          validarEstante={validarAlias}
          setValidarEstante={setValidarAlias}
          nombre={"Alias"}
          indice="carpeta2"
          placeholder={"carpeta marron no 001"}
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
              nombre,
              descripcion,
              alias,
              nivel,
              seccion,
              idEstante,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({
                setNombre,
                setDescripcion,
                setAlias,
                setNivel,
                setSeccion,
              });
            }}
            campos={{
              nombre,
              descripcion,
              alias,
              nivel,
              seccion,
              idEstante,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
