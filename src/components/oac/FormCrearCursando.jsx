import SelectOpcion from "../SelectOpcion";
import LabelInput from "../LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import MenuDesplegable from "../MenuDesplegable";
import InputCheckBox from "../InputCheckBox";

export default function FormCrearCursando({
  abrirModal,
  cedula,
  setCedula,
  genero,
  setGenero,
  edad,
  setEdad,
  dondeCrear,
  idComuna,
  idConsejo,
  clases,
  cambiarSeleccionComuna,
  cambiarSeleccionConsejo,
  comunas,
  consejos,
  setNameComuna,
  setNameConsejo,
  seleccionarClases,
  toggleGenero,
  toggleClases,
}) {
  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-4"
    >
      {dondeCrear === 1 ? (
        <SelectOpcion
          idOpcion={idComuna}
          nombre={"Comunas"}
          handleChange={cambiarSeleccionComuna}
          opciones={comunas}
          seleccione={"Seleccione"}
          setNombre={setNameComuna}
        />
      ) : (
        <SelectOpcion
          idOpcion={idConsejo}
          nombre={"Consejos comunales"}
          handleChange={cambiarSeleccionConsejo}
          opciones={consejos}
          seleccione={"Seleccione"}
          setNombre={setNameConsejo}
        />
      )}

      {(idComuna || idConsejo) && (
        <>
          <div className="">
            <LabelInput nombre={"Cedula"} value={cedula} setValue={setCedula} />
          </div>

          <div className="">
            <LabelInput nombre={"Edad"} value={edad} setValue={setEdad} />
          </div>

          <div className="flex flex-col w-full">
            <span>Genero</span>
            <div className="flex justify-evenly border border-gray-300 py-2 mt-1 rounded-md hover:border hover:border-[#082158]">
              {[
                { id: 1, nombre: "Masculino" },
                { id: 2, nombre: "Femenino" },
              ].map((opcion) => (
                <InputCheckBox
                  altura={5}
                  key={opcion.id}
                  id={opcion.id}
                  nombre={opcion.nombre}
                  isChecked={genero === opcion.id} // Solo una opción puede estar seleccionada
                  onToggle={() => toggleGenero(opcion.id)} // Cambia el estado con la opción elegida
                />
              ))}
            </div>
          </div>

          <div className="flex">
            <div className="mt-1 uppercase block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all">
              {clases?.map((clases) => (
                <InputCheckBox
                  key={clases.id}
                  id={clases.id}
                  nombre={clases.nombre}
                  isChecked={seleccionarClases.includes(clases.id)}
                  onToggle={toggleClases}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <BotonAceptarCancelar
              indice={"aceptar"}
              aceptar={abrirModal}
              nombre={"Crear"}
              campos={{
                cedula,
                edad,
                genero,
                seleccionarClases,
              }}
            />

            <BotonAceptarCancelar
              indice={"limpiar"}
              aceptar={() => {
                limpiarCampos({
                  setCedula,
                  setEdad,
                  setGenero,
                });
              }}
              nombre={"Limpiar"}
              campos={{
                cedula,
                edad,
                genero,
              }}
            />
          </div>
        </>
      )}
    </Formulario>
  );
}
