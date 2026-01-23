import ModalDatos from "./ModalDatos";

// Componente ModalDatosLista.jsx
export default function ModalDatosLista({ datos, objeto }) {
  return datos
    .filter(({ campo, condicional }) => !condicional || objeto[campo])
    .map(({ titulo, campo, transformar }) => {
      return (
        <ModalDatos
          key={titulo}
          titulo={titulo}
          descripcion={transformar ? transformar(objeto[campo]) : objeto[campo]}
        />
      );
    });
}
