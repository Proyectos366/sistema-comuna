export default function ImagenFondo() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-[-1] flex">
      <img
        className="w-full h-full object-cover opacity-50"
        src="/img/fondo.png"
        alt="Fondo"
      />
      <img
        className="w-full h-full object-cover opacity-50"
        src="/img/fondo.png"
        alt="Fondo"
      />
    </div>
  );
}
