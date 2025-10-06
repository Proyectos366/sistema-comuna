import Titulos from "./Titulos";
import Section from "@/components/padres/Section";

export default function SectionSecondary({ children, nombre }) {
  return (
    <Section
      className={`flex flex-col ${
        nombre ? "gap-2" : ""
      } w-full max-w-2xl py-2 bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-xl`}
    >
      {nombre && <Titulos indice={2} titulo={nombre} />}
      {children}
    </Section>
  );
}
