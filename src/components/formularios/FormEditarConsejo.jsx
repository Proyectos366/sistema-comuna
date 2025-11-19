import SelectOpcion from "../SelectOpcion";
import LabelInput from "../inputs/LabelInput";
import BotonAceptarCancelar from "../botones/BotonAceptarCancelar";
import Formulario from "../Formulario";
import MostarMsjEnModal from "../MostrarMsjEnModal";
import Input from "../inputs/Input";

export default function FormEditarConsejo({
  idComuna,
  cambiarSeleccionComuna,
  nombre,
  setNombre,
  comunas,
  limpiarCampos,
  setNombreComuna,
  mostrarMensaje,
  editar,
  mensaje,
}) {
  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <div className="flex flex-col w-full gap-2 px-1">
        <SelectOpcion
          idOpcion={idComuna}
          nombre="Comunas"
          handleChange={cambiarSeleccionComuna}
          opciones={comunas}
          seleccione="Seleccione"
          setNombre={setNombreComuna}
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
              idComuna,
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
