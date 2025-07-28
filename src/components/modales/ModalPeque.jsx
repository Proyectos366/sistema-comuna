export default function ModalPequena({ visible, indice }) {
  if (!visible) return null;

  return (
    <div
      className={`
        absolute
        z-50
        bottom-full
        left-0
        right-0
        mb-2
        bg-gray-50
        p-3
        rounded-md
        shadow-lg
        border border-gray-200
        text-sm
        text-gray-700
      `}
    >
      {indice === "clave2" && (
        <>
          <span className="text-xl font-semibold">
            La clave debe contener minimo
          </span>
          <ul className="flex flex-col gap-2 w-full">
            <li className="bg-white px-2 py-1 rounded-md">* 1 mayuscula</li>
            <li className="bg-white px-2 py-1 rounded-md">* 1 minuscula</li>
            <li className="bg-white px-2 py-1 rounded-md">* 1 numero</li>
            <li className="bg-white px-2 py-1 rounded-md">
              * 1 caracter especial: [ /.*-@ ]
            </li>
            <li className="bg-white px-2 py-1 rounded-md">
              * La longitud debe ser entre 8 y 16 digitos
            </li>
            <li className="bg-white px-2 py-1 rounded-md">
              <div>
                Ejemplo: <b>Carmen*12</b>
              </div>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

/** 
  export default function ModalPequena({ visible, indice }) {
    return (
      <div className="w-full flex justify-center">
        {visible && (
          <div
            className={`absolute z-50 ${
              !indice
                ? "top-[15%] sm:top-[10%]  w-[90%] sm:w-[71%] md:w-[62%] lg:w-[48%]"
                : "top-[5%] sm:top-[3%]  w-[90%] sm:w-[71%] md:w-[62%] lg:w-[48%]"
            }  flex flex-col shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2`}
          >
            <span className="text-xl text-center font-semibold">
              La clave debe contener minimo:
            </span>
            <ul className="flex flex-col space-y-3">
              <li>* 1 mayuscula</li>
              <li>* 1 minuscula</li>
              <li>* 1 numero</li>
              <li>* 1 caracter especial: [ /.*-@ ]</li>
              <li>* La longitud debe ser entre 8 y 16 digitos</li>
              <li>
                <div>
                  Ejemplo: <b>Carmen*12</b>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }
*/

/**
export default function ModalPequena({ visible, indice }) {
  return (
    <div
      className={`absolute top-full left-0 mt-2 w-full bg-gray-100 border border-[#082158] rounded-md shadow-lg p-4 text-md z-20 transition-all duration-300 ease-out
      ${
        visible && indice === "clave2"
          ? "opacity-100 scale-100 flex flex-col items-center"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <span className="text-xl font-semibold">
        La clave debe contener minimo
      </span>
      <ul className="flex flex-col gap-2 w-full">
        <li className="bg-white px-2 py-1 rounded-md">* 1 mayuscula</li>
        <li className="bg-white px-2 py-1 rounded-md">* 1 minuscula</li>
        <li className="bg-white px-2 py-1 rounded-md">* 1 numero</li>
        <li className="bg-white px-2 py-1 rounded-md">
          * 1 caracter especial: [ /.*-@ ]
        </li>
        <li className="bg-white px-2 py-1 rounded-md">
          * La longitud debe ser entre 8 y 16 digitos
        </li>
        <li className="bg-white px-2 py-1 rounded-md">
          <div>
            Ejemplo: <b>Carmen*12</b>
          </div>
        </li>
      </ul>
    </div>
  );
}
 */

/**
 <div className="container mx-auto py-2 px-2 sm:px-0">
       <Modal
         isVisible={mostrar}
         onClose={cerrarModal}
         titulo={"¿Desea registrar usuario?"}
       >
         <ModalDatosContenedor>
           <ModalDatos titulo={"Cedula"} descripcion={cedula} />
           <ModalDatos titulo={"Nombre"} descripcion={nombre} />
           <ModalDatos titulo={"Apellido"} descripcion={apellido} />
           <ModalDatos titulo={"Correo"} descripcion={correo} />
           <ModalDatos
             titulo={"Departamento"}
             descripcion={nombreDepartamento}
           />
           <ModalDatos titulo={"Clave"} descripcion={claveUno} indice={1} />
           <ModalDatos
             titulo={"Confirmar clave"}
             descripcion={claveDos}
             indice={1}
           />
         </ModalDatosContenedor>
 
         {mensajeBackEnd && (
           <div className="w-full mb-3">
             <MostrarMsj mensaje={mensajeBackEnd} />
           </div>
         )}
 
         <BotonesModal
           aceptar={crearUsuario}
           cancelar={cerrarModal}
           indiceUno={"crear"}
           indiceDos={"cancelar"}
           nombreUno={isLoading ? "Procesando..." : "Aceptar"}
           nombreDos={"Cancelar"}
           campos={{
             cedula,
             nombre,
             apellido,
             correo,
             claveUno,
             claveDos,
             seleccionarDepartamentos,
           }}
         />
       </Modal>
 
       <div className="grid min-h-dvh grid-rows-[auto_1fr_auto] gap-4">
         <header className="bg-white rounded-md h-20 flex items-center justify-center">
           <ImgRegistroLogin />
         </header>
         <main
           className="bg-white rounded-md flex flex-col items-center justify-center relative overflow-hidden
                  "
         >
           <div className="absolute inset-0 bg-white opacity-80 z-0"></div>
 
           <div className="relative z-10 p-4 w-full">
             <Titulos
               indice={1}
               titulo={"Crear usuario"}
               className="text-center text-xl font-semibold text-gray-700 mb-4"
             />
             <Formulario
               onSubmit={(e) => {
                 e.preventDefault();
               }}
             >
               <div className="w-full flex flex-col gap-2 hover:bg-white">
                 <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                   <LabelInput nombre={"Cedula"}>
                     <InputCedula
                       type="text"
                       indice={"cedula"}
                       value={cedula}
                       setValue={setCedula}
                       validarCedula={validarCedula}
                       setValidarCedula={setValidarCedula}
                     />
                   </LabelInput>
 
                   <LabelInput nombre={"Correo"}>
                     <InputCorreo
                       type="text"
                       indice="email"
                       value={correo}
                       setValue={setCorreo}
                       validarCorreo={validarCorreo}
                       setValidarCorreo={setValidarCorreo}
                     />
                   </LabelInput>
                 </div>
 
                 <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                   <LabelInput nombre={"Nombre"}>
                     <InputNombre
                       type="text"
                       indice="nombre"
                       value={nombre}
                       setValue={setNombre}
                       validarNombre={validarNombre}
                       setValidarNombre={setValidarNombre}
                     />
                   </LabelInput>
 
                   <LabelInput nombre={"Apellido"}>
                     <InputNombre
                       type={"text"}
                       indice={"nombre"}
                       value={apellido}
                       setValue={setApellido}
                       validarNombre={validarApellido}
                       setValidarNombre={setValidarApellido}
                     />
                   </LabelInput>
                 </div>
                 <SelectOpcion
                   idOpcion={idDepartamento}
                   nombre={"Departamentos"}
                   handleChange={cambiarSeleccionDepartamento}
                   opciones={todosDepartamentos}
                   seleccione={"Seleccione"}
                   setNombre={setNombreDepartamento}
                 />
 
                 <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                   <LabelInput nombre={"Clave"}>
                     <InputClave
                       type={"password"}
                       value={claveUno}
                       onChange={leyendoClave1}
                       indice={"clave"}
                       validarClave={validarClave}
                       setValidarClave={setValidarClave}
                     />
                   </LabelInput>
 
                   <LabelInput nombre={"Clave confirmar"}>
                     <InputClave
                       type={"password"}
                       value={claveDos}
                       onChange={leyendoClave2}
                       indice={"clave2"}
                     />
                   </LabelInput>
                 </div>
               </div>
 
               <div className="flex items-center justify-between -mt-3 sm:mt-0">
                 <LinkPaginas href="/" nombre={"Login"} />
                 <LinkPaginas
                   href="/recuperar-clave-correo"
                   nombre={"Olvido su clave?"}
                 />
               </div>
 
               {mensaje && (
                 <div className="w-full mb-3">
                   <MostrarMsj mensaje={mensaje} />
                 </div>
               )}
 
               <div className="flex space-x-4">
                 <BotonAceptarCancelar
                   indice={"aceptar"}
                   aceptar={mostrarModal}
                   nombre={"Crear"}
                   campos={{
                     cedula,
                     correo,
                     nombre,
                     apellido,
                     idDepartamento,
                     claveUno,
                     claveDos,
                   }}
                 />
 
                 <BotonAceptarCancelar
                   indice={"limpiar"}
                   aceptar={() => {
                     limpiarCampos({
                       setCedula,
                       setCorreo,
                       setNombre,
                       setApellido,
                       setIdDepartamento,
                       setClaveUno,
                       setClaveDos,
                     });
                   }}
                   nombre={"Limpiar"}
                   campos={{
                     cedula,
                     correo,
                     nombre,
                     apellido,
                     idDepartamento,
                     claveUno,
                     claveDos,
                   }}
                 />
               </div>
             </Formulario>
           </div>
         </main>
         <Footer />
       </div>
     </div>
 */
