export default function Formulario({ children, onSubmit, className, encType }) {
  const clasePorDefecto = `space-y-4 sm:space-y-2 w-full`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <form encType={encType} onSubmit={onSubmit} className={nuevaClase}>
      {children}
    </form>
  );
}
