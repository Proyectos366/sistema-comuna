import SelectOpcion from "../SelectOpcion";
import LabelInput from "../inputs/LabelInput";
import BotonAceptarCancelar from "../botones/BotonAceptarCancelar";
import Formulario from "../Formulario";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import Input from "../inputs/Input";

export default function FormEditarComuna({
  idParroquia,
  cambiarSeleccionParroquia,
  nombre,
  setNombre,
  parroquias,
  limpiarCampos,
  setNombreParroquia,
  mostrarMensaje,
  editar,
  mensaje,
}) {
  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <div className="flex flex-col w-full gap-2 px-1">
        <SelectOpcion
          idOpcion={idParroquia}
          nombre="Parroquias"
          handleChange={cambiarSeleccionParroquia}
          opciones={parroquias}
          seleccione="Seleccione"
          setNombre={setNombreParroquia}
          // indice={1}
        />

        <div className="flex flex-col sm:flex-row gap-2 gap-x-4">
          <LabelInput nombre={"Nombre"}>
            <Input
              type={"text"}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </LabelInput>
        </div>

        <div className="">
          <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
        </div>

        <div className="flex space-x-4">
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={editar}
            nombre={"Guardar cambios"}
            campos={{
              nombre,
            }}
          />

          <BotonAceptarCancelar
            indice={"limpiar"}
            aceptar={() => {
              limpiarCampos({
                setNombre,
              });
            }}
            nombre={"Limpiar"}
            campos={{
              nombre,
            }}
          />
        </div>
      </div>
    </Formulario>
  );
}
