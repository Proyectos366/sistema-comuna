import SelectOpcion from "../SelectOpcion";
import LabelInput from "../LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import MenuDesplegable from "../MenuDesplegable";
import InputCheckBox from "../InputCheckBox";
import InputDate from "../InputDate";

export default function FormCrearEstadistica({
  abrirModal,
  limpiarCampos,
  cantidadMujeres,
  setCantidadMujeres,
  cantidadHombres,
  setCantidadHombres,
  modulo,
  setModulo,
  fechaAprobado,
  setFechaAprobado,
  nombreFacilitador,
  setNombreFacilitador,
  idConsejo,
  clases,
  cambiarSeleccionConsejo,
  consejos,
  setNameConsejo,
  seleccionarClases,
  seleccionarModulo,
  setSeleccionarModulo,
  toggleModulo,
  toggleClases,
  setDatos,
}) {
  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-4"
    >
      <SelectOpcion
        idOpcion={idConsejo}
        nombre={"Consejos comunales"}
        handleChange={cambiarSeleccionConsejo}
        opciones={consejos}
        seleccione={"Seleccione"}
        setNombre={setNameConsejo}
        setDatos={setDatos}
        indice={1}
      />

      {idConsejo && (
        <>
          <div className="">
            <LabelInput
              nombre={"Cantidad de hombres"}
              value={cantidadHombres}
              setValue={setCantidadHombres}
            />
            <LabelInput
              nombre={"Cantidad de mujeres"}
              value={cantidadMujeres}
              setValue={setCantidadMujeres}
            />

            {/* <div className="flex flex-col w-full">
              <span>Modulos</span>
              <div className="flex justify-evenly border border-gray-300 py-2 mt-1 rounded-md hover:border hover:border-[#082158]">
                {[
                  { id: 1, nombre: "Modulo I" },
                  { id: 2, nombre: "Modulo II" },
                  { id: 3, nombre: "Modulo III" },
                ].map((modulo) => (
                  <InputCheckBox
                    altura={5}
                    key={modulo.id}
                    id={modulo.id}
                    nombre={modulo.nombre}
                    isChecked={seleccionarModulo.includes(modulo.id)}
                    onToggle={toggleModulo} // Cambia el estado con la opción elegida
                  />
                ))}
              </div>
            </div> */}

            <div className="flex flex-col w-full">
              <span>Modulo</span>
              <div className="flex justify-evenly border border-gray-300 py-2 mt-1 rounded-md hover:border hover:border-[#082158]">
                {[
                  { id: 1, nombre: "Modulo I y II" },
                  { id: 2, nombre: "Modulo III" },
                ].map((opcion) => (
                  <InputCheckBox
                    altura={5}
                    key={opcion.id}
                    id={opcion.id}
                    nombre={opcion.nombre}
                    isChecked={modulo === opcion.id} // Solo una opción puede estar seleccionada
                    onToggle={() => toggleModulo(opcion.id)} // Cambia el estado con la opción elegida
                  />
                ))}
              </div>
            </div>

            <div>
              <InputDate
                max={new Date().toISOString().split("T")[0]}
                type="date"
                value={fechaAprobado}
                onChange={(e) => setFechaAprobado(e.target.value)}
                className="w-full cursor-pointer"
              />
            </div>

            <LabelInput
              nombre={"Facilitador"}
              value={nombreFacilitador}
              setValue={setNombreFacilitador}
            />
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
                cantidadMujeres,
                cantidadHombres,
                modulo,
                seleccionarClases,
                fechaAprobado,
                nombreFacilitador,
              }}
            />

            <BotonAceptarCancelar
              indice={"limpiar"}
              aceptar={() => {
                limpiarCampos({
                  setCantidadMujeres,
                  setCantidadHombres,
                  setModulo,
                  setFechaAprobado,
                  setNombreFacilitador,
                });
              }}
              nombre={"Limpiar"}
              campos={{
                cantidadMujeres,
                cantidadHombres,
                modulo,
                fechaAprobado,
                nombreFacilitador,
              }}
            />
          </div>
        </>
      )}
    </Formulario>
  );
}

/**
 Total mujeres
 hombres
 todos consejos comunales
 total atendidos
 facilitdor, es decir, quien hizo la formacion
 */
