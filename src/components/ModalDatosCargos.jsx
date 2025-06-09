export default function ModalDatosCargos({ nombre, cargos, todosCargos }) {
  return (
    <div className="flex justify-between w-full sm:w-[80%]">
      <span className="w-1/2 flex">{nombre}: </span>
      <div className="w-1/2 flex flex-col">
        {todosCargos
          .map((id) => {
            const cargo = cargos.find((c) => c.id === id);
            return cargo ? cargo.nombre : "";
          })
          .map((nombre, index) => (
            <b key={index} className="w-1/2 flex">
              {nombre}
            </b>
          ))}
      </div>
    </div>
  );
}
