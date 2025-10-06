import Titulos from "@/components/Titulos";
import Section from "@/components/padres/Section";
import Div from "@/components/padres/Div";
import ButtonAdd from "@/components/botones/ButtonAdd";

export default function SectionTertiary({ children, nombre, funcion }) {
  return (
    <Section
      className={`flex flex-col ${
        nombre ? "gap-4" : ""
      } w-full max-w-2xl py-2 bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-xl px-6`}
    >
      {nombre && (
        <Div className="w-full flex justify-between items-center">
          <Titulos indice={2} titulo={nombre} />
          <ButtonAdd onClick={funcion} />
        </Div>
      )}

      {children}
    </Section>
  );
}
