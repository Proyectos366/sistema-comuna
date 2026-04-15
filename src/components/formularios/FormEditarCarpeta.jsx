import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import SelectOpcion from "@/components/SelectOpcion";
import InputNombreSinValidar from "@/components/inputs/InputNombreSinValidar";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

import { textRegex } from "@/utils/regex/textRegex";
import { limpiarCampos } from "@/utils/limpiarForm";
import { cambiarSeleccionNivel } from "@/utils/dashboard/cambiarSeleccionNivel";
import { cambiarSeleccionSeccion } from "@/utils/dashboard/cambiarSeleccionSeccion";
import { generarItems, generarItemsSecciones } from "@/utils/generarItems";

export default function FormEditarCarpeta({
  acciones,
  datosCarpeta,
  validaciones,
}) {
  const dispatch = useDispatch();

  const { setIdCarpeta, setNombre, setDescripcion, setNivel, setSeccion } =
    acciones;

  const {
    idCarpeta,
    nombre,
    descripcion,
    nivel,
    seccion,
    nivelEstante,
    seccionEstante,
  } = datosCarpeta;

  const {
    validarNombre,
    setValidarNombre,
    validarniveles,
    setValidarniveles,
    validarSecciones,
    setValidarSecciones,
  } = validaciones;

  useEffect(() => {
    const validarYActualizar = (valor, setValidar) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = textRegex.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
      }
    };

    validarYActualizar(nombre, setValidarNombre);

    // Transformar niveles
    if (nivel >= 0) {
      const nivelesStr = String(nivel);

      const nivelesTransformado =
        nivelesStr.length === 1 ? `0${nivelesStr}` : nivelesStr;
      if (nivelesTransformado !== nivel) {
        setNivel(nivelesTransformado);
      }
    }

    // Transformar secciones
    if (seccion >= 1) {
      const seccionesStr = String(seccion);

      if (seccionesStr !== seccion) {
        setSeccion(seccionesStr);
      }
    }
  }, [nombre, nivel, seccion, descripcion]);

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
          opciones={generarItems(nivelEstante, {
            indice: true,
            formatoDigitos: 2,
            nombreCero: "cabecera",
          })}
          seleccione={"Seleccione"}
        />

        <SelectOpcion
          idOpcion={seccion}
          nombre={"Sección"}
          handleChange={(e) => {
            cambiarSeleccionSeccion(e, setSeccion);
          }}
          opciones={generarItemsSecciones(seccionEstante)}
          seleccione={"Seleccione"}
        />

        <AgruparCamposForm>
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={() => {
              dispatch(cerrarModal("editar"));
              dispatch(abrirModal("confirmarCambios"));
            }}
            nombre={"Actualizar"}
            campos={{
              nombre,
              descripcion,
              nivel,
              seccion,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({
                setNombre,
                setDescripcion,
                setNivel,
                setSeccion,
              });
            }}
            campos={{
              nombre,
              descripcion,
              nivel,
              seccion,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
