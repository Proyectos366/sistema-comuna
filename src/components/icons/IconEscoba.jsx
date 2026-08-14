const IconoEscoba = ({ className = "text-[#ffffff] sm:hidden", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="24"
    height="24"
    fill="currentColor"
    stroke="currentColor"
    className={className}
    {...props}
  >
    <path d="M112 112c0-26.5 21.5-48 48-48s48 21.5 48 48V288h-96V112zM0 416c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64v32c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V416zM288 288V112c0-53-43-96-96-96S96 59 96 112V288H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H288z" />
  </svg>
);

export default IconoEscoba;
