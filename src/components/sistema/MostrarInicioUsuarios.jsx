import Titulos from "../Titulos";
import Boton from "../Boton";
import Input from "../Input";
import InputCheckBox from "../InputCheckBox";
import DivDosConsultas from "./opciones_inicio/DivDosConsultas";
import ConsultarCedula from "./opciones_inicio/ConsultarCedula";
import ConsultarTodasParroquias from "./opciones_inicio/ConsultarParroquias";
import ConsultarTodasComunas from "./opciones_inicio/ConsultarComunas";
import ConsultarTodosConsejos from "./opciones_inicio/ConsultarConsejosComunales";
import Modal from "../Modal";
import MostarMsjEnModal from "../MostrarMsjEnModal";

export default function MostrarAlInicioUsuarios({
  mostrar,
  cerrarModal,
  mostrarMensaje,
  mensaje,
  abrirModal,
  mostrarModal,
  abrirMensaje,
  limpiarCampos,
  ejecutarAccionesConRetraso,
  id_usuario,
  buscador,
  setBuscador,
  validarCedula,
  setValidarCedula,
  seleccionarConsulta,
  setSeleccionarConsulta,
  consultarTodasParroquias,
  consultarTodasComunas,
  consultarTodosConsejos,
  consultarTodos,
  cedula,
  setCedula,
  consultarVoceroCedula,
  consultarVoceroParroquia,
  consultarVoceroComuna,
  consultarVoceroConsejo,
  consultarVoceroTodos,
  voceroPorCedula,
  voceroPorParroquia,
  voceroPorComuna,
  voceroPorConsejo,
  voceroPorTodos,
  idOpcion,
  setIdOpcion,
  todasParroquias,
  todasComunas,
  todosConsejos,
  loading,
  expandido,
  setExpandido,
}) {
  const toggleConsultar = (id) => {
    const nuevoId = seleccionarConsulta === id ? null : id;
    setSeleccionarConsulta(nuevoId);

    // Ejecutar solo si se está seleccionando (no al desmarcar)
    if (nuevoId !== null) {
      switch (id) {
        case 1:
          break;
        case 2:
          consultarTodasParroquias();
          break;
        case 3:
          consultarTodasComunas();
          break;
        case 4:
          consultarTodosConsejos();
          break;
        case 5:
          consultarTodos();
          break;
        default:
          break;
      }
    }
  };

  const formatearCedula = (valor) => {
    return valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChangeCedula = (e) => {
    let limpio = e.target.value.replace(/\D/g, ""); // solo números

    if (limpio.length > 8) limpio = limpio.slice(0, 8); // máximo 8 dígitos

    if (limpio.startsWith("0")) return; // no permitir que comience con 0

    setCedula(limpio);
  };

  const cambiarSeleccionParroquia = (e) => {
    const valor = e.target.value;
    setIdOpcion(valor);
  };

  const cambiarSeleccionComuna = (e) => {
    const valor = e.target.value;
    setIdOpcion(valor);
  };

  const cambiarSeleccionConsejo = (e) => {
    const valor = e.target.value;
    setIdOpcion(valor);
  };

  return (
    <>
      <Modal isVisible={mostrar} onClose={cerrarModal} titulo={"Respuesta"}>
        <MostarMsjEnModal mostrarMensaje={mostrarMensaje} mensaje={mensaje} />
      </Modal>

      <div className="flex flex-col mt-3">
        <div className="flex justify-start">
          <Titulos indice={2} titulo={"Bienvenidos"} />
        </div>

        {/* <div className="border border-gray-200 p-2 rounded-md mb-2">
          <div className="flex flex-wrap gap-2 sm:justify-between">
            <div className="w-full sm:w-auto">
              <InputCheckBox
                id={1}
                isChecked={seleccionarConsulta === 1}
                onToggle={toggleConsultar}
                nombre="Cédula"
              />
            </div>
            <div className="w-full sm:w-auto">
              <InputCheckBox
                id={2}
                isChecked={seleccionarConsulta === 2}
                onToggle={toggleConsultar}
                nombre="Parroquia"
              />
            </div>
            <div className="w-full sm:w-auto">
              <InputCheckBox
                id={3}
                isChecked={seleccionarConsulta === 3}
                onToggle={toggleConsultar}
                nombre="Comuna"
              />
            </div>
            <div className="w-full sm:w-auto">
              <InputCheckBox
                id={4}
                isChecked={seleccionarConsulta === 4}
                onToggle={toggleConsultar}
                nombre="Consejo comunal"
              />
            </div>
            <div className="w-full sm:w-auto">
              <InputCheckBox
                id={5}
                isChecked={seleccionarConsulta === 5}
                onToggle={toggleConsultar}
                nombre="Todos"
              />
            </div>
          </div>
        </div>

        <DivDosConsultas>
          <ConsultarCedula
            seleccionarConsulta={seleccionarConsulta}
            formatearCedula={formatearCedula}
            cedula={cedula}
            handleChangeCedula={handleChangeCedula}
            consultarVoceroCedula={consultarVoceroCedula}
            voceroPorCedula={voceroPorCedula}
            abrirModal={abrirModal}
          />

          <ConsultarTodasParroquias
            seleccionarConsulta={seleccionarConsulta}
            idParroquia={idOpcion}
            cambiarSeleccionParroquia={cambiarSeleccionParroquia}
            parroquias={todasParroquias}
            voceroPorParroquia={voceroPorParroquia}
            expandido={expandido}
            setExpandido={setExpandido}
          />

          <ConsultarTodasComunas
            seleccionarConsulta={seleccionarConsulta}
            idParroquia={idOpcion}
            cambiarSeleccionComuna={cambiarSeleccionComuna}
            comunas={todasComunas}
          />

          <ConsultarTodosConsejos
            seleccionarConsulta={seleccionarConsulta}
            idConsejo={idOpcion}
            cambiarSeleccionConsejo={cambiarSeleccionConsejo}
            consejos={todosConsejos}
          />
        </DivDosConsultas> */}
      </div>
    </>
  );
}

/**
export default function MostrarAlInicioUsuarios() {
  return (
    <div className="h-full flex flex-col">
      <div className="h-10 flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-between items-center">
        <Titulos indice={2} titulo={"Bienvenidos"} />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <img className="opacity-40 max-w-[300px]" src="/img/fondo.png" alt="" />
      </div>
    </div>
  );
}
 */
