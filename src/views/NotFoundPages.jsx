import Link from "next/link";

import Section from "@/components/padres/Section";
import Titulos from "@/components/Titulos";
import P from "@/components/padres/P";

export default function NotFoundPages() {
  return (
    <Section className="flex flex-col items-center justify-center gap-8 h-screen text-center text-[#ffffff]">
      <Titulos
        indice={2}
        titulo={"404"}
        className={
          "text-6xl font-extrabold tracking-tight sm:text-7xl !text-[#ffffff]"
        }
      />

      <Titulos
        indice={6}
        titulo={"Página no encontrada"}
        className={"text-2xl font-semibold sm:text-3xl"}
      />

      <P className="max-w-md text-[#e5e7eb]">
        Lo sentimos, la página que estás buscando no existe. Es posible que
        hayas escrito mal la dirección o que la página haya sido eliminada.
      </P>

      <Link
        className="rounded-lg bg-[#286bfa] px-6 py-3 font-semibold text-[#ffffff] shadow-md transition duration-300 ease-in-out hover:bg-[#155dfc] focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:ring-offset-2 focus:ring-offset-[#0648d6]"
        href={"/"}
      >
        Volver al inicio
      </Link>
    </Section>
  );
}
