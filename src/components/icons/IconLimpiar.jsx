const IconoLimpiar = ({ className = "text-[#ffffff] sm:hidden", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="24"
    height="24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="11"
    className={className}
    {...props}
  >
    <path d="M448 64L64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64zM64 128l384 0c17.6 0 32 14.4 32 32l-64 0L32 160c0-17.6 14.4-32 32-32zm-32 64l64 0L96 352 32 352l0-160zm384 0l0 160-256 0 0-160 256 0zM32 384l0-32 64 0 0 32c0 17.6-14.4 32-32 32s-32-14.4-32-32zm384 32c-17.6 0-32-14.4-32-32l0-32 64 0 0 32c0 17.6-14.4 32-32 32z" />
    <path d="M128 224l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
  </svg>
);

export default IconoLimpiar;
