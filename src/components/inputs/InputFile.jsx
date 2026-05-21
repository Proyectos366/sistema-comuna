import DivMensajeInput from "@/components/mensaje/DivMensaje";
import LabelInput from "@/components/inputs/LabelInput";

export default function InputFile({
  value,
  setValue,
  onChange,
  validarArchivo,
  setValidarArchivo,
  disabled = false,
  readOnly = false,
  multiple = false,
  accept = "application/pdf",
  maxSize = 10,
  maxFiles = 5,
  className,
  placeholder = "Seleccionar archivo",
  htmlFor,
  nombre,
  indice,
  name,
  autoComplete,
}) {
  // Obtener extensiones permitidas desde accept
  const getExtensionesPermitidas = (acceptStr) => {
    const extensiones = [];
    const tipos = acceptStr.split(",").map((t) => t.trim());

    tipos.forEach((tipo) => {
      if (tipo.startsWith(".")) {
        extensiones.push(tipo.toLowerCase());
      } else if (tipo.includes("/")) {
        const ext = tipo.split("/")[1];
        extensiones.push(`.${ext}`);
      }
    });

    return extensiones;
  };

  const validarArchivoIndividual = (file) => {
    // Obtener extensión del archivo
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    const extensionesPermitidas = getExtensionesPermitidas(accept);

    // Validar por extensión (más confiable que file.type)
    if (!extensionesPermitidas.includes(extension)) {
      return {
        valido: false,
        mensaje: `"${file.name}" no es un formato válido (${accept})`,
      };
    }

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      return {
        valido: false,
        mensaje: `"${file.name}" supera el límite de ${maxSize}MB`,
      };
    }

    return { valido: true, mensaje: "" };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = (e) => {
    if (readOnly || disabled) return;

    const files = e.target.files;
    if (!files || files.length === 0) {
      setValue?.(multiple ? [] : null);
      setValidarArchivo?.(false);
      onChange?.(null);
      return;
    }

    const archivosArray = multiple ? Array.from(files) : [files[0]];
    const errores = [];
    const archivosValidos = [];

    for (const file of archivosArray) {
      const validacion = validarArchivoIndividual(file);
      if (validacion.valido) {
        archivosValidos.push(file);
      } else {
        errores.push(validacion.mensaje);
      }
    }

    if (errores.length > 0) {
      alert(errores.join("\n"));
      e.target.value = "";
      setValidarArchivo?.(false);
      return;
    }

    // Limitar cantidad de archivos
    const archivosSeleccionados = multiple
      ? archivosValidos.slice(0, maxFiles)
      : archivosValidos[0];

    setValue?.(archivosSeleccionados);
    setValidarArchivo?.(true);
    onChange?.(archivosSeleccionados);
  };

  const eliminarArchivo = (index) => {
    if (multiple && Array.isArray(value)) {
      const nuevosArchivos = value.filter((_, i) => i !== index);
      setValue?.(nuevosArchivos);
      setValidarArchivo?.(true);
      onChange?.(nuevosArchivos);
    } else {
      setValue?.(null);
      setValidarArchivo?.(false);
      onChange?.(null);
    }
  };

  const obtenerNombreArchivos = () => {
    if (!value) return "";
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return "";
      if (value.length === 1) return value[0].name;
      return `${value.length} archivos seleccionados`;
    }
    return value.name || "";
  };

  // Mostrar extensiones permitidas de forma legible
  const mostrarExtensiones = () => {
    return accept
      .split(",")
      .map((a) =>
        a
          .trim()
          .replace("application/", "")
          .replace("image/", "")
          .replace("video/", "")
          .toUpperCase(),
      )
      .join(", ");
  };

  return (
    <LabelInput
      htmlFor={htmlFor ? htmlFor : indice ? `archivo-${indice}` : "archivo"}
      nombre={nombre ? nombre : "Archivo"}
    >
      <div className={`space-y-3 ${className}`}>
        <div
          className={`
          relative border-2 border-dashed rounded-xl p-6 
          transition-all duration-200
          ${
            disabled || readOnly
              ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
              : "bg-yellow-50 border-yellow-300 hover:bg-yellow-100 hover:border-yellow-400 cursor-pointer"
          }
        `}
        >
          <label
            htmlFor={
              htmlFor ? htmlFor : indice ? `archivo-${indice}` : "archivo"
            }
            className="cursor-pointer block"
          >
            <input
              id={htmlFor ? htmlFor : indice ? `archivo-${indice}` : "archivo"}
              type="file"
              key={multiple ? value?.length || "empty" : value?.name || "empty"}
              onChange={handleFileChange}
              className="hidden"
              accept={accept}
              multiple={multiple}
              disabled={disabled || readOnly}
              name={name}
              autoComplete={autoComplete}
            />

            <div className="flex flex-col items-center space-y-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-12 h-12 transition-colors ${disabled || readOnly ? "text-gray-400" : "text-yellow-500"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <div className="text-center">
                <p
                  className={`text-sm font-medium ${disabled || readOnly ? "text-gray-500" : "text-gray-700"}`}
                >
                  {placeholder}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {mostrarExtensiones()} • Máx. {maxSize}MB
                  {multiple && ` • Hasta ${maxFiles} archivos`}
                </p>
              </div>
            </div>
          </label>
        </div>

        {value && (multiple ? value.length > 0 : true) && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600">
              {multiple ? "Archivos seleccionados:" : "Archivo seleccionado:"}
            </p>

            <div
              className={multiple ? "space-y-2 max-h-40 overflow-y-auto" : ""}
            >
              {multiple && Array.isArray(value) ? (
                value.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-2 group hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <svg
                        className="w-4 h-4 text-red-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm text-gray-700 truncate"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    {!disabled && !readOnly && (
                      <button
                        type="button"
                        onClick={() => eliminarArchivo(idx)}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Eliminar archivo"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 group hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <svg
                      className="w-5 h-5 text-red-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm text-gray-700 truncate"
                        title={value.name}
                      >
                        {value.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(value.size)}
                      </p>
                    </div>
                  </div>

                  {!disabled && !readOnly && (
                    <button
                      type="button"
                      onClick={() => eliminarArchivo()}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Eliminar archivo"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {value && !validarArchivo && (
          <DivMensajeInput
            mensaje={`Archivo${multiple ? "s" : ""} inválido${multiple ? "s" : ""}`}
          />
        )}
      </div>
    </LabelInput>
  );
}

/** 
export default function InputFile({ value, setValue }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Por favor, selecciona un archivo PDF.");
      event.target.value = "";
    } else {
      setValue(file); // Directamente, sin setTimeout ni setear null
    }
  };

  return (
    <div className={`flex space-x-10 sm:w-1/3 space-y-1 h-20 border`}>
      <label
        htmlFor="file-upload"
        className={`cursor-pointer custom-file-upload`}
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="40"
            height="40"
            viewBox="0 0 512 512"
          >
            <path
              fill="#EFC849"
              d="M7.9,256C7.9,119,119,7.9,256,7.9C393,7.9,504.1,119,504.1,256c0,137-111.1,248.1-248.1,248.1C119,504.1,7.9,393,7.9,256z"
            ></path>
            <path
              fill="#F5F5F5"
              d="M159.1,106.1c-9.2,0-16.7,7.5-16.7,16.7v267.7c0,9.2,7.5,16.7,16.7,16.7h192.4c9.2,0,16.7-7.5,16.7-16.7v-207l-80.7-77.5H159.1z"
            ></path>
            <path
              fill="#E1E1E1"
              d="M368.3,183.6h-63.9c-9.2,0-16.7-7.5-16.7-16.7v-60.8L368.3,183.6z"
            ></path>
            <path
              fill="#C9C9C8"
              d="M344.7 206.5c0 2.9-2.3 5.2-5.2 5.2H172.4c-2.9 0-5.2-2.3-5.2-5.2l0 0c0-2.9 2.3-5.2 5.2-5.2h167.1C342.4 201.2 344.7 203.6 344.7 206.5L344.7 206.5zM344.7 233.9c0 2.9-2.3 5.2-5.2 5.2H172.4c-2.9 0-5.2-2.3-5.2-5.2l0 0c0-2.9 2.3-5.2 5.2-5.2h167.1C342.4 228.7 344.7 231 344.7 233.9L344.7 233.9zM344.7 260c0 2.9-2.3 5.2-5.2 5.2H172.4c-2.9 0-5.2-2.3-5.2-5.2l0 0c0-2.9 2.3-5.2 5.2-5.2h167.1C342.4 254.8 344.7 257.1 344.7 260L344.7 260zM344.7 287.4c0 2.9-2.3 5.2-5.2 5.2H172.4c-2.9 0-5.2-2.3-5.2-5.2l0 0c0-2.9 2.3-5.2 5.2-5.2h167.1C342.4 282.2 344.7 284.5 344.7 287.4L344.7 287.4zM259.9 309.6h-87.5c-2.9 0-5.2 2.3-5.2 5.2s2.3 5.2 5.2 5.2h87.5c2.9 0 5.2-2.3 5.2-5.2S262.8 309.6 259.9 309.6z"
            ></path>
            <g>
              <path
                fill="#49A0AE"
                d="M351.5 323A59.7 59.7 0 1 0 351.5 442.4A59.7 59.7 0 1 0 351.5 323Z"
              ></path>
              <path
                fill="#FFF"
                d="M390.2 376.5c-10.9-10.9-21.8-21.8-32.6-32.6-3.3-3.3-8.7-3.2-12 .1-10.9 10.9-21.8 21.8-32.6 32.6-7.7 7.7 4.3 19.7 12 11.9 10.9-10.9 21.8-21.8 32.6-32.6-4 0-8 0-12 .1 10.9 10.9 21.8 21.8 32.6 32.6C386 396.2 397.9 384.2 390.2 376.5L390.2 376.5zM351.6 351.6L351.6 419"
              ></path>
              <path
                fill="#FFF"
                d="M343.1,351.6c0,25.7,0,41.6,0,67.3c0,10.9,17,11,17,0.1c0-25.7,0-41.6,0-67.4C360,340.7,343.1,340.6,343.1,351.6L343.1,351.6z"
              ></path>
            </g>
          </svg>
        </div>

        <input
          id="file-upload"
          type="file"
          key={value?.name || "empty"}
          onChange={handleFileChange}
          className="hidden"
          accept="application/pdf"
        />
      </label>
      <div className={`${value ? "flex" : "hidden"}`}>
        <img className="w-16 h-full" src="/img/pdf-subir-archivo.jpg" alt="" />
      </div>
    </div>
  );
}
*/
