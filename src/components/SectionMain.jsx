// components/SectionMain.jsx - MODIFICAR
import Section from "@/components/padres/Section";

export default function SectionMain({ children, className, indice }) {
  const clasePorDefecto = `w-full h-full rounded-md p-2 sm:p-6 flex flex-col items-center justify-center ${!indice ? 'gap-4' : 'gap-10'} bg-gradient-to-b from-[#f3f4f6] via-[#e5e7eb] to-[#d1d5dc]`;

  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return <Section className={nuevaClase}>{children}</Section>;
}
