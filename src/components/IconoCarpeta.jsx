export default function IconoCarpeta({ indice }) {
  return (
    <>
      <div className="border p-2 rounded-full">
        {indice === 1 ? (
          <img className="w-8 h-8" src="/img/estante.jpg" alt="Imagen de los" />
        ) : (
          <img
            className="w-8 h-8"
            src="/img/carpeta.png"
            alt="Imagen de la carpeta"
          />
        )}
      </div>
    </>
  );
}
