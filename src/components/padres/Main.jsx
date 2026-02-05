export default function Main({ children, className, style, onClick, ref }) {
  const clasePorDefecto = ``;

  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <main className={nuevaClase} style={style} onClick={onClick} ref={ref}>
      {children}
    </main>
  );
}

/**
export default function Main({ children }) {
  return (
    <main className="container mx-auto px-2 flex items-center justify-center h-screen">
      {children}
    </main>
  );
}
*/
