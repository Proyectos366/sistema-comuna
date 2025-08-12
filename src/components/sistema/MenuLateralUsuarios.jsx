import EnlacesBarraLateral from "./EnlacesBarraLateral";

export default function MenuLateralUsuario({
  abrirPanel,
  cambiarRuta,
  vista,
  id_rol,
  nombreDepartamento,
}) {
  return (
    <>
      <section
        className={` w-48 h-full p-2 fixed inset-y-0 left-0 transform ${
          abrirPanel
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } transition-all duration-700 ease-in-out`}
      >
        <div className="space-y-4 h-full flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="py-1 flex flex-col justify-center items-center">
              <div className="flex flex-col items-center p-1 border border-white rounded-full">
                <img
                  className="w-full p-2 h-14"
                  src="/img/logo_contraloria.png"
                  alt="Logo en la barra laterall izquierda"
                />
              </div>
              <p className="text-white text-center fuente-arial-black text-xs shadow-lg">
                Contraloria Municipio Zamora
              </p>
            </div>

            <div className="mt-2 flex flex-col space-y-2 overflow-y-auto h-[390px] no-scrollbar">
              <EnlacesBarraLateral
                id_rol={id_rol}
                cambiarRuta={cambiarRuta}
                vista={vista}
                vistaActual={"inicio"}
                nombre={"Inicio"}
              />

              {id_rol === 1 && (
                <>
                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"usuarios"}
                    nombre={"Usuarios"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"paises"}
                    nombre={"Paises"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"estados"}
                    nombre={"Estados"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"municipios"}
                    nombre={"Municipios"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"parroquias"}
                    nombre={"Parroquias"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"instituciones"}
                    nombre={"Instituciones"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"oac"}
                    nombre={"OAC"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"departamentos"}
                    nombre={"Departamentos"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"cargos"}
                    nombre={"Cargos"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"formaciones"}
                    nombre={"Formaciones"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"participantes"}
                    nombre={"Participantes"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"comunas"}
                    nombre={"Comunas"}
                  />
                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"circuitos-comunales"}
                    nombre={"Circuitos comunales"}
                  />
                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"consejos-comunales"}
                    nombre={"Consejos comunales"}
                  />
                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"voceros"}
                    nombre={"Voceros"}
                  />
                </>
              )}

              {id_rol === 2 && (
                <>
                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"usuarios"}
                    nombre={"Usuarios"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"departamentos"}
                    nombre={"Departamentos"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"formaciones"}
                    nombre={"Formaciones"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"participantes"}
                    nombre={"Participantes"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"comunas"}
                    nombre={"Comunas"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"circuitos-comunales"}
                    nombre={"Circuitos"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"consejos-comunales"}
                    nombre={"Consejo"}
                  />

                  <EnlacesBarraLateral
                    id_rol={id_rol}
                    cambiarRuta={cambiarRuta}
                    vista={vista}
                    vistaActual={"voceros"}
                    nombre={"Voceros"}
                  />
                </>
              )}

              {id_rol === 3 && (
                <>
                  {nombreDepartamento === "oac" && (
                    <>
                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"oac"}
                        nombre={"OAC"}
                      />

                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"formaciones"}
                        nombre={"Formaciones"}
                      />

                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"participantes"}
                        nombre={"Participantes"}
                      />

                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"comunas"}
                        nombre={"Comunas"}
                      />

                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"consejos-comunales"}
                        nombre={"Consejo"}
                      />

                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"voceros"}
                        nombre={"Voceros"}
                      />
                    </>
                  )}
                </>
              )}

              {id_rol === 4 && (
                <>
                  {nombreDepartamento === "oac" && (
                    <>
                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"oac"}
                        nombre={"OAC"}
                      />
                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"participantes"}
                        nombre={"Participantes"}
                      />

                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"comunas"}
                        nombre={"Comunas"}
                      />

                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"consejos-comunales"}
                        nombre={"Consejo"}
                      />

                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"voceros"}
                        nombre={"Voceros"}
                      />
                    </>
                  )}

                  {nombreDepartamento === "administracion y presupuesto" && (
                    <>
                      <EnlacesBarraLateral
                        id_rol={id_rol}
                        cambiarRuta={cambiarRuta}
                        vista={vista}
                        vistaActual={"administracion"}
                        nombre={"Administración y presupuesto"}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            <img
              className="w-full h-32 opacity-50"
              src="/img/busqueda.png"
              alt="Imagen de busqueda"
            />
          </div>
        </div>
      </section>
    </>
  );
}
