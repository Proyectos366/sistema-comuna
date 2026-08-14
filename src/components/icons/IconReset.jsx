const IconoReset = ({ className = "text-[#ffffff] sm:hidden", ...props }) => (
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
    <path d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6C142.7 51.6 203.9 24 272 24c132.5 0 240 107.5 240 240S404.5 504 272 504C163.5 504 71.7 431.8 41.7 332.1c-4.1-13.6 3.5-28 17.1-32.1s28 3.5 32.1 17.1C116 398.8 187.2 456 272 456c106 0 192-86 192-192S378 72 272 72c-54.8 0-103.9 22.3-139.3 58.2l44.3 44.3c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z" />
  </svg>
);

export default IconoReset;
