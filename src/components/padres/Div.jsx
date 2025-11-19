export default function Div({ children, className, style, onClick, ref }) {
  return (
    <div className={className} style={style} onClick={onClick} ref={ref}>
      {children}
    </div>
  );
}
