export default function Li({ children, className, onClick }) {
  return <li className={className} onClick={onClick}>{children}</li>;
}
