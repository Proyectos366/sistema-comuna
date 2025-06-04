import Link from "next/link";

export default function LinkPaginas({ href, className, nombre }) {
  const clasePorDefecto = `text-lg sm:text-xl text-blue-500 hover:underline hover:text-red-500 hover:font-semibold transition-all ease-in-out duration-500`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <Link href={href} className={nuevaClase}>
      {nombre}
    </Link>
  );
}
