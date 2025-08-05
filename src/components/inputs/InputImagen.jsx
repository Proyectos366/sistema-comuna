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
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      <div className="w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-white">
        {imgPrevia ? (
          <img
            src={imgPrevia}
            alt="Vista previa"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
            Sin imagen
          </div>
        )}
      </div>

      <label className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Subir imagen
        <input
          type="file"
          accept="image/*"
          onChange={handleImagenChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
