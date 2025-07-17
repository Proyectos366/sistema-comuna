export default function Formulario({ children, onSubmit, className, encType }) {
  const clasePorDefecto = `flex flex-col w-full gap-2`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <form encType={encType} onSubmit={onSubmit} className={nuevaClase}>
      {children}
    </form>
  );
}
