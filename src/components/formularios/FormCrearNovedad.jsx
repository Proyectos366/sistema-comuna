import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import SelectOpcion from "@/components/SelectOpcion";
import InputNombre from "@/components/inputs/InputNombre";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

export default function FormCrearNovedad({
  usuarioActivo,
  idInstitucion,
  idDepartamento,
  idPrioridad,
  setIdInstitucion,
  setIdDepartamento,
  setIdPrioridad,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  validarNombre,
  setValidarNombre,
  instituciones,
  departamentos,
  setNombreDepartamento,
  setNombreInstitucion,
  setNombrePrioridad,
  cambiarSeleccionDepartamento,
  cambiarSeleccionInstitucion,
  cambiarSeleccionPrioridad,
  abrirModal,
  limpiarCampos,
}) {
  const id = usuarioActivo.id_rol === 1 ? idInstitucion : idDepartamento;
  const setId =
    usuarioActivo.id_rol === 1 ? setIdInstitucion : setIdDepartamento;

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col"
    >
      <DivScroll>
        {usuarioActivo.id_rol === 1 && (
          <SelectOpcion
            idOpcion={idInstitucion}
            nombre={"Instituciones"}
            handleChange={cambiarSeleccionInstitucion}
            opciones={instituciones}
            seleccione={"Seleccione"}
            setNombre={setNombreInstitucion}
            indice={1}
          />
        )}

        {usuarioActivo.id_rol !== 1 && (
          <SelectOpcion
            idOpcion={idDepartamento}
            nombre={"Departamentos"}
            handleChange={cambiarSeleccionDepartamento}
            opciones={departamentos}
            seleccione={"Seleccione"}
            setNombre={setNombreDepartamento}
            indice={1}
          />
        )}

        <SelectOpcion
          idOpcion={idPrioridad}
          nombre={"Prioridad"}
          handleChange={cambiarSeleccionPrioridad}
          opciones={[
            { id: 1, nombre: "alta" },
            { id: 2, nombre: "media" },
            { id: 3, nombre: "baja" },
          ]}
          seleccione={"Seleccione"}
          setNombre={setNombrePrioridad}
          indice={1}
        />

        <InputNombre
          value={nombre}
          setValue={setNombre}
          validarNombre={validarNombre}
          setValidarNombre={setValidarNombre}
        />

        <InputDescripcion
          value={descripcion}
          setValue={setDescripcion}
          rows={6}
          max={500}
          autoComplete="off"
        />

        <AgruparCamposForm>
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={abrirModal}
            nombre={"Crear"}
            campos={{
              nombre,
              descripcion,
              id,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({ setNombre, setDescripcion, setId });
            }}
            campos={{
              nombre,
              descripcion,
              id,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
