import Div from "@/components/padres/Div";

export default function InputImagen({ imgPrevia, setImgVistaPrevia, setFile }) {
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file); // Guardamos el archivo
      const reader = new FileReader();
      reader.onloadend = () => setImgVistaPrevia(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      <Div className="w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-[#082158]">
        {imgPrevia ? (
          <img
            src={imgPrevia}
            alt="Vista previa"
            className="w-full h-full object-cover"
          />
        ) : (
          <Div className="flex items-center justify-center w-full h-full bg-[#e5e7eb] text-[#6a7282]">
            Sin imagen
          </Div>
        )}
      </Div>

      <label className="cursor-pointer inline-block px-4 py-2 bg-[#1d65ff] text-[#ffffff] rounded-lg hover:bg-[#1a53ff] transition">
        Subir imagen
        <input
          type="file"
          accept="image/*"
          onChange={handleImagenChange}
          className="hidden"
        />
      </label>
    </Div>
  );
}

/** 
export default function InputImagen({ imgPrevia, setImgVistaPrevia, setFile }) {
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImgVistaPrevia(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      <Div className="w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-[#ffffff]">
        {imgPrevia ? (
          <img
            src={imgPrevia}
            alt="Vista previa del perfil"
            className="w-full h-full object-cover"
          />
        ) : (
          <Div className="flex items-center justify-center w-full h-full bg-[#e5e7eb] text-[#6a7282]">
            Sin imagen
          </Div>
        )}
      </Div>

      <label 
        htmlFor="file-input"
        className="cursor-pointer inline-block px-4 py-2 bg-[#155dfc] text-[#ffffff] rounded-lg hover:bg-blue-700 transition"
      >
        Subir imagen
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleImagenChange}
          className="hidden"
        />
      </label>
    </Div>
  );
}

InputImagen.displayName = 'InputImagen';
*/
