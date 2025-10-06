import Titulos from "./Titulos";
import Section from "@/components/padres/Section";

export default function SectionPrimary({ children, nombre }) {
  return (
    <Section
      className={`w-full flex flex-col ${
        nombre ? "gap-2" : ""
      } items-center sm:max-w-2xl bg-white bg-opacity-90 backdrop-blur-md rounded-md shadow-xl px-1 py-2 sm:px-6`}
    >
      {nombre && <Titulos indice={2} titulo={nombre} />}
      {children}
    </Section>
  );
}
