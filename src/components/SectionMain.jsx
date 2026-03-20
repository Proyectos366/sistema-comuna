// components/SectionMain.jsx - MODIFICAR
import Section from "@/components/padres/Section";

export default function SectionMain({ children, className }) {
  const clasePorDefecto = `w-full h-full rounded-md p-2 sm:p-6 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#f3f4f6] via-[#e5e7eb] to-[#d1d5dc] text-[#101828]`;

  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return <Section className={nuevaClase}>{children}</Section>;
}

// import Section from "@/components/padres/Section";

// export default function SectionMain({ children, className }) {
//   const clasePorDefecto = `rounded-md p-2 sm:p-6 min-h-screen flex flex-col items-center sm:justify-center gap-4 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900`;
//   const nuevaClase = className
//     ? `${clasePorDefecto} ${className}`
//     : clasePorDefecto;

//   return <Section className={nuevaClase}>{children}</Section>;
// }
